// Validation shared by the forms and the Worker, so both give the same answer.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const VOLUMES = ['Under 10,000', '10,000 to 50,000', '50,000 to 250,000', 'Over 250,000'] as const
export const PLAN_IDS = ['launch', 'growth', 'scale'] as const

export type Errors<T> = Partial<Record<keyof T, string>>

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Enter your work email.'
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email, like you@brand.com.'
  return undefined
}

/** Accepts `brand.com`, `www.brand.com/shop` or a full https URL. Returns the bare hostname. */
export function parseStoreUrl(raw: string): { host?: string; error?: string } {
  const value = raw.trim()
  if (!value) return { error: 'Enter your store’s URL.' }
  if (value.length > 200) return { error: 'That URL is too long.' }
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
  } catch {
    return { error: 'Enter a URL like yourbrand.com.' }
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  if (!/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(host) || host.split('.').some((p) => !p || p.startsWith('-') || p.endsWith('-'))) {
    return { error: 'Enter a URL like yourbrand.com.' }
  }
  if (host === 'localhost' || /^\d+(\.\d+){3}$/.test(host)) return { error: 'Enter a public store URL.' }
  return { host }
}

export type ContactInput = { name: string; email: string; company: string; volume: string; message: string }

export function validateContact(v: Partial<ContactInput>): Errors<ContactInput> {
  const e: Errors<ContactInput> = {}
  const name = (v.name ?? '').trim()
  if (name.length < 2) e.name = 'Enter your full name.'
  else if (name.length > 80) e.name = 'Keep your name under 80 characters.'
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const company = (v.company ?? '').trim()
  if (!company) e.company = 'Enter your brand or store name.'
  else if (company.length > 100) e.company = 'Keep it under 100 characters.'
  if (!VOLUMES.includes((v.volume ?? '') as (typeof VOLUMES)[number])) e.volume = 'Choose your list size.'
  if ((v.message ?? '').length > 1000) e.message = 'Keep your note under 1,000 characters.'
  return e
}

export type SignupInput = { name: string; email: string; store: string; plan: string; terms: boolean }

export function validateSignup(v: Partial<SignupInput>): Errors<SignupInput> {
  const e: Errors<SignupInput> = {}
  const name = (v.name ?? '').trim()
  if (name.length < 2) e.name = 'Enter your full name.'
  else if (name.length > 80) e.name = 'Keep your name under 80 characters.'
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const store = parseStoreUrl(v.store ?? '')
  if (store.error) e.store = store.error
  if (!PLAN_IDS.includes((v.plan ?? '') as (typeof PLAN_IDS)[number])) e.plan = 'Choose a plan.'
  if (!v.terms) e.terms = 'Accept the terms to continue.'
  return e
}
