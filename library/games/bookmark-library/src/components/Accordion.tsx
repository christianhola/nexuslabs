import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

import { cx } from '../lib/cx'

export function Accordion({ items, defaultOpen = 0 }: { items: Array<{ q: string; a: string }>; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const base = useId()
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[18px] font-medium tracking-[-0.02em] hover:text-ink-2"
              >
                {it.q}
                <span className={cx('grid size-8 shrink-0 place-items-center rounded-full bg-chip transition-transform duration-(--duration-base) ease-out-soft', isOpen && 'rotate-45 bg-lime')}>
                  <Plus aria-hidden className="size-4" />
                </span>
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} hidden={!isOpen} className="pr-14 pb-6 text-[16px] leading-[1.6] text-muted">
              {it.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
