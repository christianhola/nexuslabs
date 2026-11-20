import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cx } from '../lib/cx'
import { IconButton } from './Button'

/*
  Modal dialog or side drawer. Traps focus while open, closes on Esc or a
  backdrop click, locks page scroll and returns focus to whatever opened it.
*/
export function Dialog({ open, onClose, title, description, children, side = 'center', className }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; side?: 'center' | 'right'; className?: string }) {
  const id = useId()
  const box = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusables = () => Array.from(box.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])') ?? [])
    requestAnimationFrame(() => (focusables()[1] ?? focusables()[0] ?? box.current)?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
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
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      opener?.focus?.()
    }
  }, [open])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-t`}
        aria-describedby={description ? `${id}-d` : undefined}
        tabIndex={-1}
        className={cx(
          'absolute flex flex-col overflow-y-auto bg-card shadow-[var(--shadow-pop)] outline-none',
          side === 'center' ? 'left-1/2 top-1/2 max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 animate-pop-in rounded-[var(--radius-card)] p-6' : 'inset-y-0 right-0 w-full max-w-[400px] p-5',
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id={`${id}-t`} className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
              {title}
            </h2>
            {description ? (
              <p id={`${id}-d`} className="mt-1 text-[14.5px] text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1">
            <X aria-hidden />
          </IconButton>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
