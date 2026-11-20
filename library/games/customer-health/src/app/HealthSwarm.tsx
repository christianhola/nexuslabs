import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { SegmentTag } from '../components/SegmentTag'
import { copy, SEGMENTS, type Account, type Segment } from '../data'
import { packSwarm, type SwarmPoint } from '../lib/beeswarm'
import { cx } from '../lib/cx'
import { money, signed } from '../lib/format'
import { healthFill } from '../lib/healthColor'
import { current, wow } from '../lib/metrics'

export type ViewMode = 'Combined' | 'By segment'

type HealthSwarmProps = {
  accounts: Account[]
  /** Accounts that pass the segment filter; the rest shrink away. */
  visibleIds: Set<string>
  mode: ViewMode
  threshold: number
  onThreshold: (value: number) => void
  onSelect: (account: Account) => void
}

const DOMAIN: [number, number] = [5, 105]
const TICKS = [20, 40, 60, 80, 100]
const TOP = 22 // threshold label band
const BOTTOM = 78 // tick labels + axis title

export function HealthSwarm({ accounts, visibleIds, mode, threshold, onThreshold, onSelect }: HealthSwarmProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [width, setWidth] = useState(1240)
  const [hover, setHover] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [lineHover, setLineHover] = useState(false)
  const [lineFocus, setLineFocus] = useState(false)
  const [entered, setEntered] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry!.contentRect.width)))
    ro.observe(el)
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    const t = window.setTimeout(() => setSettled(true), 1600)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
    }
  }, [])

  const compact = width < 640
  const x = (v: number) => ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * width

  // Lanes: one for Combined, one per visible segment for By segment.
  const lanes = useMemo(() => {
    if (mode === 'Combined') return [{ key: 'all' as const, label: null as Segment | null }]
    const present = SEGMENTS.filter((s) => accounts.some((a) => a.segment === s && visibleIds.has(a.id)))
    return present.map((s) => ({ key: s, label: s as Segment | null }))
  }, [mode, accounts, visibleIds])

  const laneHalf = mode === 'Combined' ? (compact ? 82 : 96) : compact ? 54 : 62
  const laneGap = mode === 'Combined' ? 0 : 30
  const laneTop = (i: number) => TOP + 6 + i * (laneHalf * 2 + laneGap) + (mode === 'Combined' ? 0 : 14)
  const plotBottom = laneTop(lanes.length - 1) + laneHalf * 2
  const height = plotBottom + BOTTOM

  // Pack each lane; shrink every radius together until all lanes fit.
  const layout = useMemo(() => {
    const maxArr = Math.max(...accounts.map((a) => a.arr))
    const base = 27 * Math.min(1, Math.max(0.42, width / 1240))
    let k = 1
    let result = new Map<string, SwarmPoint & { r: number; lane: number }>()
    for (let attempt = 0; attempt < 10; attempt++) {
      result = new Map()
      let fits = true
      lanes.forEach((lane, li) => {
        const members = accounts.filter((a) => visibleIds.has(a.id) && (lane.key === 'all' || a.segment === lane.key))
        const nodes = members.map((a) => ({ id: a.id, x: x(current(a)), r: Math.max(3.2 * Math.min(1, width / 900), base * k * Math.sqrt(a.arr / maxArr)) }))
        const { points, extent } = packSwarm(nodes)
        if (extent > laneHalf) fits = false
        for (const n of nodes) result.set(n.id, { ...points.get(n.id)!, r: n.r, lane: li })
      })
      if (fits) break
      k *= 0.9
    }
    return result
  }, [accounts, visibleIds, lanes, width, laneHalf])

  // Hidden bubbles shrink in place at their last position.
  const lastPos = useRef(new Map<string, { x: number; y: number; r: number }>())
  const positions = accounts.map((a) => {
    const p = layout.get(a.id)
    if (p) {
      const pos = { x: p.x, y: laneTop(p.lane) + laneHalf + p.y, r: p.r }
      lastPos.current.set(a.id, pos)
      return { a, ...pos, visible: true }
    }
    const prev = lastPos.current.get(a.id) ?? { x: x(current(a)), y: laneTop(0) + laneHalf, r: 4 }
    return { a, ...prev, visible: false }
  })

  // Threshold dragging (pointer + keyboard).
  const valueAt = (clientX: number) => {
    const rect = svgRef.current!.getBoundingClientRect()
    const v = DOMAIN[0] + ((clientX - rect.left) / rect.width) * (DOMAIN[1] - DOMAIN[0])
    return Math.round(Math.min(90, Math.max(10, v)))
  }
  const onPointerDown = (e: PointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    onThreshold(valueAt(e.clientX))
  }
  const onPointerMove = (e: PointerEvent<SVGGElement>) => dragging && onThreshold(valueAt(e.clientX))
  const onPointerUp = () => setDragging(false)
  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const step = e.shiftKey ? 5 : 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onThreshold(Math.max(10, threshold - step))
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onThreshold(Math.min(90, threshold + step))
    else return
    e.preventDefault()
  }

  const hovered = hover ? positions.find((p) => p.a.id === hover && p.visible) : undefined
  const tx = x(threshold)
  const lineActive = dragging || lineHover || lineFocus

  return (
    <div ref={wrapRef} className="relative select-none" style={{ height, transition: 'height 0.6s cubic-bezier(0.2,0.7,0.2,1)' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="absolute inset-0 overflow-visible"
        role="group"
        aria-label={`Beeswarm of ${visibleIds.size} accounts by health score; circle size is ARR`}
      >
        {/* Lane labels (By segment) */}
        {lanes.map((lane, i) =>
          lane.label ? (
            <text
              key={lane.key}
              x={0}
              y={laneTop(i) - 6}
              className="caps animate-fade fill-muted text-[10.5px]"
              style={{ letterSpacing: '0.22em' }}
            >
              {lane.label.toUpperCase()}
              <tspan className="fill-muted">
                {'  '}
                {accounts.filter((a) => a.segment === lane.label && visibleIds.has(a.id)).length}
              </tspan>
            </text>
          ) : null,
        )}

        {/* Bubbles */}
        <g>
          {positions.map(({ a, x: px, y: py, r, visible }) => {
            const show = entered && visible
            const delay = settled ? 0 : (px / Math.max(1, width)) * 700
            return (
              <g
                key={a.id}
                style={{
                  transform: `translate(${px}px, ${entered ? py : laneTop(0) + laneHalf}px)`,
                  transition: `transform 0.75s cubic-bezier(0.2,0.75,0.2,1) ${delay}ms`,
                }}
              >
                <circle
                  r={r}
                  fill={healthFill(current(a))}
                  stroke="var(--fg)"
                  strokeWidth={hover === a.id ? 1.5 : 0}
                  className="cursor-pointer"
                  style={{
                    transform: `scale(${show ? (hover === a.id ? 1.12 : 1) : 0})`,
                    opacity: show ? (hover && hover !== a.id ? 0.55 : 1) : 0,
                    transition: `transform 0.55s cubic-bezier(0.3,1.4,0.5,1) ${delay}ms, opacity 0.3s ease, fill 0.5s ease, stroke-width 0.15s`,
                  }}
                  onPointerEnter={() => visible && setHover(a.id)}
                  onPointerLeave={() => setHover((h) => (h === a.id ? null : h))}
                  onClick={() => visible && onSelect(a)}
                />
              </g>
            )
          })}
        </g>

        {/* Risk threshold: drag it, or focus and use the arrow keys */}
        <g
          role="slider"
          tabIndex={0}
          aria-label="Risk threshold"
          aria-valuemin={10}
          aria-valuemax={90}
          aria-valuenow={threshold}
          className="cursor-ew-resize outline-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => setLineHover(true)}
          onPointerLeave={() => setLineHover(false)}
          onKeyDown={onKey}
          onFocus={(e) => setLineFocus(e.currentTarget.matches(':focus-visible'))}
          onBlur={() => setLineFocus(false)}
          style={{ transform: `translateX(${tx}px)`, transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.2,0.7,0.2,1)' }}
        >
          <rect x={-12} y={TOP - 18} width={24} height={plotBottom - TOP + 22} fill="transparent" />
          <line
            className="thr-line"
            x1={0}
            x2={0}
            y1={TOP + 4}
            y2={plotBottom}
            stroke={lineActive ? 'var(--fg)' : 'var(--muted)'}
            strokeOpacity={lineActive ? 0.9 : 0.75}
            strokeWidth={lineActive ? 1.5 : 1}
            style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
          />
          <text x={10} y={TOP - 6} className="caps fill-muted text-[10.5px] sm:text-[11px]" style={{ letterSpacing: '0.24em' }}>
            {copy.thresholdLabel.toUpperCase()}
            <tspan className="fill-fg" style={{ opacity: lineActive ? 1 : 0, transition: 'opacity 0.2s' }}>
              {' '}
              {threshold}
            </tspan>
          </text>
          <g style={{ opacity: lineActive ? 1 : 0, transition: 'opacity 0.2s' }}>
            <rect x={-7} y={plotBottom - 2} width={14} height={14} rx={7} fill="var(--fg)" />
            <path d={`M-2.5 ${plotBottom + 2} l-2 3 l2 3 M2.5 ${plotBottom + 2} l2 3 l-2 3`} stroke="var(--bg)" strokeWidth={1.2} fill="none" />
          </g>
        </g>

        {/* Axis */}
        {TICKS.map((t) => (
          <text
            key={t}
            x={x(t)}
            y={plotBottom + 30}
            textAnchor="middle"
            className="tnum fill-muted font-mono text-[12px] sm:text-[12.5px]"
          >
            {t}
          </text>
        ))}
        <text x={width / 2} y={plotBottom + 61} textAnchor="middle" className="fill-muted font-sans text-[13px]">
          {copy.axisLabel}
        </text>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.a.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16 }}
            className="pointer-events-none absolute z-20 w-max max-w-[240px] rounded-[6px] border border-line bg-raised px-3.5 py-3 shadow-pop"
            style={{
              left: Math.min(width - 120, Math.max(120, hovered.x)),
              top: hovered.y - hovered.r - 12,
              translate: '-50% -100%',
            }}
          >
            <div className="flex items-baseline gap-2.5">
              <span className="text-[14px] font-medium">{hovered.a.name}</span>
            </div>
            <SegmentTag className="mt-0.5 block">{hovered.a.segment}</SegmentTag>
            <dl className="tnum mt-2.5 grid grid-cols-3 gap-x-4 font-mono text-[12px]">
              <dt className="caps text-[9.5px] text-muted">ARR</dt>
              <dt className="caps text-[9.5px] text-muted">Health</dt>
              <dt className="caps text-[9.5px] text-muted">WoW</dt>
              <dd>{money(hovered.a.arr)}</dd>
              <dd className={cx(current(hovered.a) < threshold && 'text-risk')}>{current(hovered.a)}</dd>
              <dd className={cx(wow(hovered.a) < 0 ? 'text-risk' : 'text-muted')}>{signed(wow(hovered.a))}</dd>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
