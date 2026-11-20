import { motion } from 'motion/react'
import { useState } from 'react'

import { cx } from '../lib/cx'

/*
  A conversion funnel: one bar per step, height = people who reached it,
  with the drop between steps called out. Bars are buttons: selecting one
  shows who dropped there (onSelect). Single series, so no legend.
*/
export function FunnelChart({
  steps,
  selected,
  onSelect,
  compact,
  className,
}: {
  steps: readonly { label: string; value: number }[]
  selected?: number
  onSelect?: (i: number) => void
  compact?: boolean
  className?: string
}) {
  const [hover, setHover] = useState<number | null>(null)
  const top = steps[0]?.value ?? 1
  return (
    <div className={cx('flex flex-col gap-4', className)}>
      <div className={cx('grid items-end gap-2', compact ? 'h-[150px]' : 'h-[240px]')} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => {
          const pct = (s.value / top) * 100
          const on = selected === i
          const drop = i ? 100 - (s.value / steps[i - 1]!.value) * 100 : 0
          return (
            <button
              key={s.label}
              type="button"
              disabled={!onSelect}
              aria-pressed={onSelect ? on : undefined}
              aria-label={`${s.label}: ${s.value.toLocaleString('en-US')} people, ${pct.toFixed(0)}% of start${i ? `, ${drop.toFixed(0)}% dropped from the step before` : ''}`}
              onClick={() => onSelect?.(i)}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="group relative flex h-full flex-col justify-end rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf disabled:cursor-default"
            >
              <span className="absolute inset-x-0 bottom-0 rounded-[8px] bg-wash-2" style={{ height: '100%' }} aria-hidden />
              <motion.span
                className={cx('relative rounded-[8px] transition-colors', on ? 'bg-leaf' : 'bg-lime group-hover:bg-lime-hover')}
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden
              />
              {hover === i ? (
                <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-night px-2.5 py-1.5 text-[12px] text-on-dark shadow-pop" aria-hidden>
                  {s.value.toLocaleString('en-US')} people
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-hidden>
        {steps.map((s, i) => {
          const conv = (s.value / top) * 100
          const drop = i ? 100 - (s.value / steps[i - 1]!.value) * 100 : 0
          return (
            <div key={s.label} className="min-w-0">
              <p className={cx('font-display font-bold tracking-[-0.03em] text-ink', compact ? 'text-[15px]' : 'text-[20px]')}>{conv.toFixed(0)}%</p>
              <p className={cx('truncate text-muted', compact ? 'text-[11px]' : 'text-[12.5px]')}>{s.label}</p>
              {i && !compact ? (
                <p className="mt-1 whitespace-nowrap text-[12px] font-medium text-bad">
                  −{drop.toFixed(0)}%<span className="max-sm:hidden"> here</span>
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
