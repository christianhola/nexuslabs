import { ChevronLeft, ChevronRight } from 'lucide-react'

import { addDays, formatShort, relativeDay, todayKey } from '../lib/dates'
import { cn } from '../lib/cn'
import { IconButton } from './Button'

/** Day stepper: previous / next arrows around the date, plus a native picker. */
export function DateStepper({ value, onChange, className }: { value: string; onChange: (v: string) => void; className?: string }) {
  const today = todayKey()
  return (
    <div className={cn('inline-flex h-10 items-center rounded-sm bg-surface ring-1 ring-inset ring-line', className)}>
      <IconButton label="Previous day" size="sm" disabled={value <= today} onClick={() => onChange(addDays(value, -1))}>
        <ChevronLeft className="size-4" />
      </IconButton>
      <label className="relative grid min-w-[128px] cursor-pointer place-items-center px-1 text-sm font-semibold text-fg">
        <span aria-hidden>{relativeDay(value) === formatShort(value) ? formatShort(value) : `${relativeDay(value)} · ${formatShort(value).split(', ')[1]}`}</span>
        <input
          type="date"
          aria-label="Date"
          min={today}
          value={value}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <IconButton label="Next day" size="sm" onClick={() => onChange(addDays(value, 1))}>
        <ChevronRight className="size-4" />
      </IconButton>
    </div>
  )
}
