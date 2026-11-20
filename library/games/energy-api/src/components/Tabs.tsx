import { useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

export type TabItem<T extends string> = { value: T; label: ReactNode }

/*
  An underline tab list. Arrow keys move between tabs (automatic activation);
  pair it with <TabPanel> using the same `idBase`.
*/
export function Tabs<T extends string>({
  value,
  onChange,
  items,
  label,
  idBase,
  tone = 'ink',
  className,
}: {
  value: T
  onChange: (v: T) => void
  items: TabItem<T>[]
  label: string
  idBase: string
  tone?: 'ink' | 'forest'
  className?: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    let n = -1
    if (e.key === 'ArrowRight') n = (i + 1) % items.length
    else if (e.key === 'ArrowLeft') n = (i - 1 + items.length) % items.length
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = items.length - 1
    if (n < 0) return
    e.preventDefault()
    onChange(items[n].value)
    refs.current[n]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className={cx('flex gap-1 overflow-x-auto', className)}>
      {items.map((t, i) => {
        const on = t.value === value
        return (
          <button
            key={t.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            id={`${idBase}-tab-${t.value}`}
            role="tab"
            type="button"
            aria-selected={on}
            aria-controls={`${idBase}-panel`}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'relative h-10 shrink-0 whitespace-nowrap rounded-control-sm px-3 text-[13.5px] font-medium transition-colors',
              tone === 'forest'
                ? on
                  ? 'text-on-forest'
                  : 'text-on-forest-muted hover:text-on-forest'
                : on
                  ? 'text-ink'
                  : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
            <span
              aria-hidden
              className={cx('absolute inset-x-3 -bottom-px h-[2px] rounded-full transition-opacity', on ? 'opacity-100' : 'opacity-0', tone === 'forest' ? 'bg-volt' : 'bg-ink')}
            />
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({ idBase, value, children, className }: { idBase: string; value: string; children: ReactNode; className?: string }) {
  return (
    <div id={`${idBase}-panel`} role="tabpanel" aria-labelledby={`${idBase}-tab-${value}`} tabIndex={0} className={cx('outline-none', className)}>
      {children}
    </div>
  )
}

export function useIdBase() {
  return useId().replace(/:/g, '')
}
