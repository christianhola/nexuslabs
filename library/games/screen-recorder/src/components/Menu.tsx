import { Check } from 'lucide-react'
import { type KeyboardEvent, type ReactNode, useRef, useState } from 'react'

import { cn } from '@/lib/cn'
import { Popover } from './Popover'

export type MenuItem = { id: string; label: string; icon?: ReactNode; danger?: boolean; checked?: boolean; disabled?: boolean; onSelect: () => void } | { id: string; separator: true }

/**
 * Anchored action menu. `trigger` receives the props to spread on its button
 * (ref, aria attributes, click). Arrow keys move, Enter/Space pick, Esc closes.
 */
export function Menu({
  label,
  items,
  trigger,
  align = 'end',
  width = 220,
}: {
  label: string
  items: MenuItem[]
  trigger: (p: { ref: React.RefObject<HTMLButtonElement | null>; 'aria-expanded': boolean; 'aria-haspopup': 'menu'; onClick: () => void }) => ReactNode
  align?: 'start' | 'end'
  width?: number
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const els = [...(list.current?.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]:not(:disabled)') ?? [])]
    const i = els.indexOf(document.activeElement as HTMLButtonElement)
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? els.length - 1 : e.key === 'ArrowDown' ? (i + 1) % els.length : (i - 1 + els.length) % els.length
    els[n]?.focus()
  }

  return (
    <>
      {trigger({ ref, 'aria-expanded': open, 'aria-haspopup': 'menu', onClick: () => setOpen((v) => !v) })}
      <Popover open={open} onClose={() => setOpen(false)} anchor={ref} align={align} width={width} label={label}>
        <div ref={list} role="menu" aria-label={label} onKeyDown={onKey}>
          {items.map((it) =>
            'separator' in it ? (
              <div key={it.id} role="separator" className="my-1 h-px bg-line" />
            ) : (
              <button
                key={it.id}
                type="button"
                role={it.checked !== undefined ? 'menuitemradio' : 'menuitem'}
                aria-checked={it.checked}
                disabled={it.disabled}
                onClick={() => {
                  setOpen(false)
                  it.onSelect()
                }}
                className={cn(
                  'flex h-9 w-full items-center gap-2.5 rounded-[9px] px-2.5 text-left text-[13.5px] transition-colors duration-100 outline-none pointer-coarse:h-10',
                  'hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:outline-none disabled:opacity-40',
                  it.danger ? 'text-ember-text' : 'text-fg',
                )}
              >
                {it.icon && <span className="text-muted">{it.icon}</span>}
                <span className="flex-1 truncate">{it.label}</span>
                {it.checked && <Check className="size-4 text-fg" />}
              </button>
            ),
          )}
        </div>
      </Popover>
    </>
  )
}
