import { validateEmail } from '../shared/validate'
import { readStore, writeStore } from './storage'

export type Signup = { email: string; position: number; referral: string; plan?: string; at: string }

/** Posts to the Worker and remembers the signup locally for the confirm page. */
export async function joinWaitlist(email: string, plan?: string): Promise<{ ok: true; signup: Signup } | { ok: false; error: string }> {
  const local = validateEmail(email)
  if (local) return { ok: false, error: local }
  try {
    const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: email.trim(), plan }) })
    const data = (await res.json().catch(() => ({}))) as { error?: string; position?: number; referral?: string }
    if (!res.ok) return { ok: false, error: data.error ?? 'Something went wrong. Try again.' }
    const signup: Signup = { email: email.trim().toLowerCase(), position: data.position ?? 0, referral: data.referral ?? '', plan, at: new Date().toISOString() }
    writeStore('waitlist', signup)
    return { ok: true, signup }
  } catch {
    return { ok: false, error: 'You look offline. Check your connection and try again.' }
  }
}

export const readSignup = () => readStore<Signup | null>('waitlist', null)
