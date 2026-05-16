/**
 * NobiliView — Server-side only utilities
 * Ces fonctions NE doivent JAMAIS être importées depuis un composant client (.client.tsx)
 * Elles sont reservées aux Server Components et API Routes.
 */

import { createClient } from '@supabase/supabase-js'

// Lazy validation — only check when actually used, not at module load
function getEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please add ${key} to your .env.local file.`
    )
  }
  return value
}

// Client Supabase server-side (avec clé service role — jamais exposé au client)
export function getServerSupabase() {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  
  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// World Labs API — lazy, only resolved when called
let _wlKey: string | null = null
let _wlUrl: string | null = null

export function getWorldLabsConfig() {
  if (!_wlKey) _wlKey = getEnv('WORLDLABS_API_KEY')
  if (!_wlUrl) _wlUrl = 'https://api.worldlabs.ai/marble/v1'
  return { apiKey: _wlKey, apiUrl: _wlUrl }
}

// Only validate in production when functions are called, not during build
export function requireEnv(key: string): string {
  return getEnv(key)
}