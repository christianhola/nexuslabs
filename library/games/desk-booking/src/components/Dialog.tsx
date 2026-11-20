import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cn } from '../lib/cn'
import { useFocusTrap } from '../lib/focus'
import { duration, ease } from '../lib/motion'
import { IconButton } from './Button'

/**
  Modal dialog (or a side drawer with `side`). Traps focus, closes on Esc and
  on backdrop click, and puts focus back where it was.
*/
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side,
  size = 'md',
  initialFocus,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  side?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  initialFocus?: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  useFocusTrap(ref, open, onClose, initialFocus)
  const width = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-md'
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-50 flex', side ? (side === 'left' ? 'justify-start' : 'justify-end') : 'items-end justify-center p-0 sm:items-center sm:p-6')}>
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base }}
            onClick={onClose}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-t`}
            aria-describedby={description ? `${id}-d` : undefined}
            tabIndex={-1}
            className={cn(
              'relative flex max-h-[100dvh] w-full flex-col bg-surface shadow-pop outline-none',
              side ? 'h-full max-w-[300px]' : cn(width, 'max-h-[92dvh] rounded-t-lg sm:rounded-lg'),
            )}
            initial={side ? { x: side === 'left' ? '-100%' : '100%' } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={side ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={side ? { x: side === 'left' ? '-100%' : '100%' } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: duration.base, ease }}
          >
            <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
              <div className="min-w-0">
                <h2 id={`${id}-t`} className="text-lg font-bold tracking-[-0.02em] text-ink">
                  {title}
                </h2>
                {description && (
                  <div id={`${id}-d`} className="mt-0.5 text-sm text-muted">
                    {description}
                  </div>
                )}
              </div>
              <IconButton label="Close" size="sm" onClick={onClose} className="-mt-1 -mr-2">
                <X className="size-4" />
              </IconButton>
            </div>
            {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>}
            {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line-soft px-5 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
