import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Security headers
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }

  for (const [key, value] of Object.entries(headers)) {
    res.headers.set(key, value)
  }

  // CORS — only allow our own origin in production
  const origin = req.headers.get('origin')
  if (origin && process.env.NODE_ENV === 'production') {
    // En prod, restreindre à notre domaine
    const allowedOrigins = [
      'https://nobiliview.com',
      'https://www.nobiliview.com',
      // ajouter d'autres domaines si besoin
    ]
    if (allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin)
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      res.headers.set('Access-Control-Allow-Credentials', 'true')
    }
  }

  return res
}

export const config = {
  matcher: [
    // Apply to all routes except static files and api/health
    '/((?!_next/static|_next/image|favicon.ico|api/health).*)',
  ],
}