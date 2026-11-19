import { Hono } from 'hono'

import { slotsFor, validateBooking, validateSubscribe, type FieldErrors } from '../shared/validation'

// The Worker in front of the static site. The form routes validate input and
// return a reference; connect them to email, a CRM or a D1 table to keep the
// requests. Everything else falls through to the built assets (SPA mode).
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

const reference = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json()
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

const invalid = (fieldErrors: FieldErrors) => Response.json({ error: 'Please check the highlighted fields.', fieldErrors }, { status: 422 })
const badJson = () => Response.json({ error: 'Send a JSON object.' }, { status: 400 })

app.get('/api/health', (c) => c.json({ ok: true }))

// Open consultation times for one day.
app.get('/api/slots', (c) => {
  const date = c.req.query('date') ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return c.json({ error: 'Pass ?date=YYYY-MM-DD.' }, 400)
  return c.json({ date, slots: slotsFor(date) })
})

// Design consultation booking.
app.post('/api/bookings', async (c) => {
  const body = await readBody(c.req.raw)
  if (!body) return badJson()
  const errors = validateBooking(body)
  if (Object.keys(errors).length) return invalid(errors)
  const slot = slotsFor(String(body.date)).find((s) => s.time === body.time)
  if (!slot?.available) return Response.json({ error: 'That time has just been taken. Choose another.', fieldErrors: { time: 'That time has just been taken.' } }, { status: 409 })
  return c.json({ ok: true, reference: reference('LO') }, 201)
})

// Footer newsletter signup.
app.post('/api/subscribe', async (c) => {
  const body = await readBody(c.req.raw)
  if (!body) return badJson()
  const errors = validateSubscribe(body)
  if (Object.keys(errors).length) return invalid(errors)
  return c.json({ ok: true }, 201)
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
