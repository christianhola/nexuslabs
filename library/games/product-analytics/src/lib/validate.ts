// Validation shared by the forms and the Worker, so both give the same answer.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+'] as const
export const TOPICS = ['demo', 'pricing', 'migration', 'security', 'other'] as const

export type ContactInput = { name: string; email: string; company: string; size: string; topic: string; message: string }
export type SignupInput = { name: string; email: string; password: string; company: string }
export type Errors<T> = Partial<Record<keyof T, string>>

export function validateEmail(email: string): string | undefined {
  const v = email.trim()
  if (!v) return 'Enter your work email.'
  if (v.length > 254 || !EMAIL_RE.test(v)) return 'Enter a valid email, like you@company.com.'
  return undefined
}

export function validateContact(v: Partial<ContactInput>): Errors<ContactInput> {
  const e: Errors<ContactInput> = {}
  const name = (v.name ?? '').trim()
  if (name.length < 2) e.name = 'Enter your full name.'
  else if (name.length > 80) e.name = 'Keep your name under 80 characters.'
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const company = (v.company ?? '').trim()
  if (company.length < 2) e.company = 'Enter your company name.'
  else if (company.length > 100) e.company = 'Keep the company name under 100 characters.'
  if (!TEAM_SIZES.includes((v.size ?? '') as (typeof TEAM_SIZES)[number])) e.size = 'Choose your team size.'
  if (!TOPICS.includes((v.topic ?? '') as (typeof TOPICS)[number])) e.topic = 'Choose what you want to talk about.'
  const msg = (v.message ?? '').trim()
  if (msg.length < 20) e.message = `Write at least 20 characters (${msg.length} so far).`
  else if (msg.length > 2000) e.message = 'Keep your message under 2,000 characters.'
  return e
}

export function passwordScore(pw: string): 0 | 1 | 2 | 3 | 4 {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++
  return s as 0 | 1 | 2 | 3 | 4
}

export function validateSignup(v: Partial<SignupInput>): Errors<SignupInput> {
  const e: Errors<SignupInput> = {}
  const name = (v.name ?? '').trim()
  if (name.length < 2) e.name = 'Enter your full name.'
  else if (name.length > 80) e.name = 'Keep your name under 80 characters.'
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const pw = v.password ?? ''
  if (pw.length < 8) e.password = 'Use at least 8 characters.'
  else if (pw.length > 128) e.password = 'Keep it under 128 characters.'
  const company = (v.company ?? '').trim()
  if (company.length < 2) e.company = 'Enter a workspace name.'
  else if (company.length > 60) e.company = 'Keep it under 60 characters.'
  return e
}
