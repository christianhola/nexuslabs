import { DurableObject } from 'cloudflare:workers'
import { World } from '../shared/simulation'
import {
  EMPTY_PROFILE,
  ROOM_LIMIT,
  STEP,
  cleanName,
  validInput,
  validSkin,
} from '../shared/protocol'
import type { Profile, Result, Snake } from '../shared/protocol'
import type { Env } from './index'

type Peer = {
  id: string
  sub: string | null
  joined: boolean
  tokens: number
  refill: number
  lastInput: number
  connected: number
  lastPong: number
  pendingTick: number
  food: Set<number>
}
const BOT_NAMES = [
  'Fern',
  'Miso',
  'Pebble',
  'Clover',
  'Mochi',
  'Fig',
  'Wisp',
  'Pip',
]

export class Arena extends DurableObject<Env> {
  private world = new World()
  private peers = new Map<WebSocket, Peer>()
  private timer: ReturnType<typeof setInterval> | null = null
  private last = 0
  private accumulator = 0

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.world.onDeath = (snake, result) => this.finish(snake, result)
  }
  async getProfile(sub: string): Promise<Profile> {
    return (
      (await this.ctx.storage.get<Profile>(`user:${sub}`)) ?? {
        ...EMPTY_PROFILE,
      }
    )
  }
  async saveSkin(sub: string, skin: number) {
    return this.ctx.storage.transaction(async (tx) => {
      const p = (await tx.get<Profile>(`user:${sub}`)) ?? { ...EMPTY_PROFILE }
      p.skin = skin
      await tx.put(`user:${sub}`, p)
      return p
    })
  }
  async recordResult(sub: string, result: Result) {
    await this.ctx.storage.transaction(async (tx) => {
      const p = (await tx.get<Profile>(`user:${sub}`)) ?? { ...EMPTY_PROFILE }
      p.best = Math.max(p.best, result.score)
      p.games++
      p.kills += result.kills
      p.seconds += result.seconds
      await tx.put(`user:${sub}`, p)
    })
  }
  async population() {
    return {
      online: [...this.peers.values()].filter((p) => p.joined).length,
      capacity: ROOM_LIMIT,
    }
  }
  async fetch(request: Request) {
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket')
      return new Response('WebSocket required', { status: 426 })
    if (this.peers.size >= ROOM_LIMIT)
      return new Response('Arena full', { status: 429 })
    const pair = new WebSocketPair(),
      [client, server] = Object.values(pair)
    // Active simulation intentionally uses standard sockets; no idle billing once the last peer leaves.
    server.accept()
    const now = Date.now()
    const peer: Peer = {
      id: crypto.randomUUID(),
      sub: request.headers.get('x-coil-sub'),
      joined: false,
      tokens: 60,
      refill: now,
      lastInput: now,
      connected: now,
      lastPong: now,
      pendingTick: 0,
      food: new Set(),
    }
    this.peers.set(server, peer)
    server.addEventListener('message', (event) =>
      this.message(server, event.data),
    )
    server.addEventListener('close', () => this.remove(server))
    server.addEventListener('error', () => this.remove(server))
    this.send(server, { type: 'welcome', id: peer.id })
    this.start()
    return new Response(null, { status: 101, webSocket: client })
  }
  private message(ws: WebSocket, data: string | ArrayBuffer) {
    const p = this.peers.get(ws)
    if (!p) return
    const now = Date.now()
    p.tokens = Math.min(60, p.tokens + (now - p.refill) * 0.04)
    p.refill = now
    if (typeof data !== 'string' || data.length > 512 || --p.tokens < 0) {
      ws.close(1008, 'Input limit')
      this.remove(ws)
      return
    }
    let m: Record<string, unknown>
    try {
      m = JSON.parse(data)
      if (!m || typeof m !== 'object') return
    } catch {
      return
    }
    if (m.type === 'join' && !p.joined) {
      p.joined = true
      this.world.spawn(p.id, cleanName(m.name), validSkin(m.skin) ? m.skin : 0)
      for (let i = 0; i < BOT_NAMES.length; i++)
        if (!this.world.snakes.has(`bot-${i}`))
          this.world.spawn(`bot-${i}`, BOT_NAMES[i], i % 6, true)
      this.sendSnapshot(ws, p)
    } else if (m.type === 'input' && validInput(m)) {
      const s = this.world.snakes.get(p.id)
      if (s) {
        s.input = { angle: m.angle, boost: m.boost }
        p.lastInput = now
      }
    } else if (
      m.type === 'ack' &&
      typeof m.tick === 'number' &&
      m.tick === p.pendingTick
    ) {
      p.lastPong = now
      p.pendingTick = 0
    } else if (m.type === 'ping' && typeof m.at === 'number')
      this.send(ws, { type: 'pong', at: m.at })
  }
  private send(ws: WebSocket, data: unknown) {
    try {
      ws.send(JSON.stringify(data))
    } catch {
      this.remove(ws)
    }
  }
  private sendSnapshot(ws: WebSocket, p: Peer) {
    const state = this.world.snapshot(
      p.id,
      [...this.peers.values()].filter((peer) => this.world.snakes.has(peer.id))
        .length,
    )
    const visible = new Set(state.food.map((f) => f.id))
    state.removedFood = [...p.food].filter((id) => !visible.has(id))
    state.food = state.food.filter((f) => !p.food.has(f.id))
    p.food = visible
    this.send(ws, state)
  }
  private finish(s: Snake, result: Result) {
    if (s.bot) return
    for (const [ws, p] of this.peers)
      if (p.id === s.id) {
        this.send(ws, { type: 'ended', ...result })
        if (p.sub)
          this.ctx.waitUntil(
            this.env.ARENA.get(this.env.ARENA.idFromName('profiles'))
              .recordResult(p.sub, result)
              .catch(() => {
                this.send(ws, { type: 'save-error' })
              }),
          )
      }
  }
  private remove(ws: WebSocket) {
    const p = this.peers.get(ws)
    if (!p) return
    const snake = this.world.snakes.get(p.id)
    if (snake) this.world.kill(snake, 'left')
    this.peers.delete(ws)
    if (!this.peers.size && this.timer) {
      clearInterval(this.timer)
      this.timer = null
      this.world = new World()
      this.world.onDeath = (s, r) => this.finish(s, r)
    }
  }
  private start() {
    if (this.timer) return
    this.last = Date.now()
    this.accumulator = 0
    this.timer = setInterval(() => {
      const now = Date.now()
      this.accumulator += Math.min((now - this.last) / 1000, 0.15)
      this.last = now
      let steps = 0
      while (this.accumulator >= STEP && steps++ < 5) {
        this.world.step()
        this.accumulator -= STEP
      }
      if (this.world.tick % 2 !== 0) return
      for (const [ws, p] of this.peers) {
        if (
          (!p.joined && now - p.connected > 10000) ||
          now - p.lastInput > 90000 ||
          now - p.connected > 20 * 60_000 ||
          now - p.lastPong > 15000
        ) {
          ws.close(1000, 'Session ended')
          this.remove(ws)
          continue
        }
        const snake = this.world.snakes.get(p.id)
        if (snake && now - p.lastInput > 500) snake.input.boost = false
        if (!snake) continue
        // ACK-based flow control: never enqueue a second state behind an unread frame.
        if (p.pendingTick && now - p.lastPong < 3000) continue
        if (p.pendingTick) {
          ws.close(1013, 'Connection too slow')
          this.remove(ws)
          continue
        }
        p.pendingTick = this.world.tick
        this.sendSnapshot(ws, p)
      }
      if (
        this.world.tick % 90 === 0 &&
        [...this.peers.values()].some((p) => this.world.snakes.has(p.id))
      ) {
        for (let i = 0; i < BOT_NAMES.length; i++)
          if (!this.world.snakes.has(`bot-${i}`))
            this.world.spawn(`bot-${i}`, BOT_NAMES[i], i % 6, true)
      }
    }, 1000 / 30)
  }
}
