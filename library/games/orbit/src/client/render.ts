import { clamp, radius, SKINS, speed, WORLD } from '../shared/config'
import type { CellWire, PersonWire, Snapshot } from '../shared/protocol'

type DrawCell = {
  id: number
  owner: string
  x: number
  y: number
  mass: number
  shield: number
  alpha: number
  squish: number
  angle: number
}
type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  color: string
  r: number
}
const FOOD_COLORS = [
  '#b5c98d',
  '#e4be91',
  '#b5cbd7',
  '#cfb9db',
  '#e1a9ba',
  '#d3c278',
]
export class Renderer {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width = 0
  height = 0
  dpr = 1
  camera = { x: WORLD / 2, y: WORLD / 2, zoom: 1 }
  cells = new Map<number, DrawCell>()
  snapshot: Snapshot | null = null
  previous: { state: Snapshot; at: number } | null = null
  received = 0
  id = ''
  playing = false
  skin = 0
  aim = { x: 0, y: 0, active: false }
  particles: Particle[] = []
  frames: number[] = []
  fps = 60
  onEat?: () => void
  reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  last = performance.now()
  raf = 0
  minimap: HTMLCanvasElement | null = null
  private foodSeen = new Map<number, [number, number]>()
  private sprites = new Map<string, HTMLCanvasElement>()
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: false })!
    this.resize()
    addEventListener('resize', () => this.resize())
    const animate = (now: number) => {
      const dt = Math.min(0.04, (now - this.last) / 1000)
      this.last = now
      if (!document.hidden) this.draw(now, dt)
      this.raf = requestAnimationFrame(animate)
    }
    this.raf = requestAnimationFrame(animate)
  }
  resize() {
    this.width = innerWidth
    this.height = innerHeight
    this.dpr = Math.min(devicePixelRatio, 2)
    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`
  }
  reset() {
    this.cells.clear()
    this.snapshot = null
    this.previous = null
    this.foodSeen.clear()
    this.particles = []
  }
  update(state: Snapshot) {
    const now = performance.now()
    if (this.snapshot)
      this.previous = { state: this.snapshot, at: this.received }
    if (this.playing && !this.reduced) {
      const current = new Set(state.food.map((f) => f[0]))
      const own = state.cells.filter((c) => c[1] === this.id)
      let eaten = 0
      for (const [id, [x, y]] of this.foodSeen) {
        if (
          !current.has(id) &&
          own.some((c) => Math.hypot(c[2] - x, c[3] - y) < radius(c[4]) + 25)
        ) {
          eaten++
          for (let i = 0; i < 3 && this.particles.length < 160; i++)
            this.particles.push({
              x,
              y,
              vx: (Math.random() - 0.5) * 60,
              vy: (Math.random() - 0.5) * 60,
              life: 0.45,
              max: 0.45,
              color: SKINS[this.skin].dark,
              r: 1.5 + Math.random() * 2,
            })
        }
      }
      if (eaten) this.onEat?.()
    }
    this.foodSeen = new Map(state.food.map((f) => [f[0], [f[1], f[2]]]))
    this.snapshot = state
    this.received = now
    if (!this.previous) {
      this.camera.x = state.center[0]
      this.camera.y = state.center[1]
      this.camera.zoom = this.targetZoom(state.score)
    }
  }
  targetZoom(score: number) {
    return clamp(
      Math.min(this.width / 1450, this.height / 900) *
        (1.05 / Math.pow(Math.max(60, score) / 60, 0.17)),
      0.24,
      1.3,
    )
  }
  screenToWorld(x: number, y: number) {
    return {
      x: this.camera.x + (x - this.width / 2) / this.camera.zoom,
      y: this.camera.y + (y - this.height / 2) / this.camera.zoom,
    }
  }
  draw(now: number, dt: number) {
    const ctx = this.ctx,
      w = this.width,
      h = this.height
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.fillStyle = '#f5f4ef'
    ctx.fillRect(0, 0, w, h)
    if (!this.playing || !this.snapshot) {
      this.drawLobby(now)
      return
    }
    const state = this.snapshot
    const ease = 1 - Math.exp(-5 * dt)
    const own = [...this.cells.values()].filter((c) => c.owner === this.id)
    const total = own.reduce((s, c) => s + c.mass, 0)
    const cx = total
      ? own.reduce((s, c) => s + c.x * c.mass, 0) / total
      : state.center[0]
    const cy = total
      ? own.reduce((s, c) => s + c.y * c.mass, 0) / total
      : state.center[1]
    this.camera.x += (cx - this.camera.x) * ease
    this.camera.y += (cy - this.camera.y) * ease
    this.camera.zoom +=
      (this.targetZoom(state.score) - this.camera.zoom) *
      (1 - Math.exp(-2 * dt))
    const z = this.camera.zoom
    // Keep the arena filling the viewport at an edge; the player can move off-centre.
    const halfW = Math.min(WORLD / 2, w / z / 2)
    const halfH = Math.min(WORLD / 2, h / z / 2)
    this.camera.x = clamp(this.camera.x, halfW, WORLD - halfW)
    this.camera.y = clamp(this.camera.y, halfH, WORLD - halfH)
    ctx.translate(w / 2, h / 2)
    ctx.scale(z, z)
    ctx.translate(-this.camera.x, -this.camera.y)
    this.drawGrid(now)
    ctx.strokeStyle = '#c4c7b4'
    ctx.lineWidth = 2 / z
    ctx.strokeRect(0, 0, WORLD, WORLD)
    ctx.fillStyle = '#e9e9e0'
    ctx.fillRect(-20000, -20000, 20000, 40000)
    ctx.fillRect(WORLD, -20000, 20000, 40000)
    ctx.fillRect(0, -20000, WORLD, 20000)
    ctx.fillRect(0, WORLD, WORLD, 20000)
    for (const food of state.food) {
      const r = food[4] > 2 ? 10 : 3.5
      if (!this.onScreen(food[1], food[2], 15)) continue
      ctx.fillStyle = FOOD_COLORS[food[3] % 6]
      ctx.beginPath()
      ctx.arc(food[1], food[2], r, 0, Math.PI * 2)
      ctx.fill()
      if (food[4] > 2) {
        ctx.fillStyle = '#fff8'
        ctx.beginPath()
        ctx.arc(food[1] - 2, food[2] - 3, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    for (const virus of state.viruses)
      if (this.onScreen(virus[1], virus[2], 65))
        this.drawVirus(virus[1], virus[2], 43 + virus[3] * 1.5, now)
    const people = new Map(state.people.map((p) => [p.id, p]))
    const active = new Set(state.cells.map((c) => c[0]))
    const previousCells = new Map(
      this.previous?.state.cells.map((c) => [c[0], c]) ?? [],
    )
    const span = this.previous ? this.received - this.previous.at : 67
    const t = clamp((now - this.received) / Math.max(33, span), 0, 1)
    for (const c of state.cells) {
      let draw = this.cells.get(c[0])
      if (!draw) {
        draw = {
          id: c[0],
          owner: c[1],
          x: c[2],
          y: c[3],
          mass: c[4],
          shield: c[5],
          alpha: 0,
          squish: 0,
          angle: 0,
        }
        this.cells.set(c[0], draw)
      }
      const old = previousCells.get(c[0]) ?? c
      let x = old[2] + (c[2] - old[2]) * t,
        y = old[3] + (c[3] - old[3]) * t
      if (c[1] === this.id) {
        // Predict only our short, bounded movement; server snapshots continuously reconcile it.
        const age = clamp((now - this.received) / 1000, 0, 0.1)
        const dx = this.aim.x - c[2],
          dy = this.aim.y - c[3],
          d = Math.hypot(dx, dy)
        const v = speed(c[4]) * Math.min(1, d / 45)
        x = c[2] + (d > 0.01 ? (dx / d) * v * age : 0)
        y = c[3] + (d > 0.01 ? (dy / d) * v * age : 0)
      }
      const smooth = 1 - Math.exp(-(c[1] === this.id ? 18 : 25) * dt)
      const dx = x - draw.x,
        dy = y - draw.y
      draw.x += dx * smooth
      draw.y += dy * smooth
      draw.angle = Math.atan2(dy, dx)
      draw.squish +=
        (Math.min(0.035, Math.hypot(dx, dy) * 0.0015) - draw.squish) * 0.12
      draw.mass += (c[4] - draw.mass) * (1 - Math.exp(-10 * dt))
      draw.shield = c[5]
      draw.alpha = Math.min(1, draw.alpha + dt * 5)
    }
    for (const [id, cell] of this.cells)
      if (!active.has(id)) {
        cell.alpha -= dt * 7
        cell.mass *= Math.exp(-dt * 4)
        if (cell.alpha <= 0) this.cells.delete(id)
      }
    for (const c of [...this.cells.values()].sort((a, b) => a.mass - b.mass)) {
      if (!this.onScreen(c.x, c.y, radius(c.mass) + 20)) continue
      const p = people.get(c.owner)
      if (p) this.drawCell(c, p, now)
    }
    for (const p of this.particles) {
      p.life -= dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      ctx.globalAlpha = Math.max(0, p.life / p.max) * 0.6
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }
    this.particles = this.particles.filter((p) => p.life > 0)
    ctx.globalAlpha = 1
    this.drawMinimap(state)
    this.frames.push(dt)
    if (this.frames.length > 60) this.frames.shift()
    this.fps = Math.round(
      this.frames.length / this.frames.reduce((s, v) => s + v, 0),
    )
  }
  onScreen(x: number, y: number, r: number) {
    return (
      Math.abs(x - this.camera.x) < this.width / this.camera.zoom / 2 + r &&
      Math.abs(y - this.camera.y) < this.height / this.camera.zoom / 2 + r
    )
  }
  drawGrid(now: number) {
    const ctx = this.ctx,
      z = this.camera.zoom,
      space = 60
    const left = this.camera.x - this.width / z / 2,
      top = this.camera.y - this.height / z / 2
    ctx.fillStyle = '#d7d8cd'
    ctx.beginPath()
    for (
      let x = Math.max(0, Math.floor(left / space) * space);
      x < Math.min(WORLD, left + this.width / z + space);
      x += space
    )
      for (
        let y = Math.max(0, Math.floor(top / space) * space);
        y < Math.min(WORLD, top + this.height / z + space);
        y += space
      ) {
        ctx.moveTo(x + 1, y)
        ctx.arc(x, y, 0.8 / z, 0, Math.PI * 2)
      }
    ctx.fill()
  }
  sprite(skin: number, size: number) {
    const resolution = size > 140 ? 512 : 256,
      key = `${skin}-${resolution}`
    if (this.sprites.has(key)) return this.sprites.get(key)!
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = resolution
    const c = canvas.getContext('2d')!,
      s = SKINS[skin],
      r = resolution * 0.435,
      x = resolution / 2,
      y = resolution / 2
    c.shadowColor = `${s.dark}32`
    c.shadowBlur = r * 0.13
    c.shadowOffsetY = r * 0.07
    const g = c.createRadialGradient(
      x - r * 0.32,
      y - r * 0.4,
      r * 0.04,
      x + r * 0.08,
      y + r * 0.12,
      r * 1.05,
    )
    g.addColorStop(0, s.light)
    g.addColorStop(0.48, s.mid)
    g.addColorStop(0.84, s.mid)
    g.addColorStop(1, s.dark)
    c.fillStyle = g
    c.beginPath()
    c.arc(x, y, r, 0, Math.PI * 2)
    c.fill()
    c.shadowColor = 'transparent'
    c.save()
    c.beginPath()
    c.arc(x, y, r - 2, 0, Math.PI * 2)
    c.clip()
    const rim = c.createRadialGradient(x, y, r * 0.67, x, y, r)
    rim.addColorStop(0, '#ffffff00')
    rim.addColorStop(0.8, '#ffffff08')
    rim.addColorStop(1, '#ffffff88')
    c.fillStyle = rim
    c.fillRect(0, 0, resolution, resolution)
    if (s.pattern === 'rings') {
      c.strokeStyle = `${s.light}80`
      c.lineWidth = r * 0.025
      for (let i = 0; i < 4; i++) {
        c.beginPath()
        c.ellipse(
          x - r * 0.5,
          y - r * 0.2,
          r * (0.45 + i * 0.25),
          r * (0.25 + i * 0.2),
          -0.6,
          0,
          Math.PI * 2,
        )
        c.stroke()
      }
    } else if (s.pattern === 'petals') {
      c.fillStyle = `${s.light}60`
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3
        c.beginPath()
        c.ellipse(
          x + Math.cos(a) * r * 0.37,
          y + Math.sin(a) * r * 0.37,
          r * 0.36,
          r * 0.2,
          a,
          0,
          Math.PI * 2,
        )
        c.fill()
      }
    } else if (s.pattern === 'moon') {
      c.fillStyle = `${s.dark}18`
      for (const [dx, dy, sr] of [
        [0.4, 0.3, 0.24],
        [-0.3, 0.3, 0.12],
        [0.25, -0.35, 0.16],
      ]) {
        c.beginPath()
        c.arc(x + dx * r, y + dy * r, sr * r, 0, Math.PI * 2)
        c.fill()
      }
    }
    const shine = c.createRadialGradient(
      x - r * 0.36,
      y - r * 0.42,
      0,
      x - r * 0.36,
      y - r * 0.42,
      r * 0.62,
    )
    shine.addColorStop(0, '#ffffff96')
    shine.addColorStop(0.4, '#ffffff30')
    shine.addColorStop(1, '#ffffff00')
    c.fillStyle = shine
    c.fillRect(0, 0, resolution, resolution)
    c.restore()
    c.strokeStyle = `${s.dark}60`
    c.lineWidth = 0.8
    c.beginPath()
    c.arc(x, y, r, 0, Math.PI * 2)
    c.stroke()
    this.sprites.set(key, canvas)
    return canvas
  }
  blob(x: number, y: number, r: number, skin: number, wobble = 0, angle = 0) {
    const ctx = this.ctx,
      sprite = this.sprite(skin, r * 2),
      size = r / 0.435
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.scale(1 + wobble, 1 - wobble)
    ctx.rotate(-angle)
    ctx.drawImage(sprite, -size / 2, -size / 2, size, size)
    ctx.restore()
  }
  drawCell(c: DrawCell, p: PersonWire, now: number) {
    const ctx = this.ctx,
      r = radius(c.mass),
      own = p.id === this.id
    ctx.globalAlpha = c.alpha
    this.blob(c.x, c.y, r, p.skin, this.reduced ? 0 : c.squish, c.angle)
    if (c.shield > 0) {
      ctx.strokeStyle = `${SKINS[p.skin].dark}55`
      ctx.lineWidth = 1.3 / this.camera.zoom
      ctx.setLineDash([3 / this.camera.zoom, 5 / this.camera.zoom])
      ctx.lineDashOffset = -now * 0.009
      ctx.beginPath()
      ctx.arc(c.x, c.y, r + 5 / this.camera.zoom, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }
    const font = clamp(r * 0.3, 10, 28)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = SKINS[p.skin].ink
    ctx.font = `600 ${font}px "DM Sans Variable", sans-serif`
    if (r * this.camera.zoom > 18) ctx.fillText(p.name, c.x, c.y, r * 1.65)
    if (own && r * this.camera.zoom > 35) {
      ctx.globalAlpha *= 0.55
      ctx.font = `500 ${font * 0.68}px "DM Sans Variable", sans-serif`
      ctx.fillText(String(Math.floor(c.mass)), c.x, c.y + font * 1.1)
    }
    ctx.globalAlpha = 1
  }
  drawVirus(x: number, y: number, r: number, now: number) {
    const ctx = this.ctx
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(this.reduced ? 0 : now * 0.000035)
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r)
    g.addColorStop(0, '#eef3d6')
    g.addColorStop(0.7, '#bed29b')
    g.addColorStop(1, '#879c67')
    ctx.fillStyle = g
    ctx.strokeStyle = '#829764'
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 0; i <= 56; i++) {
      const a = (i / 56) * Math.PI * 2,
        sr = r * (i % 2 ? 0.9 : 1.04)
      ctx.lineTo(Math.cos(a) * sr, Math.sin(a) * sr)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.strokeStyle = '#f4f7e5aa'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2)
    ctx.stroke()
    for (let i = 0; i < 5; i++) {
      const a = i * 2.4
      ctx.fillStyle = '#6b895442'
      ctx.beginPath()
      ctx.arc(Math.cos(a) * r * 0.4, Math.sin(a) * r * 0.4, 2.2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }
  drawLobby(now: number) {
    const ctx = this.ctx,
      w = this.width,
      h = this.height,
      mobile = w < 680,
      t = this.reduced ? 0 : now * 0.00025
    ctx.fillStyle = '#d8dacd'
    ctx.beginPath()
    for (let x = 26; x < w; x += 40)
      for (let y = 22; y < h; y += 40) {
        ctx.moveTo(x + 0.6, y)
        ctx.arc(x, y, 0.6, 0, Math.PI * 2)
      }
    ctx.fill()
    const decoration = mobile
      ? [
          [-0.07, 0.26, 78, 1],
          [1.02, 0.8, 94, 2],
          [0.84, 0.13, 29, 3],
        ]
      : [
          [0.14, 0.36, 94, 1],
          [0.85, 0.59, 116, 2],
          [0.24, 0.79, 63, 3],
          [0.78, 0.2, 47, 4],
          [-0.02, 0.8, 134, 0],
          [1.02, 0.22, 108, 3],
        ]
    decoration.forEach(([px, py, r, skin], i) => {
      const x = px * w + Math.sin(t + i) * 17,
        y = py * h + Math.cos(t * 0.8 + i) * 18
      this.blob(x, y, r, skin, Math.sin(t + i) * 0.012, t)
    })
    for (let i = 0; i < (mobile ? 24 : 58); i++) {
      const px = ((i * 173.31 + 29) % 997) / 997,
        py = ((i * 263.13 + 73) % 983) / 983
      if (px > 0.32 && px < 0.68 && py > 0.15 && py < 0.86) continue
      ctx.fillStyle = FOOD_COLORS[i % 6]
      ctx.beginPath()
      ctx.arc(
        px * w + Math.sin(t + i) * 4,
        py * h + Math.cos(t + i) * 4,
        2.8 + (i % 3) * 0.6,
        0,
        Math.PI * 2,
      )
      ctx.fill()
    }
    // A soft clearing behind the lobby keeps the controls quiet.
    const clearing = ctx.createRadialGradient(
      w / 2,
      h / 2,
      80,
      w / 2,
      h / 2,
      mobile ? 250 : 370,
    )
    clearing.addColorStop(0, '#f5f4ef')
    clearing.addColorStop(0.55, '#f5f4efc0')
    clearing.addColorStop(1, '#f5f4ef00')
    ctx.fillStyle = clearing
    ctx.fillRect(0, 0, w, h)
  }
  drawMinimap(state: Snapshot) {
    const c = this.minimap?.getContext('2d')
    if (!c || !this.minimap) return
    const size = this.minimap.width,
      pad = 7,
      scale = (size - pad * 2) / WORLD
    c.clearRect(0, 0, size, size)
    c.fillStyle = '#e5e7da'
    c.fillRect(pad, pad, size - pad * 2, size - pad * 2)
    c.fillStyle = '#ffffff70'
    c.fillRect(
      pad + (this.camera.x - this.width / this.camera.zoom / 2) * scale,
      pad + (this.camera.y - this.height / this.camera.zoom / 2) * scale,
      (this.width / this.camera.zoom) * scale,
      (this.height / this.camera.zoom) * scale,
    )
    c.fillStyle = '#83996550'
    for (const v of state.viruses) {
      c.beginPath()
      c.arc(pad + v[1] * scale, pad + v[2] * scale, 1.5, 0, Math.PI * 2)
      c.fill()
    }
    c.fillStyle = '#435e36'
    c.beginPath()
    c.arc(
      pad + state.center[0] * scale,
      pad + state.center[1] * scale,
      3,
      0,
      Math.PI * 2,
    )
    c.fill()
  }
}
