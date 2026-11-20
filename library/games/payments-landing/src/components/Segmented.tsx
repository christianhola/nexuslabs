import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  A pill switcher (radiogroup). Arrow keys move and select, like native
  radios; only the selected option is in the tab order.
*/
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  tone = 'light',
  className,
}: {
  label: string
  options: readonly { id: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
  tone?: 'light' | 'mist'
  className?: string
}) {
  const name = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = Math.max(0, options.findIndex((o) => o.id === value))

  function onKey(e: KeyboardEvent) {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (idx + dir + options.length) % options.length
    onChange(options[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
      className={cx('inline-flex rounded-control p-1', tone === 'mist' ? 'bg-mist' : 'border border-line bg-white', className)}
    >
      {options.map((o, i) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            name={name}
            onClick={() => onChange(o.id)}
            className={cx(
              'rounded-control-sm font-medium transition-[background-color,color,box-shadow] duration-150',
              size === 'sm' ? 'h-10 px-3 text-[13px] sm:h-9' : 'h-10 px-4 text-[14px]',
              on ? 'bg-navy text-white shadow-sm' : 'text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
