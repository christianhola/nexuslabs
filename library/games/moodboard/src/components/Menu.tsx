import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { cx } from '../lib/cx'

export type MenuItem =
  | { type?: 'item'; label: string; icon?: ReactNode; hint?: ReactNode; onSelect: () => void; danger?: boolean; disabled?: boolean; checked?: boolean }
  | { type: 'separator' }
  | { type: 'label'; label: string }

/**
 * A dropdown menu. The trigger is rendered by you through `trigger(props)` so
 * it can be any Button/IconButton. Arrow keys move, Enter/Space pick, Esc
 * closes and returns focus to the trigger.
 */
export function Menu({
  trigger,
  items,
  align = 'start',
  side = 'bottom',
  label,
  className,
}: {
  trigger: (props: { ref: (el: HTMLButtonElement | null) => void; onClick: () => void; 'aria-haspopup': 'menu'; 'aria-expanded': boolean; 'aria-controls': string }) => ReactNode
  items: MenuItem[]
  align?: 'start' | 'end'
  side?: 'bottom' | 'top'
  label: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const close = useCallback((focusTrigger = true) => {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }, [])

  const focusables = () => [...(listRef.current?.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]:not(:disabled)') ?? [])]

  useLayoutEffect(() => {
    if (open) focusables()[0]?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!listRef.current?.contains(t) && !triggerRef.current?.contains(t)) close(false)
    }
    window.addEventListener('pointerdown', onDown, true)
    return () => window.removeEventListener('pointerdown', onDown, true)
  }, [open, close])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const els = focusables()
    const i = els.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      els[(i + 1) % els.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      els[(i - 1 + els.length) % els.length]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      els[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      els[els.length - 1]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      close()
    } else if (e.key === 'Tab') {
      close(false)
    }
  }

  return (
    <div className={cx('relative inline-flex', className)}>
      {trigger({
        ref: (el) => {
          triggerRef.current = el
        },
        onClick: () => setOpen((o) => !o),
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': id,
      })}
      {open && (
        <div
          ref={listRef}
          id={id}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          className={cx(
            'absolute z-50 min-w-[220px] animate-pop rounded-[12px] bg-surface p-1.5 shadow-[var(--shadow-float)]',
            side === 'bottom' ? 'top-full mt-2 origin-top' : 'bottom-full mb-2 origin-bottom',
            align === 'start' ? 'left-0' : 'right-0',
          )}
        >
          {items.map((it, i) => {
            if (it.type === 'separator') return <div key={i} role="separator" className="my-1 h-px bg-line" />
            if (it.type === 'label')
              return (
                <div key={i} className="px-2.5 pb-1 pt-1.5 text-[11.5px] font-medium uppercase tracking-[0.06em] text-faint">
                  {it.label}
                </div>
              )
            return (
              <button
                key={i}
                type="button"
                role={it.checked === undefined ? 'menuitem' : 'menuitemradio'}
                aria-checked={it.checked}
                disabled={it.disabled}
                onClick={() => {
                  close()
                  it.onSelect()
                }}
                className={cx(
                  'flex h-9 w-full items-center gap-2.5 rounded-[8px] px-2.5 text-left text-[14px] outline-none transition-colors duration-100',
                  'hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none disabled:opacity-40',
                  it.danger ? 'text-danger' : 'text-ink',
                )}
              >
                <span className="flex size-4 shrink-0 items-center justify-center text-ink-2 [&>svg]:size-4">{it.icon}</span>
                <span className="min-w-0 flex-1 truncate">{it.label}</span>
                {it.checked && <span aria-hidden className="size-1.5 rounded-full bg-select" />}
                {it.hint && <span className="text-[12px] text-faint">{it.hint}</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
