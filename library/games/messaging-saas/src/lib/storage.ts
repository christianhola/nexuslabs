import { useCallback, useEffect, useRef, useState } from 'react'

/*
  localStorage with a namespace, JSON and graceful failure (private windows,
  blocked storage). Everything the site remembers goes through here.
*/
const NS = 'relaytext:'

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(NS + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function writeStore<T>(key: string, value: T) {
  try {
    if (value === undefined) window.localStorage.removeItem(NS + key)
    else window.localStorage.setItem(NS + key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('relaytext:store', { detail: key }))
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

/** useState that persists to localStorage and syncs between components. */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStore(key, fallback))
  const fallbackRef = useRef(fallback)
  useEffect(() => {
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail === key || e.type === 'storage') setValue(readStore(key, fallback))
    }
    window.addEventListener('relaytext:store', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('relaytext:store', sync)
      window.removeEventListener('storage', sync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      // Resolve against the stored value outside React's updater, so the
      // sync event never fires while another component is rendering.
      const v = typeof next === 'function' ? (next as (p: T) => T)(readStore(key, fallbackRef.current)) : next
      setValue(v)
      writeStore(key, v)
    },
    [key],
  )
  return [value, set] as const
}
