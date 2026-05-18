import { cookies } from 'next/headers'
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'nobiliview-session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? 'dev-only-change-me'
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url')
}

function sign(payload: string) {
  return createHmac('sha256', getAuthSecret()).update(payload).digest('base64url')
}

export type SessionUser = {
  id: string
  email: string
}

export function createSessionToken(user: SessionUser) {
  const payload = base64url(JSON.stringify({
    ...user,
    nonce: randomBytes(16).toString('hex'),
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  }))
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string): SessionUser | null {
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null

  const expected = sign(payload)
  const sig = Buffer.from(signature)
  const exp = Buffer.from(expected)
  if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) return null

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (!data?.id || !data?.email || !data?.exp) return null
    if (data.exp < Math.floor(Date.now() / 1000)) return null
    return { id: data.id, email: data.email }
  } catch {
    return null
  }
}

export async function setSessionCookie(user: SessionUser) {
  const jar = await cookies()
  jar.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_SECONDS,
    path: '/',
  })
}

export async function getSessionUser() {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  return token ? verifySessionToken(token) : null
}

