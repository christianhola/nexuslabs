import { useCallback, useEffect, useId, useRef, useState } from 'react'

/*
  localStorage with a namespaced key, JSON values and safe fallbacks (private
  mode, quota, corrupt JSON). Every persisted thing in the template goes
  through here, so the keys are easy to find: inkwell:<key>.
*/
const NS = 'inkwell:'
const EVENT = 'inkwell:storage'

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(NS + key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function write<T>(key: string, value: T, source?: string) {
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    /* storage unavailable: keep the in-memory value */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { key, source } }))
}

export function remove(key: string) {
  try {
    window.localStorage.removeItem(NS + key)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }))
}

/*
  useState that survives a reload and stays in sync across components. The
  setter is a pure state update; the write happens in an effect afterwards,
  so React can replay updaters (StrictMode, concurrent renders) safely.
*/
export function useStored<T>(key: string, fallback: T) {
  const id = useId()
  const [value, setValue] = useState<T>(() => read(key, fallback))
  const dirty = useRef(false)
  useEffect(() => {
    const sync = (e: Event) => {
      const d = (e as CustomEvent<{ key: string; source?: string }>).detail
      if (d.key === key && d.source !== id) setValue(read(key, fallback))
    }
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, id])
  useEffect(() => {
    if (!dirty.current) return
    dirty.current = false
    write(key, value, id)
  }, [key, value, id])
  const set = useCallback((next: T | ((prev: T) => T)) => {
    dirty.current = true
    setValue((prev) => (typeof next === 'function' ? (next as (p: T) => T)(prev) : next))
  }, [])
  return [value, set] as const
}
