import { useCallback, useSyncExternalStore } from 'react'

/*
  A typed localStorage value that every component reading the same key
  shares. Reads and writes are wrapped so private mode or blocked storage
  falls back to the default instead of throwing.
*/
const EVENT = 'ledgerly:store'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

const cache = new Map<string, { raw: string | null; value: unknown }>()

function snapshot<T>(key: string, fallback: T): T {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    raw = null
  }
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value as T
  const value = raw == null ? fallback : read(key, fallback)
  cache.set(key, { raw, value })
  return value
}

export function writeStore<T>(key: string, value: T | null) {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable: the value lives only until reload.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
}

function subscribe(cb: () => void) {
  window.addEventListener('storage', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('storage', cb)
    window.removeEventListener(EVENT, cb)
  }
}

export function useStore<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => snapshot(key, fallback),
    () => fallback,
  )
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = snapshot(key, fallback)
      writeStore(key, typeof next === 'function' ? (next as (p: T) => T)(prev) : next)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  )
  const clear = useCallback(() => writeStore(key, null), [key])
  return [value, set, clear]
}

/** Storage keys used by the template, in one place. */
export const keys = {
  transfers: 'ledgerly.transfers.v1',
  sendDraft: 'ledgerly.send-draft.v1',
  checkoutTheme: 'ledgerly.checkout-theme.v1',
  orders: 'ledgerly.orders.v1',
  signupDraft: 'ledgerly.signup-draft.v1',
  session: 'ledgerly.session.v1',
  billing: 'ledgerly.billing.v1',
} as const
