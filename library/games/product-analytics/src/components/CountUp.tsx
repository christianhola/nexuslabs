import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '../lib/useReducedMotion'

/* Counts to `value` the first time it scrolls into view. */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.4 }: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (reduce) {
      setN(value)
      return
    }
    const c = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setN })
    return () => c.stop()
  }, [seen, value, duration, reduce])
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}
