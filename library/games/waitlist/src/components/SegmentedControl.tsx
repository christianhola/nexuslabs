import { motion } from 'motion/react'
import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

import { cx } from '../lib/cx'
import { ease } from '../lib/motion'

export type Segment<T extends string> = { value: T; label: ReactNode; icon?: ReactNode }

/**
 * Two-to-four way switch (a radio group). Arrow keys move the selection,
 * the white thumb slides between options.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: Segment<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  const id = useId()
  const refs = useRef<Array<HTMLButtonElement | null>>([])

  function onKey(event: KeyboardEvent, index: number) {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-label={label} className={cx('inline-flex rounded-control border border-line-soft bg-sunken p-[3px]', className)}>
      {options.map((option, i) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'relative inline-flex h-10 cursor-pointer sm:h-[34px] items-center gap-1.5 rounded-[1px] px-3.5 text-[14px] font-medium outline-none transition-colors duration-150 is-focus:shadow-focus',
              selected ? 'text-ink' : 'text-muted is-hover:text-ink',
            )}
          >
            {selected && (
              <motion.span layoutId={`${id}-thumb`} className="absolute inset-0 rounded-[1px] bg-white shadow-control ring-1 ring-line-soft" transition={{ duration: 0.3, ease }} />
            )}
            <span className="relative inline-flex items-center gap-1.5">
              {option.icon}
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
