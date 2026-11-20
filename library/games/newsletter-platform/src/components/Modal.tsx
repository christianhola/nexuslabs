import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cx } from '../lib/cx'
import { useReducedMotion } from '../lib/useReducedMotion'
import { IconButton } from './Button'

const focusable = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/*
  A dialog (centered) or a drawer (`side="right"`). Focus moves in on open,
  is trapped while open and returns to the opener on close; Esc and the
  backdrop close it. Background scroll is locked.
*/
export function Modal({ open, onClose, title, description, children, footer, side = 'center', width = 'md' }: { open: boolean; onClose: () => void; title: ReactNode; description?: ReactNode; children: ReactNode; footer?: ReactNode; side?: 'center' | 'right'; width?: 'sm' | 'md' | 'lg' }) {
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const id = useId()
  const reduce = useReducedMotion()
  // Read onClose through a ref so a parent re-render never re-runs the
  // focus effect (which would bounce focus to the opener and back).
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (!open) return
    opener.current = document.activeElement as HTMLElement
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => {
      const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(focusable)
      first?.focus()
    })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close.current()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(focusable)).filter((el) => el.offsetParent !== null || el === document.activeElement)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      opener.current?.focus?.()
    }
  }, [open])

  const widths = { sm: 'max-w-[440px]', md: 'max-w-[560px]', lg: 'max-w-[920px]' }
  const t = reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className={cx('fixed inset-0 z-[80] flex', side === 'right' ? 'justify-end' : 'items-end justify-center p-0 sm:items-center sm:p-6')}>
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t} onClick={() => close.current()} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-t`}
            aria-describedby={description ? `${id}-d` : undefined}
            initial={side === 'right' ? { x: 40, opacity: 0 } : { y: 24, opacity: 0, scale: 0.98 }}
            animate={side === 'right' ? { x: 0, opacity: 1 } : { y: 0, opacity: 1, scale: 1 }}
            exit={side === 'right' ? { x: 40, opacity: 0 } : { y: 16, opacity: 0, scale: 0.98 }}
            transition={t}
            className={cx(
              'relative flex max-h-[100dvh] w-full flex-col border border-line-strong bg-panel shadow-[var(--shadow-pop)]',
              side === 'right' ? 'h-full max-w-[420px] rounded-l-[var(--radius-card-lg)]' : cx(widths[width], 'max-h-[92dvh] rounded-t-[var(--radius-card-lg)] sm:rounded-[var(--radius-card-lg)]'),
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id={`${id}-t`} className="text-[18px] font-semibold text-ink">
                  {title}
                </h2>
                {description ? (
                  <p id={`${id}-d`} className="mt-1 text-[14px] text-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
                <X />
              </IconButton>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
            {footer ? <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4 sm:px-6">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
