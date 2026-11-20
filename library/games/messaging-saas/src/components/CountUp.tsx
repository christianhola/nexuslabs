import { useEffect, useState } from 'react'

import { useInView } from '../lib/useInView'
import { useReducedMotion } from '../lib/useReducedMotion'

/** Counts from 0 to `value` once it scrolls into view (instant with reduced motion). */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1400 }: { value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number }) {
  const [ref, seen] = useInView<HTMLSpanElement>()
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (reduce) return setN(value)
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      setN(value * (1 - Math.pow(1 - p, 4)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, reduce, value, duration])
  const text = `${prefix}${n.toFixed(decimals)}${suffix}`
  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden>{text}</span>
      <span className="sr-only">{`${prefix}${value.toFixed(decimals)}${suffix}`}</span>
    </span>
  )
}
