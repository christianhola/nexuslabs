import { ArrowDownUp, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { AreaChart, BarList } from '../components/AreaChart'
import { Button } from '../components/Button'
import { Card, CardHeader } from '../components/Card'
import { Container } from '../components/Container'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Segmented } from '../components/Segmented'
import { Skeleton } from '../components/Skeleton'
import { toast } from '../components/Toast'
import { analyticsCopy } from '../content'
import { api } from '../lib/api'
import { cx } from '../lib/cx'
import { useLocation } from '../lib/router'
import { useStored } from '../lib/storage'
import type { Post, Range, Report } from '../shared-analytics'

type Metric = 'subscribers' | 'opens' | 'clicks' | 'revenue'
const fmt: Record<Metric, (n: number) => string> = {
  subscribers: (n) => Math.round(n).toLocaleString('en-US'),
  opens: (n) => `${n.toFixed(2)}%`,
  clicks: (n) => `${n.toFixed(2)}%`,
  revenue: (n) => `$${Math.round(n).toLocaleString('en-US')}`,
}
type SortKey = 'sent' | 'recipients' | 'openRate' | 'clickRate' | 'revenue'

export function AnalyticsPage() {
  const { search } = useLocation()
  const fail = new URLSearchParams(search).has('fail')
  const [range, setRange] = useStored<Range>('analytics-range', '30d')
  const [metric, setMetric] = useState<Metric>('subscribers')
  const [data, setData] = useState<Report | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'sent', dir: 'desc' })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    // Ignore a stale response rather than aborting it, so a quick range
    // change never shows up as a failed request.
    let stale = false
    setLoading(true)
    setError(null)
    // A short floor so the loading state is visible rather than a flash.
    const floor = new Promise((r) => setTimeout(r, 450))
    Promise.all([api<Report>(`/api/analytics?range=${range}${fail ? '&fail=1' : ''}`), floor])
      .then(([r]) => {
        if (!stale) setData(r)
      })
      .catch((e: Error) => {
        if (stale) return
        setData(null)
        setError(e.message)
      })
      .finally(() => {
        if (!stale) setLoading(false)
      })
    return () => {
      stale = true
    }
  }, [range, fail, nonce])

  const posts = useMemo(() => {
    if (!data) return []
    const order = data.posts.map((p) => p.id)
    return [...data.posts].sort((a, b) => {
      const d = sort.key === 'sent' ? order.indexOf(b.id) - order.indexOf(a.id) : (a[sort.key] as number) - (b[sort.key] as number)
      return sort.dir === 'asc' ? d : -d
    })
  }, [data, sort])

  const exportCsv = useCallback(() => {
    if (!data) return
    const rows = [['Title', 'Sent', 'Recipients', 'Open rate', 'Click rate', 'Revenue'], ...data.posts.map((p) => [p.title, p.sent, p.recipients, p.openRate, p.clickRate, p.revenue])]
    const blob = new Blob([rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `inkwell-posts-${data.range}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
    toast('Exported posts as CSV')
  }, [data])

  const th = (key: SortKey, label: string) => {
    const on = sort.key === key
    const Icon = !on ? ArrowDownUp : sort.dir === 'asc' ? ChevronUp : ChevronDown
    return (
      <th scope="col" aria-sort={on ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={cx('px-4 py-3 font-medium', key !== 'sent' && 'text-right')}>
        <button type="button" onClick={() => setSort({ key, dir: on && sort.dir === 'desc' ? 'asc' : 'desc' })} className={cx('inline-flex min-h-10 items-center gap-1 rounded-[4px] hover:text-white', on && 'text-ink')}>
          {label}
          <Icon className="size-3.5" aria-hidden />
        </button>
      </th>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={analyticsCopy.title}
        title="The Quiet Hour"
        intro={analyticsCopy.intro}
        actions={
          <>
            <Segmented label="Date range" value={range} onChange={setRange} options={analyticsCopy.ranges.map((r) => ({ value: r.value as Range, label: r.label }))} />
            <Button variant="outline" icon={<Download className="size-4" />} onClick={exportCsv} disabled={!data || loading}>
              Export
            </Button>
          </>
        }
      />
      <Container className="pb-24" >
        <div aria-busy={loading} aria-live="polite">
          {error ? (
            <Notice
              tone="bad"
              title={analyticsCopy.error}
              action={
                <Button variant="outline" size="sm" icon={<RefreshCw className="size-4" />} onClick={() => setNonce((n) => n + 1)}>
                  Try again
                </Button>
              }
            >
              {error}
              {fail ? ' (This page was opened with ?fail=1 to show the error state.)' : null}
            </Notice>
          ) : null}

          <div role="tablist" aria-label="Metric" className="mt-0 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {analyticsCopy.metrics.map((m) => {
              const id = m.id as Metric
              const on = metric === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="metric-panel"
                  onClick={() => setMetric(id)}
                  className={cx('rounded-[var(--radius-card)] border p-4 text-left transition-colors sm:p-5', on ? 'border-pink/60 bg-[linear-gradient(180deg,rgb(229_72_191/0.1),transparent)] shadow-[inset_0_0_0_1px_rgb(229_72_191/0.25)]' : 'border-line bg-panel hover:border-line-strong')}
                >
                  <span className="text-[14px] text-muted">{m.label}</span>
                  {loading ? (
                    <Skeleton className="mt-2 h-9 w-32" />
                  ) : !data ? (
                    <span className="mt-1 block text-[32px] text-faint">–</span>
                  ) : (
                    <>
                      <span className="mt-1 block text-[28px] font-medium tabular-nums tracking-[-0.02em] text-white sm:text-[32px]">{fmt[id](data.totals[id])}</span>
                      <span className={cx('mt-1 block text-[13px] font-semibold', data.deltas[id] >= 0 ? 'text-ok' : 'text-bad')}>
                        {data.deltas[id] >= 0 ? '+' : ''}
                        {data.deltas[id].toFixed(1)}% <span className="font-normal text-muted">vs previous</span>
                      </span>
                    </>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            <Card id="metric-panel" role="tabpanel">
              <CardHeader title={`${analyticsCopy.metrics.find((m) => m.id === metric)?.label} over ${analyticsCopy.ranges.find((r) => r.value === range)?.label}`} />
              <div className="p-5">{loading ? <Skeleton className="h-[260px] w-full" /> : !data ? <p className="grid h-[260px] place-items-center text-[15px] text-muted">No data to chart yet.</p> : <AreaChart key={`${metric}-${range}`} series={data.series[metric]} labels={data.labels} format={fmt[metric]} height={260} label={metric} />}</div>
            </Card>
            <Card>
              <CardHeader title="Where new readers came from" />
              <div className="p-5">
                {!data && !loading ? (
                  <p className="text-[15px] text-muted">No sources to show.</p>
                ) : loading || !data ? (
                  <div className="flex flex-col gap-2.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                ) : (
                  <BarList rows={data.sources} format={(n) => n.toLocaleString('en-US')} />
                )}
              </div>
            </Card>
          </div>

          <Card className="mt-6 overflow-hidden">
            <CardHeader title="Posts" action={data && !loading ? <span className="text-[13px] text-muted">{data.posts.length} sent</span> : null} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-[14px]">
                <caption className="sr-only">Posts sent in the selected range. Column headers sort the table.</caption>
                <thead className="border-b border-line text-left text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Title
                    </th>
                    {th('sent', 'Sent')}
                    {th('recipients', 'Recipients')}
                    {th('openRate', 'Open rate')}
                    {th('clickRate', 'Click rate')}
                    {th('revenue', 'Revenue')}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {!data && !loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted">
                        No posts to show.
                      </td>
                    </tr>
                  ) : loading || !data
                    ? [0, 1, 2, 3].map((i) => (
                        <tr key={i}>
                          <td colSpan={6} className="px-4 py-3">
                            <Skeleton className="h-6 w-full" />
                          </td>
                        </tr>
                      ))
                    : posts.map((p: Post) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                          <td className="px-4 py-3 text-body">{p.sent}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-body">{p.recipients.toLocaleString('en-US')}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-body">{p.openRate}%</td>
                          <td className="px-4 py-3 text-right tabular-nums text-body">{p.clickRate}%</td>
                          <td className="px-4 py-3 text-right tabular-nums text-white">${p.revenue.toLocaleString('en-US')}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Container>
    </>
  )
}
