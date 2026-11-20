import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  ARIA tabs: arrow keys move between tabs, Home/End jump, and each tab
  controls its panel. Render the panels yourself with `tabPanelProps`.
*/
export function useTabIds(prefix?: string) {
  const id = useId()
  const base = prefix ?? id
  return {
    tab: (k: string) => `${base}-tab-${k}`,
    panel: (k: string) => `${base}-panel-${k}`,
  }
}

export function Tabs<T extends string>({
  label,
  tabs,
  value,
  onChange,
  ids,
  tone = 'light',
  className,
}: {
  label: string
  tabs: readonly { id: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  ids: ReturnType<typeof useTabIds>
  tone?: 'light' | 'dark'
  className?: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const idx = Math.max(0, tabs.findIndex((t) => t.id === value))
  function onKey(e: KeyboardEvent) {
    let next = -1
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    if (next < 0) return
    e.preventDefault()
    onChange(tabs[next].id)
    refs.current[next]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} onKeyDown={onKey} className={cx('flex gap-1', className)}>
      {tabs.map((t, i) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            id={ids.tab(t.id)}
            role="tab"
            type="button"
            aria-selected={on}
            aria-controls={ids.panel(t.id)}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cx(
              'h-10 rounded-control-sm px-3.5 text-[13px] font-medium transition-colors',
              tone === 'dark'
                ? on
                  ? 'bg-white/12 text-white'
                  : 'text-on-navy-muted hover:text-white'
                : on
                  ? 'bg-mist text-ink'
                  : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
