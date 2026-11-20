import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'

import { cx } from '../lib/cx'

/* FAQ list. One open at a time; buttons carry aria-expanded/controls. */
export function Accordion({ items, className, defaultOpen = 0 }: { items: readonly { q: string; a: string }[]; className?: string; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const id = useId()
  return (
    <div className={cx('divide-y divide-line rounded-[var(--radius-card)] border border-line bg-card shadow-card', className)}>
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`${id}-${i}`}
                id={`${id}-b${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-[16px] font-semibold tracking-[-0.015em] text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-leaf"
              >
                {it.q}
                <span className={cx('round grid size-8 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-300', on ? 'rotate-45 bg-lime' : 'bg-wash')}>
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on ? (
                <motion.div
                  id={`${id}-${i}`}
                  role="region"
                  aria-labelledby={`${id}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[640px] px-6 pb-6 text-[15px] leading-relaxed text-muted">{it.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
