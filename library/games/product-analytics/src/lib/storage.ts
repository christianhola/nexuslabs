import { useCallback, useEffect, useState } from 'react'

/*
  localStorage with a namespaced key, JSON values and safe fallbacks (private
  mode, quota, corrupt JSON). Every persisted thing in the template goes
  through here, so the keys are easy to find: pulseboard:<key>.
*/
const NS = 'pulseboard:'

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
    window.dispatchEvent(new CustomEvent('pulseboard:storage', { detail: key }))
  } catch {
    /* storage unavailable: keep the in-memory value */
  }
}

export function remove(key: string) {
  try {
    window.localStorage.removeItem(NS + key)
    window.dispatchEvent(new CustomEvent('pulseboard:storage', { detail: key }))
  } catch {
    /* ignore */
  }
}

/** useState that survives a reload, kept in sync across components. */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback))
  useEffect(() => {
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(read(key, fallback))
    }
    window.addEventListener('pulseboard:storage', sync)
    return () => window.removeEventListener('pulseboard:storage', sync)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        write(key, v)
        return v
      })
    },
    [key],
  )
  return [value, set] as const
}
