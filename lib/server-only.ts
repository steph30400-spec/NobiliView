/**
 * NobiliView — Server-side only utilities
 * Ces fonctions NE doivent JAMAIS être importées depuis un composant client (.client.tsx)
 * Elles sont reservées aux Server Components et API Routes.
 */

import { createClient } from '@supabase/supabase-js'

// Client Supabase server-side (avec clé service role — jamais exposé au client)
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    )
  }
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// World Labs API — server-side only, jamais côté client
export const WORLDLABS_API_KEY = process.env.WORLDLABS_API_KEY!
export const WORLDLABS_API_URL = 'https://api.worldlabs.ai/marble/v1'

if (!WORLDLABS_API_KEY) {
  throw new Error('Missing WORLDLABS_API_KEY environment variable')
}

// Validate all required env vars at module load time
export function validateEnv(): void {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'WORLDLABS_API_KEY',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please add these to .env.local before starting the application.'
    )
  }
}

// Validate once on module import
try {
  validateEnv()
} catch (e) {
  // In development, warn but don't crash the module load
  if (process.env.NODE_ENV === 'development') {
    console.warn('[ENV] Missing environment variables:', (e as Error).message)
  }
}