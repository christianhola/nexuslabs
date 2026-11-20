// One fetch helper for the Worker routes: JSON in, JSON out, typed errors.
export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string; errors?: Record<string, string> }

export async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) return { ok: false, status: res.status, error: String(json.error ?? 'Something went wrong. Try again.'), errors: json.errors as Record<string, string> | undefined }
    return { ok: true, data: json as T }
  } catch {
    return { ok: false, status: 0, error: 'You look offline. Check your connection and try again.' }
  }
}

export async function getJson<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url)
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) return { ok: false, status: res.status, error: String(json.error ?? 'Could not load this.') }
    return { ok: true, data: json as T }
  } catch {
    return { ok: false, status: 0, error: 'You look offline. Check your connection and try again.' }
  }
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
