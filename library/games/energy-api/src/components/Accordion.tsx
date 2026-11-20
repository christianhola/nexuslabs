import { AnimatePresence, motion } from 'motion/react'
import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

import { cx } from '../lib/cx'

export function Accordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <div className={cx('divide-y divide-line border-y border-line', className)}>
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${base}-q${i}`}
                aria-expanded={on}
                aria-controls={`${base}-a${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left text-[17px] font-medium tracking-[-0.015em]"
              >
                {it.q}
                <Plus className={cx('size-5 shrink-0 text-muted transition-transform duration-200', on && 'rotate-45')} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`${base}-a${i}`}
                  role="region"
                  aria-labelledby={`${base}-q${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[640px] pb-5 text-[15.5px] leading-[1.65] text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
