import { Hono } from 'hono'

// The Worker in front of the static app. The library itself keeps its data in
// the browser (localStorage); add API routes here when you move it to D1/R2.
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.get('/api/health', (c) => c.json({ ok: true }))

// "Get started" email capture on the landing page. Wire this to your email
// provider or a D1 table; it currently validates and acknowledges.
app.post('/api/subscribe', async (c) => {
  const body = await c.req.json<{ email?: unknown }>().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  if (!EMAIL.test(email) || email.length > 254) return c.json({ error: 'Enter a valid work email.' }, 400)
  return c.json({ ok: true })
})

// "Talk to us" form. Forward it to your CRM or inbox here.
app.post('/api/contact', async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => null)
  if (!body) return c.json({ error: 'Send the form as JSON.' }, 400)
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!EMAIL.test(email) || email.length > 254) return c.json({ error: 'Enter a valid work email.', field: 'email' }, 400)
  if (message.length < 10) return c.json({ error: 'Tell us a little more (10 characters or so).', field: 'message' }, 400)
  if (message.length > 4000) return c.json({ error: 'Keep it under 4,000 characters.', field: 'message' }, 400)
  return c.json({ ok: true })
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
