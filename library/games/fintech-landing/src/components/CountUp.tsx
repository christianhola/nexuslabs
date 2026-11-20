import { animate, useInView, useMotionValue, useMotionValueEvent } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Counts from `from` to `value` once it scrolls into view, and eases to any new value after.
export function CountUp({
  value,
  from = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  delay = 0,
  className,
}: {
  value: number
  from?: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const mv = useMotionValue(from)
  const fmt = (n: number) =>
    prefix + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  const [text, setText] = useState(fmt(from))
  useMotionValueEvent(mv, 'change', (v) => setText(fmt(v)))

  useEffect(() => {
    if (!inView) return
    if (prefersReduced()) {
      mv.set(value)
      setText(fmt(value))
      return
    }
    const controls = animate(mv, value, { duration, delay, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
