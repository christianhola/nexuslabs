import { useEffect, useRef, useState } from 'react'

import { QUOTE_LOCK_SECONDS, quote as localQuote } from '../shared/fx'
import type { CurrencyCode, Quote, Speed } from '../shared/fx'
import { validateAmount } from '../shared/validate'
import { api } from './api'

export type LiveQuote = {
  quote: Quote | null
  /** Seconds left on the lock. */
  remaining: number
  status: 'idle' | 'loading' | 'live' | 'offline' | 'error'
  error: string | null
  refresh: () => void
}

/*
  Prices a transfer as you type: an instant local estimate, replaced by the
  Worker's quote (GET /api/quote) after a short debounce. The quote re-locks
  every 30 seconds; `remaining` counts down to the next refresh.
*/
export function useQuote(from: CurrencyCode, to: CurrencyCode, amount: number, speed: Speed, enabled = true): LiveQuote {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [status, setStatus] = useState<LiveQuote['status']>('idle')
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [nonce, setNonce] = useState(0)
  const ctrl = useRef<AbortController | null>(null)

  const invalid = validateAmount(amount, from)

  useEffect(() => {
    if (!enabled) return
    if (invalid) {
      setQuote(null)
      setError(invalid)
      setStatus('error')
      return
    }
    setError(null)
    setQuote(localQuote(from, to, amount, speed))
    setStatus('loading')
    const t = setTimeout(async () => {
      ctrl.current?.abort()
      const c = new AbortController()
      ctrl.current = c
      try {
        const res = await api<Quote>(`/api/quote?from=${from}&to=${to}&amount=${amount}&speed=${speed}`, { signal: c.signal })
        if (c.signal.aborted) return
        if (res.ok) {
          setQuote(res.data)
          setStatus('live')
        } else if (res.status === 0) {
          setStatus('offline')
        } else {
          setError(res.data.errors?.amount ?? res.data.message ?? 'We couldn’t price that transfer.')
          setStatus('error')
        }
      } catch {
        // aborted by a newer request
      }
    }, 350)
    return () => clearTimeout(t)
  }, [from, to, amount, speed, invalid, enabled, nonce])

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(i)
  }, [])

  const remaining = quote ? Math.max(0, Math.ceil((quote.expiresAt - now) / 1000)) : QUOTE_LOCK_SECONDS

  // Re-quote when the lock runs out.
  useEffect(() => {
    if (enabled && quote && remaining === 0 && status !== 'loading') setNonce((n) => n + 1)
  }, [remaining, quote, status, enabled])

  return { quote, remaining, status, error, refresh: () => setNonce((n) => n + 1) }
}
