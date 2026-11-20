import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useId, useRef } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { useFocusTrap } from '../lib/useFocusTrap'

/*
  A modal side drawer (mobile nav, integration details). Traps Tab, closes on
  Esc or a backdrop click, locks page scroll and hands focus back.
*/
export function Sheet({ open, onClose, title, children, side = 'right', className }: { open: boolean; onClose: () => void; title: string; children: ReactNode; side?: 'right' | 'left'; className?: string }) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(open, panel, onClose)
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className={cx('absolute inset-y-0 flex w-[min(420px,100%)] flex-col overflow-y-auto bg-paper p-5 shadow-float', side === 'right' ? 'right-0' : 'left-0', className)}
          >
            <div className="flex items-center justify-between pb-3">
              <h2 id={titleId} className="font-display text-[18px] font-medium text-ink">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="grid size-11 place-items-center rounded-[10px] bg-wash-2 text-ink transition-colors hover:bg-line focus-visible:outline-2 focus-visible:outline-flame-strong"
                aria-label={`Close ${title.toLowerCase()}`}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
