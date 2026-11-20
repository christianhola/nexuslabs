import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

import { validateContact, validateEmail } from '../lib/validate'

// The Worker in front of the static site. Add API routes here; everything
// else falls through to the built assets (single-page-application mode).
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', bodyLimit({ maxSize: 16 * 1024, onError: (c) => c.json({ error: 'Request is too large.' }, 413) }))

app.get('/api/health', (c) => c.json({ ok: true }))

// Newsletter / waitlist capture. Wire this to your email provider or a D1
// table; it currently just acknowledges the address.
app.post('/api/subscribe', async (c) => {
  const body = await c.req.json<{ email?: string }>().catch(() => null)
  if (!body || typeof body !== 'object') return c.json({ error: 'Send a JSON body.' }, 400)
  const error = validateEmail(String(body.email ?? ''))
  if (error) return c.json({ error }, 400)
  return c.json({ ok: true, demo: true })
})

// Contact form. Validates with the same rules as the page and returns 422
// with per-field errors, or 201 with a reference number. Forward the message
// to your inbox, CRM or a D1 table here.
app.post('/api/contact', async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = {
    name: String(body.name ?? ''),
    email: String(body.email ?? ''),
    company: String(body.company ?? ''),
    topic: String(body.topic ?? ''),
    message: String(body.message ?? ''),
  }
  const errors = validateContact(input)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  const ref = `RV-${Date.now().toString(36).toUpperCase().slice(-6)}`
  return c.json({ ok: true, demo: true, ref }, 201)
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
