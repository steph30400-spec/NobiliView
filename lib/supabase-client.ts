import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a dummy client during build — pages that use it at runtime will get a proper error
    // This prevents build failures while still being type-correct
    console.warn('[Supabase] Missing env vars — using placeholder client')
    // Return a client that will fail gracefully at runtime
    const placeholderClient = createClient('https://placeholder.supabase.co', 'placeholder-key')
    return placeholderClient
  }

  _client = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })

  return _client
}

export const supabase = {
  get client() { return getClient() },
  // Proxy all common supabase methods
  from: (...args: Parameters<SupabaseClient['from']>) => getClient().from(...args),
  auth: {
    signInWithPassword: (opts: Parameters<SupabaseClient['auth']['signInWithPassword']>[0]) =>
      getClient().auth.signInWithPassword(opts),
    signUp: (opts: Parameters<SupabaseClient['auth']['signUp']>[0]) =>
      getClient().auth.signUp(opts),
    getUser: (token?: string) =>
      token ? getClient().auth.getUser(token) : getClient().auth.getUser(),
    signOut: () => getClient().auth.signOut(),
  },
}

// Alias for convenience
export default supabase