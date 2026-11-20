import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** A small disclosure menu: click or Enter opens, Esc or outside click closes, focus returns to the trigger. */
export function Popover({ trigger, label, children, align = 'right' }: { trigger: ReactNode; label: string; children: (close: () => void) => ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const first = wrap.current?.querySelector<HTMLElement>('[data-menu] button, [data-menu] a')
    first?.focus()
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  const close = () => {
    setOpen(false)
    btn.current?.focus()
  }
  return (
    <div ref={wrap} className="relative">
      <button ref={btn} type="button" aria-label={label} aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="flex h-10 items-center gap-2 rounded-sm px-1 hover:bg-chip">
        {trigger}
      </button>
      {open && (
        <div id={id} data-menu className={cx('absolute top-full z-40 mt-2 w-60 animate-pop rounded-lg bg-paper p-1.5 shadow-pop ring-1 ring-line', align === 'right' ? 'right-0' : 'left-0')}>
          {children(close)}
        </div>
      )}
    </div>
  )
}

export function MenuItem({ children, onClick, tone, icon }: { children: ReactNode; onClick: () => void; tone?: 'danger'; icon?: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cx('flex h-10 w-full items-center gap-2.5 rounded-sm px-3 text-left text-[14.5px] hover:bg-chip', tone === 'danger' ? 'text-danger' : 'text-ink-2')}>
      {icon}
      {children}
    </button>
  )
}
