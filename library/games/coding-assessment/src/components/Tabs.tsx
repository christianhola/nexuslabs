import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { cx } from '../lib/cx'

export type TabItem<T extends string> = { id: T; label: ReactNode; count?: number }

/** Segmented tabs with arrow-key roving focus. Pair with `tabPanelProps` on the panel. */
export function Tabs<T extends string>({ items, value, onChange, label, idBase, className, size = 'md', panel = true }: { items: TabItem<T>[]; value: T; onChange: (v: T) => void; label: string; idBase: string; className?: string; size?: 'sm' | 'md'; panel?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const onKey = (e: KeyboardEvent) => {
    const i = items.findIndex((t) => t.id === value)
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % items.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + items.length) % items.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = items.length - 1
    if (next < 0) return
    e.preventDefault()
    onChange(items[next]!.id)
    ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }
  return (
    <div ref={ref} role="tablist" aria-label={label} onKeyDown={onKey} className={cx('inline-flex max-w-full gap-1 overflow-x-auto rounded-[14px] bg-surface-2 p-1 ring-1 ring-inset ring-line', className)}>
      {items.map((t) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            id={`${idBase}-tab-${t.id}`}
            aria-selected={on}
            aria-controls={panel ? `${idBase}-panel` : undefined}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cx(
              'inline-flex shrink-0 items-center gap-2 rounded-[10px] font-medium whitespace-nowrap transition-colors',
              size === 'sm' ? 'h-10 px-3 text-[13.5px] sm:h-8' : 'h-10 px-4 text-[14.5px]',
              on ? 'bg-raised text-fg shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]' : 'text-muted hover:text-fg',
            )}
          >
            {t.label}
            {t.count !== undefined && <span className={cx('text-[12.5px]', on ? 'text-brand-text' : 'text-faint')}>{t.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export const tabPanelProps = (idBase: string, value: string) => ({ role: 'tabpanel' as const, id: `${idBase}-panel`, 'aria-labelledby': `${idBase}-tab-${value}`, tabIndex: 0 })
