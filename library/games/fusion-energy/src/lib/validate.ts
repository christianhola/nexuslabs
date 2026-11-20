// Validation shared by the forms and the Worker, so both give the same answer.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const SEGMENTS = ['shipping', 'defense', 'offshore'] as const
export const TOPICS = ['investors', 'press', 'partnerships', 'general'] as const

type Errors<T> = Partial<Record<keyof T, string>>

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter your email address.'
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address, like you@company.com.'
  return undefined
}

function validateName(name: string): string | undefined {
  const n = name.trim()
  if (n.length < 2) return 'Enter your full name.'
  if (n.length > 80) return 'Keep your name under 80 characters.'
  return undefined
}

export type EarlyAccessInput = {
  name: string
  email: string
  organisation: string
  role?: string
  segment: string
  fleetSize: string
  timeline: string
  notes?: string
}

export function validateEarlyAccessStep1(v: Partial<EarlyAccessInput>): Errors<EarlyAccessInput> {
  const e: Errors<EarlyAccessInput> = {}
  const name = validateName(v.name ?? '')
  if (name) e.name = name
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const org = (v.organisation ?? '').trim()
  if (org.length < 2) e.organisation = 'Enter your organisation.'
  else if (org.length > 100) e.organisation = 'Keep this under 100 characters.'
  if (!SEGMENTS.includes((v.segment ?? '') as (typeof SEGMENTS)[number])) e.segment = 'Choose a segment.'
  return e
}

export function validateEarlyAccessStep2(v: Partial<EarlyAccessInput>): Errors<EarlyAccessInput> {
  const e: Errors<EarlyAccessInput> = {}
  if (!v.fleetSize) e.fleetSize = 'Choose a fleet size.'
  if (!v.timeline) e.timeline = 'Choose a timeline.'
  if ((v.notes ?? '').length > 1000) e.notes = 'Keep notes under 1,000 characters.'
  return e
}

export function validateEarlyAccess(v: Partial<EarlyAccessInput>): Errors<EarlyAccessInput> {
  return { ...validateEarlyAccessStep1(v), ...validateEarlyAccessStep2(v) }
}

export type ContactInput = { name: string; email: string; topic: string; message: string }

export function validateContact(v: Partial<ContactInput>): Errors<ContactInput> {
  const e: Errors<ContactInput> = {}
  const name = validateName(v.name ?? '')
  if (name) e.name = name
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  if (!TOPICS.includes((v.topic ?? '') as (typeof TOPICS)[number])) e.topic = 'Choose a topic.'
  const msg = (v.message ?? '').trim()
  if (msg.length < 20) e.message = `Write at least 20 characters (${msg.length} so far).`
  else if (msg.length > 2000) e.message = 'Keep your message under 2,000 characters.'
  return e
}

export type ApplicationInput = { role: string; name: string; email: string; link: string; note: string }

export function validateApplication(v: Partial<ApplicationInput>, roles: string[]): Errors<ApplicationInput> {
  const e: Errors<ApplicationInput> = {}
  if (!roles.includes(v.role ?? '')) e.role = 'That role is not open.'
  const name = validateName(v.name ?? '')
  if (name) e.name = name
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const link = (v.link ?? '').trim()
  if (!link) e.link = 'Add a link to your CV, LinkedIn or portfolio.'
  else if (!/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(link)) e.link = 'Enter a full link starting with https://'
  const note = (v.note ?? '').trim()
  if (note.length < 30) e.note = `Tell us a little more: at least 30 characters (${note.length} so far).`
  else if (note.length > 2000) e.note = 'Keep this under 2,000 characters.'
  return e
}

export function hasErrors(e: object) {
  return Object.keys(e).length > 0
}
