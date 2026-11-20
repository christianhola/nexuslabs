import { NOTE_COLORS } from '../content'
import { itemBounds, unionRect } from './geometry'
import { loadImage } from './images'
import { inkOn } from './palette'
import type { Board, Item } from './types'

const PAD = 64
const MAX_SIDE = 6000
const FONT = "'Google Sans', ui-sans-serif, system-ui, sans-serif"

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = []
  for (const para of text.split('\n')) {
    let line = ''
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line)
        line = word
      } else line = test
    }
    lines.push(line)
  }
  return lines
}

function drawCover(ctx: CanvasRenderingContext2D, im: HTMLImageElement, w: number, h: number) {
  const s = Math.max(w / im.naturalWidth, h / im.naturalHeight)
  const sw = w / s
  const sh = h / s
  ctx.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) / 2, sw, sh, -w / 2, -h / 2, w, h)
}

async function drawItem(ctx: CanvasRenderingContext2D, it: Item) {
  ctx.save()
  ctx.translate(it.x + it.w / 2, it.y + it.h / 2)
  ctx.rotate((it.rotation * Math.PI) / 180)
  const x = -it.w / 2
  const y = -it.h / 2
  if (it.kind === 'image') {
    const im = await loadImage(it.src)
    roundRect(ctx, x, y, it.w, it.h, 11)
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.12)'
    ctx.shadowBlur = 18
    ctx.shadowOffsetY = 6
    ctx.fillStyle = '#e9e9e9'
    ctx.fill()
    ctx.restore()
    ctx.clip()
    if (im) drawCover(ctx, im, it.w, it.h)
  } else if (it.kind === 'note') {
    const bg = NOTE_COLORS.find((c) => c.id === it.color)?.hex ?? '#fff1a8'
    roundRect(ctx, x, y, it.w, it.h, 6)
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.14)'
    ctx.shadowBlur = 16
    ctx.shadowOffsetY = 6
    ctx.fillStyle = bg
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = '#141414'
    ctx.font = `400 17px ${FONT}`
    ctx.textBaseline = 'top'
    wrap(ctx, it.text ?? '', it.w - 36).forEach((l, i) => ctx.fillText(l, x + 18, y + 18 + i * 24))
  } else if (it.kind === 'text') {
    const fs = it.fontSize ?? 40
    ctx.fillStyle = '#141414'
    ctx.font = `600 ${fs}px ${FONT}`
    ctx.textBaseline = 'top'
    wrap(ctx, it.text ?? '', it.w).forEach((l, i) => ctx.fillText(l, x, y + i * fs * 1.1))
  } else if (it.kind === 'swatch') {
    roundRect(ctx, x, y, it.w, it.h, 11)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    const colors = it.colors ?? []
    const gap = 6
    const cw = (it.w - 16 - gap * (colors.length - 1)) / Math.max(colors.length, 1)
    colors.forEach((c, i) => {
      const cxp = x + 8 + i * (cw + gap)
      roundRect(ctx, cxp, y + 8, cw, it.h - 34, 7)
      ctx.fillStyle = c
      ctx.fill()
      ctx.fillStyle = inkOn('#ffffff')
      ctx.font = `500 11px ${FONT}`
      ctx.textBaseline = 'top'
      ctx.fillText(c.toUpperCase(), cxp, y + it.h - 20)
    })
  }
  ctx.restore()
}

/** Render a board to a PNG blob at 1× world scale (2× when small). */
export async function boardToPng(board: Board): Promise<Blob | null> {
  const bounds = unionRect(board.items.map(itemBounds))
  if (!bounds) return null
  await document.fonts?.ready
  const w = bounds.w + PAD * 2
  const h = bounds.h + PAD * 2
  const scale = Math.min(2, MAX_SIDE / Math.max(w, h))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * scale)
  canvas.height = Math.round(h * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.scale(scale, scale)
  ctx.fillStyle = '#f9f9f9'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#d6d6d6'
  for (let gx = 18; gx < w; gx += 36) for (let gy = 18; gy < h; gy += 36) ctx.fillRect(gx, gy, 1.5, 1.5)
  ctx.translate(PAD - bounds.x, PAD - bounds.y)
  for (const it of board.items) await drawItem(ctx, it)
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export const fileName = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'board'}.png`
