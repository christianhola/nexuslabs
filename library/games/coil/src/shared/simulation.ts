import {
  BOOST_SPEED,
  FOOD_SCORE,
  MIN_SCORE,
  SEGMENT_GAP,
  SPEED,
  STEP,
  WORLD_RADIUS,
  angleDelta,
  radius,
  steer,
} from './protocol'
import type {
  Pellet,
  Point,
  Result,
  Snake,
  Snapshot,
  WireSnake,
} from './protocol'

const FOOD_TARGET = 1100
const CELL = 64
type BodyCell = { snake: Snake; point: Point }[]
export class World {
  snakes = new Map<string, Snake>()
  food = new Map<number, Pellet>()
  tick = 0
  private foodId = 0
  private bodyGrid = new Map<string, BodyCell>()
  private foodGrid = new Map<string, Pellet[]>()
  onDeath: (snake: Snake, result: Result) => void = () => {}
  constructor(
    private random = Math.random,
    private foodTarget = FOOD_TARGET,
  ) {
    for (let i = 0; i < foodTarget; i++) this.addFood()
  }
  private key(x: number, y: number) {
    return `${Math.floor(x / CELL)},${Math.floor(y / CELL)}`
  }
  private nearby<T>(grid: Map<string, T[]>, p: Point, reach = 1): T[] {
    const result: T[] = [],
      x = Math.floor(p.x / CELL),
      y = Math.floor(p.y / CELL)
    for (let i = -reach; i <= reach; i++)
      for (let j = -reach; j <= reach; j++) {
        const entries = grid.get(`${x + i},${y + j}`)
        if (entries) result.push(...entries)
      }
    return result
  }
  addFood(point?: Point, value = 1, color = Math.floor(this.random() * 6)) {
    if (this.food.size >= 2200) return
    const angle = this.random() * Math.PI * 2,
      distance = Math.sqrt(this.random()) * (WORLD_RADIUS - 80)
    const p = {
      id: ++this.foodId,
      x: point?.x ?? Math.cos(angle) * distance,
      y: point?.y ?? Math.sin(angle) * distance,
      value,
      color,
    }
    this.food.set(p.id, p)
    const key = this.key(p.x, p.y),
      cell = this.foodGrid.get(key) ?? []
    cell.push(p)
    this.foodGrid.set(key, cell)
  }
  private removeFood(p: Pellet) {
    this.food.delete(p.id)
    const key = this.key(p.x, p.y),
      cell = this.foodGrid.get(key)
    if (cell) {
      const i = cell.indexOf(p)
      if (i >= 0) cell.splice(i, 1)
      if (!cell.length) this.foodGrid.delete(key)
    }
  }
  spawn(id: string, name: string, skin: number, bot = false): Snake {
    let head: Point = { x: 0, y: 0 }
    for (let attempt = 0; attempt < 32; attempt++) {
      const a = this.random() * Math.PI * 2,
        r = 250 + this.random() * 1050
      head = { x: Math.cos(a) * r, y: Math.sin(a) * r }
      if (
        ![...this.snakes.values()].some((s) =>
          s.points.some((p) => Math.hypot(p.x - head.x, p.y - head.y) < 220),
        )
      )
        break
    }
    const angle = Math.atan2(-head.y, -head.x),
      score = bot ? 160 + Math.floor(this.random() * 460) : MIN_SCORE
    const length = this.length(score)
    const snake: Snake = {
      id,
      name,
      skin,
      bot,
      angle,
      input: { angle, boost: false },
      score,
      best: score,
      born: this.tick,
      kills: 0,
      boosting: false,
      boostSpent: 0,
      alive: true,
      points: Array.from({ length }, (_, i) => ({
        x: head.x - Math.cos(angle) * SEGMENT_GAP * i,
        y: head.y - Math.sin(angle) * SEGMENT_GAP * i,
      })),
    }
    this.snakes.set(id, snake)
    return snake
  }
  length(score: number) {
    return Math.min(240, 24 + Math.floor(score / 7))
  }
  kill(s: Snake, reason: Result['reason'], killer?: Snake) {
    if (!s.alive) return
    s.alive = false
    this.snakes.delete(s.id)
    if (killer && killer.alive) killer.kills++
    if (reason !== 'left')
      for (let i = 0; i < s.points.length; i += 2) {
        const p = s.points[i]
        this.addFood(
          {
            x: p.x + (this.random() - 0.5) * 14,
            y: p.y + (this.random() - 0.5) * 14,
          },
          4,
          s.skin,
        )
      }
    this.onDeath(s, {
      score: Math.floor(s.best),
      kills: s.kills,
      seconds: Math.floor((this.tick - s.born) * STEP),
      reason,
    })
  }
  private botInput(s: Snake) {
    const h = s.points[0]
    let desired = s.angle + Math.sin(this.tick * 0.008 + s.skin) * 0.24
    const nearbyFood = this.nearby(this.foodGrid, h, 4)
    let nearest = Infinity
    for (const p of nearbyFood) {
      const a = Math.atan2(p.y - h.y, p.x - h.x),
        d = Math.hypot(p.x - h.x, p.y - h.y) / Math.sqrt(p.value)
      if (Math.abs(angleDelta(s.angle, a)) < 1.5 && d < nearest) {
        nearest = d
        desired = a
      }
    }
    if (Math.hypot(h.x, h.y) > WORLD_RADIUS - 280)
      desired = Math.atan2(-h.y, -h.x)
    const obstacles = this.nearby(this.bodyGrid, h, 3).filter(
      (b) => b.snake.id !== s.id,
    )
    let best = -Infinity,
      chosen = desired
    for (let i = -4; i <= 4; i++) {
      const a = s.angle + i * 0.32,
        x = h.x + Math.cos(a) * 105,
        y = h.y + Math.sin(a) * 105
      let safe = Math.min(160, WORLD_RADIUS - Math.hypot(x, y))
      for (const b of obstacles)
        safe = Math.min(
          safe,
          Math.hypot(b.point.x - x, b.point.y - y) - radius(b.snake.score),
        )
      const score = safe - Math.abs(angleDelta(a, desired)) * 32
      if (score > best) {
        best = score
        chosen = a
      }
    }
    s.input = { angle: chosen, boost: false }
  }
  step() {
    this.tick++
    this.rebuildBodies()
    for (const s of this.snakes.values()) {
      if (s.bot && this.tick % 3 === 0) this.botInput(s)
      s.boosting = s.input.boost
      s.angle = steer(s.angle, s.input.angle, STEP, s.boosting)
      const speed = s.boosting ? BOOST_SPEED : SPEED,
        h = s.points[0]
      h.x += Math.cos(s.angle) * speed * STEP
      h.y += Math.sin(s.angle) * speed * STEP
      if (s.boosting) {
        const spent = Math.min(s.score - MIN_SCORE, STEP * 10)
        s.score -= spent
        s.boostSpent += spent
        // Only shed mass actually spent; a fresh snake can boost without
        // shrinking below its starting length or generating free food.
        if (s.boostSpent >= FOOD_SCORE) {
          s.boostSpent -= FOOD_SCORE
          this.addFood(s.points[s.points.length - 1], 1, s.skin)
        }
      }
      const length = this.length(s.score)
      while (s.points.length < length)
        s.points.push({ ...s.points[s.points.length - 1] })
      s.points.length = length
      for (let i = 1; i < s.points.length; i++) {
        const p = s.points[i],
          prev = s.points[i - 1],
          dx = prev.x - p.x,
          dy = prev.y - p.y,
          d = Math.hypot(dx, dy)
        if (d > SEGMENT_GAP) {
          p.x = prev.x - (dx / d) * SEGMENT_GAP
          p.y = prev.y - (dy / d) * SEGMENT_GAP
        }
      }
      for (const p of this.nearby(this.foodGrid, h)) {
        if (Math.hypot(h.x - p.x, h.y - p.y) < radius(s.score) + 11) {
          s.score += p.value * FOOD_SCORE
          this.removeFood(p)
        }
      }
      s.best = Math.max(s.best, s.score)
    }
    // Resolve all lethal contacts from the same frame, independent of Map order.
    this.rebuildBodies()
    const dead: { snake: Snake; reason: Result['reason']; killer?: Snake }[] =
      []
    for (const s of this.snakes.values()) {
      const h = s.points[0]
      if (Math.hypot(h.x, h.y) > WORLD_RADIUS - radius(s.score)) {
        dead.push({ snake: s, reason: 'edge' })
        continue
      }
      if (this.tick - s.born < 90) continue
      for (const b of this.nearby(this.bodyGrid, h)) {
        if (b.snake.id === s.id || this.tick - b.snake.born < 90) continue
        if (
          Math.hypot(h.x - b.point.x, h.y - b.point.y) <
          radius(s.score) * 0.7 + radius(b.snake.score) * 0.8
        ) {
          dead.push({ snake: s, reason: 'snake', killer: b.snake })
          break
        }
      }
    }
    const deadIds = new Set(dead.map((d) => d.snake.id))
    for (const d of dead)
      this.kill(
        d.snake,
        d.reason,
        d.killer && !deadIds.has(d.killer.id) ? d.killer : undefined,
      )
    for (let i = 0; i < 5 && this.food.size < this.foodTarget; i++)
      this.addFood()
  }
  private rebuildBodies() {
    this.bodyGrid.clear()
    for (const snake of this.snakes.values())
      for (let i = 0; i < snake.points.length; i += 2) {
        const point = snake.points[i],
          key = this.key(point.x, point.y),
          cell = this.bodyGrid.get(key) ?? []
        cell.push({ snake, point })
        this.bodyGrid.set(key, cell)
      }
  }
  snapshot(id: string, online: number): Snapshot {
    const viewer = this.snakes.get(id)?.points[0] ?? { x: 0, y: 0 }
    // Fixed maximum interest area, independent of untrusted viewport claims.
    const reach = 1500,
      snakes: WireSnake[] = []
    for (const s of this.snakes.values()) {
      if (
        !s.points.some(
          (p) =>
            Math.abs(p.x - viewer.x) < reach &&
            Math.abs(p.y - viewer.y) < reach,
        )
      )
        continue
      snakes.push({
        id: s.id,
        name: s.name,
        skin: s.skin,
        bot: s.bot,
        angle: s.angle,
        score: Math.floor(s.score),
        kills: s.kills,
        boost: s.boosting,
        shield: this.tick - s.born < 90,
        body: s.points.flatMap((p) => [
          Math.round(p.x * 2) / 2,
          Math.round(p.y * 2) / 2,
        ]),
      })
    }
    return {
      type: 'state',
      tick: this.tick,
      online,
      total: this.snakes.size,
      snakes,
      food: [...this.food.values()].filter(
        (p) =>
          Math.abs(p.x - viewer.x) < reach && Math.abs(p.y - viewer.y) < reach,
      ),
      leaders: [...this.snakes.values()]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => ({
          id: s.id,
          name: s.name,
          skin: s.skin,
          score: Math.floor(s.score),
          bot: s.bot,
        })),
    }
  }
}
