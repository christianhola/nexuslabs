import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  Vertical (or horizontal) tabs with arrow-key navigation. Each tab can
  carry a title and a body, as in the home showcase.
*/
export function Tabs<T extends string>({ tabs, value, onChange, label, orientation = 'vertical' }: { tabs: readonly { id: T; label: string; title?: string; body?: ReactNode }[]; value: T; onChange: (v: T) => void; label: string; orientation?: 'vertical' | 'horizontal' }) {
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = tabs.findIndex((t) => t.id === value)
  const onKey = (e: KeyboardEvent) => {
    const next = ['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(e.key) ? -1 : 0
    if (!next) return
    e.preventDefault()
    const n = (idx + next + tabs.length) % tabs.length
    onChange(tabs[n].id)
    refs.current[n]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} aria-orientation={orientation} onKeyDown={onKey} className={cx(orientation === 'vertical' ? 'flex flex-col gap-2' : 'scrollbar-none flex gap-2 overflow-x-auto')}>
      {tabs.map((t, i) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            id={`${id}-${t.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cx(
              'text-left transition-[background-color,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
              orientation === 'vertical' ? 'rounded-[16px] border p-4 sm:p-5' : 'h-10 shrink-0 rounded-[9px] border px-4 text-[14.5px] font-medium',
              on ? 'border-ink bg-card shadow-[5px_5px_0_var(--color-mint)]' : 'border-transparent hover:bg-mist',
            )}
          >
            {orientation === 'vertical' ? (
              <>
                <span className="block text-[13px] font-medium text-faint">{t.label}</span>
                <span className="mt-0.5 block font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">{t.title}</span>
                {on && t.body ? <span className="mt-1.5 block text-[15px] leading-relaxed text-muted">{t.body}</span> : null}
              </>
            ) : (
              t.label
            )}
          </button>
        )
      })}
    </div>
  )
}
