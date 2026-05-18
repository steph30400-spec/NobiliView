import { Pool, type QueryResult, type QueryResultRow } from 'pg'

let pool: Pool | null = null

function requiredEnv(key: string) {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: requiredEnv('DATABASE_URL'),
      max: 5,
      idleTimeoutMillis: 30_000,
    })
  }

  return pool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return getDb().query<T>(text, params)
}

