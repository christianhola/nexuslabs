import { useId } from 'react'

/* A tiny single-series trend line with a soft fill. Decorative: pair it with text. */
export function Sparkline({ values, width = 96, height = 28, tone = 'bad', className }: { values: readonly number[]; width?: number; height?: number; tone?: 'ok' | 'bad' | 'leaf'; className?: string }) {
  const id = useId()
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pts = values.map((v, i) => [(i / (values.length - 1)) * (width - 4) + 2, height - 3 - ((v - min) / (max - min || 1)) * (height - 6)] as const)
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const color = tone === 'ok' ? 'var(--color-ok)' : tone === 'bad' ? 'var(--color-bad)' : 'var(--color-leaf)'
  const last = pts[pts.length - 1]!
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.18" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${width - 2} ${height} L2 ${height} Z`} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} stroke="white" strokeWidth="1.5" />
    </svg>
  )
}
