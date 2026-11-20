import { useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cx } from '../lib/cx'
import { useFocusTrap } from '../lib/useFocusTrap'
import { IconButton } from './Button'

/** A side sheet. Focus is trapped inside; Escape or the backdrop closes it and focus returns to the opener. */
export function Drawer({ open, onClose, title, children, footer, side = 'right', className }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; side?: 'right' | 'left'; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div aria-hidden className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cx('absolute top-0 bottom-0 flex w-full max-w-[460px] animate-pop flex-col bg-surface shadow-float', side === 'right' ? 'right-0 border-l' : 'left-0 border-r', className)}
      >
        <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
          <h2 id="drawer-title" className="text-[18px] font-medium">
            {title}
          </h2>
          <IconButton label="Close" onClick={onClose}>
            <X className="size-5" />
          </IconButton>
        </div>
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="border-t px-5 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
