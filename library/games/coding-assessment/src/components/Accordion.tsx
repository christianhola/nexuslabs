import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '../lib/cx'

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  return (
    <div className="divide-y divide-white/7 border-y border-white/7">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button type="button" id={`${base}-b${i}`} aria-expanded={on} aria-controls={`${base}-p${i}`} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-4 rounded-lg py-5 text-left text-[17px] text-fg">
                {it.q}
                <ChevronDown aria-hidden className={cx('size-5 shrink-0 text-muted transition-transform duration-300', on && 'rotate-180')} />
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} hidden={!on} className="pb-5 text-[15.5px] leading-relaxed text-muted">
              {it.a}
            </div>
          </div>
        )
      })}
    </div>
  )
}
