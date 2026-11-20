import { useId, useState } from 'react'
import { Plus } from 'lucide-react'

import { cx } from '../lib/cx'

export function Accordion({ items, defaultOpen = 0 }: { items: { q: string; a: string }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const base = useId()
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${base}-h${i}`}
                aria-expanded={on}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left text-[17px] font-medium text-ink"
              >
                {it.q}
                <Plus aria-hidden className={cx('size-5 shrink-0 text-teal-ink transition-transform duration-200', on && 'rotate-45')} />
              </button>
            </h3>
            <div
              id={`${base}-p${i}`}
              role="region"
              aria-labelledby={`${base}-h${i}`}
              hidden={!on}
              className="pb-5 pr-10 text-[15px] leading-[1.65] text-muted"
            >
              {it.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
