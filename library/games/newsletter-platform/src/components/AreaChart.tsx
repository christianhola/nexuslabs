import { useId, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { cx } from '../lib/cx'

/*
  An SVG area chart with a pink-violet fill. `mini` hides axes and tooltip
  (used in the hero mock). In full mode, hover or arrow keys move a marker
  and the tooltip reads the point.
*/
export function AreaChart({ series, labels, format = String, mini, className, height = 220, label = 'Chart' }: { series: number[]; labels?: string[]; format?: (n: number) => string; mini?: boolean; className?: string; height?: number; label?: string }) {
  const id = useId().replace(/:/g, '')
  const [hover, setHover] = useState<number | null>(null)
  const W = 600
  const H = height
  const pad = mini ? { t: 8, r: 0, b: 0, l: 0 } : { t: 16, r: 8, b: 26, l: 8 }
  const { line, area, pts } = useMemo(() => {
    const lo = Math.min(...series)
    const hi = Math.max(...series)
    // Start the axis at zero unless the series lives far from it (subscriber
    // counts), where a zero baseline would flatten the line.
    const min = mini ? lo * 0.6 : lo > hi * 0.5 ? lo - (hi - lo) * 0.35 : 0
    const max = hi + (hi - min) * 0.12
    const x = (i: number) => pad.l + (i / Math.max(1, series.length - 1)) * (W - pad.l - pad.r)
    const y = (v: number) => pad.t + (1 - (v - min) / (max - min || 1)) * (H - pad.t - pad.b)
    const pts = series.map((v, i) => [x(i), y(v)] as const)
    const line = pts.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`).join('')
    const area = `${line}L${pts[pts.length - 1][0]},${H - pad.b}L${pts[0][0]},${H - pad.b}Z`
    return { line, area, pts }
  }, [series, H, mini, pad.b, pad.l, pad.r, pad.t])

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    setHover((h) => {
      const cur = h ?? (e.key === 'ArrowRight' ? -1 : series.length)
      return Math.min(series.length - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1)))
    })
  }

  const svg = (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e548bf" stopOpacity="0.42" />
          <stop offset="0.6" stopColor="#8b5cf6" stopOpacity="0.12" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#f06acd" />
        </linearGradient>
      </defs>
      {!mini
        ? [0.25, 0.5, 0.75].map((g) => <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + g * (H - pad.t - pad.b)} y2={pad.t + g * (H - pad.t - pad.b)} stroke="#24212e" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />)
        : null}
      <path d={area} fill={`url(#f${id})`} />
      <path d={line} fill="none" stroke={`url(#l${id})`} strokeWidth={mini ? 2 : 2.5} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      {hover != null ? <line x1={pts[hover][0]} x2={pts[hover][0]} y1={pad.t} y2={H - pad.b} stroke="#4d4858" vectorEffect="non-scaling-stroke" /> : null}
    </svg>
  )

  if (mini) return <div className={cx('relative', className)} style={{ height }}>{svg}</div>

  const hx = hover != null ? (pts[hover][0] / W) * 100 : 0
  const hy = hover != null ? (pts[hover][1] / H) * 100 : 0
  return (
    <div className={cx('relative', className)}>
      <div
        role="img"
        tabIndex={0}
        aria-label={`${label}: ${format(series[0])} to ${format(series[series.length - 1])}. Use arrow keys to read points.`}
        onKeyDown={onKey}
        onBlur={() => setHover(null)}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const i = Math.round(((e.clientX - r.left) / r.width) * (series.length - 1))
          setHover(Math.min(series.length - 1, Math.max(0, i)))
        }}
        className="relative rounded-[8px] focus-visible:outline-offset-4"
        style={{ height: H }}
      >
        {svg}
        {hover != null ? (
          <>
            <span className="round pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-pink-strong" style={{ left: `${hx}%`, top: `${hy}%` }} />
            <div className={cx('pointer-events-none absolute top-2 z-10 rounded-[8px] border border-line-strong bg-panel-2 px-3 py-2 text-[13px] shadow-[var(--shadow-pop)]', hx > 70 ? '-translate-x-[calc(100%+12px)]' : 'translate-x-3')} style={{ left: `${hx}%` }}>
              <p className="text-muted">{labels?.[hover]}</p>
              <p className="font-semibold text-ink">{format(series[hover])}</p>
            </div>
          </>
        ) : null}
      </div>
      {labels ? (
        <div className="mt-2 flex justify-between text-[12px] text-faint" aria-hidden>
          <span>{labels[0]}</span>
          <span>{labels[Math.floor(labels.length / 2)]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      ) : null}
      <span className="sr-only">Peak {format(Math.max(...series))}.</span>
    </div>
  )
}

/* Horizontal bar list: acquisition sources, top links. */
export function BarList({ rows, format = String }: { rows: { label: string; value: number }[]; format?: (n: number) => string }) {
  const max = Math.max(...rows.map((r) => r.value))
  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <li key={r.label} className="relative flex h-9 items-center justify-between overflow-hidden rounded-[7px] px-3 text-[14px]">
          <span className="absolute inset-y-0 left-0 rounded-[7px] bg-[linear-gradient(90deg,rgb(139_92_246/0.32),rgb(229_72_191/0.28))]" style={{ width: `${(r.value / max) * 100}%` }} aria-hidden />
          <span className="relative text-ink">{r.label}</span>
          <span className="relative font-medium tabular-nums text-body">{format(r.value)}</span>
        </li>
      ))}
    </ul>
  )
}
