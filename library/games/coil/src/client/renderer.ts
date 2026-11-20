import {
  BOOST_SPEED,
  SEGMENT_GAP,
  SKINS,
  SPEED,
  WORLD_RADIUS,
  radius,
  steer,
} from '../shared/protocol'
import type {
  Input,
  Pellet,
  Point,
  Snapshot,
  WireSnake,
} from '../shared/protocol'

type Frame = { state: Snapshot; time: number }
type Spark = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export class Renderer {
  private ctx: CanvasRenderingContext2D
  private frames: Frame[] = []
  private food = new Map<number, Pellet>()
  private sparks: Spark[] = []
  private predicted: WireSnake | null = null
  private camera = { x: 0, y: 0, zoom: 1 }
  private last = 0
  private raf = 0
  private width = 0
  private height = 0
  private dpr = 1
  private seedFood: Pellet[] = []
  private glowSprites: HTMLCanvasElement[] = []
  private menuTime = 0
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  private touch = matchMedia('(pointer: coarse)').matches
  active = false
  id = ''
  skin = 0
  input: Input = { angle: 0, boost: false }
  pointer = { x: 0, y: 0, active: false }
  onCollect: (() => void) | null = null
  get player() {
    return this.predicted
  }
  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d', { alpha: false })!
    for (let i = 0; i < 260; i++)
      this.seedFood.push({
        id: i,
        x: this.random(i * 7 + 3),
        y: this.random(i * 17 + 11),
        value: 1 + (i % 11 === 0 ? 2 : 0),
        color: i % 6,
      })
    this.glowSprites = SKINS.map((s) => {
      const c = document.createElement('canvas')
      c.width = c.height = 64
      const g = c.getContext('2d')!,
        gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, s.light)
      gradient.addColorStop(0.1, s.main)
      gradient.addColorStop(0.2, s.main + '85')
      gradient.addColorStop(1, s.main + '00')
      g.fillStyle = gradient
      g.fillRect(0, 0, 64, 64)
      return c
    })
    this.resize()
    window.addEventListener('resize', this.resize)
    this.raf = requestAnimationFrame(this.draw)
  }
  private random(n: number) {
    const x = Math.sin(n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  resize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.dpr = Math.min(devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
  }
  clear() {
    this.frames = []
    this.food.clear()
    this.predicted = null
    this.sparks = []
  }
  receive(state: Snapshot) {
    const now = performance.now()
    this.frames.push({ state, time: now })
    if (this.frames.length > 5) this.frames.shift()
    const nextFood = new Map(this.food)
    for (const id of state.removedFood ?? []) nextFood.delete(id)
    for (const f of state.food) nextFood.set(f.id, f)
    if (this.predicted)
      for (const [id, p] of this.food)
        if (
          !nextFood.has(id) &&
          Math.hypot(
            p.x - this.predicted.body[0],
            p.y - this.predicted.body[1],
          ) < 70
        ) {
          this.onCollect?.()
          if (!this.reduced)
            for (let j = 0; j < 4; j++) {
              const a = Math.random() * Math.PI * 2
              this.sparks.push({
                x: p.x,
                y: p.y,
                vx: Math.cos(a) * 45,
                vy: Math.sin(a) * 45,
                life: 0.45,
                color: SKINS[p.color].main,
              })
            }
        }
    this.food = nextFood
    const player = state.snakes.find((s) => s.id === this.id)
    if (player && !this.predicted) {
      this.predicted = { ...player, body: [...player.body] }
      this.input.angle = player.angle
      this.camera.x = player.body[0]
      this.camera.y = player.body[1]
      this.camera.zoom = 0.95
    }
  }
  private predict(dt: number, now: number) {
    const p = this.predicted,
      latest = this.frames.at(-1)
    if (!p || !latest) return
    const authoritative = latest.state.snakes.find((s) => s.id === this.id)
    if (!authoritative) return
    if (this.pointer.active)
      this.input.angle = Math.atan2(
        this.pointer.y -
          (this.height / 2 + (p.body[1] - this.camera.y) * this.camera.zoom),
        this.pointer.x -
          (this.width / 2 + (p.body[0] - this.camera.x) * this.camera.zoom),
      )
    p.angle = steer(p.angle, this.input.angle, dt, this.input.boost)
    p.boost = this.input.boost
    p.score = authoritative.score
    p.shield = authoritative.shield
    p.kills = authoritative.kills
    const speed = p.boost ? BOOST_SPEED : SPEED
    p.body[0] += Math.cos(p.angle) * speed * dt
    p.body[1] += Math.sin(p.angle) * speed * dt
    const age = Math.min(0.13, Math.max(0, (now - latest.time) / 1000)),
      lead = (authoritative.boost ? BOOST_SPEED : SPEED) * age
    const tx = authoritative.body[0] + Math.cos(authoritative.angle) * lead,
      ty = authoritative.body[1] + Math.sin(authoritative.angle) * lead
    const distance = Math.hypot(tx - p.body[0], ty - p.body[1]),
      correction = distance > 160 ? 1 : 1 - Math.exp(-8 * dt)
    p.body[0] = lerp(p.body[0], tx, correction)
    p.body[1] = lerp(p.body[1], ty, correction)
    while (p.body.length < authoritative.body.length)
      p.body.push(p.body[p.body.length - 2], p.body[p.body.length - 1])
    p.body.length = authoritative.body.length
    for (let i = 2; i < p.body.length; i += 2) {
      const dx = p.body[i - 2] - p.body[i],
        dy = p.body[i - 1] - p.body[i + 1],
        d = Math.hypot(dx, dy)
      if (d > SEGMENT_GAP) {
        p.body[i] = p.body[i - 2] - (dx / d) * SEGMENT_GAP
        p.body[i + 1] = p.body[i - 1] - (dy / d) * SEGMENT_GAP
      }
    }
    this.camera.x = lerp(this.camera.x, p.body[0], 1 - Math.exp(-5 * dt))
    this.camera.y = lerp(this.camera.y, p.body[1], 1 - Math.exp(-5 * dt))
    const desiredZoom =
      Math.max(
        0.55,
        Math.min(1.15, Math.min(this.width / 1100, this.height / 750)),
      ) /
      (1 + Math.min(p.score / 9000, 0.22))
    this.camera.zoom = lerp(
      this.camera.zoom,
      desiredZoom,
      1 - Math.exp(-2 * dt),
    )
  }
  private draw = (now: number) => {
    this.raf = requestAnimationFrame(this.draw)
    if (document.hidden) {
      this.last = now
      return
    }
    const dt = Math.min((now - (this.last || now)) / 1000, 0.04)
    this.last = now
    const g = this.ctx,
      w = this.width,
      h = this.height
    g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    g.fillStyle = '#101d21'
    g.fillRect(0, 0, w, h)
    if (!this.active || !this.frames.length) {
      this.menuTime += dt
      this.drawMenu(this.menuTime)
      return
    }
    this.predict(dt, now)
    const c = this.camera
    g.save()
    g.translate(w / 2, h / 2)
    g.scale(c.zoom, c.zoom)
    g.translate(-c.x, -c.y)
    this.grid(
      c.x - w / c.zoom / 2,
      c.y - h / c.zoom / 2,
      w / c.zoom,
      h / c.zoom,
    )
    // The ring is drawn in world space, never a screen edge or a scrolling page.
    g.beginPath()
    g.arc(0, 0, WORLD_RADIUS, 0, Math.PI * 2)
    g.strokeStyle = '#f2bba752'
    g.lineWidth = 12
    g.stroke()
    g.strokeStyle = '#ffceb7'
    g.lineWidth = 2
    g.stroke()
    for (const p of this.food.values()) this.pellet(p, now / 1000)
    const targetTime = now - 90
    let a = this.frames[0],
      b = this.frames.at(-1)!
    for (let i = 1; i < this.frames.length; i++)
      if (this.frames[i].time >= targetTime) {
        a = this.frames[i - 1]
        b = this.frames[i]
        break
      }
    const t = Math.max(
      0,
      Math.min(1, (targetTime - a.time) / Math.max(1, b.time - a.time)),
    )
    const old = new Map(a.state.snakes.map((s) => [s.id, s]))
    for (const s of b.state.snakes) {
      if (s.id === this.id) continue
      const prev = old.get(s.id)
      const body = prev
        ? s.body.map((v, i) =>
            lerp(
              prev.body[Math.min(i, prev.body.length - 2 + (i % 2))] ?? v,
              v,
              t,
            ),
          )
        : s.body
      this.snake({ ...s, body }, false, now / 1000)
    }
    if (this.predicted) this.snake(this.predicted, true, now / 1000)
    for (const s of this.sparks) {
      s.life -= dt
      s.x += s.vx * dt
      s.y += s.vy * dt
      g.globalAlpha = Math.max(0, s.life / 0.45)
      g.fillStyle = s.color
      g.beginPath()
      g.arc(s.x, s.y, 2, 0, Math.PI * 2)
      g.fill()
    }
    this.sparks = this.sparks.filter((s) => s.life > 0).slice(-150)
    g.globalAlpha = 1
    g.restore()
    this.vignette()
    this.minimap(b.state)
  }
  private grid(x: number, y: number, w: number, h: number) {
    const g = this.ctx,
      gap = 48
    g.fillStyle = '#c0e9da12'
    for (let xx = Math.floor(x / gap) * gap; xx < x + w; xx += gap)
      for (let yy = Math.floor(y / gap) * gap; yy < y + h; yy += gap) {
        g.beginPath()
        g.arc(xx, yy, 1, 0, Math.PI * 2)
        g.fill()
      }
  }
  private pellet(p: Pellet, time: number) {
    const size =
      (p.value > 1 ? 32 : 22) *
      (this.reduced ? 1 : 1 + Math.sin(time * 1.7 + p.id) * 0.08)
    this.ctx.drawImage(
      this.glowSprites[p.color],
      p.x - size / 2,
      p.y - size / 2,
      size,
      size,
    )
  }
  private path(body: number[], dx = 0, dy = 0) {
    const g = this.ctx
    g.beginPath()
    g.moveTo(body[0] + dx, body[1] + dy)
    for (let i = 2; i < body.length - 2; i += 2)
      g.quadraticCurveTo(
        body[i] + dx,
        body[i + 1] + dy,
        (body[i] + body[i + 2]) / 2 + dx,
        (body[i + 1] + body[i + 3]) / 2 + dy,
      )
    g.lineTo(body[body.length - 2] + dx, body[body.length - 1] + dy)
  }
  private snake(s: WireSnake, own: boolean, time: number, label = true) {
    const g = this.ctx,
      colors = SKINS[s.skin],
      r = radius(s.score),
      body = s.body
    if (body.length < 4) return
    g.lineCap = 'round'
    g.lineJoin = 'round'
    this.path(body, 0, 5)
    g.strokeStyle = '#050c0f80'
    g.lineWidth = r * 2 + 9
    g.stroke()
    if (s.boost) {
      this.path(body)
      g.strokeStyle = colors.main + '13'
      g.lineWidth = r * 2 + 24
      g.stroke()
      g.strokeStyle = colors.main + '22'
      g.lineWidth = r * 2 + 12
      g.stroke()
    }
    this.path(body)
    g.strokeStyle = colors.dark
    g.lineWidth = r * 2
    g.stroke()
    this.path(body, 0, -2)
    g.strokeStyle = colors.main
    g.lineWidth = r * 1.6
    g.stroke()
    this.path(body, 0, -r * 0.34)
    g.strokeStyle = colors.light + '72'
    g.lineWidth = r * 0.62
    g.stroke()
    // Quiet transverse ribs give the body shape without individual bead seams.
    for (let i = 8; i < body.length - 4; i += 8) {
      const a = Math.atan2(
          body[i + 3] - body[i - 1],
          body[i + 2] - body[i - 2],
        ),
        nx = -Math.sin(a),
        ny = Math.cos(a)
      g.beginPath()
      g.moveTo(body[i] + nx * r * 0.65, body[i + 1] + ny * r * 0.65)
      g.quadraticCurveTo(
        body[i] - Math.cos(a) * 2,
        body[i + 1] - Math.sin(a) * 2,
        body[i] - nx * r * 0.65,
        body[i + 1] - ny * r * 0.65,
      )
      g.strokeStyle = colors.dark + '38'
      g.lineWidth = 1.2
      g.stroke()
    }
    const x = body[0],
      y = body[1]
    g.save()
    g.translate(x, y)
    g.rotate(s.angle)
    const gradient = g.createLinearGradient(0, -r, 0, r)
    gradient.addColorStop(0, colors.light)
    gradient.addColorStop(0.4, colors.main)
    gradient.addColorStop(1, colors.dark)
    g.fillStyle = gradient
    g.beginPath()
    g.ellipse(0, 0, r * 1.15, r, 0, 0, Math.PI * 2)
    g.fill()
    for (const side of [-1, 1]) {
      g.fillStyle = '#f5faf0'
      g.beginPath()
      g.ellipse(
        r * 0.36,
        side * r * 0.62,
        r * 0.36,
        r * 0.39,
        0,
        0,
        Math.PI * 2,
      )
      g.fill()
      g.fillStyle = '#162b30'
      g.beginPath()
      g.arc(r * 0.53, side * r * 0.63, r * 0.18, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = '#fff'
      g.beginPath()
      g.arc(r * 0.55, side * r * 0.63 - r * 0.06, r * 0.055, 0, Math.PI * 2)
      g.fill()
    }
    g.restore()
    if (s.shield) {
      g.beginPath()
      g.arc(x, y, r + 9, 0, Math.PI * 2)
      g.strokeStyle = colors.light + (Math.sin(time * 5) > 0 ? '65' : '35')
      g.lineWidth = 1
      g.stroke()
    }
    if (label && !own) {
      g.font = '500 11px "DM Sans Variable", sans-serif'
      g.textAlign = 'center'
      g.fillStyle = '#d5e4e5a0'
      g.fillText(s.name, x, y - r - 16)
    }
  }
  private drawMenu(time: number) {
    const g = this.ctx,
      w = this.width,
      h = this.height,
      scale = Math.max(0.65, Math.min(w / 1300, h / 800))
    this.grid(0, 0, w, h)
    const gradient = g.createRadialGradient(
      w * 0.5,
      h * 0.4,
      0,
      w * 0.5,
      h * 0.4,
      w * 0.65,
    )
    gradient.addColorStop(0, '#29403b40')
    gradient.addColorStop(1, '#101d2100')
    g.fillStyle = gradient
    g.fillRect(0, 0, w, h)
    const count = Math.min(
      260,
      Math.max(65, Math.round((260 * w * h) / (1280 * 720))),
    )
    for (const f of this.seedFood.slice(0, count)) {
      const x = f.x * w,
        y = f.y * h
      const central = Math.abs(x - w / 2) < 250 && Math.abs(y - h / 2) < 260
      g.globalAlpha = central ? 0.16 : 0.65
      this.pellet({ ...f, x, y }, time)
    }
    g.globalAlpha = 1
    const motion = this.reduced ? 0 : time
    const paths = [
      { x: 0.17, y: 0.39, a: -0.7, skin: this.skin, phase: 0, size: 1.6 },
      { x: 0.83, y: 0.61, a: 2.3, skin: 3, phase: 2, size: 1.4 },
      { x: 0.8, y: 0.08, a: 0.6, skin: 2, phase: 5, size: 1 },
      { x: 0.17, y: 0.95, a: -0.4, skin: 1, phase: 3, size: 1 },
    ]
    for (const p of paths) {
      const body: number[] = [],
        t = motion * 0.18 + p.phase
      const length = 74
      for (let i = 0; i < length; i++) {
        const q = i / length,
          u = t - q * 3.8
        body.push(
          Math.sin(u) * 110 + Math.cos(u * 1.5) * 45,
          Math.cos(u * 0.8) * 115 + q * 200 - 130,
        )
      }
      g.save()
      g.translate(w * p.x, h * p.y)
      g.rotate(p.a)
      g.scale(scale * p.size, scale * p.size)
      this.snake(
        {
          id: '',
          name: '',
          skin: p.skin,
          bot: true,
          body,
          score: 80,
          kills: 0,
          angle: Math.atan2(body[1] - body[3], body[0] - body[2]),
          boost: false,
          shield: false,
        },
        false,
        time,
        false,
      )
      g.restore()
    }
    // Keep the composition calm behind the form, without an opaque card.
    const shade = g.createRadialGradient(
      w / 2,
      h / 2,
      80,
      w / 2,
      h / 2,
      Math.min(w * 0.7, 500),
    )
    shade.addColorStop(0, '#101d21ee')
    shade.addColorStop(0.55, '#101d21c0')
    shade.addColorStop(1, '#101d2100')
    g.fillStyle = shade
    g.fillRect(0, 0, w, h)
    this.vignette()
  }
  private vignette() {
    const g = this.ctx,
      w = this.width,
      h = this.height,
      shade = g.createRadialGradient(
        w / 2,
        h / 2,
        h * 0.2,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.7,
      )
    shade.addColorStop(0, '#050f1600')
    shade.addColorStop(1, '#050f1675')
    g.fillStyle = shade
    g.fillRect(0, 0, w, h)
  }
  private minimap(state: Snapshot) {
    const g = this.ctx,
      r = this.width < 600 ? 40 : 55,
      x = this.width - r - 30,
      y = this.height - r - (this.touch ? 130 : 30)
    g.beginPath()
    g.arc(x, y, r, 0, Math.PI * 2)
    g.fillStyle = '#0b171ad9'
    g.fill()
    g.strokeStyle = '#c4e8e020'
    g.lineWidth = 1
    g.stroke()
    g.beginPath()
    g.moveTo(x - r + 8, y)
    g.lineTo(x + r - 8, y)
    g.moveTo(x, y - r + 8)
    g.lineTo(x, y + r - 8)
    g.strokeStyle = '#b1d9cd0e'
    g.stroke()
    for (const s of state.snakes) {
      const own = s.id === this.id
      g.beginPath()
      g.arc(
        x + (s.body[0] / WORLD_RADIUS) * (r - 3),
        y + (s.body[1] / WORLD_RADIUS) * (r - 3),
        own ? 3 : 1.4,
        0,
        Math.PI * 2,
      )
      g.fillStyle = own ? '#d9f9e8' : '#93baa263'
      g.fill()
    }
  }
  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.resize)
  }
}
