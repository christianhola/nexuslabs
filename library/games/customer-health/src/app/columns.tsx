import type { Column } from '../components/DataTable'
import { HealthDot } from '../components/HealthDot'
import { SegmentTag } from '../components/SegmentTag'
import { Sparkline } from '../components/Sparkline'
import { StatusTag } from '../components/StatusTag'
import type { Account, Range } from '../data'
import { cx } from '../lib/cx'
import { money, percent, shortDate, signed } from '../lib/format'
import { change, current, daysUntil, drawdown, isStale, runwayWeeks, series, status, wow } from '../lib/metrics'

/*
  Every account column, shared by the Watchlist and the Accounts table (which
  lets people choose among them). Widths match the reference watchlist.
*/

function runwayLabel(w: number | null) {
  if (w === null) return <span className="text-muted">—</span>
  const n = Math.max(1, Math.round(w))
  return (
    <span className={cx(n <= 4 && 'text-risk')}>
      ~{n} {n === 1 ? 'wk' : 'wks'}
    </span>
  )
}

/** 13-week sparkline (14 points) with the selected range emphasised. */
export function TrendCell({ a, range, width = 132 }: { a: Account; range: Range; width?: number }) {
  const values = series(a).slice(-14)
  return <Sparkline values={values} width={width} height={24} windowStart={values.length - 1 - range} className="ml-auto" />
}

export function accountColumns(threshold: number, range: Range): Column<Account>[] {
  return [
    {
      key: 'account',
      label: 'Account',
      width: 'minmax(210px,1fr)',
      sort: (a) => a.name,
      cellClass: 'font-sans',
      cell: (a) => (
        <span className="flex min-w-0 items-baseline gap-3">
          <span className="truncate text-[15px] text-fg">{a.name}</span>
          <SegmentTag>{a.segment}</SegmentTag>
        </span>
      ),
    },
    { key: 'arr', label: 'ARR', align: 'right', width: '64px', sort: (a) => a.arr, firstDir: -1, cell: (a) => money(a.arr) },
    { key: 'health', label: 'Health', align: 'right', width: '76px', sort: current, cell: (a) => current(a) },
    { key: 'trend', label: '13 wks', align: 'right', width: '150px', sort: (a) => change(a, range), cell: (a) => <TrendCell a={a} range={range} /> },
    {
      key: 'drawdown',
      label: 'Drawdown',
      align: 'right',
      width: '104px',
      sort: drawdown,
      cell: (a) => <span className={cx(drawdown(a) <= -10 ? 'text-risk' : 'text-muted')}>{signed(drawdown(a))}</span>,
    },
    {
      key: 'runway',
      label: 'Runway',
      align: 'right',
      width: '92px',
      sort: (a) => runwayWeeks(a, threshold) ?? (current(a) < threshold ? -1 : 999),
      cell: (a) => runwayLabel(runwayWeeks(a, threshold)),
    },
    { key: 'seats', label: 'Seats', align: 'right', width: '62px', sort: (a) => a.seatUtilization, firstDir: -1, cell: (a) => percent(a.seatUtilization) },
    { key: 'wow', label: 'WoW', align: 'right', width: '54px', sort: wow, firstDir: -1, cell: (a) => <span className={cx(wow(a) < 0 ? 'text-risk' : 'text-muted')}>{signed(wow(a))}</span> },
    {
      key: 'touch',
      label: 'Last touch',
      align: 'right',
      width: '112px',
      sort: (a) => a.lastTouchDays,
      firstDir: -1,
      cell: (a) => <span className={cx(isStale(a) && 'text-risk')}>{a.lastTouchDays === 0 ? 'today' : `${a.lastTouchDays}d`}</span>,
    },
    { key: 'renewal', label: 'Renewal', align: 'right', width: '130px', sort: (a) => daysUntil(a.renewal), cell: (a) => shortDate(a.renewal) },
  ]
}

/** Extra columns for the Accounts page. */
export function extraColumns(threshold: number, range: Range): Column<Account>[] {
  return [
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      sort: (a) => ['At risk', 'Watch', 'Healthy'].indexOf(status(a, threshold)),
      cell: (a) => <StatusTag status={status(a, threshold)} />,
    },
    {
      key: 'change',
      label: `${range}w Δ`,
      align: 'right',
      width: '72px',
      sort: (a) => change(a, range),
      cell: (a) => <span className={cx(change(a, range) < 0 ? 'text-risk' : 'text-muted')}>{signed(change(a, range))}</span>,
    },
    { key: 'owner', label: 'Owner', width: '156px', className: 'pl-7', sort: (a) => a.owner, cellClass: 'font-sans text-[14px] text-muted truncate', cell: (a) => a.owner },
    { key: 'cohort', label: 'Cohort', align: 'right', width: '84px', sort: (a) => a.cohort.slice(-2) + a.cohort, cell: (a) => <span className="text-muted">{a.cohort}</span> },
    {
      key: 'dot',
      label: '',
      width: '28px',
      cell: (a) => <HealthDot score={current(a)} size={9} className="ml-auto block" />,
    },
  ]
}
