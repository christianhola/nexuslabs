import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { useId, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'

import { cx } from '../lib/cx'
import { useFocusTrap } from '../lib/useFocusTrap'

/*
  A centred dialog (publish confirmation, checkout). Same contract as
  <Sheet>: focus trapped, Esc and the backdrop close it, focus restored.
*/
export function Modal({ open, onClose, title, description, children, className, initialFocus }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; className?: string; initialFocus?: RefObject<HTMLElement | null> }) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descId = useId()
  useFocusTrap(open, panel, onClose, initialFocus)
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="fixed inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cx('relative w-full max-w-[460px] rounded-[var(--radius-panel)] bg-card p-6 shadow-float sm:p-7', className)}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id={titleId} className="font-display text-[21px] font-medium tracking-[-0.02em] text-ink">
                  {title}
                </h2>
                {description ? (
                  <p id={descId} className="mt-1 text-[14.5px] text-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              <button type="button" onClick={onClose} aria-label="Close dialog" className="-mr-2 -mt-2 grid size-10 shrink-0 place-items-center rounded-[10px] text-muted hover:bg-wash-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="mt-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
