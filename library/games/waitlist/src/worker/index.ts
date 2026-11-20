import { Hono, type Context } from 'hono'

import { ensureSchema, newCode } from './db'
import { BOOST, RANKED, csvCell, maskEmail, type RankedRow } from './rank'

// The Worker in front of the static page. `/api/*` reads and writes the
// waitlist in D1 (binding `DB`); everything else falls through to the built
// assets, and the single-page app routes it.
type Env = {
  ASSETS: Fetcher
  // Attached by Freebuff Sites once provisioned (sites_add_storage). Optional
  // so the page can explain what is missing instead of crashing.
  DB?: D1Database
  // Secret that unlocks /admin. Unset means the admin API is disabled.
  ADMIN_TOKEN?: string
}

type Ctx = Context<{ Bindings: Env }>
type Entry = { id: number; code: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const CODE = /^[a-z0-9]{4,16}$/

const app = new Hono<{ Bindings: Env }>()

app.use('/api/*', async (c, next) => {
  await next()
  c.res.headers.set('Cache-Control', 'no-store')
})

app.get('/api/health', (c) => c.json({ ok: true }))

const noDb = { error: 'database_missing', message: 'The waitlist database is not attached yet. Add D1 storage named DB and redeploy.' }

/** The DB binding with its schema ready, or null when it isn't attached. */
async function database(c: Ctx): Promise<D1Database | null> {
  const db = c.env.DB
  if (!db) return null
  await ensureSchema(db)
  return db
}

async function countAll(db: D1Database): Promise<number> {
  const row = await db.prepare('SELECT COUNT(*) AS n FROM waitlist').first<{ n: number }>()
  return Number(row?.n ?? 0)
}

async function rankedByCode(db: D1Database, code: string): Promise<RankedRow | null> {
  return db.prepare(`SELECT * FROM (${RANKED}) WHERE code = ?`).bind(code).first<RankedRow>()
}

// Public count for the "N people waiting" line.
app.get('/api/waitlist', async (c) => {
  const db = await database(c)
  if (!db) return c.json(noDb, 503)
  return c.json({ count: await countAll(db) })
})

app.post('/api/waitlist', async (c) => {
  const db = await database(c)
  if (!db) return c.json(noDb, 503)

  const body = await c.req
    .json<{ email?: unknown; ref?: unknown; company?: unknown }>()
    .catch(() => ({}) as { email?: unknown; ref?: unknown; company?: unknown })

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !EMAIL.test(email)) {
    return c.json({ error: 'invalid_email', message: 'Enter a valid email address.' }, 400)
  }
  const ref = typeof body.ref === 'string' && CODE.test(body.ref) ? body.ref : null

  // Honeypot: bots fill the hidden "company" field. Pretend it worked.
  if (typeof body.company === 'string' && body.company.trim()) {
    const count = await countAll(db)
    return c.json({ status: 'joined', position: count + 1, count: count + 1, code: newCode(), referrals: 0 })
  }

  let created: Entry | null = null
  for (let attempt = 0; attempt < 3 && !created; attempt++) {
    try {
      created = await db
        .prepare(
          `INSERT INTO waitlist (email, code, referred_by, created_at) VALUES (?, ?, ?, ?)
           ON CONFLICT(email) DO NOTHING RETURNING id, code`,
        )
        .bind(email, newCode(), ref, Date.now())
        .first<Entry>()
      if (!created) break // email already on the list
    } catch (error) {
      // A share-code collision on the UNIQUE(code) index: try a fresh code.
      if (!String(error).includes('UNIQUE') || attempt === 2) throw error
    }
  }

  const status = created ? 'joined' : 'exists'
  const code = created?.code ?? (await db.prepare('SELECT code FROM waitlist WHERE email = ?').bind(email).first<{ code: string }>())?.code
  const row = code ? await rankedByCode(db, code) : null
  if (!row) return c.json({ error: 'not_saved', message: 'Something went wrong. Try again.' }, 500)

  const count = await countAll(db)
  return c.json({ status, position: row.position, count, code: row.code, referrals: row.referrals }, created ? 201 : 200)
})

// Status page data for one share code. The code is the only key, so the
// response never includes the email.
app.get('/api/status/:code', async (c) => {
  const code = c.req.param('code').toLowerCase()
  if (!CODE.test(code)) return c.json({ error: 'invalid_code', message: 'That link is not a valid waitlist link.' }, 400)
  const db = await database(c)
  if (!db) return c.json(noDb, 503)
  const row = await rankedByCode(db, code)
  if (!row) return c.json({ error: 'not_found', message: "We couldn't find a spot for that link." }, 404)
  return c.json({
    code: row.code,
    position: row.position,
    joinedAt: row.joined_at,
    referrals: row.referrals,
    count: await countAll(db),
    boost: BOOST,
  })
})

// Top referrers, with masked names. `?code=` marks (and appends) your row.
app.get('/api/leaderboard', async (c) => {
  const db = await database(c)
  if (!db) return c.json(noDb, 503)
  const top = await db
    .prepare(`SELECT * FROM (${RANKED}) WHERE referrals > 0 ORDER BY referrals DESC, position LIMIT 5`)
    .all<RankedRow>()
  const code = c.req.query('code')?.toLowerCase()
  const rows = top.results
  if (code && CODE.test(code) && !rows.some((r) => r.code === code)) {
    const mine = await rankedByCode(db, code)
    if (mine && mine.referrals > 0) rows.push(mine)
  }
  return c.json({
    boost: BOOST,
    entries: rows.map((r) => ({
      name: maskEmail(r.email),
      referrals: r.referrals,
      position: r.position,
      ...(code && r.code === code ? { you: true } : {}),
    })),
  })
})

// ---- Admin -----------------------------------------------------------------

const encoder = new TextEncoder()

async function sameSecret(given: string, expected: string): Promise<boolean> {
  // Hash both so the comparison is length-independent and constant-time.
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(given)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ])
  // Compare every byte of the two equal-length digests (no early exit).
  const x = new Uint8Array(a)
  const y = new Uint8Array(b)
  let diff = 0
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i]
  return diff === 0
}

/** Returns an error response, or null when the caller holds ADMIN_TOKEN. */
async function denyAdmin(c: Ctx): Promise<Response | null> {
  const expected = c.env.ADMIN_TOKEN
  if (!expected) {
    return c.json({ error: 'admin_disabled', message: 'Admin is disabled. Set the ADMIN_TOKEN secret to turn it on.' }, 404)
  }
  const header = c.req.header('Authorization') ?? ''
  const given = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!given || !(await sameSecret(given, expected))) {
    c.header('WWW-Authenticate', 'Bearer')
    return c.json({ error: 'unauthorized', message: "That token didn't match. Check it and try again." }, 401)
  }
  return null
}

async function allSignups(db: D1Database): Promise<RankedRow[]> {
  const { results } = await db.prepare(`SELECT * FROM (${RANKED}) ORDER BY id DESC`).all<RankedRow>()
  return results
}

// Lets /admin say "turned off" before asking for a token.
app.get('/api/admin', (c) => c.json({ enabled: Boolean(c.env.ADMIN_TOKEN) }))

app.get('/api/admin/signups', async (c) => {
  const denied = await denyAdmin(c)
  if (denied) return denied
  const db = await database(c)
  if (!db) return c.json(noDb, 503)
  const rows = await allSignups(db)
  return c.json({
    count: rows.length,
    signups: rows.map((r) => ({
      id: r.id,
      email: r.email,
      code: r.code,
      referred_by: r.referred_by,
      referrals: r.referrals,
      position: r.position,
      created_at: r.created_at,
    })),
  })
})

app.get('/api/admin/signups.csv', async (c) => {
  const denied = await denyAdmin(c)
  if (denied) return denied
  const db = await database(c)
  if (!db) return c.json(noDb, 503)
  const rows = (await allSignups(db)).reverse()
  const header = ['email', 'position', 'joined_order', 'referrals', 'code', 'referred_by', 'created_at']
  const lines = rows.map((r) =>
    [r.email, r.position, r.joined_at, r.referrals, r.code, r.referred_by, new Date(r.created_at).toISOString()].map(csvCell).join(','),
  )
  const csv = [header.join(','), ...lines].join('\r\n') + '\r\n'
  return c.body(csv, 200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
  })
})

app.all('/api/*', (c) => c.json({ error: 'not_found', message: 'No such endpoint.' }, 404))

app.onError((error, c) => {
  console.error(error)
  return c.json({ error: 'server_error', message: 'Something went wrong. Try again.' }, 500)
})

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
