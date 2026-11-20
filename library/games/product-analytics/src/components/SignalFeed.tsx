import { AnimatePresence, motion } from 'motion/react'
import { TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

import { signalFeed } from '../content'
import { cx } from '../lib/cx'
import { useReducedMotion } from '../lib/useReducedMotion'

type Kind = (typeof signalFeed)[number]['kind']

const kindMeta: Record<Kind, { label: string; icon: typeof Zap; cls: string }> = {
  drop: { label: 'Drop', icon: TrendingDown, cls: 'bg-bad-soft text-bad' },
  spike: { label: 'Spike', icon: Zap, cls: 'bg-warn-soft text-warn' },
  win: { label: 'Win', icon: TrendingUp, cls: 'bg-ok-soft text-ok' },
}

/*
  A live-looking stream of signals: a new one slides in on top every few
  seconds. Pauses on hover and focus, and stays still with reduced motion.
*/
export function SignalFeed({ rows = 4, className, paused: forcePaused }: { rows?: number; className?: string; paused?: boolean }) {
  const reduce = useReducedMotion()
  const [offset, setOffset] = useState(0)
  const [hold, setHold] = useState(false)
  const paused = forcePaused || hold || reduce
  useEffect(() => {
    if (paused) return
    const t = window.setInterval(() => setOffset((o) => (o + 1) % signalFeed.length), 2800)
    return () => window.clearInterval(t)
  }, [paused])
  const items = Array.from({ length: rows }, (_, i) => signalFeed[(offset + i) % signalFeed.length]!)
  return (
    <ul className={cx('flex flex-col gap-2', className)} onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)} aria-label="Recent signals">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((f) => {
          const m = kindMeta[f.kind]
          const Icon = m.icon
          return (
            <motion.li
              key={f.id}
              layout
              initial={{ y: -12, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0 } }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 rounded-[12px] border border-line bg-card px-3 py-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
            >
              <span className={cx('round grid size-8 shrink-0 place-items-center rounded-full', m.cls)}>
                <Icon className="size-4" aria-hidden />
                <span className="sr-only">{m.label}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-ink">{f.title}</span>
                <span className="block truncate text-[12px] text-faint">{f.detail}</span>
              </span>
              <span className="shrink-0 text-[12px] text-faint">{f.time}</span>
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
