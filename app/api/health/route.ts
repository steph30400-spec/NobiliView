import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const results = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {} as Record<string, { ok: boolean; latency_ms?: number; error?: string }>,
  }

  // Check Supabase
  const t0 = Date.now()
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    results.services.supabase = {
      ok: !error,
      latency_ms: Date.now() - t0,
      ...(error && { error: error.message }),
    }
  } catch (e) {
    results.services.supabase = { ok: false, error: (e as Error).message }
  }

  // Check World Labs API (simple connectivity check)
  const t1 = Date.now()
  try {
    const res = await fetch('https://api.worldlabs.ai/marble/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.WORLDLABS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    })
    results.services.worldlabs = {
      ok: res.ok,
      latency_ms: Date.now() - t1,
      ...(res.ok ? {} : { error: `HTTP ${res.status}` }),
    }
  } catch (e) {
    results.services.worldlabs = { ok: false, error: (e as Error).message }
  }

  const allOk = Object.values(results.services).every(s => s.ok)
  return NextResponse.json(results, {
    status: allOk ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}