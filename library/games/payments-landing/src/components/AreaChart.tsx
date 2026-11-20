import { useId, useMemo } from 'react'

import { cx } from '../lib/cx'

/*
  A small SVG area chart with a smooth line, used for the balance summary.
  `points` are values; `labels` sit under the x axis.
*/
export function AreaChart({ points, labels, className, height = 150, title }: { points: number[]; labels: string[]; className?: string; height?: number; title: string }) {
  const id = useId()
  const w = 320
  const h = height
  const pad = 6
  const { line, area } = useMemo(() => {
    const min = Math.min(...points) * 0.9
    const max = Math.max(...points) * 1.02
    const xy = points.map((p, i) => [pad + (i / (points.length - 1)) * (w - pad * 2), h - pad - ((p - min) / (max - min)) * (h - pad * 2)] as const)
    let d = `M${xy[0][0]},${xy[0][1]}`
    for (let i = 1; i < xy.length; i++) {
      const [x0, y0] = xy[i - 1]
      const [x1, y1] = xy[i]
      const cx1 = x0 + (x1 - x0) / 2
      d += ` C${cx1},${y0} ${cx1},${y1} ${x1},${y1}`
    }
    return { line: d, area: `${d} L${xy[xy.length - 1][0]},${h} L${xy[0][0]},${h} Z` }
  }, [points, h])
  return (
    <figure className={cx('w-full', className)}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" role="img" aria-label={title} preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-teal)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--color-teal)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="var(--color-line)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path
          key={line}
          d={line}
          fill="none"
          stroke="var(--color-teal-ink)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1"
          className="animate-draw"
        />
      </svg>
      <figcaption className="mt-2 flex justify-between text-[11px] text-faint" aria-hidden>
        {labels.map((l, i) => (
          <span key={`${l}-${i}`}>{l}</span>
        ))}
      </figcaption>
    </figure>
  )
}
