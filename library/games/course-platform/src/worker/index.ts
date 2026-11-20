import { Hono } from 'hono'

import { LIVE_QUIZZES, normaliseQuizCode, validateContact, validateEmail, validateEnroll, validateIntegrationRequest, validatePublish, validateQuizCode, validateSignup } from '../lib/validate'

/*
  The Worker in front of the static site. Every form posts here and is
  validated with the same rules as the page (src/lib/validate.ts). Nothing
  is stored server-side: wire each TODO to your email provider, CRM,
  payment provider or a D1 table.
*/
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

async function body(c: { req: { json: <T>() => Promise<T> } }) {
  const b = await c.req.json<Record<string, unknown>>().catch(() => null)
  return b && typeof b === 'object' && !Array.isArray(b) ? b : null
}
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const ref = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`
const fieldErrors = (errors: Record<string, string | undefined>) => Object.keys(errors).length > 0

app.get('/api/health', (c) => c.json({ ok: true }))

// Footer newsletter.
app.post('/api/subscribe', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const error = validateEmail(str(b.email))
  if (error) return c.json({ error, errors: { email: error } }, 422)
  // TODO: add the address to your mailing list.
  return c.json({ ok: true })
})

// Hero quiz card: join a live quiz by code. 422 bad format, 404 unknown code.
app.post('/api/quiz/join', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const error = validateQuizCode(str(b.code))
  if (error) return c.json({ error }, 422)
  const quiz = LIVE_QUIZZES[normaliseQuizCode(str(b.code))]
  if (!quiz) return c.json({ error: 'No live quiz uses that code. Check it with your instructor.' }, 404)
  return c.json({ ok: true, ...quiz })
})

// "Book a demo".
app.post('/api/contact', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { name: str(b.name), email: str(b.email), company: str(b.company), topic: str(b.topic), audience: str(b.audience), message: str(b.message) }
  const errors = validateContact(input)
  if (fieldErrors(errors)) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: forward to your inbox or CRM.
  return c.json({ ok: true, ref: ref('CK') }, 201)
})

// Start free: creates nothing yet, just validates and names the school URL.
app.post('/api/signup', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { name: str(b.name), email: str(b.email), school: str(b.school), kind: str(b.kind), terms: b.terms === true }
  const errors = validateSignup(input)
  if (fieldErrors(errors)) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: create the account with real auth (for example Sign in with Freebuff).
  const slug = input.school.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'school'
  return c.json({ ok: true, slug }, 201)
})

// Storefront checkout (demo, no payment is taken).
app.post('/api/enroll', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { name: str(b.name), email: str(b.email), courseId: str(b.courseId), plan: str(b.plan) }
  const errors = validateEnroll(input)
  if (fieldErrors(errors)) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: create a checkout session with your payment provider.
  return c.json({ ok: true, order: ref('ORD') }, 201)
})

// Integrations page: request a new integration.
app.post('/api/integration-request', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { tool: str(b.tool), category: str(b.category), email: str(b.email), useCase: str(b.useCase) }
  const errors = validateIntegrationRequest(input)
  if (fieldErrors(errors)) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: log the request to your roadmap tool.
  return c.json({ ok: true, ref: ref('INT') }, 201)
})

// Course builder: publish checks the outline and returns the public URL.
app.post('/api/courses/publish', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const problems = validatePublish(b as never)
  if (problems.length) return c.json({ error: problems[0], problems }, 422)
  // TODO: persist the course (D1) and invalidate the storefront cache.
  const slug = str(b.title).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
  return c.json({ ok: true, url: `/courses/${slug}`, publishedAt: new Date().toISOString() }, 201)
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
