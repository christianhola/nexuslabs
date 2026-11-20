// Client for the Worker API (src/worker/index.ts).

export type JoinResult = {
  status: 'joined' | 'exists'
  /** Current place in line, after referral boosts. */
  position: number
  count: number
  code: string
  referrals: number
}

export type Status = {
  code: string
  position: number
  /** Place in line at signup, before any referral boosts. */
  joinedAt: number
  referrals: number
  count: number
  boost: number
}

export type LeaderEntry = { name: string; referrals: number; position: number; you?: boolean }

export type Signup = {
  id: number
  email: string
  code: string
  referred_by: string | null
  referrals: number
  position: number
  created_at: number
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
  ) {
    super(message)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, init)
  } catch {
    throw new ApiError("We couldn't reach the server. Check your connection and try again.", 'offline', 0)
  }
  const data = (await res.json().catch(() => ({}))) as T & { error?: string; message?: string }
  if (!res.ok) throw new ApiError(data.message ?? 'Something went wrong. Try again.', data.error ?? 'server_error', res.status)
  return data
}

export function joinWaitlist(input: { email: string; ref?: string | null; company?: string }): Promise<JoinResult> {
  return request<JoinResult>('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export async function fetchCount(): Promise<number | null> {
  try {
    const data = await request<{ count?: number }>('/api/waitlist')
    return typeof data.count === 'number' ? data.count : null
  } catch {
    return null
  }
}

export function fetchStatus(code: string): Promise<Status> {
  return request<Status>(`/api/status/${encodeURIComponent(code)}`)
}

export function fetchLeaderboard(code?: string | null): Promise<{ entries: LeaderEntry[]; boost: number }> {
  const query = code ? `?code=${encodeURIComponent(code)}` : ''
  return request(`/api/leaderboard${query}`)
}

export async function adminEnabled(): Promise<boolean> {
  try {
    return (await request<{ enabled: boolean }>('/api/admin')).enabled
  } catch {
    return true // unknown: show the token form and let the real call decide
  }
}

export function fetchSignups(token: string): Promise<{ signups: Signup[]; count: number }> {
  return request('/api/admin/signups', { headers: { Authorization: `Bearer ${token}` } })
}

/** Downloads the CSV with the token in a header (never in the URL). */
export async function downloadSignupsCsv(token: string): Promise<void> {
  const res = await fetch('/api/admin/signups.csv', { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string }
    throw new ApiError(data.message ?? 'Export failed. Try again.', data.error ?? 'server_error', res.status)
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const STORAGE_KEY = 'waitlist:entry'

export type SavedEntry = JoinResult & { email: string }

/** Remember this browser's spot so a reload shows the success state. */
export function loadSaved(): SavedEntry | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const entry = JSON.parse(raw) as SavedEntry
    return { ...entry, referrals: entry.referrals ?? 0 }
  } catch {
    return null
  }
}

export function save(entry: SavedEntry | null) {
  try {
    if (entry) localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage blocked: the success state just won't survive a reload.
  }
}

/** The link people share. Friends who open it are credited to `code`. */
export function shareUrl(code: string): string {
  return `${window.location.origin}/?ref=${encodeURIComponent(code)}`
}

/** Your own status page (rank and referrals). */
export function statusPath(code: string): string {
  return `/status/${encodeURIComponent(code)}`
}
