import { cx } from '../lib/cx'

/* Horizontal completion funnel. The largest drop is called out in flame. */
export function FunnelBars({ steps, className }: { steps: readonly { label: string; value: number }[]; className?: string }) {
  let worst = 1
  for (let i = 1; i < steps.length; i++) if (steps[i - 1]!.value - steps[i]!.value > steps[worst - 1]!.value - steps[worst]!.value) worst = i
  return (
    <ol className={cx('flex flex-col gap-3', className)}>
      {steps.map((s, i) => (
        <li key={s.label}>
          <div className="flex items-baseline justify-between text-[14px]">
            <span className="text-ink">{s.label}</span>
            <span className="tabular-nums text-muted">
              {s.value}%{i === worst ? <span className="ml-2 text-[12.5px] font-medium text-flame-ink">−{steps[i - 1]!.value - s.value} pts, biggest drop</span> : null}
            </span>
          </div>
          <div className="round mt-1.5 h-2.5 overflow-hidden rounded-full bg-wash-2" aria-hidden>
            <div className={cx('round h-full rounded-full transition-[width] duration-700 ease-[var(--ease-brand)]', i === worst ? 'bg-flame' : 'bg-flame-tint')} style={{ width: `${s.value}%` }} />
          </div>
        </li>
      ))}
    </ol>
  )
}
