/**
 * NobiliView - Server-side only utilities.
 * Never import this file from client components.
 */

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
