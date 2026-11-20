import { useState } from 'react'

import { cx } from '../lib/cx'

/*
  Cohort retention: rows are signup weeks, columns weeks since. One green
  ramp, light to dark, for magnitude; cells beat or miss the baseline
  (average of that column) get a thin ring. Hover or focus a cell for its
  numbers.
*/
const ramp = ['#f1f8ea', '#dcf2c8', '#bfe6a0', '#9fd877', '#7fc356', '#5ea53b', '#3f7d23']

function shade(v: number) {
  if (v >= 99) return '#2a5a12'
  const t = Math.min(1, Math.max(0, (v - 30) / 40))
  return ramp[Math.round(t * (ramp.length - 1))]!
}

export function RetentionGrid({ cohorts, compact, className }: { cohorts: readonly { label: string; size: number; values: readonly number[] }[]; compact?: boolean; className?: string }) {
  const cols = Math.max(...cohorts.map((c) => c.values.length))
  const base = Array.from({ length: cols }, (_, j) => {
    const vs = cohorts.map((c) => c.values[j]).filter((v): v is number => v != null)
    return vs.reduce((a, b) => a + b, 0) / vs.length
  })
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null)
  const h = hover ? cohorts[hover.r] : null
  return (
    <div className={cx('relative', className)}>
      <table className="w-full table-fixed border-separate border-spacing-[3px] text-[12px]">
        <caption className="sr-only">Weekly retention by signup cohort, percent of the cohort still active</caption>
        <thead>
          <tr>
            <th scope="col" className={cx('text-left font-medium text-faint', compact ? 'w-[56px]' : 'w-[92px]')}>
              Cohort
            </th>
            {Array.from({ length: cols }, (_, j) => (
              <th key={j} scope="col" className="pb-1 text-center font-medium text-faint">
                {compact ? `W${j}` : `Week ${j}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cohorts.map((c, r) => (
            <tr key={c.label}>
              <th scope="row" className="whitespace-nowrap text-left font-medium text-body">
                {c.label}
                {!compact ? <span className="block text-[11px] font-normal text-faint">{c.size.toLocaleString('en-US')} people</span> : null}
              </th>
              {Array.from({ length: cols }, (_, j) => {
                const v = c.values[j]
                if (v == null) return <td key={j} className="rounded-[6px] bg-wash" aria-label="No data yet" />
                const delta = j ? v - base[j]! : 0
                return (
                  <td
                    key={j}
                    tabIndex={compact ? -1 : 0}
                    onPointerEnter={() => setHover({ r, c: j })}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover({ r, c: j })}
                    onBlur={() => setHover(null)}
                    className={cx(
                      'rounded-[6px] text-center font-semibold tabular-nums outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ink',
                      compact ? 'h-7' : 'h-10',
                      Math.abs(delta) >= 4 && 'ring-1 ring-inset ring-ink/40',
                    )}
                    style={{ background: shade(v), color: ['#3f7d23', '#2a5a12'].includes(shade(v)) ? '#ffffff' : 'var(--color-ink)' }}
                  >
                    {v}%
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {h && hover && !compact ? (
        <div className="pointer-events-none absolute right-0 top-0 rounded-[12px] bg-night px-3 py-2 text-[12.5px] text-on-dark shadow-pop" role="status">
          <span className="text-white/70">{h.label} cohort, week {hover.c}:</span> <span className="font-semibold">{h.values[hover.c]}%</span>
          {hover.c ? <span className="text-white/70"> ({((h.values[hover.c]! - base[hover.c]!) >= 0 ? '+' : '') + (h.values[hover.c]! - base[hover.c]!).toFixed(1)} pts vs average)</span> : null}
        </div>
      ) : null}
    </div>
  )
}
