import { Check } from 'lucide-react'

import { cx } from '../lib/cx'

/** Numbered progress for multi-step flows. */
export function Stepper({ steps, current, className }: { steps: readonly string[]; current: number; className?: string }) {
  return (
    <ol className={cx('flex items-center gap-2', className)} aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current
        const on = i === current
        return (
          <li key={s} className="flex flex-1 items-center gap-2 last:flex-none" aria-current={on ? 'step' : undefined}>
            <span
              className={cx(
                'round grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold transition-colors',
                done ? 'bg-teal-ink text-white' : on ? 'bg-navy text-white' : 'bg-mist text-faint',
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden /> : i + 1}
            </span>
            <span className={cx('text-[13px] font-medium', on ? 'text-ink' : done ? 'text-ink-2' : 'text-faint', !on && 'max-sm:sr-only')}>
              {s}
              {done && <span className="sr-only"> (done)</span>}
            </span>
            {i < steps.length - 1 && <span aria-hidden className={cx('h-px flex-1', done ? 'bg-teal' : 'bg-line')} />}
          </li>
        )
      })}
    </ol>
  )
}
