/*
  Validation rules shared by the forms and the Worker routes, so the page and
  the server reject the same input with the same messages.
*/
import { isCurrency, limits } from './fx'
import type { CurrencyCode, Speed } from './fx'

export type Errors<K extends string = string> = Partial<Record<K, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateEmail(email: string): string | null {
  const v = email.trim()
  if (!v) return 'Enter your email address.'
  if (v.length > 254 || !EMAIL.test(v)) return 'Enter a valid email address, like name@company.com.'
  return null
}

/* ---------- Transfers ---------- */

export type TransferInput = {
  from: string
  to: string
  amount: number
  speed: string
  recipientName: string
  recipientEmail: string
  /** IBAN or account number; spaces allowed. */
  account: string
  reference: string
}

export type TransferField = 'from' | 'to' | 'amount' | 'speed' | 'recipientName' | 'recipientEmail' | 'account' | 'reference'

export function validateAmount(amount: number, code: CurrencyCode): string | null {
  if (!Number.isFinite(amount) || amount <= 0) return 'Enter an amount to send.'
  const { min, max } = limits(code)
  if (amount < min) return `The minimum is ${min} ${code}.`
  if (amount > max) return `The maximum per transfer is ${max.toLocaleString('en-US')} ${code}.`
  return null
}

export function validateRecipient(input: Pick<TransferInput, 'recipientName' | 'recipientEmail' | 'account' | 'reference'>) {
  const errors: Errors<TransferField> = {}
  const name = input.recipientName.trim()
  if (name.length < 2) errors.recipientName = 'Enter the recipient’s full name.'
  else if (name.length > 80) errors.recipientName = 'Keep the name under 80 characters.'
  const email = validateEmail(input.recipientEmail)
  if (email) errors.recipientEmail = email
  const acct = input.account.replace(/\s+/g, '').toUpperCase()
  if (!acct) errors.account = 'Enter an IBAN or account number.'
  else if (!/^[A-Z0-9]{8,34}$/.test(acct)) errors.account = 'Use 8 to 34 letters and digits.'
  if (input.reference.length > 40) errors.reference = 'Keep the reference under 40 characters.'
  return errors
}

export function validateTransfer(input: TransferInput) {
  const errors: Errors<TransferField> = {}
  if (!isCurrency(input.from)) errors.from = 'Choose a currency to send.'
  if (!isCurrency(input.to)) errors.to = 'Choose a currency to receive.'
  if (isCurrency(input.from)) {
    const a = validateAmount(input.amount, input.from)
    if (a) errors.amount = a
  }
  if (input.speed !== 'instant' && input.speed !== 'standard') errors.speed = 'Choose a speed.'
  Object.assign(errors, validateRecipient(input))
  return errors
}

export function asSpeed(v: string): Speed {
  return v === 'standard' ? 'standard' : 'instant'
}

/* ---------- Cards (checkout demo) ---------- */

export function digits(v: string) {
  return v.replace(/\D+/g, '')
}

export function luhn(num: string) {
  const d = digits(num)
  if (d.length < 12 || d.length > 19) return false
  let sum = 0
  let dbl = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = d.charCodeAt(i) - 48
    if (dbl) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    dbl = !dbl
  }
  return sum % 10 === 0
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'card'

export function cardBrand(num: string): CardBrand {
  const d = digits(num)
  if (/^4/.test(d)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard'
  if (/^3[47]/.test(d)) return 'amex'
  return 'card'
}

export type CheckoutInput = {
  email: string
  name: string
  card: string
  expiry: string
  cvc: string
  postcode: string
}
export type CheckoutField = keyof CheckoutInput

export function validateCheckout(input: CheckoutInput, now = new Date()) {
  const errors: Errors<CheckoutField> = {}
  const e = validateEmail(input.email)
  if (e) errors.email = e
  if (input.name.trim().length < 2) errors.name = 'Enter the name on the card.'
  if (!digits(input.card)) errors.card = 'Enter a card number.'
  else if (!luhn(input.card)) errors.card = 'That card number is not valid.'
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(input.expiry.trim())
  if (!m) errors.expiry = 'Use MM / YY.'
  else {
    const month = Number(m[1])
    const year = 2000 + Number(m[2])
    if (month < 1 || month > 12) errors.expiry = 'The month must be 01 to 12.'
    else if (new Date(year, month, 1) <= new Date(now.getFullYear(), now.getMonth(), 1)) errors.expiry = 'This card has expired.'
  }
  const cvcLen = cardBrand(input.card) === 'amex' ? 4 : 3
  if (digits(input.cvc).length !== cvcLen) errors.cvc = `Enter the ${cvcLen}-digit code.`
  if (input.postcode.trim().length < 3) errors.postcode = 'Enter your postcode.'
  return errors
}

/** Demo card numbers the checkout understands (see content.ts testCards). */
export const DECLINE_CARD = '4000000000000002'
export const CHALLENGE_CARD = '4000002500003155'

/* ---------- Contact / trust center ---------- */

export type ContactInput = { name: string; email: string; company: string; topic: string; message: string }
export type ContactField = keyof ContactInput

export function validateContact(input: ContactInput, topics: readonly string[]) {
  const errors: Errors<ContactField> = {}
  if (input.name.trim().length < 2) errors.name = 'Enter your name.'
  const e = validateEmail(input.email)
  if (e) errors.email = e
  if (input.company.trim().length < 2) errors.company = 'Enter your company.'
  if (!topics.includes(input.topic)) errors.topic = 'Choose what you need.'
  if (input.message.trim().length < 10) errors.message = 'Tell us a little more (10 characters or more).'
  else if (input.message.length > 2000) errors.message = 'Keep it under 2,000 characters.'
  return errors
}

/* ---------- Sign up ---------- */

export type SignupInput = {
  businessType: string
  country: string
  volume: string
  company: string
  name: string
  email: string
  password: string
}
export type SignupField = keyof SignupInput

export function validatePassword(pw: string): string | null {
  if (pw.length < 10) return 'Use 10 characters or more.'
  if (!/[a-z]/i.test(pw) || !/\d/.test(pw)) return 'Mix letters and at least one number.'
  return null
}

export function validateSignup(input: SignupInput, options: { types: readonly string[]; countries: readonly string[]; volumes: readonly string[] }) {
  const errors: Errors<SignupField> = {}
  if (!options.types.includes(input.businessType)) errors.businessType = 'Choose your business type.'
  if (!options.countries.includes(input.country)) errors.country = 'Choose where you’re registered.'
  if (!options.volumes.includes(input.volume)) errors.volume = 'Choose your monthly volume.'
  if (input.company.trim().length < 2) errors.company = 'Enter your company’s legal name.'
  if (input.name.trim().length < 2) errors.name = 'Enter your full name.'
  const e = validateEmail(input.email)
  if (e) errors.email = e
  const p = validatePassword(input.password)
  if (p) errors.password = p
  return errors
}
