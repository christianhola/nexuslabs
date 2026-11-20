import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CircleAlert, Info } from 'lucide-react'

import { cx } from '../lib/cx'
import { initials } from '../lib/format'
import { useReducedMotion } from '../lib/useReducedMotion'

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360
  return (
    <span aria-hidden className={cx('round inline-grid shrink-0 place-items-center rounded-full font-medium text-white', className)} style={{ width: size, height: size, fontSize: size * 0.38, background: `linear-gradient(135deg, hsl(${(h % 60) + 140} 45% 32%), hsl(${(h % 60) + 170} 50% 20%))` }}>
      {initials(name)}
    </span>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-[6px] bg-white/8 px-1.5 font-mono text-[12px] text-muted ring-1 ring-inset ring-line-strong">{children}</kbd>
}

export function Notice({ tone = 'info', title, children, className, action }: { tone?: 'info' | 'error'; title?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  const Icon = tone === 'error' ? CircleAlert : Info
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex items-start gap-3 rounded-card-sm px-4 py-3 text-[14px] ring-1 ring-inset', tone === 'error' ? 'bg-danger/8 text-fg ring-danger/30' : 'bg-info/6 text-fg ring-info/20', className)}>
      <Icon aria-hidden className={cx('mt-0.5 size-4 shrink-0', tone === 'error' ? 'text-danger' : 'text-info')} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-muted">{children}</div>
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon, title, body, action, className }: { icon: ReactNode; title: string; body: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('grid place-items-center rounded-card border border-dashed border-line-strong px-6 py-14 text-center', className)}>
      <div className="grid size-12 place-items-center rounded-[14px] bg-brand/10 text-brand-text">{icon}</div>
      <h3 className="mt-4 text-[18px] font-medium">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[14.5px] text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cx('skeleton rounded-[10px]', className)} />
}

/** Counts up to `value` when scrolled into view. */
export function CountUp({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(reduce ? value : 0)
  useEffect(() => {
    if (reduce) {
      setV(value)
      return
    }
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400)
        setV(value * (1 - Math.pow(1 - k, 3)))
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, reduce])
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals)}
      {suffix}
    </span>
  )
}
