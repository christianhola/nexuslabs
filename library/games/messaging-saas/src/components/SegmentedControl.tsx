import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

export type Segment<T extends string> = { value: T; label: ReactNode }

/**
 * A pill group. `mode="tabs"` renders a WAI-ARIA tablist (pair with
 * `tabPanelId`); otherwise it is a radio group. Arrow keys move between options.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  mode = 'radio',
  idPrefix,
  className,
  size = 'md',
}: {
  options: Segment<T>[]
  value: T
  onChange: (v: T) => void
  label: string
  mode?: 'radio' | 'tabs'
  idPrefix?: string
  className?: string
  size?: 'sm' | 'md'
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
      role={mode === 'tabs' ? 'tablist' : 'radiogroup'}
      aria-label={label}
      className={cx('inline-flex rounded-[10px] border border-line bg-white/[0.04] p-1', className)}
    >
      {options.map((o, i) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role={mode === 'tabs' ? 'tab' : 'radio'}
            id={idPrefix ? `${idPrefix}-tab-${o.value}` : undefined}
            aria-controls={mode === 'tabs' && idPrefix ? `${idPrefix}-panel` : undefined}
            aria-selected={mode === 'tabs' ? active : undefined}
            aria-checked={mode === 'radio' ? active : undefined}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[7px] font-medium transition-[background-color,color] duration-200',
              size === 'md' ? 'h-10 px-4 text-[14px]' : 'h-10 min-w-11 px-3 text-[13px] sm:h-8 sm:min-w-0',
              active ? 'bg-white text-bg shadow-sm' : 'text-muted hover:text-white',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
