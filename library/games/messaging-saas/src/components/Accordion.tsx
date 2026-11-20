import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type AccordionItem = { id: string; title: string; body: ReactNode }

/** Disclosure list: each row is a button with aria-expanded controlling its panel. */
export function Accordion({ items, defaultOpen, className }: { items: AccordionItem[]; defaultOpen?: string; className?: string }) {
  const [open, setOpen] = useState<string | undefined>(defaultOpen)
  const base = useId()
  return (
    <div className={cx('divide-y divide-line border-y border-line', className)}>
      {items.map((it) => {
        const isOpen = open === it.id
        const panel = `${base}-${it.id}`
        return (
          <div key={it.id}>
            <h3 className="font-sans">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? undefined : it.id)}
                className="group flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left text-[17px] font-medium text-white transition-colors hover:text-cobalt-text"
              >
                {it.title}
                <span className={cx('grid size-8 shrink-0 place-items-center rounded-full border border-line-strong transition-[transform,background-color] duration-300 ease-brand', isOpen && 'rotate-45 bg-white text-bg')}>
                  <Plus aria-hidden className="size-4" />
                </span>
              </button>
            </h3>
            <div id={panel} role="region" aria-label={it.title} hidden={!isOpen} className="pb-6 pr-14 text-[15px] leading-[1.7] text-muted">
              {it.body}
            </div>
          </div>
        )
      })}
    </div>
  )
}
