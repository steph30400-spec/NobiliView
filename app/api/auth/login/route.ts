import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'
import { setSessionCookie } from '@/lib/auth'

export const runtime = 'nodejs'

type DbUser = {
  id: string
  email: string
  password_hash: string | null
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 })
  }

  const { rows } = await query<DbUser>(
    'select id, email, password_hash from users where lower(email) = lower($1) limit 1',
    [email],
  )

  const user = rows[0]
  if (!user?.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: 'Identifiants invalides.' }, { status: 401 })
  }

  await setSessionCookie({ id: user.id, email: user.email })
  return NextResponse.json({ ok: true })
}

