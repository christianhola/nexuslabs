import { useId, useRef, useState } from 'react'

import { cx } from '../lib/cx'

/*
  Single-series area line with a recessive grid, a crosshair and a tooltip
  on hover or arrow keys. The title outside names the series, so there is
  no legend. A visually hidden table carries the numbers for screen readers.
*/
export function LineChart({
  values,
  labels,
  format = (v: number) => v.toLocaleString('en-US'),
  height = 220,
  label,
  className,
}: {
  values: readonly number[]
  labels: readonly string[]
  format?: (v: number) => string
  height?: number
  label: string
  className?: string
}) {
  const W = 640
  const H = height
  const pad = { l: 8, r: 8, t: 16, b: 26 }
  const id = useId()
  const [hover, setHover] = useState<number | null>(null)
  const box = useRef<SVGSVGElement>(null)
  const lo = Math.floor(Math.min(...values) * 0.94)
  const hi = Math.ceil(Math.max(...values) * 1.03)
  const x = (i: number) => pad.l + (i / (values.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo)) * (H - pad.t - pad.b)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const grid = [0, 0.33, 0.66, 1].map((f) => pad.t + f * (H - pad.t - pad.b))

  const onMove = (clientX: number) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    const rel = ((clientX - r.left) / r.width) * W
    const i = Math.round(((rel - pad.l) / (W - pad.l - pad.r)) * (values.length - 1))
    setHover(Math.max(0, Math.min(values.length - 1, i)))
  }

  return (
    <div className={cx('relative', className)}>
      <svg
        ref={box}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-none overflow-visible focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flame-strong"
        role="img"
        aria-label={`${label}: ${format(values[0]!)} on ${labels[0]} to ${format(values[values.length - 1]!)} on ${labels[labels.length - 1]}`}
        tabIndex={0}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault()
            setHover((h) => Math.max(0, Math.min(values.length - 1, (h ?? (e.key === 'ArrowRight' ? -1 : values.length)) + (e.key === 'ArrowRight' ? 1 : -1))))
          } else if (e.key === 'Escape') setHover(null)
        }}
      >
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-flame)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--color-flame)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {grid.map((gy) => (
          <line key={gy} x1={pad.l} x2={W - pad.r} y1={gy} y2={gy} stroke="var(--color-line)" strokeDasharray="2 4" />
        ))}
        <path d={`${d} L${x(values.length - 1)} ${H - pad.b} L${x(0)} ${H - pad.b} Z`} fill={`url(#${id})`} />
        <path d={d} fill="none" stroke="var(--color-flame-strong)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {labels.map((l, i) =>
          (i % 3 === 0 && labels.length - 1 - i >= 2) || i === labels.length - 1 ? (
            <text key={l} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'} fontSize="11" fill="var(--color-faint)">
              {l}
            </text>
          ) : null,
        )}
        {hover != null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t - 6} y2={H - pad.b} stroke="var(--color-ink)" strokeOpacity="0.25" />
            <circle cx={x(hover)} cy={y(values[hover]!)} r="5" fill="var(--color-flame-strong)" stroke="white" strokeWidth="2" />
          </g>
        ) : null}
      </svg>
      {hover != null ? (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-night px-2.5 py-1.5 text-[12px] text-on-dark shadow-pop"
          style={{ left: `${(x(hover) / W) * 100}%` }}
          role="status"
        >
          <span className="text-white/70">{labels[hover]}</span> <span className="font-semibold">{format(values[hover]!)}</span>
        </div>
      ) : null}
      <table className="sr-only">
        <caption>{label}</caption>
        <tbody>
          {values.map((v, i) => (
            <tr key={labels[i]}>
              <th scope="row">{labels[i]}</th>
              <td>{format(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
