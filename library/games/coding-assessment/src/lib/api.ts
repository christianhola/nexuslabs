import type { Errors } from '../shared/validate'

/** POST JSON to a Worker route. Resolves to the data, or throws with field errors. */
export class ApiError extends Error {
  constructor(
    message: string,
    public fields: Errors = {},
    public status = 0,
  ) {
    super(message)
  }
}

export async function post<T>(path: string, data: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.')
  }
  const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: Errors }
  if (!res.ok) throw new ApiError(json.error ?? `Request failed (${res.status}).`, json.fields ?? {}, res.status)
  return json as T
}
