// Device-local state shared across components: the ideas board, the quiz
// result, the booking draft and the confirmed booking. Every write fires an
// event so other components re-read the key.
import { useCallback, useSyncExternalStore } from 'react'

import type { StyleId } from '../content'
import type { BookingInput } from '../shared/validation'
import { readJson, removeKey, writeJson } from './storage'

export const KEYS = {
  saved: 'lo.saved.v1',
  quiz: 'lo.quiz.v1',
  draft: 'lo.booking-draft.v1',
  booking: 'lo.booking.v1',
} as const

const EVENT = 'lo-store'
const cache = new Map<string, { raw: string | null; value: unknown }>()

function read<T>(key: string, fallback: T): T {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(key)
  } catch {
    raw = null
  }
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value as T
  const value = raw ? readJson<T>(key, fallback) : fallback
  cache.set(key, { raw, value })
  return value
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

/** A localStorage-backed value that every component sees update together. */
export function useStored<T>(key: string, fallback: T) {
  const value = useSyncExternalStore(subscribe, () => read(key, fallback), () => fallback)
  const set = useCallback(
    (next: T | null | ((prev: T) => T | null)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T | null)(read(key, fallback)) : next
      if (resolved === null) removeKey(key)
      else writeJson(key, resolved)
      window.dispatchEvent(new Event(EVENT))
    },
    // fallback is a module constant at each call site; key identifies the value.
    [key],
  )
  return [value, set] as const
}

export type SavedBoard = Record<string, { note: string; at: number }>
const EMPTY_BOARD: SavedBoard = {}

export function useSaved() {
  const [board, setBoard] = useStored<SavedBoard>(KEYS.saved, EMPTY_BOARD)
  const toggle = useCallback(
    (id: string) =>
      setBoard((prev) => {
        const next = { ...prev }
        if (next[id]) delete next[id]
        else next[id] = { note: '', at: Date.now() }
        return next
      }),
    [setBoard],
  )
  const setNote = useCallback((id: string, note: string) => setBoard((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], note } } : prev)), [setBoard])
  const clear = useCallback(() => setBoard(null), [setBoard])
  return { board, ids: Object.keys(board), toggle, setNote, clear, has: (id: string) => !!board[id] }
}

export type QuizState = { answers: Record<string, string>; result?: StyleId; at?: number }
const EMPTY_QUIZ: QuizState = { answers: {} }
export const useQuiz = () => useStored<QuizState>(KEYS.quiz, EMPTY_QUIZ)

const EMPTY_DRAFT: BookingInput = {}
export const useBookingDraft = () => useStored<BookingInput>(KEYS.draft, EMPTY_DRAFT)

export type ConfirmedBooking = BookingInput & { reference: string; createdAt: number }
export const useBooking = () => useStored<ConfirmedBooking | null>(KEYS.booking, null)
