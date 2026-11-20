import { useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { EmptyState } from '../components/EmptyState'
import { Switch } from '../components/Field'
import { Kpi } from '../components/Kpi'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { SegmentTag } from '../components/SegmentTag'
import { StatusTag } from '../components/StatusTag'
import { TextTabs } from '../components/TextTabs'
import { isoFromToday, TODAY, type Account } from '../data'
import { cx } from '../lib/cx'
import { dayMonth, money, monthName, shortDate } from '../lib/format'
import { healthFill } from '../lib/healthColor'
import { current, daysUntil, status } from '../lib/metrics'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'

type View = 'Timeline' | 'Calendar'
const DAYS = 90
const WEEKS = 13

function Tip({ a, threshold }: { a: Account; threshold: number }) {
  return (
    <>
      <span className="block text-[13.5px] font-medium">{a.name}</span>
      <span className="tnum mt-1 block font-mono text-[12px] text-muted">
        {money(a.arr)} · health <span className={cx(current(a) < threshold && 'text-risk')}>{current(a)}</span> · {shortDate(a.renewal)}
      </span>
    </>
  )
}

/** Weekly columns over the next 90 days; each account is a block sized by ARR and filled by health. */
function Timeline({ list, threshold }: { list: Account[]; threshold: number }) {
  const [hover, setHover] = useState<string | null>(null)
  const weeks = Array.from({ length: WEEKS }, (_, w) => {
    const items = list.filter((a) => Math.floor(daysUntil(a.renewal) / 7) === w).sort((a, b) => current(a) - current(b))
    return { w, items, arr: items.reduce((s, a) => s + a.arr, 0) }
  })
  const max = Math.max(1, ...weeks.map((w) => w.arr))
  const H = 260
  return (
    <div className="scroll-thin -mx-5 overflow-x-auto px-5 sm:-mx-9 sm:px-9" tabIndex={0} role="region" aria-label="ARR renewing by week">
      <p className="sr-only">
        Weekly ARR renewing over the next 13 weeks: {weeks.map((w) => `week of ${dayMonth(isoFromToday(w.w * 7))}, ${w.items.length} renewals, ${money(w.arr)}`).join('; ')}. Every account is listed by month below.
      </p>
      <div className="min-w-[680px]" aria-hidden="true">
        <div className="grid items-end gap-2" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0,1fr))`, height: H + 28 }}>
          {weeks.map(({ w, items, arr }) => (
            <div key={w} className="flex h-full flex-col justify-end">
              <span className={cx('tnum mb-1.5 text-center font-mono text-[11px]', arr ? 'text-muted' : 'text-transparent')}>{arr ? money(arr) : '—'}</span>
              <ul className="flex flex-col-reverse gap-[2px]">
                {items.map((a, i) => {
                  const h = Math.max(4, (a.arr / max) * H - 2)
                  return (
                    <li key={a.id} className="relative">
                      <span
                        onClick={() => navigate(`/accounts/${a.id}`)}
                        onPointerEnter={() => setHover(a.id)}
                        onPointerLeave={() => setHover(null)}
                        className={cx('block w-full origin-bottom animate-grow cursor-pointer rounded-[2px] transition-[opacity,filter] duration-150', hover && hover !== a.id && 'opacity-45')}
                        style={{ height: h, background: healthFill(current(a)), animationDelay: `${120 + w * 40 + i * 25}ms` }}
                      />
                      <AnimatePresence>
                        {hover === a.id && (
                          <motion.span
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, transition: { duration: 0.1 } }}
                            transition={{ duration: 0.14 }}
                            className={cx('pointer-events-none absolute bottom-[calc(100%+8px)] z-20 w-max max-w-[240px] rounded-[6px] border border-line bg-raised px-3 py-2.5 shadow-pop', w > WEEKS - 4 ? 'right-0' : w < 3 ? 'left-0' : 'left-1/2 -translate-x-1/2')}
                          >
                            <Tip a={a} threshold={threshold} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-3 grid gap-2 border-t border-line pt-3" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0,1fr))` }}>
          {weeks.map(({ w, items }) => (
            <div key={w} className="text-center">
              <span className="tnum block font-mono text-[11px] text-fg">{dayMonth(isoFromToday(w * 7))}</span>
              <span className="tnum block font-mono text-[10.5px] text-muted">{items.length || ''}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Month grids for the next 90 days; each renewal is a bar whose width is its share of the largest ARR. */
function Calendar({ list, threshold }: { list: Account[]; threshold: number }) {
  const start = new Date(`${TODAY}T00:00:00Z`)
  const months = Array.from({ length: 4 }, (_, i) => new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1)))
  const max = Math.max(1, ...list.map((a) => a.arr))
  const byDay = new Map<string, Account[]>()
  for (const a of list) byDay.set(a.renewal, [...(byDay.get(a.renewal) ?? []), a])
  return (
    <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
      {months.map((m, mi) => {
        const y = m.getUTCFullYear()
        const mo = m.getUTCMonth()
        const days = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate()
        const lead = (new Date(Date.UTC(y, mo, 1)).getUTCDay() + 6) % 7
        return (
          <div key={mo} className="animate-rise" style={{ animationDelay: `${100 + mi * 80}ms` }}>
            <h3 className="font-serif text-[19px]">
              {monthName(mo)} <span className="tnum font-mono text-[13px] text-muted">{y}</span>
            </h3>
            <div className="caps mt-3 grid grid-cols-7 gap-1 text-[9.5px] tracking-[0.18em] text-muted" aria-hidden="true">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d} className="px-1">
                  {d.slice(0, 2)}
                </span>
              ))}
            </div>
            <ol className="mt-1.5 grid grid-cols-7 gap-1">
              {Array.from({ length: lead }, (_, i) => (
                <li key={`x${i}`} aria-hidden="true" />
              ))}
              {Array.from({ length: days }, (_, i) => {
                const iso = new Date(Date.UTC(y, mo, i + 1)).toISOString().slice(0, 10)
                const d = daysUntil(iso)
                const inRange = d >= 0 && d <= DAYS
                const items = byDay.get(iso) ?? []
                return (
                  <li key={iso} className={cx('min-h-[58px] rounded-[3px] border p-1', d === 0 ? 'border-fg/60' : 'border-line-soft', !inRange && 'opacity-35')}>
                    <span className={cx('tnum block font-mono text-[10.5px]', d === 0 ? 'text-fg' : 'text-muted')}>{i + 1}</span>
                    {items.length > 0 && <span className="sr-only">{items.map((a) => `${a.name} ${money(a.arr)}${current(a) < threshold ? ' at risk' : ''}`).join(', ')}</span>}
                    <span className="mt-1 flex flex-col gap-[3px]" aria-hidden="true">
                      {items.map((a) => (
                        <span
                          key={a.id}
                          title={`${a.name} · ${money(a.arr)} · health ${current(a)}`}
                          onClick={() => navigate(`/accounts/${a.id}`)}
                          className="block h-[7px] min-w-[6px] origin-left animate-grow-x cursor-pointer rounded-full transition-transform hover:scale-y-150 max-sm:h-[10px]"
                          style={{ width: `${Math.max(14, (a.arr / max) * 100)}%`, background: healthFill(current(a)) }}
                        />
                      ))}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>
        )
      })}
    </div>
  )
}

export function Renewals() {
  const { accounts, settings } = useStore()
  const threshold = settings.threshold
  const [view, setView] = useState<View>('Timeline')
  const [riskOnly, setRiskOnly] = useState(false)

  const upcoming = useMemo(
    () => accounts.filter((a) => daysUntil(a.renewal) >= 0 && daysUntil(a.renewal) <= DAYS).sort((a, b) => a.renewal.localeCompare(b.renewal)),
    [accounts],
  )
  const atRisk = (a: Account) => current(a) < threshold + 10
  const list = riskOnly ? upcoming.filter(atRisk) : upcoming
  const sum = (l: Account[]) => l.reduce((s, a) => s + a.arr, 0)
  const within = (n: number) => upcoming.filter((a) => daysUntil(a.renewal) <= n)
  const maxArr = Math.max(1, ...list.map((a) => a.arr))

  const groups = useMemo(() => {
    const g = new Map<string, Account[]>()
    for (const a of list) {
      const key = a.renewal.slice(0, 7)
      g.set(key, [...(g.get(key) ?? []), a])
    }
    return [...g.entries()]
  }, [list])

  return (
    <>
      <PageHeader
        eyebrow="Next 90 days"
        title="Renewals"
        lede="Every contract renewing before February 9, sized by ARR and coloured by health. Orange blocks need a plan before the notice deadline."
        actions={<TextTabs label="Renewals view" options={['Timeline', 'Calendar'] as const} value={view} onChange={setView} separator="·" />}
      />

      <section aria-label="Renewal totals" className="grid grid-cols-2 border-b border-line sm:grid-cols-4 [&>*]:border-line [&>*:nth-child(odd)]:border-r sm:[&>*:not(:last-child)]:border-r [&>*:nth-child(-n+2)]:border-b sm:[&>*:nth-child(-n+2)]:border-b-0">
        <Kpi size="sm" label="Next 30 days" value={sum(within(30))} format={money} note={`${within(30).length} accounts`} delay={60} />
        <Kpi size="sm" label="Next 60 days" value={sum(within(60))} format={money} note={`${within(60).length} accounts`} delay={110} />
        <Kpi size="sm" label="Next 90 days" value={sum(upcoming)} format={money} note={`${upcoming.length} accounts`} delay={160} />
        <Kpi size="sm" label="At risk renewing" value={sum(upcoming.filter(atRisk))} format={money} note={`${upcoming.filter(atRisk).length} under ${threshold + 10}`} alert={upcoming.some(atRisk)} delay={210} />
      </section>

      <div className="mt-8">
        <Panel
          id="renewal-chart"
          title={view === 'Timeline' ? 'ARR by week' : 'Calendar'}
          meta={`${list.length} renewals · ${money(sum(list))}`}
          actions={
            <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] text-muted">
              <Switch checked={riskOnly} onChange={setRiskOnly} label="Only at-risk renewals" />
              <span aria-hidden="true">At risk only</span>
            </label>
          }
          className="animate-rise [animation-delay:200ms]"
        >
          <div className="mt-8">
            {list.length === 0 ? (
              <EmptyState title="No renewals at risk">Nothing renewing in the next 90 days is under {threshold + 10}.</EmptyState>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {view === 'Timeline' ? <Timeline list={list} threshold={threshold} /> : <Calendar list={list} threshold={threshold} />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </Panel>
      </div>

      {list.length > 0 && (
        <div className="mt-8">
          <Panel id="renewal-list" title="By month" meta="Click a row to open the account" className="animate-rise [animation-delay:280ms]">
            {groups.map(([key, items]) => (
              <div key={key} className="mt-8">
                <h3 className="caps flex items-baseline justify-between border-b border-line pb-2.5 text-[10.5px] tracking-[0.22em] text-muted">
                  <span>{monthName(Number(key.slice(5, 7)) - 1)}</span>
                  <span className="tnum">{money(sum(items))}</span>
                </h3>
                <ul>
                  {items.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => navigate(`/accounts/${a.id}`)}
                        className="group relative grid min-h-[52px] w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-line py-2.5 text-left before:pointer-events-none before:absolute before:-inset-x-3 before:inset-y-0 before:rounded-[3px] before:bg-fg before:opacity-0 before:transition-opacity hover:before:opacity-[0.045] sm:grid-cols-[minmax(200px,1.2fr)_80px_110px_1fr_90px]"
                      >
                        <span className="flex min-w-0 items-baseline gap-3">
                          <span className="truncate text-[15px]">{a.name}</span>
                          <SegmentTag className="hidden sm:inline">{a.segment}</SegmentTag>
                        </span>
                        <span className="tnum text-right font-mono text-[13px] text-muted sm:text-left">{dayMonth(a.renewal)}</span>
                        <StatusTag status={status(a, threshold)} className="hidden sm:inline-flex" />
                        <span className="col-span-2 flex items-center gap-3 sm:col-span-1">
                          <span className="h-[6px] origin-left animate-grow-x rounded-full" style={{ width: `${Math.max(3, (a.arr / maxArr) * 100)}%`, background: healthFill(current(a)) }} />
                        </span>
                        <span className="tnum hidden text-right font-mono text-[14px] sm:block">{money(a.arr)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Panel>
        </div>
      )}
    </>
  )
}
