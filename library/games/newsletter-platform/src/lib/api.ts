/* fetch + JSON with one error shape: { error, errors? }. */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, string> = {},
  ) {
    super(message)
  }
}

export async function api<T>(url: string, init?: { method?: string; body?: unknown; signal?: AbortSignal }): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      method: init?.method ?? (init?.body ? 'POST' : 'GET'),
      headers: init?.body ? { 'content-type': 'application/json' } : undefined,
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: init?.signal,
    })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new ApiError('You look offline. Check your connection and try again.', 0)
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string; errors?: Record<string, string> }
  if (!res.ok) throw new ApiError(data.error ?? `Something went wrong (${res.status}).`, res.status, data.errors)
  return data
}
