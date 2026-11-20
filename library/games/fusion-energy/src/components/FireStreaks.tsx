import { useEffect, useRef } from 'react'

import { cx } from '../lib/cx'
import { useReducedMotion } from '../lib/useReducedMotion'

/*
  The orange light streaks behind "Why Maritime Fusion?": a few hundred thin
  curves drawn on a canvas that pinch together in the middle like light
  pulled through a lens. They sway slowly while on screen; with reduced
  motion they are drawn once and held still.
*/
type Line = { offset: number; hue: number; light: number; alpha: number; width: number; phase: number; speed: number }

function makeLines(count: number, seed = 7): Line[] {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  return Array.from({ length: count }, () => {
    const r = rand() * 2 - 1
    return {
      offset: Math.sign(r) * Math.pow(Math.abs(r), 0.8),
      hue: 14 + rand() * 26,
      light: 45 + rand() * 25,
      alpha: 0.18 + rand() * 0.55,
      width: 0.4 + rand() * 1.3,
      phase: rand() * Math.PI * 2,
      speed: 0.2 + rand() * 0.5,
    }
  })
}

export function FireStreaks({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const lines = makeLines(220)
    let w = 0
    let h = 0
    let raf = 0
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = el.clientWidth
      h = el.clientHeight
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      const cx = w / 2
      const cy = h / 2
      for (const l of lines) {
        const grad = ctx.createLinearGradient(0, 0, w, 0)
        const a = l.alpha * intensity
        grad.addColorStop(0, `hsla(${l.hue},100%,${l.light}%,0)`)
        grad.addColorStop(0.25, `hsla(${l.hue},100%,${l.light}%,${a * 0.5})`)
        grad.addColorStop(0.5, `hsla(${l.hue + 8},100%,${l.light + 15}%,${a})`)
        grad.addColorStop(0.75, `hsla(${l.hue},100%,${l.light}%,${a * 0.5})`)
        grad.addColorStop(1, `hsla(${l.hue},100%,${l.light}%,0)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = l.width
        ctx.beginPath()
        const sway = Math.sin(t * 0.0004 * l.speed + l.phase) * 0.06
        for (let i = 0; i <= 48; i++) {
          const x = (i / 48) * w
          const d = Math.abs(x - cx) / cx
          const spread = 0.16 + 0.84 * Math.pow(d, 1.4)
          const y = cy + (l.offset + sway * d) * (h / 2) * spread
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (t: number) => {
      if (visible) draw(t)
      raf = requestAnimationFrame(loop)
    }

    resize()
    draw(0)
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(el)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(el)
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [reduce, intensity])

  return <canvas ref={canvas} className={cx('pointer-events-none block h-full w-full', className)} aria-hidden />
}
