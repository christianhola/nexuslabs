import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type AccordionItem = { q: string; a: ReactNode }

/** Stack of disclosure rows; one open at a time. The plus turns into an ×. */
export function Accordion({ items, defaultOpen = 0, className }: { items: AccordionItem[]; defaultOpen?: number | null; className?: string }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const id = useId()
  return (
    <div className={cx('flex flex-col gap-3', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={cx('depth relative rounded-card-sm transition-colors', isOpen ? 'bg-surface-2' : 'bg-surface')}>
            <h3>
              <button
                type="button"
                id={`${id}-b${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                className="flex min-h-[64px] w-full items-center gap-4 rounded-card-sm px-6 py-4 text-left text-[17px] font-medium tracking-[-0.015em]"
              >
                {item.q}
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 26 }}
                  className={cx('ml-auto grid size-8 shrink-0 place-items-center rounded-full round', isOpen ? 'bg-violet' : 'bg-white/[0.06]')}
                >
                  <Plus className="size-4" aria-hidden />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-p${i}`}
                  role="region"
                  aria-labelledby={`${id}-b${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-[15px] leading-relaxed text-muted text-pretty">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
