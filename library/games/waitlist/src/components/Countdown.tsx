import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { launch } from '../content'
import { ease } from '../lib/motion'

function remaining(target: number) {
  const ms = Math.max(0, target - Date.now())
  const s = Math.floor(ms / 1000)
  return { done: ms === 0, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** One digit group; the value rolls up when it changes. */
function Unit({ value, unit, reduce }: { value: string; unit: string; reduce: boolean }) {
  return (
    <span className="inline-flex items-baseline">
      <span className="relative inline-block overflow-hidden tabular-nums text-ink">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="inline-block"
            initial={reduce ? false : { y: '-100%' }}
            animate={{ y: 0 }}
            exit={reduce ? undefined : { y: '100%' }}
            transition={{ duration: 0.32, ease }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-[1px] text-muted">{unit}</span>
    </span>
  )
}

export function Countdown({ className }: { className?: string }) {
  const reduce = useReducedMotion() ?? false
  const target = Date.parse(launch.at)
  const [left, setLeft] = useState(() => remaining(target))

  useEffect(() => {
    const timer = window.setInterval(() => setLeft(remaining(target)), 1000)
    return () => window.clearInterval(timer)
  }, [target])

  if (Number.isNaN(target) || left.done) {
    return <p className={className}>{launch.live}</p>
  }

  return (
    <p className={className} role="timer" aria-label={`${launch.prefix} ${left.d} days ${left.h} hours ${left.m} minutes`}>
      <span aria-hidden="true" className="inline-flex flex-wrap items-baseline gap-x-2">
        <span>{launch.prefix}</span>
        <span className="inline-flex items-baseline gap-1.5 font-medium">
          <Unit value={String(left.d)} unit={launch.units.d} reduce={reduce} />
          <Unit value={pad(left.h)} unit={launch.units.h} reduce={reduce} />
          <Unit value={pad(left.m)} unit={launch.units.m} reduce={reduce} />
          <Unit value={pad(left.s)} unit={launch.units.s} reduce={reduce} />
        </span>
      </span>
    </p>
  )
}
