import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

/** Radio-group segmented control: arrow keys move, one tab stop. */
export function Segmented<T extends string>({ value, onChange, options, label, size = 'md' }: { value: T; onChange: (v: T) => void; options: Array<{ value: T; label: ReactNode; title?: string }>; label: string; size?: 'sm' | 'md' }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = (i + d + options.length) % options.length
    onChange(options[n].value)
    refs.current[n]?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-md bg-chip p-1">
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
            title={o.title}
            aria-label={o.title}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'inline-flex items-center justify-center gap-1.5 rounded-sm font-medium transition-[background-color,box-shadow] duration-(--duration-fast)',
              size === 'sm' ? 'h-10 min-w-10 px-2.5 text-[13px] sm:h-8 sm:min-w-9' : 'h-10 px-4 text-[14px]',
              on ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
