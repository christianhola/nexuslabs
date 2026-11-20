import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

import { cx } from '../lib/cx'

/* FAQ disclosure list. One item open at a time; buttons carry aria-expanded. */
export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
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
                className="flex min-h-[64px] w-full items-center justify-between gap-6 py-4 text-left text-[17px] font-medium text-ink hover:text-white focus-visible:outline-offset-4"
              >
                {it.q}
                <ChevronDown className={cx('size-5 shrink-0 text-muted transition-transform duration-300', on && 'rotate-180')} aria-hidden />
              </button>
            </h3>
            <div id={`${id}-p${i}`} role="region" aria-labelledby={`${id}-b${i}`} hidden={!on} className="pb-5 pr-10 text-[16px] leading-relaxed text-body">
              {it.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
