/*
  Contact-form rules shared by the page and the Worker, so the browser and
  the server always agree on what is valid.
*/
export type ContactInput = {
  firstName: string
  lastName: string
  email: string
  company: string
  role: string
  volume: string
  devices: string[]
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

// Personal mail domains: sales wants a work address.
const PERSONAL = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'proton.me', 'aol.com', 'gmx.com']

export const VOLUMES = ['lt1k', '1k-10k', '10k-100k', 'gt100k']

export function validateEmail(email: string): string | undefined {
  const e = email.trim().toLowerCase()
  if (!e) return 'Enter your work email.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return 'Enter an email like name@company.com.'
  if (PERSONAL.includes(e.split('@')[1])) return 'Use your work email so we can route you to the right team.'
  return undefined
}

export function validateContact(v: ContactInput, roles: readonly string[]): ContactErrors {
  const errors: ContactErrors = {}
  if (!v.firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!v.lastName.trim()) errors.lastName = 'Enter your last name.'
  const email = validateEmail(v.email)
  if (email) errors.email = email
  if (!v.company.trim()) errors.company = 'Enter your company.'
  if (!roles.includes(v.role)) errors.role = 'Choose what best describes you.'
  if (!VOLUMES.includes(v.volume)) errors.volume = 'Choose how many devices you expect.'
  if (!v.devices.length) errors.devices = 'Pick at least one device type.'
  if (v.message.length > 2000) errors.message = 'Keep it under 2,000 characters.'
  return errors
}
