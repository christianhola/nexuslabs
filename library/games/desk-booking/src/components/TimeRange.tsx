import { DAY_END, DAY_START } from '../data'
import { halfHours } from '../lib/dates'
import { cn } from '../lib/cn'
import { Select } from './Field'

const SLOTS = halfHours(DAY_START, DAY_END)

/** Start and end selects in 30-minute steps; end options stay after start. */
export function TimeRange({
  start,
  end,
  onChange,
  idPrefix,
  invalid,
  className,
  compact,
}: {
  start: string
  end: string
  onChange: (start: string, end: string) => void
  idPrefix?: string
  invalid?: boolean
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select
        id={idPrefix ? `${idPrefix}-start` : undefined}
        aria-label="Start time"
        aria-invalid={invalid || undefined}
        value={start}
        className={compact ? 'w-[96px]' : 'flex-1'}
        onChange={(e) => {
          const s = e.target.value
          onChange(s, end > s ? end : SLOTS[Math.min(SLOTS.indexOf(s) + 2, SLOTS.length - 1)])
        }}
      >
        {SLOTS.slice(0, -1).map((t) => (
          <option key={t}>{t}</option>
        ))}
      </Select>
      <span aria-hidden className="text-sm text-muted">
        –
      </span>
      <Select
        aria-label="End time"
        aria-invalid={invalid || undefined}
        value={end}
        className={compact ? 'w-[96px]' : 'flex-1'}
        onChange={(e) => onChange(start, e.target.value)}
      >
        {SLOTS.filter((t) => t > start).map((t) => (
          <option key={t}>{t}</option>
        ))}
      </Select>
    </div>
  )
}
