import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '../lib/useReducedMotion'

/** Counts from 0 to `value` once visible. Reduced motion shows the value. */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
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
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: setN })
    return () => c.stop()
  }, [inView, value, reduce])
  const text = n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (
    <span ref={ref} className={className}>
      <span aria-hidden>
        {prefix}
        {text}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value.toLocaleString('en-US')}
        {suffix}
      </span>
    </span>
  )
}
