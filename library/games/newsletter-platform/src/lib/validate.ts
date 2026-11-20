/* Form rules shared by the pages and the Worker, so both say the same thing. */
export const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  const v = email.trim()
  if (!v) return 'Enter your email address.'
  if (!emailRe.test(v) || v.length > 254) return 'Enter an email like name@example.com.'
  return null
}

export type Errors = Record<string, string>

export function validateSignup(i: { name: string; email: string; publication: string }) {
  const e: Errors = {}
  if (!i.name.trim()) e.name = 'Enter your name.'
  const em = validateEmail(i.email)
  if (em) e.email = em
  if (i.publication.trim().length < 2) e.publication = 'Name your publication (you can change it later).'
  return e
}

export function validateDemo(i: { name: string; email: string; publication: string; size: string; message: string }) {
  const e: Errors = {}
  if (!i.name.trim()) e.name = 'Enter your name.'
  const em = validateEmail(i.email)
  if (em) e.email = em
  if (!i.publication.trim()) e.publication = 'Enter your publication or company.'
  if (!i.size) e.size = 'Choose your list size.'
  if (i.message.length > 1000) e.message = 'Keep it under 1,000 characters.'
  return e
}
