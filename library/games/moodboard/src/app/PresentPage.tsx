import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Pause, Play, X } from 'lucide-react'

import { COPY, NOTE_COLORS } from '../content'
import { IconButton } from '../components/IconButton'
import { boardPath, navigate } from '../lib/router'
import { useStore } from '../lib/store'
import type { Item } from '../lib/types'
import { ItemImage } from './CanvasItem'

const AUTOPLAY_MS = 4500

/** Reading order: rows top to bottom, then left to right inside a row. */
function slidesOf(items: Item[]): Item[] {
  const shown = items.filter((i) => i.kind === 'image' || i.kind === 'note' || i.kind === 'text')
  return [...shown].sort((a, b) => {
    const row = Math.round(a.y / 300) - Math.round(b.y / 300)
    return row || a.x - b.x
  })
}

function Slide({ item }: { item: Item }) {
  if (item.kind === 'image') {
    const ratio = item.w / item.h
    return (
      <figure className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div
          className="overflow-hidden rounded-[14px] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
          style={{ aspectRatio: String(ratio), width: `min(86vw, calc(74dvh * ${ratio}))` }}
        >
          <ItemImage src={item.src} alt={item.alt} />
        </div>
        {item.alt && <figcaption className="max-w-[70ch] px-6 text-center text-[14px] text-white/60">{item.alt}</figcaption>}
      </figure>
    )
  }
  if (item.kind === 'note') {
    return (
      <div className="flex h-full w-full items-center justify-center px-6">
        <div
          className="w-[min(560px,86vw)] rounded-[10px] p-10 text-[clamp(20px,3vw,30px)] leading-[1.35] tracking-[-0.01em] text-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)]"
          style={{ background: NOTE_COLORS.find((c) => c.id === item.color)?.hex }}
        >
          {item.text || 'Empty note'}
        </div>
      </div>
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <p className="max-w-[18ch] text-center text-[clamp(40px,8vw,96px)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">{item.text}</p>
    </div>
  )
}

/** Fullscreen slideshow of a board. ←/→ or Space to move, Esc to leave. */
export function PresentPage({ id }: { id: string }) {
  const board = useStore((s) => s.boards.find((b) => b.id === id))
  const slides = useMemo(() => slidesOf(board?.items ?? []), [board?.items])
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [playing, setPlaying] = useState(false)
  const [full, setFull] = useState(false)
  const [idle, setIdle] = useState(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reduce = useReducedMotion()
  const n = slides.length

  const go = useCallback(
    (d: number) => {
      if (!n) return
      setDir(d)
      setI((x) => (x + d + n) % n)
    },
    [n],
  )
  const exit = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    navigate(boardPath(id))
  }, [id])

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    else void document.documentElement.requestFullscreen?.().catch(() => {})
  }, [])

  useEffect(() => {
    document.title = `${board?.name ?? 'Present'} — ${COPY.brand}`
    // Go fullscreen straight away when we arrive from a click (Present button).
    if (navigator.userActivation?.isActive) void document.documentElement.requestFullscreen?.().catch(() => {})
    const onFs = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [board?.name])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && (e.target as HTMLElement).tagName !== 'BUTTON')) {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Home') setI(0)
      else if (e.key === 'End') setI(Math.max(0, n - 1))
      else if (e.key === 'Escape') exit()
      else if (e.key.toLowerCase() === 'f') toggleFull()
      else if (e.key.toLowerCase() === 'k') setPlaying((p) => !p)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, exit, n, toggleFull])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => go(1), AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [playing, go])

  const wake = () => {
    setIdle(false)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setIdle(true), 2600)
  }
  useEffect(() => {
    wake()
    return () => clearTimeout(idleTimer.current)
  }, [])

  if (!board) return null
  const slide = slides[Math.min(i, n - 1)]

  return (
    <main
      className="fixed inset-0 z-50 flex flex-col bg-[#0c0c0c] text-white"
      onPointerMove={wake}
      style={{ cursor: idle ? 'none' : undefined }}
      role="region"
      aria-roledescription="slideshow"
      aria-label={`${board.name} presentation`}
    >
      <h1 className="sr-only">Presenting {board.name}</h1>
      <div className="relative min-h-0 flex-1 overflow-hidden" onClick={() => go(1)}>
        {n === 0 ? (
          <div className="flex h-full items-center justify-center text-[15px] text-white/60">Nothing to present on this board yet.</div>
        ) : (
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={slide!.id}
              custom={dir}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60, scale: 0.98 }}
              transition={{ duration: reduce ? 0.01 : 0.45, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
              aria-label={`Slide ${i + 1} of ${n}`}
            >
              <Slide item={slide!} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className={`flex items-center justify-between gap-3 px-4 pb-4 pt-2 transition-opacity duration-500 sm:px-6 ${idle ? 'opacity-0' : 'opacity-100'}`}>
        <div className="min-w-0 text-[13.5px]">
          <span className="font-medium text-white">{board.name}</span>
          {n > 0 && (
            <span className="ml-2 tabular-nums text-white/55">
              {i + 1} / {n}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 rounded-[12px] bg-white/[0.08] p-1 backdrop-blur">
          <IconButton tone="dark" label="Previous" keys={['←']} size="sm" onClick={() => go(-1)} disabled={n < 2}>
            <ChevronLeft size={18} />
          </IconButton>
          <IconButton tone="dark" label={playing ? 'Pause' : 'Autoplay'} keys={['K']} size="sm" onClick={() => setPlaying((p) => !p)} disabled={n < 2}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </IconButton>
          <IconButton tone="dark" label="Next" keys={['→']} size="sm" onClick={() => go(1)} disabled={n < 2}>
            <ChevronRight size={18} />
          </IconButton>
          <span aria-hidden className="mx-1 h-5 w-px bg-white/15" />
          <IconButton tone="dark" label={full ? 'Exit fullscreen' : 'Fullscreen'} keys={['F']} size="sm" onClick={toggleFull}>
            {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </IconButton>
          <IconButton tone="dark" label="Exit presentation" keys={['Esc']} size="sm" onClick={exit}>
            <X size={17} />
          </IconButton>
        </div>
      </div>
      {n > 0 && (
        <div className="absolute inset-x-0 top-0 h-[3px] bg-white/10" aria-hidden>
          <div className="h-full bg-white/70 transition-[width] duration-500 ease-out" style={{ width: `${((i + 1) / n) * 100}%` }} />
        </div>
      )}
    </main>
  )
}
