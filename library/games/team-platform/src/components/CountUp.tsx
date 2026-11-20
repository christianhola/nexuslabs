import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '../lib/useReducedMotion'

/* Counts from 0 to `value` once, when it first scrolls into view. */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.4 }: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)
  useEffect(() => {
    if (reduce) {
      setN(value)
      return
    }
    if (!inView) return
    const c = animate(0, value, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setN })
    return () => c.stop()
  }, [inView, value, duration, reduce])
  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden>
        {prefix}
        {n.toFixed(decimals)}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  )
}
