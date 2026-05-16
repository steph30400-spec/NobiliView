import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabase, getWorldLabsConfig } from '@/lib/server-only'

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

  // Auth check
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServerSupabase()

  // Verify user from token
  const token = authHeader.slice(7)
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
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
  const { data: property, error: propError } = await supabase
    .from('properties')
    .select('user_id, photos_urls, generation_status, credits')
    .eq('id', property_id)
    .single()

  if (propError || !property) {
    return NextResponse.json({ error: 'Bien non trouvé' }, { status: 404 })
  }

  // Check ownership
  if (property.user_id !== user.id) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  // Check credits
  const { data: userData } = await supabase
    .from('users')
    .select('credits')
    .eq('id', user.id)
    .single()

  const credits = userData?.credits ?? 0
  if (credits < 1) {
    return NextResponse.json({ error: 'Crédits insuffisants. Achetez des crédits pour générer un tour.' }, { status: 402 })
  }

  // Check if already processing
  if (property.generation_status === 'running') {
    return NextResponse.json({ error: 'Une génération est déjà en cours pour ce bien.' }, { status: 409 })
  }

  // Pré-deduction du crédit (optimistic)
  await supabase
    .from('users')
    .update({ credits: credits - 1 })
    .eq('id', user.id)

  // Update property status
  await supabase
    .from('properties')
    .update({ generation_status: 'running', status: 'processing' })
    .eq('id', property_id)

  // Call World Labs API
  const photos = photos_urls ?? (property.photos_urls ?? [])

  if (photos.length === 0) {
    // Rollback credit
    await supabase.from('users').update({ credits: credits }).eq('id', user.id)
    return NextResponse.json({ error: 'Aucune photo disponible pour ce bien.' }, { status: 400 })
  }

  try {
    const { apiKey } = getWorldLabsConfig()

    const wlRes = await fetch(`${getWorldLabsConfig().apiUrl}/worlds:generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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
      await supabase.from('users').update({ credits: credits }).eq('id', user.id)
      await supabase.from('properties').update({ generation_status: 'failed' }).eq('id', property_id)

      return NextResponse.json({ error: 'Erreur World Labs. Réessayez.' }, { status: 502 })
    }

    const wlData = await wlRes.json()

    // Store operation_id for polling
    const operationId = wlData?.name?.split('/').pop() ?? wlData?.operation?.name?.split('/').pop()

    await supabase
      .from('properties')
      .update({
        operation_id: operationId ?? null,
        generation_status: 'running',
      })
      .eq('id', property_id)

    return NextResponse.json({
      success: true,
      operation_id: operationId,
      message: 'Génération démarrée. Vous recevrez une notification quand le tour sera prêt.',
    })

  } catch (e) {
    console.error('[Generate] Unexpected error:', e)

    // Rollback credit
    await supabase.from('users').update({ credits: credits }).eq('id', user.id)
    await supabase.from('properties').update({ generation_status: 'failed' }).eq('id', property_id)

    return NextResponse.json({ error: 'Erreur interne. Réessayez.' }, { status: 500 })
  }
}