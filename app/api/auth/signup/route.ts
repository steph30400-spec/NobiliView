import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { setSessionCookie } from '@/lib/auth'

export const runtime = 'nodejs'

type DbUser = {
  id: string
  email: string
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : ''
  const company = typeof body?.company === 'string' ? body.company.trim() : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caracteres.' }, { status: 400 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  try {
    const { rows } = await query<DbUser>(
      `insert into users (email, password_hash, full_name, company, plan, credits)
       values ($1, $2, $3, $4, 'demo', 0)
       returning id, email`,
      [email, passwordHash, fullName || null, company || null],
    )

    const user = rows[0]
    await setSessionCookie(user)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    if (message.includes('duplicate key')) {
      return NextResponse.json({ error: 'Un compte existe deja avec cet email.' }, { status: 409 })
    }
    console.error('[Signup] Error:', e)
    return NextResponse.json({ error: 'Erreur creation compte.' }, { status: 500 })
  }
}

