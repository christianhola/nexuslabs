import { cx } from '../lib/cx'

/** Single-select filter pills (toggle buttons with aria-pressed). */
export function FilterBar<T extends string>({
  options,
  value,
  onChange,
  label,
  counts,
  className,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  label: string
  counts?: Partial<Record<T, number>>
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cx('flex flex-wrap gap-2', className)}>
      {options.map((o) => {
        const active = o === value
        return (
          <button
            key={o}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o)}
            className={cx(
              'round inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition-colors duration-[var(--duration-fast)]',
              active ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-card text-ink-2 hover:border-ink',
            )}
          >
            {o}
            {counts?.[o] !== undefined && <span className={cx('tabular-nums', active ? 'text-paper/70' : 'text-muted')}>{counts[o]}</span>}
          </button>
        )
      })}
    </div>
  )
}
