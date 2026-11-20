import { X } from 'lucide-react'
import { useRef } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { useFocusTrap } from '../lib/useFocusTrap'

/** A right-hand drawer (mobile nav). Traps focus, closes on Esc or backdrop, restores focus. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60]">
      <div aria-hidden className="absolute inset-0 animate-[pop_200ms_ease-out_both] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx('absolute inset-y-0 right-0 flex w-[min(360px,88vw)] flex-col gap-6 overflow-y-auto border-l border-line bg-panel p-5 shadow-float animate-[rise_320ms_var(--ease-brand)_both]')}
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-[15px] font-semibold text-muted">{title}</p>
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-11 place-items-center rounded-full border border-line text-white hover:bg-white/[0.08]">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
