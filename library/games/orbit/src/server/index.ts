import { DurableObject } from 'cloudflare:workers'
import {
  createFreebuffAuth,
  isSameOriginRequest,
  type FreebuffAuth,
} from '@freebuff/auth'
import { MAX_PLAYERS, ROOMS, STEP } from '../shared/config'
import {
  cleanName,
  parseInput,
  skinIndex,
  validRoom,
  type Result,
  type Snapshot,
  type FoodWire,
} from '../shared/protocol'
import { World } from '../shared/physics'

interface Env {
  ASSETS: Fetcher
  ARENAS: DurableObjectNamespace<Arena>
  PROFILES: DurableObjectNamespace<Profiles>
  APP_ORIGIN?: string
  FREEBUFF_CLIENT_ID?: string
  FREEBUFF_ISSUER?: string
}
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  })
const loops = new Set(['localhost', '127.0.0.1', '[::1]'])
function origin(request: Request, env: Env) {
  if (env.APP_ORIGIN) return env.APP_ORIGIN
  const url = new URL(request.url)
  return loops.has(url.hostname) ? url.origin : null
}
let authCache: { key: string; auth: FreebuffAuth } | undefined
function authFor(env: Env) {
  if (!env.FREEBUFF_CLIENT_ID || !env.APP_ORIGIN) return null
  const key = `${env.FREEBUFF_CLIENT_ID}|${env.APP_ORIGIN}|${env.FREEBUFF_ISSUER ?? ''}`
  if (authCache?.key !== key)
    authCache = {
      key,
      auth: createFreebuffAuth({
        clientId: env.FREEBUFF_CLIENT_ID,
        baseUrl: env.APP_ORIGIN,
        issuer: env.FREEBUFF_ISSUER || undefined,
        allowInsecureLocalhost:
          env.APP_ORIGIN.startsWith('http://localhost:') ||
          env.APP_ORIGIN.startsWith('http://127.0.0.1:'),
      }),
    }
  return authCache.auth
}
async function route(request: Request, env: Env) {
  const url = new URL(request.url),
    auth = authFor(env),
    canonical = origin(request, env)
  if (url.pathname.startsWith('/auth/'))
    return json({ error: 'Sign in is not configured.' }, 503)
  if (url.pathname === '/api/me') {
    const user = await auth?.getUser(request)
    if (!user) return json({ user: null, authEnabled: !!auth })
    const response = await env.PROFILES.getByName('profiles').fetch(
      new Request('https://profiles/profile', {
        headers: { 'x-user': user.sub },
      }),
    )
    return json({
      user: { name: user.name ?? 'Player' },
      profile: await response.json(),
      authEnabled: true,
    })
  }
  if (url.pathname === '/api/rooms') {
    const rooms = await Promise.all(
      ROOMS.map(async (room) => {
        const response = await env.ARENAS.getByName(room.id).fetch(
          'https://arena/status',
        )
        return { ...room, ...((await response.json()) as object) }
      }),
    )
    return json({ rooms })
  }
  if (url.pathname === '/api/profile') {
    if (request.method !== 'POST')
      return json({ error: 'Method not allowed' }, 405)
    if (!canonical || !isSameOriginRequest(request, canonical))
      return json({ error: 'Origin refused' }, 403)
    const user = await auth?.getUser(request)
    if (!user) return json({ error: 'Sign in required' }, 401)
    if (!request.headers.get('content-type')?.startsWith('application/json'))
      return json({ error: 'Expected JSON' }, 415)
    const data = await boundedJson(request)
    if (
      !data ||
      typeof data.skin !== 'number' ||
      skinIndex(data.skin) !== data.skin
    )
      return json({ error: 'Invalid skin' }, 400)
    return env.PROFILES.getByName('profiles').fetch(
      new Request('https://profiles/skin', {
        method: 'POST',
        headers: { 'x-user': user.sub },
        body: JSON.stringify({ skin: data.skin }),
      }),
    )
  }
  if (url.pathname === '/api/play') {
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket')
      return json({ error: 'WebSocket required' }, 426)
    if (!canonical || request.headers.get('Origin') !== canonical)
      return json({ error: 'Origin refused' }, 403)
    if (!validRoom(url.searchParams.get('room')))
      return json({ error: 'Unknown room' }, 400)
    const user = await auth?.getUser(request)
    const headers = new Headers(request.headers)
    // The caller never controls identity. This private namespace has no public /arena route.
    headers.delete('x-user')
    headers.delete('x-name')
    headers.delete('x-skin')
    if (user) headers.set('x-user', user.sub)
    headers.set(
      'x-name',
      encodeURIComponent(cleanName(url.searchParams.get('name'))),
    )
    headers.set(
      'x-skin',
      String(skinIndex(Number(url.searchParams.get('skin')))),
    )
    return env.ARENAS.getByName(url.searchParams.get('room')!).fetch(
      new Request('https://arena/connect', { headers }),
    )
  }
  if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404)
  return env.ASSETS.fetch(request)
}
export default {
  fetch(request: Request, env: Env) {
    const auth = authFor(env)
    return auth
      ? auth.wrap((r: Request) => route(r, env))(request)
      : route(request, env)
  },
}
async function boundedJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  if (!request.body) return null
  const reader = request.body.getReader()
  let bytes = 0,
    text = '',
    timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      (async () => {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          bytes += value.length
          if (bytes > 1024) return null
          text += new TextDecoder().decode(value)
        }
        return JSON.parse(text)
      })(),
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), 3000)
      }),
    ])
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
    void reader.cancel().catch(() => {})
  }
}

type Session = {
  id: string
  user: string | null
  token: string
  socket: WebSocket | null
  disconnected: number
  until: number
  tokens: number
  tokenAt: number
  lastInput: number
  food: Map<number, FoodWire>
  sent: number
  ack: number
}
export class Arena extends DurableObject<Env> {
  world = new World()
  sessions = new Map<string, Session>()
  sockets = new Map<WebSocket, Session>()
  timer: ReturnType<typeof setTimeout> | undefined
  tick = 0
  nextBroadcast = 0
  lastTick = 0
  accumulator = 0
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    // A deploy/restart ends ephemeral rounds. No in-memory match is represented as durable.
    for (const socket of ctx.getWebSockets())
      socket.close(1012, 'Arena restarted')
    ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair('ping', 'pong'),
    )
  }
  async fetch(request: Request) {
    const url = new URL(request.url)
    if (url.pathname === '/status')
      return json({
        players: this.sessions.size,
        capacity: MAX_PLAYERS,
        bots: Math.max(0, 12 - this.sessions.size),
      })
    if (url.pathname !== '/connect') return json({ error: 'Not found' }, 404)
    const protocols =
      request.headers
        .get('Sec-WebSocket-Protocol')
        ?.split(',')
        .map((p) => p.trim()) ?? []
    const token = protocols.find((p) => p.startsWith('resume.'))?.slice(7)
    const user = request.headers.get('x-user')
    let session = token ? this.sessions.get(token) : undefined
    if (
      session &&
      (session.user !== user || !this.world.players.has(session.id))
    )
      session = undefined
    if (!session && this.sessions.size >= MAX_PLAYERS)
      return json({ error: 'This room is full. Try another room.' }, 429)
    const pair = new WebSocketPair(),
      client = pair[0],
      server = pair[1]
    this.ctx.acceptWebSocket(server)
    if (session) {
      if (session.socket) {
        this.sockets.delete(session.socket)
        session.socket.close(1000, 'Connected elsewhere')
      }
      session.socket = server
      session.disconnected = 0
    } else {
      const p = this.world.spawn(
        crypto.randomUUID(),
        cleanName(decodeURIComponent(request.headers.get('x-name') ?? 'Guest')),
        skinIndex(Number(request.headers.get('x-skin'))),
      )
      session = {
        id: p.id,
        user,
        token: crypto.randomUUID(),
        socket: server,
        disconnected: 0,
        until: Date.now() + 60 * 60 * 1000,
        tokens: 80,
        tokenAt: Date.now(),
        lastInput: Date.now(),
        food: new Map(),
        sent: 0,
        ack: 0,
      }
      this.sessions.set(session.token, session)
    }
    session.food.clear()
    session.sent = 0
    session.ack = 0
    this.sockets.set(server, session)
    server.send(
      JSON.stringify({ t: 'hello', id: session.id, resume: session.token }),
    )
    this.world.balanceBots()
    const state = this.world.snapshot(session.id)
    if (state) this.sendSnapshot(session, state)
    this.start()
    return new Response(null, {
      status: 101,
      webSocket: client,
      headers: protocols.includes('orbit')
        ? { 'Sec-WebSocket-Protocol': 'orbit' }
        : undefined,
    })
  }
  start() {
    if (this.timer) return
    this.lastTick = Date.now()
    this.accumulator = 0
    const loop = () => {
      this.timer = undefined
      if (!this.sessions.size) {
        this.world = new World()
        this.nextBroadcast = 0
        return
      }
      const now = Date.now()
      this.accumulator = Math.min(
        0.16,
        this.accumulator + (now - this.lastTick) / 1000,
      )
      this.lastTick = now
      while (this.accumulator >= STEP) {
        this.world.step(STEP)
        this.accumulator -= STEP
        this.tick++
      }
      for (const death of this.world.deaths.splice(0)) {
        if (death.player.bot) continue
        const session = [...this.sessions.values()].find(
          (s) => s.id === death.player.id,
        )
        if (!session) continue
        this.send(session, { t: 'end', result: death.result, by: death.by })
        this.finish(session, death.result)
      }
      for (const session of this.sessions.values()) {
        if (
          (!session.socket && now - session.disconnected > 12000) ||
          now > session.until ||
          now - session.lastInput > 90000
        ) {
          const p = this.world.players.get(session.id)
          this.finish(session, p ? this.world.result(p) : undefined)
          continue
        }
        const p = this.world.players.get(session.id)
        if (p && now - session.lastInput > 750) {
          const [x, y] = this.world.center(p)
          p.input.x = x
          p.input.y = y
        }
      }
      if (this.world.time + 1e-6 >= this.nextBroadcast) {
        do {
          this.nextBroadcast += 1 / 15
        } while (this.nextBroadcast <= this.world.time + 1e-6)
        for (const s of this.sessions.values())
          if (s.socket && s.sent - s.ack < 12) {
            const snapshot = this.world.snapshot(s.id)
            if (snapshot) this.sendSnapshot(s, snapshot)
          }
      }
      if (this.tick % 90 === 0) this.world.balanceBots()
      this.timer = setTimeout(loop, STEP * 1000)
    }
    this.timer = setTimeout(loop, STEP * 1000)
  }
  sendSnapshot(session: Session, state: Snapshot) {
    const next = new Map(state.food.map((f) => [f[0], f]))
    const changed = state.food.filter((f) => {
      const old = session.food.get(f[0])
      return !old || old[1] !== f[1] || old[2] !== f[2]
    })
    const removed = [...session.food.keys()].filter((id) => !next.has(id))
    this.send(session, {
      ...state,
      frame: ++session.sent,
      foodDelta: true,
      food: changed,
      removedFood: removed,
    })
    session.food = next
  }
  send(session: Session, data: unknown) {
    try {
      session.socket?.send(JSON.stringify(data))
    } catch {
      if (session.socket) this.disconnected(session.socket)
    }
  }
  finish(session: Session, result?: Result) {
    this.sessions.delete(session.token)
    if (session.socket) {
      this.sockets.delete(session.socket)
      session.socket.close(1000, 'Round ended')
    }
    this.world.players.delete(session.id)
    if (session.user && result && result.seconds >= 1) {
      this.ctx.waitUntil(
        this.env.PROFILES.getByName('profiles')
          .fetch(
            new Request('https://profiles/result', {
              method: 'POST',
              headers: { 'x-user': session.user },
              body: JSON.stringify(result),
            }),
          )
          .then((r) => {
            if (!r.ok) console.error('Orbit profile save failed', r.status)
          })
          .catch(() => console.error('Orbit profile save unavailable')),
      )
    }
  }
  webSocketMessage(socket: WebSocket, message: string | ArrayBuffer) {
    const s = this.sockets.get(socket)
    if (!s) return
    const now = Date.now()
    s.tokens = Math.min(80, s.tokens + (now - s.tokenAt) * 0.04)
    s.tokenAt = now
    if (--s.tokens < 0 || typeof message !== 'string' || message.length > 512) {
      socket.close(1008, 'Input limit')
      this.disconnected(socket)
      return
    }
    let data: unknown
    try {
      data = JSON.parse(message)
    } catch {
      socket.close(1008, 'Invalid input')
      this.disconnected(socket)
      return
    }
    if ((data as { t?: string })?.t === 'ping') {
      this.send(s, { t: 'pong', at: (data as { at: number }).at })
      return
    }
    if ((data as { t?: string })?.t === 'leave') {
      const p = this.world.players.get(s.id)
      this.finish(s, p ? this.world.result(p) : undefined)
      return
    }
    const input = parseInput(data)
    if (input) {
      s.lastInput = now
      s.ack = Math.max(s.ack, Math.min(s.sent, input.frame ?? 0))
      this.world.input(s.id, input)
    } else {
      socket.close(1008, 'Invalid input')
      this.disconnected(socket)
    }
  }
  disconnected(socket: WebSocket) {
    const s = this.sockets.get(socket)
    if (!s) return
    this.sockets.delete(socket)
    s.socket = null
    s.disconnected = Date.now()
  }
  webSocketClose(socket: WebSocket) {
    this.disconnected(socket)
  }
  webSocketError(socket: WebSocket) {
    this.disconnected(socket)
  }
}

/** Fixed namespace; authoritative match results arrive only through the private binding. */
export class Profiles extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    ctx.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS profile (id TEXT PRIMARY KEY, skin INTEGER NOT NULL DEFAULT 0, best INTEGER NOT NULL DEFAULT 0, rounds INTEGER NOT NULL DEFAULT 0, eaten INTEGER NOT NULL DEFAULT 0, seconds INTEGER NOT NULL DEFAULT 0)',
    )
    ctx.storage.sql.exec(
      'CREATE TABLE IF NOT EXISTS result (id TEXT PRIMARY KEY, owner TEXT NOT NULL, at INTEGER NOT NULL)',
    )
    ctx.storage.sql.exec(
      'CREATE INDEX IF NOT EXISTS result_owner ON result(owner, at)',
    )
  }
  async fetch(request: Request) {
    const user = request.headers.get('x-user')
    if (!user) return json({ error: 'Sign in required' }, 401)
    const path = new URL(request.url).pathname,
      sql = this.ctx.storage.sql
    if (path === '/profile')
      return json(
        sql
          .exec(
            'SELECT skin,best,rounds,eaten,seconds FROM profile WHERE id=?',
            user,
          )
          .toArray()[0] ?? {
          skin: 0,
          best: 0,
          rounds: 0,
          eaten: 0,
          seconds: 0,
        },
      )
    if (request.method !== 'POST')
      return json({ error: 'Method not allowed' }, 405)
    const data = (await request.json()) as Record<string, number | string>
    if (path === '/skin') {
      sql.exec(
        'INSERT INTO profile(id,skin) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET skin=excluded.skin',
        user,
        skinIndex(data.skin),
      )
      return json({ ok: true })
    }
    if (path === '/result') {
      this.ctx.storage.transactionSync(() => {
        const inserted = sql
          .exec(
            'INSERT OR IGNORE INTO result(id,owner,at) VALUES(?,?,?) RETURNING id',
            data.id,
            user,
            Date.now(),
          )
          .toArray()
        if (!inserted.length) return
        sql.exec(
          'INSERT INTO profile(id,best,rounds,eaten,seconds) VALUES(?,?,1,?,?) ON CONFLICT(id) DO UPDATE SET best=MAX(profile.best,excluded.best),rounds=profile.rounds+1,eaten=profile.eaten+excluded.eaten,seconds=profile.seconds+excluded.seconds',
          user,
          data.best,
          data.eaten,
          data.seconds,
        )
        sql.exec(
          'DELETE FROM result WHERE owner=? AND id NOT IN (SELECT id FROM result WHERE owner=? ORDER BY at DESC LIMIT 100)',
          user,
          user,
        )
      })
      return json({ ok: true })
    }
    return json({ error: 'Not found' }, 404)
  }
}
