import { useEffect, useMemo, useState } from 'react'

import { Columns3, Download, X } from 'lucide-react'

import { accountColumns, extraColumns } from '../app/columns'
import { DataTable, type Column } from '../components/DataTable'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Select, TextInput } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { Pill, pillClass } from '../components/Pill'
import { Popover } from '../components/Popover'
import { useToast } from '../components/Toast'
import { SEGMENTS, type Account } from '../data'
import { downloadCsv, toCsv } from '../lib/csv'
import { money } from '../lib/format'
import { change, current, drawdown, runwayWeeks, status, wow, type Status } from '../lib/metrics'
import { navigate } from '../lib/router'
import { useStore } from '../lib/store'

const ORDER = ['dot', 'account', 'status', 'arr', 'health', 'change', 'trend', 'drawdown', 'runway', 'seats', 'wow', 'touch', 'owner', 'cohort', 'renewal']
const DEFAULT_COLUMNS = ['dot', 'account', 'status', 'arr', 'health', 'change', 'trend', 'seats', 'touch', 'owner', 'renewal']
const LABELS: Record<string, string> = { dot: 'Health colour', trend: '13-week trend', change: 'Change over range', touch: 'Last touch' }
const STATUSES: Array<'All' | Status> = ['All', 'At risk', 'Watch', 'Healthy']

type Filters = { q: string; segment: string; status: string; owner: string }
const EMPTY: Filters = { q: '', segment: 'All', status: 'All', owner: 'All' }

function readFilters(): Filters {
  const p = new URLSearchParams(window.location.search)
  return { q: p.get('q') ?? '', segment: p.get('segment') ?? 'All', status: p.get('status') ?? 'All', owner: p.get('owner') ?? 'All' }
}

export function Accounts() {
  const { accounts, settings, range, columns: saved, setColumns } = useStore()
  const toast = useToast()
  const threshold = settings.threshold
  const [f, setF] = useState<Filters>(readFilters)
  const visibleCols = saved ?? DEFAULT_COLUMNS

  // Filters live in the URL, so reload and back/forward keep them.
  useEffect(() => {
    const p = new URLSearchParams()
    for (const [k, v] of Object.entries(f)) if (v && v !== 'All') p.set(k, v)
    const qs = p.toString()
    window.history.replaceState(null, '', `/accounts${qs ? `?${qs}` : ''}`)
  }, [f])

  const owners = useMemo(() => ['All', ...[...new Set(accounts.map((a) => a.owner))].sort()], [accounts])
  const segments = ['All', ...SEGMENTS.filter((s) => !settings.excluded.includes(s))]

  const rows = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    return accounts.filter(
      (a) =>
        (!q || a.name.toLowerCase().includes(q) || a.owner.toLowerCase().includes(q)) &&
        (f.segment === 'All' || a.segment === f.segment) &&
        (f.owner === 'All' || a.owner === f.owner) &&
        (f.status === 'All' || status(a, threshold) === f.status),
    )
  }, [accounts, f, threshold])

  const all = useMemo(() => {
    const map = new Map<string, Column<Account>>([...accountColumns(threshold, range), ...extraColumns(threshold, range)].map((c) => [c.key, c]))
    return ORDER.map((k) => map.get(k)!)
  }, [threshold, range])
  const cols = all.filter((c) => visibleCols.includes(c.key))
  const minWidth = cols.reduce((s, c) => s + (parseInt(c.width, 10) || 220), 0) + 24
  const filtered = f.q !== '' || f.segment !== 'All' || f.status !== 'All' || f.owner !== 'All'
  const arr = rows.reduce((s, a) => s + a.arr, 0)

  const toggleCol = (key: string) => setColumns(visibleCols.includes(key) ? visibleCols.filter((k) => k !== key) : ORDER.filter((k) => k === key || visibleCols.includes(k)))

  const exportCsv = () => {
    const values: Record<string, (a: Account) => string | number> = {
      account: (a) => a.name,
      status: (a) => status(a, threshold),
      arr: (a) => a.arr,
      health: current,
      change: (a) => change(a, range),
      trend: (a) => a.history.join(' '),
      drawdown,
      runway: (a) => {
        const w = runwayWeeks(a, threshold)
        return w === null ? '' : Math.max(1, Math.round(w))
      },
      seats: (a) => Math.round(a.seatUtilization * 100),
      wow,
      touch: (a) => a.lastTouchDays,
      owner: (a) => a.owner,
      cohort: (a) => a.cohort,
      renewal: (a) => a.renewal,
    }
    const keys = ['account', 'segment', ...cols.map((c) => c.key).filter((k) => k !== 'dot' && k !== 'account')]
    const header = keys.map((k) => (k === 'segment' ? 'Segment' : k === 'change' ? `Change ${range}w` : k === 'seats' ? 'Seats active %' : k === 'touch' ? 'Last touch days' : all.find((c) => c.key === k)?.label || k))
    const csv = toCsv([header, ...rows.map((a) => keys.map((k) => (k === 'segment' ? a.segment : values[k]!(a))))])
    downloadCsv(`accounts-${new Date().toISOString().slice(0, 10)}.csv`, csv)
    toast.show({ tone: 'success', title: 'CSV exported', body: `${rows.length} accounts · ${keys.length} columns` })
  }

  return (
    <>
      <PageHeader
        eyebrow={`${accounts.length} accounts`}
        title="Accounts"
        lede="Every account with its health, trend and renewal. Filter, choose columns and export what you see."
        actions={
          <Pill variant="outline" icon={<Download strokeWidth={1.75} />} onClick={exportCsv} disabled={rows.length === 0}>
            Export CSV
          </Pill>
        }
      />

      <div className="relative z-30 mt-6 flex animate-rise flex-wrap items-end gap-3 [animation-delay:120ms]">
        <TextInput
          id="account-search"
          label="Search accounts"
          hideLabel
          search
          type="search"
          placeholder="Search by account or owner   /"
          value={f.q}
          onChange={(e) => setF({ ...f, q: e.target.value })}
          className="w-full sm:w-[300px]"
        />
        <Select label="Segment" hideLabel options={segments.map((s) => ({ value: s, label: s === 'All' ? 'All segments' : s }))} value={f.segment} onChange={(e) => setF({ ...f, segment: e.target.value })} className="w-[calc(50%-6px)] sm:w-[170px]" />
        <Select label="Status" hideLabel options={STATUSES.map((s) => ({ value: s, label: s === 'All' ? 'Any status' : s }))} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })} className="w-[calc(50%-6px)] sm:w-[150px]" />
        <Select label="Owner" hideLabel options={owners.map((s) => ({ value: s, label: s === 'All' ? 'Any owner' : s }))} value={f.owner} onChange={(e) => setF({ ...f, owner: e.target.value })} className="w-[calc(50%-6px)] sm:w-[160px]" />
        <Popover
          label="Columns"
          align="left"
          trigger={(p) => (
            <button type="button" {...p} className={pillClass('ghost', 'md', 'h-[38px] max-sm:h-10')}>
              <Columns3 className="size-3.5" strokeWidth={1.75} />
              <span className="-mr-[0.26em]">Columns</span>
            </button>
          )}
        >
          <p className="caps mb-3 text-[10px] tracking-[0.22em] text-muted">Show columns</p>
          <div className="space-y-2.5">
            {all.map((c) => (
              <Checkbox key={c.key} label={LABELS[c.key] ?? c.label} checked={visibleCols.includes(c.key)} disabled={c.key === 'account'} onChange={() => toggleCol(c.key)} />
            ))}
          </div>
          <button type="button" onClick={() => setColumns(DEFAULT_COLUMNS)} className="caps mt-4 min-h-8 cursor-pointer text-[10px] tracking-[0.2em] text-muted hover:text-fg">
            Reset columns
          </button>
        </Popover>
        {filtered && (
          <Pill variant="ghost" icon={<X strokeWidth={1.75} />} onClick={() => setF(EMPTY)} className="h-[38px]">
            Clear
          </Pill>
        )}
      </div>

      <p className="caps tnum mt-6 text-[10.5px] text-muted" aria-live="polite">
        Showing {rows.length} of {accounts.length} · {money(arr)} ARR
      </p>

      <div className="mt-3 animate-rise rounded-[2px] bg-panel px-5 pt-5 pb-4 [animation-delay:200ms] sm:px-9 sm:pt-7 sm:pb-6">
        <DataTable
          key={visibleCols.join(',')}
          label="Accounts"
          columns={cols}
          rows={rows}
          rowKey={(a) => a.id}
          onRowClick={(a) => navigate(`/accounts/${a.id}`)}
          defaultSort={{ key: 'arr', dir: -1 }}
          minWidth={minWidth}
          enterDelay={150}
          className="-mx-5 px-5 sm:-mx-9 sm:px-9"
          empty={
            <EmptyState title="No accounts match" action={<Pill variant="outline" onClick={() => setF(EMPTY)}>Clear filters</Pill>}>
              Nothing matches “{f.q || 'these filters'}”. Try a shorter search or another segment.
            </EmptyState>
          }
        />
      </div>
    </>
  )
}
