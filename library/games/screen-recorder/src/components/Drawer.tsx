import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/cn'
import { IconButton } from './Button'
import { useFocusTrap } from './useFocusTrap'

/** Side sheet (mobile nav, the library sidebar on small screens). Focus is trapped and restored; Esc and the scrim close it. */
export function Drawer({ open, onClose, title, side = 'right', children, className }: { open: boolean; onClose: () => void; title: string; side?: 'left' | 'right'; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])
  const x = side === 'right' ? '100%' : '-100%'
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn('absolute top-0 bottom-0 flex w-[min(340px,88vw)] flex-col bg-surface shadow-modal outline-none', side === 'right' ? 'right-0' : 'left-0', className)}
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line pr-3 pl-5">
              <p className="text-[15px] font-medium">{title}</p>
              <IconButton label="Close" onClick={onClose}>
                <X className="size-5" />
              </IconButton>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
