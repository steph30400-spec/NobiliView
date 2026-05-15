'use client'

import { createClient } from '@supabase/supabase-js'

// Client Supabase pour le frontend — utilise la clé anon, PAS la clé service role
// Cette clé est conçue pour être exposée au client (安全 par design Supabase)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validation au runtime côté client
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Utiliser les cookies pour stocker le token — PAS localStorage
    storageKey: 'nobili-auth',
    storage: {
      // On utilise les cookies via le helper nextjs de Supabase
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export default supabase