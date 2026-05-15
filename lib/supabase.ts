import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const WORLDLABS_API_KEY = process.env.WORLDLABS_API_KEY!
export const WORLDLABS_API = 'https://api.worldlabs.ai/marble/v1'