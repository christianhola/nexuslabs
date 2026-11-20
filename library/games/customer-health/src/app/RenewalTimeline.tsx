import type { Account } from '../data'
import { cx } from '../lib/cx'
import { shortDate } from '../lib/format'
import { daysUntil } from '../lib/metrics'

function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Contract year on one line: start, quarterly reviews, notice deadline, renewal, and today. */
export function RenewalTimeline({ a }: { a: Account }) {
  const start = addDays(a.renewal, -365)
  const events = [
    { date: start, label: 'Contract start', kind: 'start' },
    { date: addDays(start, 91), label: 'QBR 1', kind: 'qbr' },
    { date: addDays(start, 182), label: 'QBR 2', kind: 'qbr' },
    { date: addDays(start, 273), label: 'QBR 3', kind: 'qbr' },
    { date: addDays(a.renewal, -60), label: 'Notice deadline', kind: 'notice' },
    { date: a.renewal, label: 'Renewal', kind: 'renewal' },
  ]
  const s = daysUntil(start)
  const e = daysUntil(a.renewal)
  const pos = (iso: string) => Math.min(100, Math.max(0, ((daysUntil(iso) - s) / (e - s)) * 100))
  const today = Math.min(100, Math.max(0, ((0 - s) / (e - s)) * 100))
  const toRenewal = e
  const toNotice = e - 60

  return (
    <div>
      <p className="text-[14px] leading-relaxed text-muted">
        {toRenewal < 0 ? (
          <>Renewal date passed {Math.abs(toRenewal)} days ago.</>
        ) : (
          <>
            Renews in <span className="tnum font-mono text-fg">{toRenewal}</span> days.{' '}
            {toNotice > 0 ? (
              <>
                Notice deadline in <span className={cx('tnum font-mono', toNotice <= 30 ? 'text-risk' : 'text-fg')}>{toNotice}</span> days.
              </>
            ) : (
              <span className="text-risk">Notice deadline has passed.</span>
            )}
          </>
        )}
      </p>
      <div className="scroll-thin -mx-1 overflow-x-auto px-1" tabIndex={0} role="region" aria-label="Contract timeline">
        <div className="relative mt-20 mb-14 min-w-[560px]">
          <div className="h-px bg-line" />
          <div className="absolute top-0 left-0 h-px origin-left animate-grow-x bg-fg/70" style={{ width: `${today}%` }} />
          <ol>
            {events.map((ev, i) => {
              const p = pos(ev.date)
              const past = daysUntil(ev.date) < 0
              const up = i % 2 === 0
              return (
                <li key={ev.label} className="absolute top-0 animate-fade" style={{ left: `${p}%`, animationDelay: `${200 + i * 70}ms` }}>
                  <span
                    aria-hidden="true"
                    className={cx(
                      'absolute top-0 block -translate-x-1/2 -translate-y-1/2 rounded-full',
                      ev.kind === 'renewal' ? 'size-3 bg-risk' : ev.kind === 'notice' ? 'size-2.5 border-[1.5px] border-risk bg-bg' : past ? 'size-2 bg-fg/70' : 'size-2 border border-fg/50 bg-bg',
                    )}
                  />
                  <span
                    className={cx(
                      'absolute w-max -translate-x-1/2 text-center',
                      up ? 'bottom-3' : 'top-3',
                      i === 0 && '!translate-x-0 !text-left',
                      i === events.length - 1 && '!-translate-x-full !text-right',
                    )}
                  >
                    <span className={cx('block text-[13px]', ev.kind === 'renewal' || ev.kind === 'notice' ? 'text-fg' : 'text-muted')}>{ev.label}</span>
                    <span className="tnum block font-mono text-[11.5px] text-muted">{shortDate(ev.date)}</span>
                  </span>
                </li>
              )
            })}
            <li className="absolute top-0 animate-fade" style={{ left: `${today}%` }}>
              <span aria-hidden="true" className="absolute -top-[58px] block h-[66px] w-px -translate-x-1/2 bg-fg/60" />
              <span className="caps absolute -top-[74px] -translate-x-1/2 rounded-full bg-fg px-2 py-0.5 text-[9.5px] tracking-[0.2em] whitespace-nowrap text-bg">Today</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
