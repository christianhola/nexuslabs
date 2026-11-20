import { createContext, createElement, useContext, useSyncExternalStore, type ReactNode } from 'react'

import {
  ME,
  floors,
  lockers,
  parking,
  people,
  rooms,
  seedBookings,
  seedDesks,
  seedWeekPattern,
  type Booking,
  type DayMode,
  type Desk,
  type ResourceKind,
} from '../data'
import { addDays, overlaps, relativeDay, todayKey, weekStart } from './dates'

/*
  The app's whole state in one small external store. The real app persists it
  to localStorage under STORAGE_KEY; the landing-page mock makes its own copy
  that never saves. Every write goes through an action below so conflict rules
  live in one place. To move to a server, replace `commit` with API calls.
*/

export const STORAGE_KEY = 'deskflow:v1'

export type Activity = { id: string; at: string; text: string; tone: 'brand' | 'teal' | 'slate' | 'amber' | 'danger' }
export type Notice = { id: string; at: string; title: string; body: string; read: boolean }

export type Profile = { name: string; officeId: string; team: string; onboarded: boolean }

export type State = {
  version: 1
  profile: Profile
  desks: Desk[]
  bookings: Booking[]
  week: Record<string, DayMode>
  activity: Activity[]
  notices: Notice[]
}

export type BookInput = {
  kind: ResourceKind
  resourceId: string
  date: string
  start: string
  end: string
  title?: string
  personId?: string
}

export type BookResult = { ok: true; booking: Booking } | { ok: false; error: string; conflict?: Booking }

let idCounter = 0
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`

export function seedState(): State {
  const today = todayKey()
  const bookings: Booking[] = seedBookings.map(({ d, ...b }, i) => ({ ...b, id: `seed-${i}`, date: addDays(today, d) }))
  const week: Record<string, DayMode> = {}
  const mon = weekStart(today)
  for (let w = 0; w < 2; w++) {
    seedWeekPattern.forEach((mode, i) => {
      week[addDays(mon, w * 7 + i)] = mode
    })
  }
  for (const b of bookings) if (b.kind === 'desk' && b.personId === ME) week[b.date] = 'office'
  const now = Date.now()
  const ago = (min: number) => new Date(now - min * 60_000).toISOString()
  return {
    version: 1,
    profile: { name: 'Lisa Park', officeId: 'london', team: 'Product', onboarded: false },
    desks: seedDesks.map((d) => ({ ...d })),
    bookings,
    week,
    activity: [
      { id: 'a1', at: ago(12), text: 'You booked parking bay P-04 for today', tone: 'slate' },
      { id: 'a2', at: ago(48), text: 'Omar Haddad booked D-02 next to you', tone: 'teal' },
      { id: 'a3', at: ago(95), text: 'You booked Cedar for Roadmap review, 14:00', tone: 'brand' },
      { id: 'a4', at: ago(60 * 20), text: 'Locker L-06 was released', tone: 'amber' },
    ],
    notices: [
      { id: 'n1', at: ago(5), title: 'Check in by 09:30', body: 'Desk D-01 is held for you until 09:30.', read: false },
      { id: 'n2', at: ago(48), title: 'Omar is in today', body: 'Omar Haddad booked the desk next to yours.', read: false },
      { id: 'n3', at: ago(60 * 26), title: 'New: parking bays', body: 'Book a bay or locker from Parking & lockers.', read: true },
    ],
  }
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as State
      if (parsed?.version === 1 && Array.isArray(parsed.bookings) && Array.isArray(parsed.desks)) return parsed
    }
  } catch {
    // Storage blocked or corrupt: fall back to the demo state.
  }
  return seedState()
}

export type Store = ReturnType<typeof createStore>

export function createStore({ persist }: { persist: boolean }) {
  let state: State = persist ? load() : { ...seedState(), profile: { ...seedState().profile, onboarded: true } }
  const listeners = new Set<() => void>()

  function commit(next: State) {
    state = next
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Quota or privacy mode: keep working in memory.
      }
    }
    listeners.forEach((l) => l())
  }

  function log(next: State, text: string, tone: Activity['tone']): State {
    return { ...next, activity: [{ id: uid('a'), at: new Date().toISOString(), text, tone }, ...next.activity].slice(0, 30) }
  }

  function notify(next: State, title: string, body: string): State {
    return { ...next, notices: [{ id: uid('n'), at: new Date().toISOString(), title, body, read: false }, ...next.notices].slice(0, 30) }
  }

  const actions = {
    /** Validates the slot against existing bookings, then saves it. */
    book(input: BookInput): BookResult {
      const personId = input.personId ?? ME
      if (input.start >= input.end) return { ok: false, error: 'End time must be after the start time.' }
      if (input.date < todayKey()) return { ok: false, error: 'You can’t book a day in the past.' }
      if (input.kind === 'desk' && !state.desks.some((d) => d.id === input.resourceId)) {
        return { ok: false, error: 'That desk no longer exists.' }
      }
      const clash = state.bookings.find(
        (b) =>
          b.resourceId === input.resourceId &&
          b.date === input.date &&
          overlaps(b.start, b.end, input.start, input.end),
      )
      if (clash) {
        const who = clash.personId === personId ? 'You already have' : `${personName(clash.personId)} has`
        return { ok: false, error: `${who} ${labelFor(clash)} ${clash.start}–${clash.end}.`, conflict: clash }
      }
      if (input.kind === 'desk' || input.kind === 'parking' || input.kind === 'locker') {
        const mine = state.bookings.find(
          (b) =>
            b.personId === personId &&
            b.kind === input.kind &&
            b.date === input.date &&
            overlaps(b.start, b.end, input.start, input.end),
        )
        if (mine) {
          return {
            ok: false,
            error: `You already have ${labelFor(mine)} ${mine.start}–${mine.end}. Cancel it first.`,
            conflict: mine,
          }
        }
      }
      const booking: Booking = { id: uid('b'), personId, ...input }
      let next: State = { ...state, bookings: [...state.bookings, booking] }
      if (input.kind === 'desk' && personId === ME) next = { ...next, week: { ...next.week, [input.date]: 'office' } }
      next = log(next, `You booked ${labelFor(booking)} for ${relativeDay(input.date).toLowerCase()}, ${input.start}`, toneFor(input.kind))
      next = notify(next, 'Booking confirmed', `${capitalise(labelFor(booking))} · ${relativeDay(input.date)} ${input.start}–${input.end}`)
      commit(next)
      return { ok: true, booking }
    },

    cancel(id: string) {
      const b = state.bookings.find((x) => x.id === id)
      if (!b) return
      let next: State = { ...state, bookings: state.bookings.filter((x) => x.id !== id) }
      next = log(next, `You cancelled ${labelFor(b)} for ${relativeDay(b.date).toLowerCase()}`, 'danger')
      commit(next)
      return b
    },

    /** Puts a cancelled booking back (the toast's Undo). */
    restore(b: Booking) {
      if (state.bookings.some((x) => x.id === b.id)) return
      commit(log({ ...state, bookings: [...state.bookings, b] }, `You restored ${labelFor(b)}`, toneFor(b.kind)))
    },

    checkIn(id: string, value = true) {
      const b = state.bookings.find((x) => x.id === id)
      if (!b) return
      let next: State = { ...state, bookings: state.bookings.map((x) => (x.id === id ? { ...x, checkedIn: value } : x)) }
      next = log(next, value ? `You checked in at ${b.resourceId}` : `You checked out of ${b.resourceId}`, value ? 'teal' : 'slate')
      commit(next)
    },

    setDay(date: string, mode: DayMode) {
      commit({ ...state, week: { ...state.week, [date]: mode } })
    },

    completeOnboarding(profile: Omit<Profile, 'onboarded'>) {
      let next: State = { ...state, profile: { ...profile, onboarded: true } }
      next = notify(next, `Welcome, ${profile.name.split(' ')[0]}`, 'Your office and home team are set. Book your first desk from the floor map.')
      commit(next)
    },

    markAllRead() {
      commit({ ...state, notices: state.notices.map((n) => ({ ...n, read: true })) })
    },

    markRead(id: string) {
      commit({ ...state, notices: state.notices.map((n) => (n.id === id ? { ...n, read: true } : n)) })
    },

    addDesk(floorId: string): Desk {
      const used = new Set(state.desks.map((d) => d.id))
      let n = 1
      while (used.has(`D-${String(n).padStart(2, '0')}`)) n++
      const desk: Desk = { id: `D-${String(n).padStart(2, '0')}`, floorId, x: 760, y: 200, w: 52, h: 36, zone: 'New', features: ['Monitor'] }
      commit(log({ ...state, desks: [...state.desks, desk] }, `Desk ${desk.id} was added to the plan`, 'slate'))
      return desk
    },

    moveDesk(id: string, x: number, y: number, silent = false) {
      const next = { ...state, desks: state.desks.map((d) => (d.id === id ? { ...d, x, y } : d)) }
      commit(silent ? next : log(next, `Desk ${id} was moved`, 'slate'))
    },

    updateDesk(id: string, patch: Partial<Omit<Desk, 'id'>>) {
      commit({ ...state, desks: state.desks.map((d) => (d.id === id ? { ...d, ...patch } : d)) })
    },

    removeDesk(id: string): number {
      const dropped = state.bookings.filter((b) => b.resourceId === id).length
      commit(
        log(
          { ...state, desks: state.desks.filter((d) => d.id !== id), bookings: state.bookings.filter((b) => b.resourceId !== id) },
          `Desk ${id} was removed from the plan`,
          'danger',
        ),
      )
      return dropped
    },

    resetPlan() {
      commit(log({ ...state, desks: seedDesks.map((d) => ({ ...d })) }, 'Floor plan was reset', 'slate'))
    },

    resetDemo() {
      commit(seedState())
    },
  }

  return {
    get: () => state,
    subscribe(l: () => void) {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    actions,
  }
}

/* ---------- labels ---------- */

export function personName(id: string): string {
  return people.find((p) => p.id === id)?.name ?? 'Someone'
}

export function roomName(id: string): string {
  return rooms.find((r) => r.id === id)?.name ?? id
}

export function floorName(id: string): string {
  return floors.find((f) => f.id === id)?.name ?? id
}

export function labelFor(b: Pick<Booking, 'kind' | 'resourceId'>): string {
  switch (b.kind) {
    case 'desk':
      return `desk ${b.resourceId}`
    case 'room':
      return roomName(b.resourceId)
    case 'parking':
      return `parking bay ${parking.find((p) => p.id === b.resourceId)?.label.replace('Bay ', '') ?? b.resourceId}`
    case 'locker':
      return `locker ${lockers.find((l) => l.id === b.resourceId)?.label.replace('Locker ', '') ?? b.resourceId}`
  }
}

export function toneFor(kind: ResourceKind): Activity['tone'] {
  return kind === 'desk' ? 'brand' : kind === 'room' ? 'teal' : kind === 'parking' ? 'slate' : 'amber'
}

function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/* ---------- React bindings ---------- */

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ store, children }: { store: Store; children: ReactNode }) {
  return createElement(StoreContext.Provider, { value: store }, children)
}

export function useStore(): Store {
  const s = useContext(StoreContext)
  if (!s) throw new Error('useStore outside StoreProvider')
  return s
}

export function useAppState(): State {
  const s = useStore()
  return useSyncExternalStore(s.subscribe, s.get, s.get)
}

export function useActions() {
  return useStore().actions
}

/* ---------- selectors ---------- */

export function bookingsOn(state: State, date: string, kind?: ResourceKind) {
  return state.bookings.filter((b) => b.date === date && (!kind || b.kind === kind))
}

export function isFree(state: State, resourceId: string, date: string, start: string, end: string) {
  return !state.bookings.some((b) => b.resourceId === resourceId && b.date === date && overlaps(b.start, b.end, start, end))
}

export function myBookings(state: State) {
  return state.bookings
    .filter((b) => b.personId === ME)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
}

export function availability(state: State, date: string) {
  const day = bookingsOn(state, date)
  const taken = (kind: ResourceKind) => new Set(day.filter((b) => b.kind === kind).map((b) => b.resourceId)).size
  return {
    desks: state.desks.length - taken('desk'),
    parking: parking.length - taken('parking'),
    lockers: lockers.length - taken('locker'),
    rooms: rooms.length,
  }
}
