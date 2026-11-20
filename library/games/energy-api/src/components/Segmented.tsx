import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

export type SegmentedOption<T extends string> = { value: T; label: ReactNode }

/*
  A pill switch for one-of-few choices (billing period, device type).
  role="radiogroup": arrow keys move and select, Tab leaves the group.
*/
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  tone = 'paper',
  size = 'md',
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: SegmentedOption<T>[]
  label: string
  tone?: 'paper' | 'forest'
  size?: 'sm' | 'md'
  className?: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + options.length) % options.length
    onChange(options[n].value)
    refs.current[n]?.focus()
  }
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx(
        'round inline-flex rounded-pill p-1',
        tone === 'forest' ? 'bg-forest-3' : 'bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]',
        className,
      )}
    >
      {options.map((o, i) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'round inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-pill font-medium transition-colors duration-150',
              size === 'sm' ? 'h-10 px-3.5 text-[13.5px] sm:h-9' : 'h-10 px-4 text-[14px]',
              on
                ? tone === 'forest'
                  ? 'bg-on-forest text-forest'
                  : 'bg-ink text-mint'
                : tone === 'forest'
                  ? 'text-on-forest-muted hover:text-on-forest'
                  : 'text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
