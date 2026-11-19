// Validation shared by the forms (instant feedback) and the Worker (the
// authority). Each validator returns a map of field -> message; empty = valid.
import { BOOK, PACKAGES, ROOM_TYPES, ROOMS, STYLES } from '../content'

export type FieldErrors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\d\s-]{7,20}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{2}:\d{2}$/

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** Studio days: Tuesday (2) to Saturday (6). */
export const isOpenDay = (iso: string) => {
  const d = new Date(iso + 'T12:00:00Z').getUTCDay()
  return d >= 2 && d <= 6
}

export const todayIso = () => new Date().toISOString().slice(0, 10)

export const addDays = (iso: string, n: number) => {
  const d = new Date(iso + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export type BookingInput = {
  package?: string
  rooms?: string[]
  property?: string
  budget?: string
  postcode?: string
  format?: string
  date?: string
  time?: string
  name?: string
  email?: string
  phone?: string
  notes?: string
  style?: string
  savedRooms?: string[]
}

export function validateBookingStep(step: number, input: Record<string, unknown>, today = todayIso()): FieldErrors {
  const e: FieldErrors = {}
  if (step === 0) {
    if (!PACKAGES.some((p) => p.id === str(input.package))) e.package = 'Choose a package.'
    if (!BOOK.formats.some((f) => f.id === str(input.format))) e.format = 'Choose where to meet.'
  }
  if (step === 1) {
    const rooms = Array.isArray(input.rooms) ? input.rooms : []
    if (!rooms.length) e.rooms = 'Choose at least one room.'
    else if (rooms.length > ROOM_TYPES.length || !rooms.every((r) => (ROOM_TYPES as readonly string[]).includes(String(r)))) e.rooms = 'One of those rooms is not on our list.'
    if (!BOOK.propertyTypes.includes(str(input.property))) e.property = 'Choose the type of property.'
    if (!BOOK.budgets.includes(str(input.budget))) e.budget = 'Choose a budget range.'
    const postcode = str(input.postcode)
    if (postcode.length < 3 || postcode.length > 10) e.postcode = 'Enter the postcode of the property.'
  }
  if (step === 2) {
    const date = str(input.date)
    if (!DATE.test(date) || Number.isNaN(Date.parse(date))) e.date = 'Choose a day.'
    else if (date <= today) e.date = 'Choose a day from tomorrow onwards.'
    else if (date > addDays(today, 60)) e.date = 'We book up to 60 days ahead.'
    else if (!isOpenDay(date)) e.date = BOOK.closed
    if (!TIME.test(str(input.time))) e.time = 'Choose a time.'
  }
  if (step === 3) {
    const name = str(input.name)
    if (name.length < 2) e.name = 'Enter your full name.'
    else if (name.length > 120) e.name = 'Keep your name under 120 characters.'
    if (!EMAIL.test(str(input.email))) e.email = 'Enter a valid email address.'
    const phone = str(input.phone)
    if (phone && !PHONE.test(phone)) e.phone = 'Enter a valid phone number.'
    if (str(input.notes).length > 2000) e.notes = 'Keep notes under 2,000 characters.'
    const style = str(input.style)
    if (style && !(style in STYLES)) e.style = 'That style result is not recognised.'
    const saved = input.savedRooms
    if (saved !== undefined && (!Array.isArray(saved) || saved.length > 40 || !saved.every((id) => ROOMS.some((r) => r.id === id)))) {
      e.savedRooms = 'Your ideas board has a room we no longer show.'
    }
  }
  return e
}

export function validateBooking(input: Record<string, unknown>, today?: string): FieldErrors {
  return [0, 1, 2, 3].reduce<FieldErrors>((acc, s) => ({ ...acc, ...validateBookingStep(s, input, today) }), {})
}

export function validateSubscribe(input: Record<string, unknown>): FieldErrors {
  return EMAIL.test(str(input.email)) ? {} : { email: 'Enter a valid email address.' }
}

/** Deterministic availability for one day: the client and the Worker agree. */
export function slotsFor(iso: string): { time: string; available: boolean }[] {
  if (!DATE.test(iso) || !isOpenDay(iso)) return []
  const saturday = new Date(iso + 'T12:00:00Z').getUTCDay() === 6
  const times = saturday ? ['10:00', '11:30', '13:30'] : ['09:30', '11:00', '13:00', '14:30', '16:00']
  const seed = iso.split('-').reduce((a, n) => a * 31 + Number(n), 11)
  return times.map((time, i) => ({ time, available: ((seed >> (i * 2)) & 3) !== 0 }))
}
