import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cx } from '../lib/cx'
import { useReducedMotion } from '../lib/useReducedMotion'

/** A number that counts up once it scrolls into view. */
export function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    const c = animate(0, value, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: setN })
    return () => c.stop()
  }, [inView, value, reduce])
  const text = n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (
    <span ref={ref} className="tabular">
      <span aria-hidden>
        {text}
        {suffix}
      </span>
      <span className="sr-only">
        {value.toLocaleString('en-US', { minimumFractionDigits: decimals })}
        {suffix}
      </span>
    </span>
  )
}

export function Stat({ value, suffix, decimals, label, className }: { value: number; suffix?: string; decimals?: number; label: string; className?: string }) {
  return (
    <div className={cx('border-t border-ink/15 pt-5', className)}>
      <p className="text-[44px] font-medium leading-none tracking-[-0.04em] sm:text-[52px]">
        <CountUp value={value} suffix={suffix} decimals={decimals} />
      </p>
      <p className="mt-3 text-[15px] text-muted">{label}</p>
    </div>
  )
}
