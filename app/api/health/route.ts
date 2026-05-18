import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  const results = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {} as Record<string, { ok: boolean; latency_ms?: number; error?: string }>,
  }

  // Check PostgreSQL
  const t0 = Date.now()
  try {
    await query('select 1')
    results.services.postgres = {
      ok: true,
      latency_ms: Date.now() - t0,
    }
  } catch (e) {
    results.services.postgres = { ok: false, error: (e as Error).message }
  }

  // Check World Labs API (simple connectivity check)
  const t1 = Date.now()
  try {
    const res = await fetch('https://api.worldlabs.ai/marble/v1/models', {
      method: 'GET',
      headers: {
        'WLT-Api-Key': process.env.WORLDLABS_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    })
    const authAccepted = res.status !== 401 && res.status !== 403
    results.services.worldlabs = {
      ok: res.ok || authAccepted,
      latency_ms: Date.now() - t1,
      ...(res.ok || authAccepted ? {} : { error: `HTTP ${res.status}` }),
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
