import { motion } from 'motion/react'
import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

export type Segment<T extends string> = { value: T; label: ReactNode; badge?: ReactNode }

/**
 * Pill radio group with a sliding violet thumb (billing period, plan picker,
 * filters). Arrow keys move the selection, as a native radio group would.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  className,
}: {
  options: Segment<T>[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const id = useId()
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
    <div role="radiogroup" aria-label={label} className={cx('depth relative inline-flex max-w-full rounded-full bg-surface p-1 round', className)}>
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
              'relative flex items-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors round',
              size === 'sm' ? 'h-10 px-3.5 text-[13px] sm:h-9' : 'h-10 px-5 text-[14px]',
              on ? 'text-white' : 'text-muted hover:text-white',
            )}
          >
            {on && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-violet round"
              />
            )}
            <span className="relative">{o.label}</span>
            {o.badge ? <span className="relative">{o.badge}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
