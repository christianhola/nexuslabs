import { useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cx } from '../lib/cx'
import { useFocusTrap } from '../lib/useFocusTrap'
import { IconButton } from './Button'

/** Centered dialog: traps focus, Esc and backdrop close it, focus returns to the opener. */
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div aria-hidden className="absolute inset-0 animate-fade bg-ink/25 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-desc' : undefined}
        className={cx('relative flex max-h-[92vh] w-full animate-pop flex-col overflow-hidden rounded-t-2xl bg-paper shadow-pop sm:rounded-2xl', size === 'sm' ? 'sm:max-w-[420px]' : 'sm:max-w-[560px]')}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 pt-5 pb-4">
          <div>
            <h2 id="modal-title" className="text-[19px] font-semibold tracking-[-0.025em]">
              {title}
            </h2>
            {description && (
              <p id="modal-desc" className="mt-1 text-[14px] text-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton label="Close" size="sm" onClick={onClose} className="-mr-2">
            <X aria-hidden className="size-4.5" />
          </IconButton>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-panel px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
