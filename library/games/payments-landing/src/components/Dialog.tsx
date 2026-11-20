import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cx } from '../lib/cx'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/*
  Modal dialog or side drawer. Traps Tab inside, closes on Esc or backdrop
  click, locks page scroll, and returns focus to whatever opened it.
*/
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  variant = 'modal',
  className,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  variant?: 'modal' | 'drawer'
  className?: string
}) {
  const panel = useRef<HTMLDivElement>(null)
  const restore = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descId = useId()
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (!open) return
    restore.current = document.activeElement as HTMLElement | null
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => {
      const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE)
      ;(first ?? panel.current)?.focus()
    })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close.current()
        return
      }
      if (e.key !== 'Tab' || !panel.current) return
      const els = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null)
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
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
      html.style.overflow = prev
      restore.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            initial={variant === 'drawer' ? { x: '100%' } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={variant === 'drawer' ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={variant === 'drawer' ? { x: '100%' } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cx(
              'absolute bg-white shadow-float outline-none',
              variant === 'drawer'
                ? 'inset-y-0 right-0 flex w-full max-w-[380px] flex-col p-5'
                : 'left-1/2 top-1/2 max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[480px] overflow-y-auto rounded-card p-6 sm:p-8',
              className,
            )}
            style={variant === 'modal' ? { translate: '-50% -50%' } : undefined}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="text-[20px] font-medium tracking-[-0.02em] text-ink">
                  {title}
                </h2>
                {description && (
                  <p id={descId} className="mt-1 text-[14px] leading-6 text-muted">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-1 grid size-10 shrink-0 place-items-center rounded-control-sm text-muted hover:bg-mist hover:text-ink"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
