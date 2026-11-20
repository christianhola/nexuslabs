import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { cx } from '../lib/cx'
import { Link, useLocation } from '../lib/router'

/*
  A disclosure dropdown for the top bar ("Features"): a button with
  aria-expanded and a panel of links. Opens on click or hover, Esc closes and
  returns focus, a click outside or tabbing away closes it.
*/
export function NavDropdown({ label, items, active, force }: { label: string; items: readonly { label: string; href: string; description: string }[]; active?: boolean; force?: 'open' }) {
  const [open, setOpen] = useState(force === 'open')
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const id = useId()
  const { path } = useLocation()
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (force !== 'open') setOpen(false)
  }, [path, force])
  useEffect(() => {
    if (!open || force === 'open') return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, force])

  const hover = (v: boolean) => {
    if (force === 'open' || !window.matchMedia('(hover: hover)').matches) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(v), v ? 60 : 160)
  }

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={() => hover(true)}
      onPointerLeave={() => hover(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault()
          window.clearTimeout(timer.current)
          setOpen(false)
          btn.current?.focus()
        }
      }}
      onBlur={(e) => {
        if (force !== 'open' && !root.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={(e) => {
          window.clearTimeout(timer.current)
          // A mouse click on a hover device keeps the hover-opened panel open;
          // keyboard activation (detail 0) and touch toggle it.
          if (e.detail > 0 && window.matchMedia('(hover: hover)').matches) setOpen(true)
          else setOpen((o) => !o)
        }}
        className={cx(
          'inline-flex h-10 items-center gap-1.5 rounded-[10px] px-3.5 text-[15px] text-ink transition-colors hover:bg-ink/[0.04] focus-visible:outline-2 focus-visible:outline-flame-strong',
          active && 'text-flame-ink',
        )}
      >
        {label}
        <ChevronDown className={cx('size-4 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 top-[calc(100%+8px)] z-40 w-[340px] -translate-x-1/2 rounded-[16px] bg-card p-2 shadow-pop"
          >
            <ul>
              {items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} className="flex flex-col gap-0.5 rounded-[11px] px-3.5 py-3 hover:bg-wash focus-visible:bg-wash focus-visible:outline-2 focus-visible:outline-flame-strong" aria-current={path === it.href ? 'page' : undefined}>
                    <span className="font-display text-[15px] font-medium text-ink">{it.label}</span>
                    <span className="text-[13.5px] text-muted">{it.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
