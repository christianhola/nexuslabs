import { loadImage } from './images'

const hex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

/**
 * Pull the `count` most characteristic colours from an image: bucket pixels
 * into a coarse 4-bit cube, then keep the busiest buckets that are visibly
 * different from each other.
 */
export async function extractPalette(src: string | undefined, count = 5): Promise<string[]> {
  const im = await loadImage(src)
  if (!im) return []
  const size = 72
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  ctx.drawImage(im, 0, 0, size, size)
  let data: Uint8ClampedArray
  try {
    data = ctx.getImageData(0, 0, size, size).data
  } catch {
    return []
  }
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>()
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3]! < 128) continue
    const r = data[i]!
    const g = data[i + 1]!
    const b = data[i + 2]!
    const k = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4)
    const e = buckets.get(k) ?? { n: 0, r: 0, g: 0, b: 0 }
    e.n++
    e.r += r
    e.g += g
    e.b += b
    buckets.set(k, e)
  }
  const sorted = [...buckets.values()]
    .map((e) => ({ n: e.n, c: [e.r / e.n, e.g / e.n, e.b / e.n] as const }))
    .sort((a, b) => b.n - a.n)
  const picked: (readonly [number, number, number])[] = []
  for (const minDist of [60, 40, 20, 0]) {
    for (const s of sorted) {
      if (picked.length >= count) break
      if (picked.includes(s.c)) continue
      if (picked.every((p) => Math.hypot(p[0] - s.c[0], p[1] - s.c[1], p[2] - s.c[2]) >= minDist)) picked.push(s.c)
    }
    if (picked.length >= count) break
  }
  // Light to dark reads best in a strip.
  const lum = (c: readonly [number, number, number]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
  return picked.sort((a, b) => lum(b) - lum(a)).map((c) => hex(c[0], c[1], c[2]))
}

/** Black or white, whichever reads better on `bg`. */
export function inkOn(bg: string): string {
  const n = parseInt(bg.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 150 ? '#141414' : '#ffffff'
}
