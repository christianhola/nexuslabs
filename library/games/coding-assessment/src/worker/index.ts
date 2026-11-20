import { Hono } from 'hono'
import type { Context } from 'hono'

import { scoreAttempt, validateAttempt, validateCandidate, validateDemoRequest, validateInvites, validateSignup, validateSubscribe } from '../shared/validate'
import type { Result } from '../shared/validate'

/*
  The Worker in front of the static site. Every route validates its input with
  the same rules as the page and answers JSON. Nothing is stored server-side
  and no candidate code is executed here: tests run in the candidate's browser.
  Wire these to D1 or your ATS when you make it real (see README).
*/
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

async function body(c: Context): Promise<Record<string, unknown> | null> {
  try {
    const v = await c.req.json()
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

function handle<T>(validate: (input: Record<string, unknown>) => Result<T>, respond: (value: T) => Record<string, unknown>, status: 200 | 201 = 200) {
  return async (c: Context) => {
    const input = await body(c)
    if (!input) return c.json({ error: 'Send a JSON object.' }, 400)
    const r = validate(input)
    if (!r.ok) return c.json({ error: 'Check the highlighted fields.', fields: r.errors }, 422)
    return c.json(respond(r.value), status)
  }
}

const id = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`

app.get('/api/health', (c) => c.json({ ok: true }))

app.post('/api/attempts/start', handle(validateCandidate, (v) => ({ ok: true, attemptId: id('a'), candidate: v, startedAt: new Date().toISOString() })))

app.post(
  '/api/attempts',
  handle(
    validateAttempt,
    (v) => ({
      ok: true,
      id: id('a'),
      score: scoreAttempt(v.passed.length, v.total, v.aiPrompts, v.pastes),
      passed: v.passed.length,
      total: v.total,
      submittedAt: new Date().toISOString(),
    }),
    201,
  ),
)

app.post('/api/demo-request', handle(validateDemoRequest, (v) => ({ ok: true, reference: id('dr'), name: v.name })))

app.post('/api/signup', handle(validateSignup, (v) => ({ ok: true, user: { ...v, id: id('u') } }), 201))

app.post('/api/invites', handle(validateInvites, (v) => ({ ok: true, sent: v.emails.length, emails: v.emails })))

app.post('/api/subscribe', handle(validateSubscribe, () => ({ ok: true })))

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
