import { Hono } from 'hono'

import { validateDemo, validateEmail, validateSignup } from '../lib/validate'
import { buildReport, ranges } from '../shared-analytics'
import type { Range } from '../shared-analytics'

// The Worker in front of the static site. Every form posts here and is
// validated with the same rules as the page (src/lib/validate.ts). Wire the
// TODOs to your email provider, CRM or a D1 table; nothing is stored yet.
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

async function body(c: { req: { json: <T>() => Promise<T> } }) {
  const b = await c.req.json<Record<string, unknown>>().catch(() => null)
  return b && typeof b === 'object' && !Array.isArray(b) ? b : null
}
const str = (v: unknown) => (typeof v === 'string' ? v : '')

app.get('/api/health', (c) => c.json({ ok: true }))

// Sign up: 422 with per-field errors, or 201. TODO: create the publication
// and email a sign-in link (for example with Sign in with Freebuff).
app.post('/api/signup', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { name: str(b.name), email: str(b.email), publication: str(b.publication) }
  const errors = validateSignup(input)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  return c.json({ ok: true, publication: input.publication.trim() }, 201)
})

// Log in by emailed link. Always 202 for a valid address so the response
// never reveals whether an account exists.
app.post('/api/login', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const error = validateEmail(str(b.email))
  if (error) return c.json({ error, errors: { email: error } }, 422)
  return c.json({ ok: true }, 202)
})

// Demo request. TODO: forward to your inbox or CRM.
app.post('/api/demo', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { name: str(b.name), email: str(b.email), publication: str(b.publication), size: str(b.size), message: str(b.message) }
  const errors = validateDemo(input)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  return c.json({ ok: true, ref: `IW-${Date.now().toString(36).toUpperCase().slice(-6)}` }, 201)
})

// Analytics report. `?range=7d|30d|90d`; `?fail=1` returns 503 so the
// dashboard's error state can be tested.
app.get('/api/analytics', (c) => {
  if (c.req.query('fail')) return c.json({ error: 'The analytics service is unavailable. Try again in a minute.' }, 503)
  const range = (c.req.query('range') ?? '30d') as Range
  if (!ranges.includes(range)) return c.json({ error: `range must be one of ${ranges.join(', ')}.` }, 400)
  return c.json(buildReport(range))
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
