import { useEffect, useSyncExternalStore } from 'react'

import { fetchCount } from './api'

// One shared "people waiting" count for every component that shows it.
let count: number | null = null
let requested = false
const listeners = new Set<() => void>()

export function setCount(next: number | null) {
  count = next
  listeners.forEach((l) => l())
}

export function useWaitlistCount(): number | null {
  const value = useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => count,
    () => null,
  )
  useEffect(() => {
    if (requested) return
    requested = true
    fetchCount().then(setCount)
  }, [])
  return value
}
