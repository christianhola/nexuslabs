import { Plus } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId, useState, type ReactNode } from 'react'

import { cx } from '../lib/cx'
import { ease } from '../lib/motion'

export type AccordionItem = { q: ReactNode; a: ReactNode }

/**
 * Disclosure list (FAQ). Each row is a real <button aria-expanded> that
 * controls a labelled region. `multiple` lets several rows stay open.
 */
export function Accordion({ items, multiple = false, defaultOpen = [], className }: { items: AccordionItem[]; multiple?: boolean; defaultOpen?: number[]; className?: string }) {
  const [open, setOpen] = useState<number[]>(defaultOpen)
  const base = useId()
  const reduce = useReducedMotion()

  function toggle(i: number) {
    setOpen((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : multiple ? [...cur, i] : [i]))
  }

  return (
    <div className={cx('border-t border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i)
        const buttonId = `${base}-b${i}`
        const panelId = `${base}-p${i}`
        return (
          <div key={i} className="border-b border-line">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="group flex min-h-14 w-full cursor-pointer items-center justify-between gap-6 rounded-control py-4 text-left text-[17px] font-semibold tracking-[-0.015em] text-ink outline-none transition-colors duration-150 is-hover:text-accent-ink is-focus:shadow-focus"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={cx(
                    'grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-[transform,background-color,border-color,color] duration-300 ease-out-expo group-hover:border-line-strong group-hover:text-ink',
                    isOpen && 'rotate-45 border-accent bg-accent text-white group-hover:border-accent group-hover:text-white',
                  )}
                >
                  <Plus className="size-4" strokeWidth={2.25} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="overflow-hidden"
                  initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease }}
                >
                  <div className="max-w-[640px] pb-5 pr-12 text-copy text-body">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
