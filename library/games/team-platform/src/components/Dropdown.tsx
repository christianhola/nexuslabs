import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  A disclosure dropdown: a button that opens a panel of links or buttons.
  Arrow keys move between the items, Esc closes and returns focus to the
  button, and clicking outside or tabbing away closes it.
*/
export function Dropdown({
  label,
  children,
  align = 'left',
  triggerClassName,
  panelClassName,
  icon,
  ariaLabel,
}: {
  label: ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
  triggerClassName?: string
  panelClassName?: string
  icon?: ReactNode
  ariaLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const items = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('a,button') ?? [])
  const close = (focus = true) => {
    setOpen(false)
    if (focus) btn.current?.focus()
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.preventDefault()
      close()
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        requestAnimationFrame(() => items()[0]?.focus())
        return
      }
      const list = items()
      const i = list.indexOf(document.activeElement as HTMLElement)
      const n = e.key === 'ArrowDown' ? (i + 1) % list.length : (i - 1 + list.length) % list.length
      list[n]?.focus()
    }
  }

  return (
    <div
      ref={root}
      className="relative"
      onKeyDown={onKey}
      onBlur={(e) => {
        if (open && !root.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className={cx('inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink', triggerClassName)}
      >
        {icon}
        {label}
        <ChevronDown className={cx('size-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      <div
        ref={panel}
        id={id}
        hidden={!open}
        className={cx('absolute top-[calc(100%+10px)] z-50 animate-pop-in rounded-[16px] border border-line bg-card p-2 shadow-[var(--shadow-pop)]', align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left', panelClassName)}
      >
        {children(() => close())}
      </div>
    </div>
  )
}
