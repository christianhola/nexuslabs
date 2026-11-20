import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '../lib/useReducedMotion'

/* Counts from 0 to `value` once it is on screen. Formats with `format`. */
export function CountUp({ value, format = (n) => Math.round(n).toLocaleString('en-US'), duration = 1.4, className }: { value: number; format?: (n: number) => string; duration?: number; className?: string }) {
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
    <span ref={ref} className={className}>
      <span aria-hidden>{format(n)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
