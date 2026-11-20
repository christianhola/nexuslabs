import { Plus } from 'lucide-react'
import { useId, useState } from 'react'

import { cx } from '../lib/cx'

export function Accordion({ items, defaultOpen }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null)
  const id = useId()
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${id}-b${i}`}
                aria-expanded={on}
                aria-controls={`${id}-p${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-[18px] font-medium tracking-[-0.015em] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {it.q}
                <span className={cx('grid size-8 shrink-0 place-items-center rounded-[8px] border transition-[background-color,border-color] duration-300', on ? 'border-ink bg-mint' : 'border-line')}>
                  <Plus className={cx('size-4 transition-transform duration-300 ease-[var(--ease-brand)]', on && 'rotate-45')} aria-hidden />
                </span>
              </button>
            </h3>
            <div id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} hidden={!on} className="pb-6 pr-12 text-[16px] leading-relaxed text-muted">
              {it.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
