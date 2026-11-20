import { Users } from 'lucide-react'

import type { Template } from '../content'
import { images } from '../content'
import { Badge } from './Badge'

/* A gallery tile: cover, name, category and how many writers use it. */
export function TemplateCard({ t, onOpen }: { t: Template; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel text-left transition-[transform,border-color] duration-300 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:border-line-strong focus-visible:outline-offset-2">
      <div className="relative aspect-[4/3] overflow-hidden bg-panel-2 p-4">
        <div className="mx-auto flex h-full w-[78%] flex-col rounded-t-[6px] bg-paper px-3 pt-3 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] transition-transform duration-500 ease-[var(--ease-brand)] group-hover:-translate-y-1">
          <span className="h-1.5 w-10 rounded-full" style={{ background: t.accent }} aria-hidden />
          <span className={t.font === 'serif' ? 'mt-2 line-clamp-2 font-serif text-[15px] font-semibold leading-tight text-paper-ink' : 'mt-2 line-clamp-2 font-display text-[14px] font-extrabold leading-tight text-paper-ink'}>{t.issue.title}</span>
          <img src={images[t.image]} alt="" loading="lazy" className="mt-2 aspect-[16/9] w-full rounded-[3px] object-cover" />
          <span className="mt-2 h-1 w-full rounded-full bg-[#e6e2dc]" aria-hidden />
          <span className="mt-1.5 h-1 w-4/5 rounded-full bg-[#e6e2dc]" aria-hidden />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t border-line p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[16px] font-semibold text-ink">{t.name}</span>
          <Badge tone={t.category === 'Paid' ? 'pink' : 'neutral'}>{t.category}</Badge>
        </div>
        <p className="line-clamp-2 text-[14px] text-muted">{t.description}</p>
        <p className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px] text-faint">
          <Users className="size-3.5" aria-hidden />
          {t.uses.toLocaleString('en-US')} writers
        </p>
      </div>
    </button>
  )
}
