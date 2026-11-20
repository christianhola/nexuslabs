import { Hono } from 'hono'

import { contactTopics, signup } from '../content'
import { isCurrency, quote } from '../shared/fx'
import {
  CHALLENGE_CARD,
  DECLINE_CARD,
  asSpeed,
  digits,
  validateAmount,
  validateCheckout,
  validateContact,
  validateEmail,
  validatePassword,
  validateSignup,
  validateTransfer,
} from '../shared/validate'

/*
  The Worker in front of the static site. Every form posts here and is
  validated with the same rules as the page (src/shared/validate.ts). Nothing
  is stored server-side: wire each route to your provider, database or inbox.
  Everything that is not /api/* falls through to the built assets (SPA mode).
*/
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

const id = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`

async function body(c: { req: { json: <T>() => Promise<T> } }): Promise<Record<string, unknown> | null> {
  const b = await c.req.json<unknown>().catch(() => null)
  return b && typeof b === 'object' && !Array.isArray(b) ? (b as Record<string, unknown>) : null
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')

app.get('/api/health', (c) => c.json({ ok: true }))

// Live FX quote. GET /api/quote?from=USD&to=EUR&amount=2500&speed=instant
app.get('/api/quote', (c) => {
  const from = c.req.query('from')
  const to = c.req.query('to')
  const amount = Number(c.req.query('amount'))
  const errors: Record<string, string> = {}
  if (!isCurrency(from)) errors.from = 'Unknown currency.'
  if (!isCurrency(to)) errors.to = 'Unknown currency.'
  if (isCurrency(from)) {
    const a = validateAmount(amount, from)
    if (a) errors.amount = a
  }
  if (Object.keys(errors).length || !isCurrency(from) || !isCurrency(to)) {
    return c.json({ error: 'invalid_request', errors }, 400)
  }
  const q = quote(from, to, amount, asSpeed(c.req.query('speed') ?? 'instant'))
  return c.json({ id: id('qt'), ...q })
})

// Create a transfer from a fresh quote. Returns 201 with the priced transfer,
// 422 with field errors, or 409 when the quote is older than its lock.
app.post('/api/transfers', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'invalid_request', message: 'Send a JSON body.' }, 400)
  const input = {
    from: str(b.from),
    to: str(b.to),
    amount: Number(b.amount),
    speed: str(b.speed),
    recipientName: str(b.recipientName),
    recipientEmail: str(b.recipientEmail),
    account: str(b.account),
    reference: str(b.reference),
  }
  const errors = validateTransfer(input)
  if (Object.keys(errors).length) return c.json({ error: 'validation_failed', errors }, 422)
  const quotedAt = Number(b.quotedAt)
  if (!Number.isFinite(quotedAt) || Date.now() - quotedAt > 35_000) {
    return c.json({ error: 'quote_expired', message: 'Your quote expired. Request a new one.' }, 409)
  }
  if (!isCurrency(input.from) || !isCurrency(input.to)) return c.json({ error: 'invalid_request' }, 400)
  const q = quote(input.from, input.to, input.amount, asSpeed(input.speed), quotedAt)
  return c.json({ id: id('tr'), status: 'converted', createdAt: Date.now(), ...q }, 201)
})

// Checkout demo. Test cards: 4242… succeeds, 4000 0025 0000 3155 needs a
// one-time code (send `otp` with six digits), 4000 0000 0000 0002 declines.
app.post('/api/checkout', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'invalid_request', message: 'Send a JSON body.' }, 400)
  const input = {
    email: str(b.email),
    name: str(b.name),
    card: str(b.card),
    expiry: str(b.expiry),
    cvc: str(b.cvc),
    postcode: str(b.postcode),
  }
  const amount = Number(b.amount)
  const errors = validateCheckout(input)
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000) {
    return c.json({ error: 'invalid_request', message: 'Amount must be between 0 and 100,000.' }, 400)
  }
  if (Object.keys(errors).length) return c.json({ error: 'validation_failed', errors }, 422)
  const card = digits(input.card)
  if (card === DECLINE_CARD) {
    return c.json({ error: 'card_declined', message: 'Your card was declined. Try another card.' }, 402)
  }
  if (card === CHALLENGE_CARD) {
    const otp = str(b.otp)
    if (!otp) return c.json({ status: 'requires_action', message: 'Enter the code your bank sent.' }, 200)
    if (!/^\d{6}$/.test(otp)) return c.json({ error: 'validation_failed', errors: { otp: 'Enter all 6 digits.' } }, 422)
  }
  return c.json({ status: 'succeeded', id: id('pay'), amount, last4: card.slice(-4) }, 201)
})

// Security pack / sales contact.
app.post('/api/contact', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'invalid_request', message: 'Send a JSON body.' }, 400)
  const input = {
    name: str(b.name),
    email: str(b.email),
    company: str(b.company),
    topic: str(b.topic),
    message: str(b.message),
  }
  const errors = validateContact(input, contactTopics)
  if (Object.keys(errors).length) return c.json({ error: 'validation_failed', errors }, 422)
  return c.json({ ok: true, ref: `LG-${Date.now().toString(36).toUpperCase().slice(-6)}` }, 201)
})

// Hero and footer email capture.
app.post('/api/subscribe', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'invalid_request', message: 'Send a JSON body.' }, 400)
  const error = validateEmail(str(b.email))
  if (error) return c.json({ error: 'validation_failed', errors: { email: error } }, 422)
  return c.json({ ok: true }, 201)
})

// Account opening. Demo only: nothing is created.
app.post('/api/signup', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'invalid_request', message: 'Send a JSON body.' }, 400)
  const input = {
    businessType: str(b.businessType),
    country: str(b.country),
    volume: str(b.volume),
    company: str(b.company),
    name: str(b.name),
    email: str(b.email),
    password: str(b.password),
  }
  const errors = validateSignup(input, signup)
  if (Object.keys(errors).length) return c.json({ error: 'validation_failed', errors }, 422)
  return c.json({ ok: true, id: id('acct') }, 201)
})

// Log in. Demo only: accepts any valid email with a valid password.
app.post('/api/login', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'invalid_request', message: 'Send a JSON body.' }, 400)
  const errors: Record<string, string> = {}
  const e = validateEmail(str(b.email))
  if (e) errors.email = e
  const p = validatePassword(str(b.password))
  if (p) errors.password = 'That email and password don’t match.'
  if (Object.keys(errors).length) return c.json({ error: 'validation_failed', errors }, e ? 422 : 401)
  return c.json({ ok: true, email: str(b.email).trim() })
})

app.all('/api/*', (c) => c.json({ error: 'not_found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
