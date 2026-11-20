import { useMemo, useState } from 'react'
import { CornerDownLeft } from 'lucide-react'

import { ChipButton } from '../components/Chip'
import { ItemRow } from '../components/ItemRow'
import { QueryChips } from '../components/QueryChips'
import { SectionHeading } from '../components/SectionHeading'
import { FINDING } from '../content'
import { seedLibrary } from '../lib/library'
import { parseQuery, searchItems } from '../lib/search'

export function Finding() {
  const lib = useMemo(() => seedLibrary(), [])
  const [q, setQ] = useState(FINDING.tries[0])
  const parsed = useMemo(() => parseQuery(q, lib.items, lib.collections), [q, lib])
  const hits = useMemo(() => searchItems(lib.items, parsed), [lib, parsed])
  return (
    <section id="finding" aria-labelledby="finding-title" className="scroll-mt-6 py-[120px]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] items-start gap-14 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div>
          <SectionHeading id="finding-title" align="left" eyebrow={FINDING.eyebrow} title={FINDING.title} lead={FINDING.lead} />
          <ul className="mt-10 flex flex-col gap-6">
            {FINDING.points.map((p, i) => (
              <li key={p.title} className="flex gap-4">
                <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-lime text-[14px] font-semibold">{i + 1}</span>
                <span>
                  <span className="block text-[17px] font-semibold tracking-[-0.02em]">{p.title}</span>
                  <span className="mt-1 block text-[16px] leading-[1.55] text-muted">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[22px] bg-panel p-3 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-4">
          <div className="rounded-[18px] bg-paper p-5 shadow-pop ring-1 ring-line sm:p-6">
            <p id="tries-label" className="text-[14px] text-muted">
              Try a half-memory
            </p>
            <div role="group" aria-labelledby="tries-label" className="mt-3 flex flex-wrap gap-2">
              {FINDING.tries.map((t) => (
                <ChipButton key={t} tone={t === q ? 'active' : 'outline'} aria-pressed={t === q} onClick={() => setQ(t)} className={t === q ? 'font-medium text-ink' : undefined}>
                  {t}
                </ChipButton>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-white px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--color-line-2)]">
              <span className="min-w-0 flex-1 truncate text-[17px] tracking-[-0.015em]" aria-live="polite">
                {q}
              </span>
              <CornerDownLeft aria-hidden className="size-4 text-subtle" />
            </div>
            <div className="mt-4 min-h-[38px]">
              <QueryChips chips={parsed.chips} off={new Set()} label="Read as" />
            </div>
            <ul className="mt-4 flex flex-col border-t border-line pt-3" aria-label="Matches">
              {hits.slice(0, 3).map(({ item }) => (
                <li key={item.id}>
                  <ItemRow item={item} href={`/app/item/${item.id}`} />
                </li>
              ))}
              {!hits.length && <li className="px-3 py-6 text-[15px] text-muted">No matches in the demo shelf.</li>}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
