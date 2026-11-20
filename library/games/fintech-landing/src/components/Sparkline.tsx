import { motion } from 'motion/react'
import { useId } from 'react'

// A smoothed line with a fading fill. Draws itself in on mount.
export function Sparkline({
  points,
  width = 100,
  height = 44,
  color = '#22c55e',
  className,
  delay = 0.6,
}: {
  points: number[]
  width?: number
  height?: number
  color?: string
  className?: string
  delay?: number
}) {
  const id = useId()
  const min = Math.min(...points)
  const max = Math.max(...points)
  const xy = points.map((p, i) => [
    (i / (points.length - 1)) * width,
    height - 3 - ((p - min) / (max - min || 1)) * (height - 8),
  ])
  let d = `M${xy[0][0]},${xy[0][1]}`
  for (let i = 1; i < xy.length; i++) {
    const [x0, y0] = xy[i - 1]
    const [x1, y1] = xy[i]
    const cx = (x0 + x1) / 2
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`
  }
  const area = `${d} L${width},${height} L0,${height} Z`
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.28" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#f${id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.8 }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#s${id})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  )
}
