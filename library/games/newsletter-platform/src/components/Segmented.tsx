import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  A radio group drawn as a segmented control. Arrow keys move the choice,
  like native radios; only the selected segment is in the tab order.
*/
export function Segmented<T extends string>({ options, value, onChange, label, size = 'md', className }: { options: { value: T; label: ReactNode; icon?: ReactNode }[]; value: T; onChange: (v: T) => void; label: string; size?: 'sm' | 'md'; className?: string }) {
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
    <div role="radiogroup" aria-label={label} className={cx('inline-flex rounded-[10px] border border-line bg-night-2 p-1', className)}>
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
              'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pink [&_svg]:size-4',
              size === 'sm' ? 'h-10 px-3 text-[13px] sm:h-8' : 'h-10 px-4 text-[14px] sm:h-9',
              on ? 'bg-panel-3 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]' : 'text-muted hover:text-ink',
            )}
          >
            {o.icon}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
