import { useState } from 'react'
import type { FormEvent } from 'react'

import { validateEmail } from './validate'

export type SubmitState = 'idle' | 'loading' | 'done' | 'error'

/**
 * Email capture used by the home CTA and the blog. Checks the address in the
 * browser first (same rule as the Worker), then POSTs /api/subscribe.
 */
export function useSubscribe() {
  const [email, setEmailRaw] = useState('')
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState('')

  const setEmail = (v: string) => {
    setEmailRaw(v)
    if (state === 'done' || state === 'error') setState('idle')
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const invalid = validateEmail(email)
    if (invalid) {
      setError(invalid)
      setState('error')
      return
    }
    setState('loading')
    setError('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
      setState('done')
    } catch (err) {
      setError(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'Could not reach the server. Try again.')
      setState('error')
    }
  }

  return { email, setEmail, state, error, submit }
}
