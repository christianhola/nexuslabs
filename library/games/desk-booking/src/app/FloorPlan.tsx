import { useRef, type KeyboardEvent, type PointerEvent } from 'react'

import { floors, people, rooms, type Booking, type Desk } from '../data'
import { initials } from '../components/Avatar'
import { cn } from '../lib/cn'

export const PLAN_W = 960
export const PLAN_H = 600

export type DeskStatus = 'free' | 'busy' | 'mine'

/**
  The office plan as SVG. Desks and rooms are focusable buttons coloured by
  status. In `edit` mode desks drag (pointer) or nudge (arrow keys) instead.
*/
export function FloorPlan({
  floorId,
  desks,
  statusOf,
  roomBusy,
  holderOf,
  selected,
  highlight,
  onDesk,
  onRoom,
  edit,
  onMove,
  className,
}: {
  floorId: string
  desks: Desk[]
  statusOf?: (d: Desk) => DeskStatus
  roomBusy?: (roomId: string) => Booking | undefined
  holderOf?: (deskId: string) => string | undefined
  selected?: string
  highlight?: string
  onDesk?: (d: Desk) => void
  onRoom?: (roomId: string) => void
  edit?: boolean
  onMove?: (id: string, x: number, y: number, done: boolean) => void
  className?: string
}) {
  const svg = useRef<SVGSVGElement>(null)
  const drag = useRef<{ id: string; dx: number; dy: number; moved: boolean } | null>(null)
  const floor = floors.find((f) => f.id === floorId)!
  const floorRooms = rooms.filter((r) => r.floorId === floorId)
  const floorDesks = desks.filter((d) => d.floorId === floorId)

  function point(e: PointerEvent) {
    const s = svg.current!
    const pt = s.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(s.getScreenCTM()!.inverse())
  }

  function down(e: PointerEvent<SVGGElement>, d: Desk) {
    if (!edit) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = point(e)
    drag.current = { id: d.id, dx: p.x - d.x, dy: p.y - d.y, moved: false }
    onDesk?.(d)
  }
  function move(e: PointerEvent<SVGGElement>) {
    const g = drag.current
    if (!g) return
    const p = point(e)
    g.moved = true
    onMove?.(g.id, snap(p.x - g.dx, PLAN_W - 52), snap(p.y - g.dy, PLAN_H - 36), false)
  }
  function up(e: PointerEvent<SVGGElement>) {
    const g = drag.current
    drag.current = null
    if (!g?.moved) return
    const p = point(e)
    onMove?.(g.id, snap(p.x - g.dx, PLAN_W - 52), snap(p.y - g.dy, PLAN_H - 36), true)
  }

  function key(e: KeyboardEvent<SVGGElement>, d: Desk) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onDesk?.(d)
      return
    }
    if (!edit) return
    const step = e.shiftKey ? 40 : 8
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    const m = delta[e.key]
    if (!m) return
    e.preventDefault()
    onMove?.(d.id, clamp(d.x + m[0], 20, PLAN_W - 20 - d.w), clamp(d.y + m[1], 20, PLAN_H - 20 - d.h), true)
  }

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
      role="group"
      aria-label={`${floor.name} plan`}
      className={cn('block h-auto w-full touch-manipulation select-none', edit && 'touch-none', className)}
    >
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#e3e6eb" strokeWidth="3" />
        </pattern>
      </defs>
      <rect x="20" y="20" width={PLAN_W - 40} height={PLAN_H - 40} rx="10" fill="#fff" stroke="#cfd4dc" strokeWidth="3" />
      {/* window wall */}
      <line x1="240" y1="20" x2="720" y2="20" stroke="#9fd8f0" strokeWidth="4" strokeLinecap="round" />

      {floor.areas.map((a) => (
        <g key={a.label} aria-hidden>
          <rect x={a.x} y={a.y} width={a.w} height={a.h} rx="6" fill={a.tone === 'hatch' ? 'url(#hatch)' : '#f6f7f9'} stroke="#e3e6eb" />
          <text x={a.x + 12} y={a.y + 22} fontSize="12" fontWeight="600" fill="#6b7280">
            {a.label}
          </text>
        </g>
      ))}

      {floorRooms.map((r) => {
        const busy = roomBusy?.(r.id)
        return (
          <g key={r.id}>
          <g
            role={onRoom ? 'button' : undefined}
            tabIndex={onRoom ? 0 : undefined}
            aria-label={onRoom ? `${r.name}, ${r.capacity} seats, ${busy ? `booked ${busy.start} to ${busy.end}` : 'available'}` : undefined}
            onClick={() => onRoom?.(r.id)}
            onKeyDown={(e) => {
              if (onRoom && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onRoom(r.id)
              }
            }}
            className={cn('outline-none', onRoom && 'cursor-pointer [&:focus-visible>rect]:stroke-brand [&:focus-visible>rect]:stroke-[3] [&:hover>rect]:brightness-[0.98]')}
          >
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx="6"
              fill={!roomBusy ? '#f6f7f9' : busy ? '#f1f2f5' : '#e8f6f4'}
              stroke={!roomBusy ? '#d6dae1' : busy ? '#c5cad3' : '#7cc9bf'}
              strokeWidth="1.5"
              className="transition-[fill,stroke] duration-200"
            />
          </g>
          <g aria-hidden pointerEvents="none">
            <text x={r.x + 12} y={r.y + 24} fontSize="14" fontWeight="700" fill="#111827">
              {r.name}
            </text>
            <text x={r.x + 12} y={r.y + 42} fontSize="11" fill="#4b5563">
              {r.capacity === 1 ? 'Phone booth' : `${r.capacity} seats`}
            </text>
            {roomBusy && (
              <text x={r.x + 12} y={r.y + r.h - 14} fontSize="11" fontWeight="600" fill={busy ? '#4b5563' : '#0c6f67'}>
                {busy ? (r.w < 120 ? 'Booked' : `Booked ${busy.start}–${busy.end}`) : 'Free'}
              </text>
            )}
          </g>
          </g>
        )
      })}

      {floorDesks.map((d) => {
        const status = statusOf?.(d) ?? 'free'
        const holder = holderOf?.(d.id)
        const person = holder ? people.find((p) => p.id === holder) : undefined
        const isSel = selected === d.id
        const isHi = highlight === d.id
        const fill = status === 'mine' ? '#fde7e0' : status === 'busy' ? '#eef0f3' : '#e3f6f0'
        const stroke = status === 'mine' ? '#f24e1e' : status === 'busy' ? '#c5cad3' : '#4fb99a'
        return (
          <g
            key={d.id}
            style={{ transform: `translate(${d.x}px, ${d.y}px)`, transition: drag.current?.id === d.id ? 'none' : 'transform 0.25s cubic-bezier(0.22,1,0.36,1)' }}
          >
          <g
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            aria-label={
              edit
                ? `${d.id}, ${d.zone}. Arrow keys move it.`
                : `${d.id}, ${d.zone}, ${status === 'free' ? 'available' : status === 'mine' ? 'booked by you' : `booked${person ? ` by ${person.name}` : ''}`}`
            }
            onClick={() => !edit && onDesk?.(d)}
            onPointerDown={(e) => down(e, d)}
            onPointerMove={move}
            onPointerUp={up}
            onKeyDown={(e) => key(e, d)}
            className={cn('group outline-none', edit ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer')}
          >
            {isHi && (
              <circle cx={d.w / 2} cy={d.h / 2} r="26" fill="none" stroke="#f24e1e" strokeWidth="3" className="origin-center animate-pulse-ring [transform-box:fill-box]" />
            )}
            <rect
              width={d.w}
              height={d.h}
              rx="5"
              fill={fill}
              stroke={isSel || isHi ? '#0b1020' : stroke}
              strokeWidth={isSel || isHi ? 2.5 : 1.5}
              className="transition-[fill,stroke] duration-200 group-hover:brightness-95 group-focus-visible:stroke-brand group-focus-visible:stroke-[3]"
            />
          </g>
          <g aria-hidden pointerEvents="none">
            <text x={d.w / 2} y={person && status !== 'free' ? 15 : d.h / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={status === 'mine' ? '#a6300a' : status === 'busy' ? '#4b5260' : '#0b6b53'}>
              {d.id}
            </text>
            {person && status !== 'free' && (
              <text x={d.w / 2} y={28} textAnchor="middle" fontSize="9.5" fontWeight="600" fill={status === 'mine' ? '#a6300a' : '#4b5260'}>
                {status === 'mine' ? 'You' : initials(person.name)}
              </text>
            )}
          </g>
          </g>
        )
      })}
    </svg>
  )
}

function snap(v: number, max: number) {
  return clamp(Math.round(v / 4) * 4, 20, max - 20)
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

export function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted" aria-label="Legend">
      {[
        ['#e3f6f0', '#4fb99a', 'Available'],
        ['#eef0f3', '#c5cad3', 'Booked'],
        ['#fde7e0', '#f24e1e', 'Yours'],
        ['#e8f6f4', '#7cc9bf', 'Free room'],
      ].map(([f, s, l]) => (
        <li key={l} className="inline-flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-[3px]" style={{ background: f, boxShadow: `inset 0 0 0 1.5px ${s}` }} />
          {l}
        </li>
      ))}
    </ul>
  )
}
