import { Hono } from 'hono'

import { validateEmail } from '../shared/validate'

/*
  The Worker in front of the static app. The library itself lives in the
  browser (localStorage); the Worker only takes waitlist signups. Wire
  /api/waitlist to D1 or your email provider when you launch.
*/
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ ok: true }))

app.post('/api/waitlist', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Send a JSON object.' }, 400)
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return c.json({ error: 'Send a JSON object.' }, 400)
  const { email, plan } = body as { email?: unknown; plan?: unknown }
  const error = validateEmail(email)
  if (error) return c.json({ error, errors: { email: error } }, 422)
  if (plan !== undefined && !['free', 'plus', 'studio'].includes(String(plan))) return c.json({ error: 'Unknown plan.' }, 422)
  // Demo: derive a stable position and referral code from the address.
  const normalised = String(email).trim().toLowerCase()
  let h = 0
  for (const ch of normalised) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return c.json({ ok: true, position: 1200 + (h % 2800), referral: h.toString(36).slice(0, 6) })
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
