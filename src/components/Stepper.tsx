import { Check } from 'lucide-react'

import { cx } from '../lib/cx'

/** Numbered progress for multi-step flows. Completed steps can be revisited. */
export function Stepper({ steps, current, onSelect, className }: { steps: readonly string[]; current: number; onSelect?: (i: number) => void; className?: string }) {
  return (
    <ol className={cx('grid gap-2', className)} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={s} className="min-w-0">
            <button
              type="button"
              disabled={!done || !onSelect}
              onClick={() => onSelect?.(i)}
              aria-current={active ? 'step' : undefined}
              className="group flex min-h-11 w-full min-w-0 flex-col gap-2 pt-1 text-left disabled:cursor-default"
            >
              <span className={cx('h-[3px] w-full rounded-full transition-colors duration-[var(--duration-base)]', done || active ? 'bg-ink' : 'bg-line')} />
              <span className={cx('flex min-h-6 items-center gap-1.5 text-[13px] font-medium', active ? 'text-ink' : done ? 'text-ink-2 group-hover:underline' : 'text-muted')}>
                {done ? <Check className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden /> : <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>}
                <span className="hidden truncate sm:inline">{s}</span>
                <span className="sr-only sm:hidden">{s}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
