import { Maximize2, Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import { type KeyboardEvent, type PointerEvent, useRef, useState } from 'react'

import type { Chapter, PresenterId, Scene } from '@/content'
import { cn } from '@/lib/cn'
import { clock } from '@/lib/format'
import { Menu } from './Menu'
import { ScreenMock } from './ScreenMock'

export type Marker = { id: string; t: number; initials: string; label: string }

/**
 * The clip player. Playback is simulated (a clock over a CSS screen), so the
 * time, scrubber, chapters, speed and comment markers all behave as they
 * would over a real <video>. Space/K play, ←/→ seek 5 s, J/L seek 10 s.
 */
export function Player({
  scene,
  presenter,
  duration,
  time,
  playing,
  onTime,
  onPlaying,
  chapters = [],
  markers = [],
  speed,
  onSpeed,
  className,
}: {
  scene: Scene
  presenter: PresenterId
  duration: number
  time: number
  playing: boolean
  onTime: (t: number) => void
  onPlaying: (p: boolean) => void
  chapters?: Chapter[]
  markers?: Marker[]
  speed: number
  onSpeed: (s: number) => void
  className?: string
}) {
  const bar = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const pct = (t: number) => `${Math.min(100, (t / duration) * 100)}%`
  const seek = (t: number) => onTime(Math.max(0, Math.min(duration, t)))
  const fromPointer = (e: PointerEvent) => {
    const r = bar.current!.getBoundingClientRect()
    return ((e.clientX - r.left) / r.width) * duration
  }
  const chapter = [...chapters].reverse().find((c) => c.t <= time)

  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('[role=slider],[aria-haspopup]') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return
    const k = e.key.toLowerCase()
    if (k === ' ' || k === 'k') {
      if ((e.target as HTMLElement).tagName === 'BUTTON' && k === ' ') return
      e.preventDefault()
      onPlaying(!playing)
    } else if (k === 'arrowleft') (e.preventDefault(), seek(time - 5))
    else if (k === 'arrowright') (e.preventDefault(), seek(time + 5))
    else if (k === 'j') seek(time - 10)
    else if (k === 'l') seek(time + 10)
  }

  return (
    <div className={cn('group/player relative overflow-hidden rounded-[18px] bg-black shadow-video', className)} onKeyDown={onKey}>
      <ScreenMock scene={scene} presenter={presenter} bubbleSize="lg" className="aspect-video w-full" />
      <button type="button" className="absolute inset-0 block w-full rounded-[18px] focus-visible:outline-offset-[-4px]" onClick={() => onPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'}>
        {!playing && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex size-14 items-center sm:size-[72px] justify-center rounded-full bg-cream text-ink shadow-video transition-transform duration-200 group-hover/player:scale-105">
              <Play className="ml-1 size-7 fill-current" />
            </span>
          </span>
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pt-6 pb-1.5 sm:px-4 sm:pt-10 sm:pb-2.5">
        {/* scrubber */}
        <div
          ref={bar}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${clock(time)} of ${clock(duration)}${chapter ? `, ${chapter.title}` : ''}`}
          className="group/bar relative flex h-5 cursor-pointer items-center rounded-full pointer-coarse:h-10"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            seek(fromPointer(e))
          }}
          onPointerMove={(e) => {
            setHover(fromPointer(e))
            if (e.buttons === 1) seek(fromPointer(e))
          }}
          onPointerLeave={() => setHover(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') (e.preventDefault(), e.stopPropagation(), seek(time - 5))
            if (e.key === 'ArrowRight') (e.preventDefault(), e.stopPropagation(), seek(time + 5))
            if (e.key === 'Home') (e.preventDefault(), seek(0))
            if (e.key === 'End') (e.preventDefault(), seek(duration))
          }}
        >
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 transition-[height] duration-150 group-hover/bar:h-1.5">
            {hover !== null && <div className="absolute inset-y-0 left-0 bg-white/25" style={{ width: pct(hover) }} />}
            <div className="absolute inset-y-0 left-0 bg-ember" style={{ width: pct(time) }} />
          </div>
          {chapters.slice(1).map((c) => (
            <span key={c.t} className="pointer-events-none absolute top-1/2 h-2 w-[2px] -translate-y-1/2 bg-black/70" style={{ left: pct(c.t) }} />
          ))}
          <span className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100" style={{ left: pct(time) }} />
          {hover !== null && (
            <span className="pointer-events-none absolute -top-7 -translate-x-1/2 rounded-md bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" style={{ left: pct(hover) }}>
              {clock(hover)}
            </span>
          )}
        </div>
        {/* comment markers */}
        <div className="relative h-5" aria-hidden>
          {markers.map((m) => (
            <span key={m.id} className="absolute top-0.5 flex size-4 -translate-x-1/2 items-center justify-center rounded-full bg-cream text-[7px] font-semibold text-ink ring-2 ring-black/60" style={{ left: pct(m.t) }} title={m.label}>
              {m.initials.slice(0, 1)}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1 text-white">
          <button type="button" onClick={() => onPlaying(!playing)} aria-label={playing ? 'Pause' : 'Play'} className="inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10">
            {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
          </button>
          <button type="button" onClick={() => seek(time - 10)} aria-label="Back 10 seconds" className="hidden size-10 items-center justify-center rounded-full hover:bg-white/10 sm:inline-flex">
            <RotateCcw className="size-4" />
          </button>
          <button type="button" onClick={() => seek(time + 10)} aria-label="Forward 10 seconds" className="hidden size-10 items-center justify-center rounded-full hover:bg-white/10 sm:inline-flex">
            <RotateCw className="size-4" />
          </button>
          <span className="ml-1 font-mono text-[12px] text-white/85 tabular-nums">
            {clock(time)} / {clock(duration)}
          </span>
          {chapter && <span className="ml-2 hidden truncate text-[12px] text-white/70 md:inline">· {chapter.title}</span>}
          <span className="ml-auto" />
          <Menu
            label="Playback speed"
            width={160}
            items={[0.75, 1, 1.25, 1.5, 2].map((s) => ({ id: String(s), label: `${s}×`, checked: s === speed, onSelect: () => onSpeed(s) }))}
            trigger={(p) => (
              <button {...p} type="button" aria-label={`Playback speed ${speed}×`} className="inline-flex h-10 min-w-10 items-center justify-center rounded-full px-2 font-mono text-[12px] hover:bg-white/10">
                {speed}×
              </button>
            )}
          />
          <button
            type="button"
            aria-label="Full screen"
            className="inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10"
            onClick={(e) => {
              const el = (e.currentTarget.closest('.group\\/player') as HTMLElement | null) ?? null
              if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
              else el?.requestFullscreen?.().catch(() => {})
            }}
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
