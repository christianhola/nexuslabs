import type { Camera, Item, Rect } from './types'

export type Vec = { x: number; y: number }

export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 4
export const MIN_SIZE = 24

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function screenToWorld(p: Vec, cam: Camera, vw: number, vh: number): Vec {
  return { x: (p.x - vw / 2) / cam.zoom + cam.cx, y: (p.y - vh / 2) / cam.zoom + cam.cy }
}

export function worldToScreen(p: Vec, cam: Camera, vw: number, vh: number): Vec {
  return { x: (p.x - cam.cx) * cam.zoom + vw / 2, y: (p.y - cam.cy) * cam.zoom + vh / 2 }
}

/** Zoom so the world point under `anchor` (screen px) stays put. */
export function zoomAt(cam: Camera, nextZoom: number, anchor: Vec, vw: number, vh: number): Camera {
  const zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM)
  const w = screenToWorld(anchor, cam, vw, vh)
  return { zoom, cx: w.x - (anchor.x - vw / 2) / zoom, cy: w.y - (anchor.y - vh / 2) / zoom }
}

export function rotate(v: Vec, deg: number): Vec {
  const r = (deg * Math.PI) / 180
  const c = Math.cos(r)
  const s = Math.sin(r)
  return { x: v.x * c - v.y * s, y: v.x * s + v.y * c }
}

export function center(it: Rect): Vec {
  return { x: it.x + it.w / 2, y: it.y + it.h / 2 }
}

/** Axis-aligned bounds of an item, including its rotation. */
export function itemBounds(it: Item): Rect {
  if (!it.rotation) return { x: it.x, y: it.y, w: it.w, h: it.h }
  const c = center(it)
  const pts = [
    { x: -it.w / 2, y: -it.h / 2 },
    { x: it.w / 2, y: -it.h / 2 },
    { x: it.w / 2, y: it.h / 2 },
    { x: -it.w / 2, y: it.h / 2 },
  ].map((p) => {
    const r = rotate(p, it.rotation)
    return { x: r.x + c.x, y: r.y + c.y }
  })
  const xs = pts.map((p) => p.x)
  const ys = pts.map((p) => p.y)
  const x = Math.min(...xs)
  const y = Math.min(...ys)
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }
}

export function unionRect(rects: Rect[]): Rect | null {
  if (!rects.length) return null
  let x1 = Infinity
  let y1 = Infinity
  let x2 = -Infinity
  let y2 = -Infinity
  for (const r of rects) {
    x1 = Math.min(x1, r.x)
    y1 = Math.min(y1, r.y)
    x2 = Math.max(x2, r.x + r.w)
    y2 = Math.max(y2, r.y + r.h)
  }
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
}

export function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

export function normRect(a: Vec, b: Vec): Rect {
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) }
}

/** Camera that fits `r` into a viewport with some padding. */
export function fitCamera(r: Rect, vw: number, vh: number, pad = 80, maxZoom = 1): Camera {
  const zoom = clamp(Math.min((vw - pad * 2) / Math.max(r.w, 1), (vh - pad * 2) / Math.max(r.h, 1)), MIN_ZOOM, maxZoom)
  return { cx: r.x + r.w / 2, cy: r.y + r.h / 2, zoom }
}

export type Guide = { axis: 'x' | 'y'; at: number; from: number; to: number }

const xLines = (r: Rect) => [r.x, r.x + r.w / 2, r.x + r.w]
const yLines = (r: Rect) => [r.y, r.y + r.h / 2, r.y + r.h]

/**
 * Snap a moving rect to the edges and centres of the others. Returns the
 * correction to add to the move and the guide lines to draw.
 */
export function snapRect(moving: Rect, others: Rect[], threshold: number): { dx: number; dy: number; guides: Guide[] } {
  let best = { x: { d: threshold + 1, at: 0 }, y: { d: threshold + 1, at: 0 } }
  let dx = 0
  let dy = 0
  for (const o of others) {
    for (const a of xLines(moving)) {
      for (const b of xLines(o)) {
        const d = Math.abs(b - a)
        if (d < best.x.d) {
          best.x = { d, at: b }
          dx = b - a
        }
      }
    }
    for (const a of yLines(moving)) {
      for (const b of yLines(o)) {
        const d = Math.abs(b - a)
        if (d < best.y.d) {
          best.y = { d, at: b }
          dy = b - a
        }
      }
    }
  }
  if (best.x.d > threshold) dx = 0
  if (best.y.d > threshold) dy = 0
  const snapped = { ...moving, x: moving.x + dx, y: moving.y + dy }
  const guides: Guide[] = []
  if (best.x.d <= threshold) {
    const at = best.x.at
    const hits = others.filter((o) => xLines(o).some((l) => Math.abs(l - at) < 0.5))
    const ys = [snapped.y, snapped.y + snapped.h, ...hits.flatMap((o) => [o.y, o.y + o.h])]
    guides.push({ axis: 'x', at, from: Math.min(...ys), to: Math.max(...ys) })
  }
  if (best.y.d <= threshold) {
    const at = best.y.at
    const hits = others.filter((o) => yLines(o).some((l) => Math.abs(l - at) < 0.5))
    const xs = [snapped.x, snapped.x + snapped.w, ...hits.flatMap((o) => [o.x, o.x + o.w])]
    guides.push({ axis: 'y', at, from: Math.min(...xs), to: Math.max(...xs) })
  }
  return { dx, dy, guides }
}

/**
 * Resize one (possibly rotated) item by a handle. `hx`/`hy` are -1, 0 or 1:
 * the handle's side. The opposite side stays fixed in world space.
 */
export function resizeItem(start: Item, hx: number, hy: number, pointer: Vec, keepAspect: boolean): Item {
  const c = center(start)
  const anchorLocal = { x: (-hx * start.w) / 2, y: (-hy * start.h) / 2 }
  const ar = rotate(anchorLocal, start.rotation)
  const A = { x: c.x + ar.x, y: c.y + ar.y }
  const d = rotate({ x: pointer.x - A.x, y: pointer.y - A.y }, -start.rotation)
  let w = hx ? Math.max(MIN_SIZE, hx * d.x) : start.w
  let h = hy ? Math.max(MIN_SIZE, hy * d.y) : start.h
  if (keepAspect) {
    const ratio = start.w / start.h
    if (hx && hy) {
      const s = Math.max(w / start.w, h / start.h)
      w = Math.max(MIN_SIZE, start.w * s)
      h = w / ratio
    } else if (hx) h = w / ratio
    else if (hy) w = h * ratio
  }
  const off = rotate({ x: (hx * w) / 2, y: (hy * h) / 2 }, start.rotation)
  const nc = { x: A.x + off.x, y: A.y + off.y }
  return { ...start, w, h, x: nc.x - w / 2, y: nc.y - h / 2 }
}
