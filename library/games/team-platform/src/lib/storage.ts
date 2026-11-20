import { useCallback, useEffect, useRef, useState } from 'react'

/*
  localStorage with a namespaced key, JSON values and safe fallbacks (private
  mode, quota, corrupt JSON). Every persisted thing in the template goes
  through here, so the keys are easy to find: branchwork:<key>.
*/
const NS = 'branchwork:'

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(NS + key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('branchwork:storage', { detail: key }))
  } catch {
    /* storage unavailable: keep the in-memory value */
  }
}

export function remove(key: string) {
  try {
    window.localStorage.removeItem(NS + key)
    window.dispatchEvent(new CustomEvent('branchwork:storage', { detail: key }))
  } catch {
    /* ignore */
  }
}

/** useState that survives a reload, kept in sync across components. */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback))
  // The latest value, so functional updates never run inside React's
  // render phase (where StrictMode would replay the storage write).
  const latest = useRef(value)
  latest.current = value
  useEffect(() => {
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail !== key) return
      const v = read(key, fallback)
      latest.current = v
      setValue(v)
    }
    window.addEventListener('branchwork:storage', sync)
    return () => window.removeEventListener('branchwork:storage', sync)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const v = typeof next === 'function' ? (next as (p: T) => T)(latest.current) : next
      latest.current = v
      setValue(v)
      write(key, v)
    },
    [key],
  )
  return [value, set] as const
}
