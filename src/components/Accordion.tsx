import { Plus } from 'lucide-react'
import { useId, useState } from 'react'

import { cx } from '../lib/cx'

export function Accordion({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)
  const id = useId()
  return (
    <div className={cx('border-t border-line-strong', className)}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q} className="border-b border-line-strong">
            <h3>
              <button
                type="button"
                id={`${id}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left text-[17px] font-medium tracking-[-0.02em] text-ink"
              >
                {it.q}
                <Plus className={cx('size-4 shrink-0 transition-transform duration-[var(--duration-base)]', isOpen && 'rotate-45')} strokeWidth={1.5} aria-hidden />
              </button>
            </h3>
            <div
              id={`${id}-p${i}`}
              role="region"
              aria-labelledby={`${id}-b${i}`}
              hidden={!isOpen}
              className="pb-5 text-[15px] text-muted"
            >
              {it.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
