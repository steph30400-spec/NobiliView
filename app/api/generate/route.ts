import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { query } from '@/lib/db'
import { getWorldLabsConfig } from '@/lib/server-only'

// Rate limiting simple par IP — en prod, utiliser Upstash Redis
const ipRequests = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10 // max 10 requêtes par minute par IP
const WINDOW_MS = 60 * 1000

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipRequests.get(ip)

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (!rateLimit(ip)) {
    return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans une minute.' }, { status: 429 })
  }

  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Parse body
  let body: { property_id: string; photos_urls?: string[]; callback_url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { property_id, photos_urls, callback_url } = body

  if (!property_id) {
    return NextResponse.json({ error: 'property_id requis' }, { status: 400 })
  }

  // Fetch property
  const { rows: properties } = await query<{
    user_id: string
    photos_urls: string[] | null
    generation_status: string
  }>(
    'select user_id, photos_urls, generation_status from properties where id = $1 limit 1',
    [property_id],
  )

  const property = properties[0]
  if (!property) {
    return NextResponse.json({ error: 'Bien non trouvé' }, { status: 404 })
  }

  // Check ownership
  if (property.user_id !== user.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  // Check credits
  const { rows: users } = await query<{ credits: number }>(
    'select credits from users where id = $1 limit 1',
    [user.id],
  )

  const credits = users[0]?.credits ?? 0
  if (credits < 1) {
    return NextResponse.json({ error: 'Crédits insuffisants. Achetez des crédits pour générer un tour.' }, { status: 402 })
  }

  // Check if already processing
  if (property.generation_status === 'running') {
    return NextResponse.json({ error: 'Une génération est déjà en cours pour ce bien.' }, { status: 409 })
  }

  // Pré-deduction du crédit (optimistic)
  await query('update users set credits = $1 where id = $2', [credits - 1, user.id])

  // Update property status
  await query(
    `update properties
     set generation_status = 'running', status = 'processing', updated_at = now()
     where id = $1`,
    [property_id],
  )

  // Call World Labs API
  const photos = photos_urls ?? (property.photos_urls ?? [])

  if (photos.length === 0) {
    // Rollback credit
    await query('update users set credits = $1 where id = $2', [credits, user.id])
    return NextResponse.json({ error: 'Aucune photo disponible pour ce bien.' }, { status: 400 })
  }

  try {
    const { apiKey } = getWorldLabsConfig()

    const wlRes = await fetch(`${getWorldLabsConfig().apiUrl}/worlds:generate`, {
      method: 'POST',
      headers: {
        'WLT-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'marble-1.1',
        inputs: photos.map((url: string) => ({ type: 'image', url })),
        callback_url: callback_url ?? null,
      }),
    })

    if (!wlRes.ok) {
      const err = await wlRes.text()
      console.error('[WorldLabs] Generation failed:', wlRes.status, err)

      // Rollback credit + status
      await query('update users set credits = $1 where id = $2', [credits, user.id])
      await query(
        `update properties
         set generation_status = 'failed', updated_at = now()
         where id = $1`,
        [property_id],
      )

      return NextResponse.json({ error: 'Erreur World Labs. Réessayez.' }, { status: 502 })
    }

    const wlData = await wlRes.json()

    // Store operation_id for polling
    const operationId = wlData?.name?.split('/').pop() ?? wlData?.operation?.name?.split('/').pop()

    await query(
      `update properties
       set operation_id = $1, generation_status = 'running', updated_at = now()
       where id = $2`,
      [operationId ?? null, property_id],
    )

    return NextResponse.json({
      success: true,
      operation_id: operationId,
      message: 'Génération démarrée. Vous recevrez une notification quand le tour sera prêt.',
    })

  } catch (e) {
    console.error('[Generate] Unexpected error:', e)

    // Rollback credit
    await query('update users set credits = $1 where id = $2', [credits, user.id])
    await query(
      `update properties
       set generation_status = 'failed', updated_at = now()
       where id = $1`,
      [property_id],
    )

    return NextResponse.json({ error: 'Erreur interne. Réessayez.' }, { status: 500 })
  }
}
