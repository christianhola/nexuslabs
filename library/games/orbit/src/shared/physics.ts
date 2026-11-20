import {
  clamp,
  FOOD_COUNT,
  massOf,
  MAX_CELLS,
  radius,
  speed,
  START_MASS,
  WORLD,
} from './config'
import type {
  Cell,
  CellWire,
  Food,
  Input,
  Player,
  Result,
  Snapshot,
  Virus,
} from './protocol'

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y)
const round = (v: number) => Math.round(v * 10) / 10
const BOT_NAMES = [
  'miso',
  'pebble',
  'fern',
  'momo',
  'clover',
  'pollen',
  'basil',
  'dew',
  'moss',
  'fig',
  'boba',
  'olive',
]
/** Fixed-step, server-owned simulation. Clients send aim and actions, never position or score. */
export class World {
  players = new Map<string, Player>()
  food = new Map<number, Food>()
  viruses: Virus[] = []
  time = 0
  nextId = 1
  deaths: { player: Player; result: Result; by: string }[] = []
  constructor(public random: () => number = Math.random) {
    for (let i = 0; i < FOOD_COUNT; i++) this.addFood()
    for (let i = 0; i < 18; i++)
      this.viruses.push({
        id: this.nextId++,
        x: 220 + random() * (WORLD - 440),
        y: 220 + random() * (WORLD - 440),
        feeds: 0,
      })
  }
  addFood() {
    const f: Food = {
      id: this.nextId++,
      x: 25 + this.random() * (WORLD - 50),
      y: 25 + this.random() * (WORLD - 50),
      hue: Math.floor(this.random() * 6),
      mass: 2,
      vx: 0,
      vy: 0,
    }
    this.food.set(f.id, f)
    return f
  }
  spawn(id: string, name: string, skin = 0, bot = false) {
    let x = 0,
      y = 0
    for (let i = 0; i < 35; i++) {
      x = 240 + this.random() * (WORLD - 480)
      y = 240 + this.random() * (WORLD - 480)
      if (
        ![...this.players.values()].some((p) =>
          p.cells.some((c) => distance(c, { x, y }) < radius(c.mass) + 240),
        )
      )
        break
    }
    const p: Player = {
      id,
      name,
      skin,
      bot,
      cells: [],
      input: { t: 'input', x, y, seq: 0 },
      joined: this.time,
      shield: this.time + 3,
      best: START_MASS,
      eaten: 0,
      splitAt: -5,
      ejectAt: -1,
      targetAt: 0,
      run: crypto.randomUUID(),
    }
    p.cells.push({
      id: this.nextId++,
      owner: id,
      x,
      y,
      mass: START_MASS,
      vx: 0,
      vy: 0,
      mergeAt: 0,
    })
    this.players.set(id, p)
    return p
  }
  balanceBots() {
    const humans = [...this.players.values()].filter((p) => !p.bot).length
    const bots = [...this.players.values()].filter((p) => p.bot)
    const count = Math.max(0, 12 - humans)
    while (bots.length > count) this.players.delete(bots.pop()!.id)
    for (let i = bots.length; i < count; i++) {
      const taken = new Set([...this.players.values()].map((p) => p.name))
      const name = BOT_NAMES.find((n) => !taken.has(n)) ?? 'sprout'
      const p = this.spawn(
        `bot-${this.nextId}`,
        name,
        Math.floor(this.random() * 8),
        true,
      )
      p.cells[0].mass = 18 + this.random() ** 2 * 140
    }
  }
  input(id: string, input: Input) {
    const p = this.players.get(id)
    if (!p || input.seq <= p.input.seq) return
    p.input = {
      ...input,
      split: input.split || p.input.split,
      eject: input.eject || p.input.eject,
    }
  }
  split(p: Player, burst = false) {
    if (!burst && this.time - p.splitAt < 0.75) return
    p.splitAt = this.time
    let slots = MAX_CELLS - p.cells.length
    const original = [...p.cells]
    for (const c of original) {
      if (!slots || c.mass < 36) continue
      const pieces = burst
        ? Math.min(slots + 1, Math.max(2, Math.floor(c.mass / 24)))
        : 2
      const angle = Math.atan2(p.input.y - c.y, p.input.x - c.x)
      c.mass /= pieces
      c.mergeAt = this.time + 12 + c.mass * 0.025
      for (let j = 1; j < pieces; j++) {
        const a = burst ? angle + (j * Math.PI * 2) / pieces : angle
        const r = radius(c.mass)
        p.cells.push({
          id: this.nextId++,
          owner: p.id,
          x: c.x + Math.cos(a) * r,
          y: c.y + Math.sin(a) * r,
          mass: c.mass,
          vx: Math.cos(a) * (burst ? 520 : 780),
          vy: Math.sin(a) * (burst ? 520 : 780),
          mergeAt: c.mergeAt,
        })
        slots--
      }
    }
  }
  eject(p: Player) {
    if (this.time - p.ejectAt < 0.16 || this.food.size >= FOOD_COUNT + 300)
      return
    p.ejectAt = this.time
    for (const c of p.cells) {
      if (c.mass < 42) continue
      c.mass -= 12
      const a = Math.atan2(p.input.y - c.y, p.input.x - c.x),
        r = radius(c.mass) + 16
      const f: Food = {
        id: this.nextId++,
        x: c.x + Math.cos(a) * r,
        y: c.y + Math.sin(a) * r,
        mass: 10,
        hue: p.skin % 6,
        vx: Math.cos(a) * 650,
        vy: Math.sin(a) * 650,
        from: p.id,
        born: this.time,
      }
      this.food.set(f.id, f)
    }
  }
  botAim(p: Player) {
    if (this.time < p.targetAt || !p.cells.length) return
    p.targetAt = this.time + 0.25 + this.random() * 0.25
    const c = p.cells[0]
    let nearest: { x: number; y: number } | undefined,
      best = Infinity
    for (const other of this.players.values()) {
      if (other.id === p.id) continue
      for (const target of other.cells) {
        const d = distance(c, target)
        if (target.mass > c.mass * 1.18 && d < radius(target.mass) + 220) {
          p.input.x = clamp(c.x + (c.x - target.x) * 4, 30, WORLD - 30)
          p.input.y = clamp(c.y + (c.y - target.y) * 4, 30, WORLD - 30)
          return
        }
        if (c.mass > target.mass * 1.25 && d < 400 && d * 0.6 < best) {
          nearest = target
          best = d * 0.6
        }
      }
    }
    for (const f of this.food.values()) {
      const d = distance(c, f)
      if (d < best) {
        nearest = f
        best = d
      }
    }
    if (nearest) {
      p.input.x = nearest.x
      p.input.y = nearest.y
    }
  }
  step(dt: number) {
    // Bound callers as well as the scheduler; a delayed tick cannot teleport cells.
    dt = clamp(dt, 0, 1 / 20)
    this.time += dt
    for (const p of this.players.values()) {
      if (p.bot) this.botAim(p)
      if (p.input.split) this.split(p)
      if (p.input.eject) this.eject(p)
      p.input.split = false
      p.input.eject = false
      for (const c of p.cells) {
        const dx = p.input.x - c.x,
          dy = p.input.y - c.y,
          d = Math.hypot(dx, dy)
        const v = speed(c.mass) * Math.min(1, d / 45)
        const damping = Math.exp(-3.2 * dt)
        c.vx *= damping
        c.vy *= damping
        c.x += ((d > 0.01 ? (dx / d) * v : 0) + c.vx) * dt
        c.y += ((d > 0.01 ? (dy / d) * v : 0) + c.vy) * dt
        c.mass = Math.max(
          START_MASS / MAX_CELLS,
          c.mass - Math.max(0, c.mass - 65) * 0.0025 * dt,
        )
        const r = radius(c.mass)
        c.x = clamp(c.x, r, WORLD - r)
        c.y = clamp(c.y, r, WORLD - r)
      }
      // Cells separate while cooling down, then coalesce on contact.
      for (let i = 0; i < p.cells.length; i++)
        for (let j = i + 1; j < p.cells.length; j++) {
          const a = p.cells[i],
            b = p.cells[j],
            d = distance(a, b),
            sum = radius(a.mass) + radius(b.mass)
          if (d >= sum) continue
          if (this.time >= Math.max(a.mergeAt, b.mergeAt)) {
            const total = a.mass + b.mass
            a.x = (a.x * a.mass + b.x * b.mass) / total
            a.y = (a.y * a.mass + b.y * b.mass) / total
            a.mass = total
            p.cells.splice(j--, 1)
          } else if (
            Math.hypot(a.vx, a.vy) < 90 &&
            Math.hypot(b.vx, b.vy) < 90
          ) {
            const ux = d > 0.001 ? (b.x - a.x) / d : 1,
              uy = d > 0.001 ? (b.y - a.y) / d : 0
            const overlap = (sum - d) * 0.25,
              total = a.mass + b.mass
            a.x -= (ux * overlap * b.mass) / total
            a.y -= (uy * overlap * b.mass) / total
            b.x += (ux * overlap * a.mass) / total
            b.y += (uy * overlap * a.mass) / total
          }
        }
    }
    // A uniform grid bounds pellet collision work to occupied neighbourhoods.
    const grid = new Map<string, Food[]>()
    for (const f of this.food.values()) {
      if (f.from) {
        f.x = clamp(f.x + f.vx * dt, 10, WORLD - 10)
        f.y = clamp(f.y + f.vy * dt, 10, WORLD - 10)
        f.vx *= Math.exp(-4 * dt)
        f.vy *= Math.exp(-4 * dt)
        if (this.time - (f.born ?? 0) > 25) {
          this.food.delete(f.id)
          continue
        }
      }
      const key = `${Math.floor(f.x / 100)},${Math.floor(f.y / 100)}`
      const list = grid.get(key)
      if (list) list.push(f)
      else grid.set(key, [f])
    }
    for (const p of this.players.values())
      for (const c of p.cells) {
        const r = radius(c.mass)
        for (
          let x = Math.floor((c.x - r) / 100);
          x <= Math.floor((c.x + r) / 100);
          x++
        )
          for (
            let y = Math.floor((c.y - r) / 100);
            y <= Math.floor((c.y + r) / 100);
            y++
          ) {
            for (const f of grid.get(`${x},${y}`) ?? []) {
              if (
                !this.food.has(f.id) ||
                (f.from === p.id && this.time - (f.born ?? 0) < 1.1)
              )
                continue
              if (distance(c, f) < r) {
                c.mass += f.mass
                this.food.delete(f.id)
              }
            }
          }
      }
    for (const v of this.viruses) {
      for (const f of grid.get(
        `${Math.floor(v.x / 100)},${Math.floor(v.y / 100)}`,
      ) ?? []) {
        if (!f.from || !this.food.has(f.id) || distance(v, f) > 48) continue
        this.food.delete(f.id)
        v.feeds++
        if (v.feeds >= 7 && this.viruses.length < 26) {
          v.feeds = 0
          const a = Math.atan2(f.vy, f.vx)
          this.viruses.push({
            id: this.nextId++,
            x: clamp(v.x + Math.cos(a) * 180, 70, WORLD - 70),
            y: clamp(v.y + Math.sin(a) * 180, 70, WORLD - 70),
            feeds: 0,
          })
        }
      }
    }
    for (const p of this.players.values())
      for (const c of [...p.cells]) {
        if (c.mass < 160 || p.cells.length >= MAX_CELLS) continue
        const i = this.viruses.findIndex(
          (v) => distance(c, v) < radius(c.mass) - 15,
        )
        if (i >= 0) {
          c.mass += 70
          this.viruses.splice(i, 1)
          this.split(p, true)
        }
      }
    const cells = [...this.players.values()]
      .flatMap((p) => p.cells)
      .sort((a, b) => b.mass - a.mass)
    const consumed = new Set<number>()
    for (const a of cells) {
      if (consumed.has(a.id)) continue
      const eater = this.players.get(a.owner)!
      for (const b of cells) {
        if (a.owner === b.owner || consumed.has(b.id) || a.mass < b.mass * 1.18)
          continue
        const victim = this.players.get(b.owner)!
        if (this.time < victim.shield || this.time < eater.shield) continue
        if (distance(a, b) < radius(a.mass) - radius(b.mass) * 0.35) {
          a.mass += b.mass
          consumed.add(b.id)
          victim.cells = victim.cells.filter((c) => c.id !== b.id)
          if (!victim.cells.length) {
            eater.eaten++
            this.deaths.push({
              player: victim,
              result: this.result(victim),
              by: eater.name,
            })
          }
        }
      }
    }
    for (const p of this.players.values()) {
      if (!p.cells.length) this.players.delete(p.id)
      else {
        p.best = Math.max(p.best, massOf(p.cells))
        for (const c of p.cells) {
          const r = radius(c.mass)
          c.x = clamp(c.x, r, WORLD - r)
          c.y = clamp(c.y, r, WORLD - r)
        }
      }
    }
    for (let i = this.food.size; i < FOOD_COUNT; i++) this.addFood()
  }
  result(p: Player): Result {
    return {
      id: p.run,
      best: Math.floor(p.best),
      eaten: p.eaten,
      seconds: Math.floor(this.time - p.joined),
    }
  }
  center(p: Player): [number, number] {
    const mass = massOf(p.cells)
    return mass > 0
      ? [
          p.cells.reduce((s, c) => s + c.x * c.mass, 0) / mass,
          p.cells.reduce((s, c) => s + c.y * c.mass, 0) / mass,
        ]
      : [WORLD / 2, WORLD / 2]
  }
  snapshot(id: string): Snapshot | null {
    const p = this.players.get(id)
    if (!p) return null
    const center = this.center(p)
    const people = [...this.players.values()]
      .map((p) => ({
        id: p.id,
        name: p.name,
        skin: p.skin,
        mass: Math.floor(massOf(p.cells)),
        bot: p.bot,
      }))
      .sort((a, b) => b.mass - a.mass)
    const score = massOf(p.cells)
    const view = Math.min(2800, 1300 + Math.sqrt(score) * 24)
    const visible = (c: { x: number; y: number }, margin = 0) =>
      Math.abs(c.x - center[0]) < view + margin &&
      Math.abs(c.y - center[1]) < view + margin
    return {
      t: 'state',
      time: this.time,
      ack: p.input.seq,
      cells: [...this.players.values()].flatMap((p) =>
        p.cells
          .filter((c) => visible(c, radius(c.mass)))
          .map(
            (c) =>
              [
                c.id,
                p.id,
                round(c.x),
                round(c.y),
                round(c.mass),
                Math.max(0, round(p.shield - this.time)),
              ] as CellWire,
          ),
      ),
      food: [...this.food.values()]
        .filter((f) => visible(f))
        .map((f) => [f.id, round(f.x), round(f.y), f.hue, f.mass]),
      viruses: this.viruses
        .filter((v) => visible(v))
        .map((v) => [v.id, round(v.x), round(v.y), v.feeds]),
      people,
      players: people.filter((p) => !p.bot).length,
      bots: people.filter((p) => p.bot).length,
      score: Math.floor(score),
      best: Math.floor(p.best),
      rank: people.findIndex((v) => v.id === id) + 1,
      eaten: p.eaten,
      center,
    }
  }
}
