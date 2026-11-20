/*
  JSON helper for the Worker routes. Resolves to { ok, status, data } and
  never throws, so forms can show a network error inline.
*/
export type ApiResult<T> = { ok: boolean; status: number; data: T & { error?: string; message?: string; errors?: Record<string, string> } }

export async function api<T = Record<string, unknown>>(path: string, init?: { method?: string; body?: unknown; signal?: AbortSignal }): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      method: init?.method ?? (init?.body ? 'POST' : 'GET'),
      headers: init?.body ? { 'content-type': 'application/json' } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: init?.signal,
    })
    const data = (await res.json().catch(() => ({}))) as ApiResult<T>['data']
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err
    return { ok: false, status: 0, data: { message: 'We couldn’t reach the server. Check your connection and try again.' } as ApiResult<T>['data'] }
  }
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
