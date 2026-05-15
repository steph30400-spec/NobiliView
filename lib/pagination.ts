/**
 * Pagination utility — cursor-based pour Supabase
 * À utiliser sur toutes les requêtes de liste pour éviter de charger toute la DB
 */

export interface PaginatedResult<T> {
  data: T[]
  total: number | null
  hasMore: boolean
  nextCursor: number | null
}

export interface PaginationOptions {
  pageSize?: number  // default 20
  maxPageSize?: number  // max 100
}

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export function parsePagination(searchParams: URLSearchParams): { offset: number; limit: number } {
  const page = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10))
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(searchParams.get('pageSize') ?? String(DEFAULT_PAGE_SIZE), 10))
  )

  return {
    offset: page * pageSize,
    limit: pageSize,
  }
}

/**
 * Helper pour construire une réponse paginée à partir d'une query Supabase
 * Utilise range (offset, offset + limit - 1)
 */
export function buildPaginatedResponse<T>(
  data: T[],
  count: number | null,
  offset: number,
  limit: number
): PaginatedResult<T> {
  return {
    data,
    total: count,
    hasMore: offset + data.length < (count ?? data.length),
    nextCursor: count !== null && offset + limit < count ? offset + limit : null,
  }
}