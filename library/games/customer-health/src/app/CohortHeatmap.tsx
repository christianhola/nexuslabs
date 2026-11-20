import { useMemo, useState } from 'react'

import { Panel } from '../components/Panel'
import { COHORTS, type Account, type Range } from '../data'
import { cx } from '../lib/cx'
import { signed } from '../lib/format'
import { healthFill } from '../lib/healthColor'
import { median, series } from '../lib/metrics'

/**
 * Median health of each signup-quarter cohort, week by week over the selected
 * range. Each cell is filled from the health scale; hover or focus a cell to
 * read its value.
 */
export function CohortHeatmap({ accounts, range }: { accounts: Account[]; range: Range }) {
  const [focus, setFocus] = useState<{ row: number; col: number } | null>(null)
  const cols = range + 1
  const rows = useMemo(
    () =>
      COHORTS.map((cohort) => {
        const members = accounts.filter((a) => a.cohort === cohort)
        const cells = Array.from({ length: cols }, (_, i) => {
          const back = cols - 1 - i
          return members.length ? Math.round(median(members.map((a) => { const s = series(a); return s[s.length - 1 - back]! }))) : null
        })
        return { cohort, n: members.length, cells }
      }).filter((r) => r.n > 0),
    [accounts, cols],
  )
  const active = focus && rows[focus.row] ? { r: rows[focus.row]!, v: rows[focus.row]!.cells[focus.col]!, back: cols - 1 - focus.col } : null

  return (
    <Panel
      id="cohorts"
      title="Health by signup cohort"
      meta={active ? `${active.r.cohort} · ${active.back === 0 ? 'now' : `${active.back} wks ago`} · median ${active.v}` : `${rows.length} cohorts · median health per week`}
      className="animate-rise [animation-delay:420ms]"
    >
      <div className="scroll-thin -mx-5 mt-7 overflow-x-auto px-5 sm:-mx-9 sm:mt-9 sm:px-9">
        <div role="table" aria-label="Median health by signup cohort and week" className="min-w-[560px]">
          <div role="row" className="grid items-end gap-1 pb-2.5" style={{ gridTemplateColumns: `92px 48px repeat(${cols}, minmax(0,1fr)) 64px` }}>
            <span role="columnheader" className="caps text-[10px] tracking-[0.22em] text-muted">
              Cohort
            </span>
            <span role="columnheader" className="caps text-right text-[10px] tracking-[0.22em] text-muted">
              N
            </span>
            {Array.from({ length: cols }, (_, i) => {
              const back = cols - 1 - i
              const label = back === 0 ? 'Now' : `−${back}`
              const show = cols <= 9 || back % 2 === 0
              return (
                <span key={i} role="columnheader" className="tnum text-center font-mono text-[11px] text-muted">
                  {show ? label : <span className="sr-only">{label}</span>}
                </span>
              )
            })}
            <span role="columnheader" className="caps text-right text-[10px] tracking-[0.22em] text-muted">
              {range}w Δ
            </span>
          </div>
          {rows.map((r, ri) => {
            const first = r.cells[0]!
            const last = r.cells[r.cells.length - 1]!
            const delta = last - first
            return (
              <div key={r.cohort} role="row" className="grid items-center gap-1 py-[2px]" style={{ gridTemplateColumns: `92px 48px repeat(${cols}, minmax(0,1fr)) 64px` }}>
                <span role="rowheader" className="tnum font-mono text-[13px] text-fg">
                  {r.cohort}
                </span>
                <span role="cell" className="tnum text-right font-mono text-[12.5px] text-muted">
                  {r.n}
                </span>
                {r.cells.map((v, ci) => {
                  const on = focus?.row === ri && focus.col === ci
                  return (
                    <span
                      key={ci}
                      role="cell"
                      tabIndex={ci === cols - 1 ? 0 : -1}
                      aria-label={`${r.cohort}, ${cols - 1 - ci === 0 ? 'now' : `${cols - 1 - ci} weeks ago`}: median ${v}`}
                      onPointerEnter={() => setFocus({ row: ri, col: ci })}
                      onPointerLeave={() => setFocus(null)}
                      onFocus={() => setFocus({ row: ri, col: ci })}
                      onBlur={() => setFocus(null)}
                      onKeyDown={(e) => {
                        const d = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0
                        if (!d) return
                        e.preventDefault()
                        ;((e.currentTarget.parentElement!.children[2 + Math.min(cols - 1, Math.max(0, ci + d))] as HTMLElement) ?? null)?.focus()
                      }}
                      className={cx('block h-[30px] max-sm:h-10 animate-fade rounded-[2px] outline-offset-1 transition-[transform,box-shadow] duration-150', on && 'scale-y-110 shadow-[0_0_0_1.5px_var(--fg)]')}
                      style={{ background: v === null ? 'transparent' : healthFill(v), animationDelay: `${450 + ci * 35 + ri * 20}ms` }}
                    />
                  )
                })}
                <span role="cell" className={cx('tnum text-right font-mono text-[13px]', delta < 0 ? 'text-risk' : 'text-muted')}>
                  {signed(delta)}
                </span>
              </div>
            )
          })}
          <div className="mt-5 flex items-center gap-3">
            <span className="caps text-[10px] tracking-[0.22em] text-muted">Health</span>
            <span className="tnum font-mono text-[11px] text-muted">20</span>
            <span aria-hidden="true" className="h-[6px] w-40 rounded-full" style={{ background: `linear-gradient(to right, ${[20, 37, 52, 67, 80, 94].map((s) => healthFill(s)).join(',')})` }} />
            <span className="tnum font-mono text-[11px] text-muted">100</span>
          </div>
        </div>
      </div>
    </Panel>
  )
}
