// Validation shared by the forms and the Worker, so both give the same answer.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const TOPICS = ['sales', 'support', 'partnerships', 'careers', 'press'] as const
export type Topic = (typeof TOPICS)[number]

export type ContactInput = { name: string; email: string; company?: string; topic: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactInput, string>>

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter your email address.'
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address, like you@company.com.'
  return undefined
}

export function validateContact(v: Partial<ContactInput>): ContactErrors {
  const e: ContactErrors = {}
  const name = (v.name ?? '').trim()
  if (name.length < 2) e.name = 'Enter your full name.'
  else if (name.length > 80) e.name = 'Keep your name under 80 characters.'
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  if ((v.company ?? '').length > 100) e.company = 'Keep the company name under 100 characters.'
  if (!TOPICS.includes((v.topic ?? '') as Topic)) e.topic = 'Choose a topic.'
  const msg = (v.message ?? '').trim()
  if (msg.length < 20) e.message = `Write at least 20 characters (${msg.length} so far).`
  else if (msg.length > 2000) e.message = 'Keep your message under 2,000 characters.'
  return e
}
