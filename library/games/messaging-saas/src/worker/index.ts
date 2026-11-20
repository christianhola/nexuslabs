import { Hono } from 'hono'

import { buildPreview } from '../lib/preview'
import { parseStoreUrl, validateContact, validateEmail, validateSignup } from '../lib/validate'

/*
  The Worker in front of the static site. Every form posts here and gets the
  same validation the browser runs (src/lib/validate.ts). Nothing is stored:
  wire each route to your CRM, email provider or a D1 table.
*/
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

async function body<T>(c: { req: { json: <J>() => Promise<J> } }): Promise<Partial<T> | null> {
  try {
    const v = await c.req.json<unknown>()
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Partial<T>) : null
  } catch {
    return null
  }
}

const invalidJson = { error: 'Send a JSON object.' }

app.get('/api/health', (c) => c.json({ ok: true }))

// "Test our AI": draft a conversation for a store URL.
app.post('/api/preview', async (c) => {
  const b = await body<{ url: string }>(c)
  if (!b) return c.json(invalidJson, 400)
  const { host, error } = parseStoreUrl(typeof b.url === 'string' ? b.url : '')
  if (!host) return c.json({ error, field: 'url' }, 422)
  return c.json({ ok: true, preview: buildPreview(host) })
})

app.post('/api/contact', async (c) => {
  const b = await body<Record<string, string>>(c)
  if (!b) return c.json(invalidJson, 400)
  const errors = validateContact(b)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  return c.json({ ok: true })
})

app.post('/api/signup', async (c) => {
  const b = await body<Record<string, unknown>>(c)
  if (!b) return c.json(invalidJson, 400)
  const errors = validateSignup(b as never)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  const host = parseStoreUrl(String(b.store)).host
  return c.json({ ok: true, workspace: { id: crypto.randomUUID(), store: host, plan: b.plan } })
})

// Magic-link sign-in. Wire to your auth provider; this only validates.
app.post('/api/login', async (c) => {
  const b = await body<{ email: string }>(c)
  if (!b) return c.json(invalidJson, 400)
  const error = validateEmail(typeof b.email === 'string' ? b.email : '')
  if (error) return c.json({ error, errors: { email: error } }, 422)
  return c.json({ ok: true })
})

app.post('/api/subscribe', async (c) => {
  const b = await body<{ email: string }>(c)
  if (!b) return c.json(invalidJson, 400)
  const error = validateEmail(typeof b.email === 'string' ? b.email : '')
  if (error) return c.json({ error, errors: { email: error } }, 422)
  return c.json({ ok: true })
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
