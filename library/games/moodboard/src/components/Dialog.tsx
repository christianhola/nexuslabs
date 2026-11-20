import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cx } from '../lib/cx'
import { IconButton } from './IconButton'

/**
 * Modal dialog: traps focus, closes on Esc and backdrop click, and gives
 * focus back to whatever opened it.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'sm',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'lg'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const el = ref.current
    const focusables = () =>
      [...(el?.querySelectorAll<HTMLElement>('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? [])].filter(
        (n) => !n.hasAttribute('disabled'),
      )
    const first = el?.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0]
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      } else if (e.key === 'Tab') {
        const els = focusables()
        if (!els.length) return
        const a = els[0]!
        const z = els[els.length - 1]!
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault()
          z.focus()
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault()
          a.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      opener?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div aria-hidden className="absolute inset-0 animate-fade bg-black/25 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cx(
          'relative flex max-h-[calc(100dvh-32px)] w-full animate-pop flex-col rounded-[16px] bg-surface shadow-[var(--shadow-card-lift)]',
          size === 'sm' ? 'max-w-[420px]' : 'max-w-[720px]',
        )}
      >
        <div className="flex items-start gap-3 px-6 pb-2 pt-5">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[19px] font-medium tracking-[-0.02em] text-ink">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-[14px] leading-[1.45] text-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton label="Close" size="sm" tooltip={false} onClick={onClose} className="-mr-2 -mt-1">
            <X size={17} />
          </IconButton>
        </div>
        {children && <div className="no-scrollbar min-h-0 overflow-y-auto px-6 py-3">{children}</div>}
        {footer && <div className="flex justify-end gap-2 px-6 pb-5 pt-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
