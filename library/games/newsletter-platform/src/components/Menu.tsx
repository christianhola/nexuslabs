import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/*
  A disclosure dropdown for the nav ("Product"). Opens on click or Enter,
  closes on Esc, outside click or route change, and returns focus.
*/
export function NavMenu({ label, items }: { label: string; items: { href: string; label: string; body: string }[] }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    const onFocus = (e: FocusEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('focusin', onFocus)
    }
  }, [open])
  return (
    <div ref={root} className="relative">
      <button ref={btn} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="inline-flex h-10 items-center gap-1 rounded-[6px] px-3 text-[15.5px] font-medium text-body transition-colors hover:text-white aria-expanded:text-white">
        {label}
        <ChevronDown className={cx('size-3.5 transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 mt-2 w-[340px] rounded-[12px] border border-line-strong bg-panel p-2 shadow-[var(--shadow-pop)]"
          >
            <ul>
              {items.map((it) => (
                <li key={it.href}>
                  <Link href={it.href} onClick={() => setOpen(false)} className="block rounded-[8px] px-3 py-2.5 hover:bg-white/[0.05] focus-visible:outline-offset-[-2px]">
                    <span className="block text-[15px] font-medium text-ink">{it.label}</span>
                    <span className="block text-[13px] text-muted">{it.body}</span>
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
