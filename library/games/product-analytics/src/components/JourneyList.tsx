import { ChevronRight } from 'lucide-react'

import type { journeys } from '../content'
import { cx } from '../lib/cx'
import { Badge } from './Badge'

/* Ranked paths: the steps as pills, the share of sessions as a bar. */
export function JourneyList({ items }: { items: readonly (typeof journeys)[number][] }) {
  const max = Math.max(...items.map((j) => j.share), 1)
  return (
    <ol className="flex flex-col gap-2.5">
      {items.map((j) => (
        <li key={j.path.join('>')} className="rounded-[14px] border border-line bg-card p-3.5">
          <div className="flex flex-wrap items-center gap-1">
            {j.path.map((p, i) => (
              <span key={p} className="inline-flex items-center gap-1">
                {i ? <ChevronRight className="size-3.5 text-faint" aria-label="then" /> : null}
                <span className={cx('rounded-[7px] px-2 py-1 text-[12.5px] font-medium', i === j.path.length - 1 ? (j.outcome === 'converted' ? 'bg-lime text-ink' : 'bg-bad-soft text-bad') : 'bg-wash-2 text-ink')}>{p}</span>
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-wash-2" aria-hidden>
              <div className={cx('h-full rounded-full', j.outcome === 'converted' ? 'bg-leaf' : 'bg-[#d9654c]')} style={{ width: `${(j.share / max) * 100}%` }} />
            </div>
            <span className="whitespace-nowrap text-right text-[12.5px] tabular-nums text-muted">
              {j.share}%<span className="max-sm:sr-only"> of sessions</span>
            </span>
            <Badge tone={j.outcome === 'converted' ? 'ok' : 'bad'}>{j.outcome === 'converted' ? 'Converted' : 'Dropped'}</Badge>
          </div>
        </li>
      ))}
    </ol>
  )
}
