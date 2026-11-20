import { useState } from 'react'

import { cx } from '../lib/cx'

export type DayStatus = 'ok' | 'degraded' | 'outage'

/* 90 thin bars, one per day. Status is never colour alone: the tooltip and the summary text name it. */
export function UptimeBars({ days, label }: { days: readonly { date: string; status: DayStatus; note?: string }[]; label: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const h = hover != null ? days[hover] : null
  return (
    <div className="relative">
      <div className="flex h-9 items-stretch gap-[2px]" role="img" aria-label={label}>
        {days.map((d, i) => (
          <span
            key={d.date}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            className={cx(
              'min-w-0 flex-1 rounded-[3px] transition-opacity',
              d.status === 'ok' && 'bg-[#8fd85d]',
              d.status === 'degraded' && 'bg-[#e5a33a]',
              d.status === 'outage' && 'bg-bad',
              hover != null && hover !== i && 'opacity-60',
              i < days.length - 45 && 'max-sm:hidden',
            )}
          />
        ))}
      </div>
      {h ? (
        <div className="pointer-events-none absolute bottom-[calc(100%+8px)] z-10 -translate-x-1/2 whitespace-nowrap rounded-[10px] bg-night px-2.5 py-1.5 text-[12px] text-on-dark shadow-pop" style={{ left: `${((hover! + 0.5) / days.length) * 100}%` }}>
          <span className="text-white/70">{h.date}</span> <span className="font-semibold">{h.status === 'ok' ? 'No incidents' : h.status === 'degraded' ? 'Degraded' : 'Outage'}</span>
          {h.note ? <span className="block text-white/70">{h.note}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
