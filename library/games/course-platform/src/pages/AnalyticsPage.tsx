import { BarChart3, Download, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Select } from '../components/Field'
import { FunnelBars } from '../components/FunnelBars'
import { LineChart } from '../components/LineChart'
import { Segmented } from '../components/Segmented'
import { Skeleton } from '../components/Skeleton'
import { ariaSort, SortHeader } from '../components/SortHeader'
import type { SortDir } from '../components/SortHeader'
import { StatCard } from '../components/StatCard'
import { analyticsCourses, funnel, images, recentSales, topCourses } from '../content'
import type { AnalyticsCourseId } from '../content'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useStored } from '../lib/storage'

/*
  Creator analytics. Numbers are generated from a seed per course and range
  so they stay stable between reloads; swap `series()` for your own API.
  The range and course filter persist (coursekit:analytics-*).
*/
type Range = '7d' | '30d' | '90d'
const ranges: { value: Range; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
]
const money = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`

function rng(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
}
function series(course: AnalyticsCourseId, range: Range) {
  if (course === 'kiln') return null
  const n = range === '7d' ? 7 : range === '30d' ? 30 : 13
  const scale = course === 'all' ? 1 : course === 'python' ? 0.36 : course === 'brand' ? 0.3 : 0.16
  const r = rng(course.length * 31 + n)
  const base = (range === '90d' ? 4200 : 600) * scale
  const values = Array.from({ length: n }, (_, i) => Math.round(base * (0.8 + i / n / 1.6 + r() * 0.35)))
  const now = new Date(2026, 10, 12)
  const labels = values.map((_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (range === '90d' ? (n - 1 - i) * 7 : n - 1 - i))
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  const revenue = values.reduce((a, b) => a + b, 0)
  return {
    values,
    labels,
    revenue,
    learners: Math.round(revenue / 46),
    completion: Math.round(62 + r() * 14),
    refund: 1 + r() * 1.6,
    deltas: [6 + r() * 12, 3 + r() * 9, -1 + r() * 5, -(r() * 0.6)],
  }
}

type SortKey = 'name' | 'learners' | 'revenue' | 'completion'

export function AnalyticsPage() {
  const [range, setRange] = useStored<Range>('analytics-range', '30d')
  const [course, setCourse] = useStored<AnalyticsCourseId>('analytics-course', 'all')
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'revenue', dir: 'desc' })
  const reduce = useReducedMotion()
  const data = useMemo(() => series(course, range), [course, range])

  // A short loading state on every filter change, as a real API call would have.
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), reduce ? 0 : 450)
    return () => window.clearTimeout(t)
  }, [course, range, reduce])

  const rows = useMemo(() => {
    const list = course === 'all' ? [...topCourses] : topCourses.filter((c) => c.id === course)
    return list.sort((a, b) => {
      const x = sort.key === 'name' ? a.name.localeCompare(b.name) : a[sort.key] - b[sort.key]
      return sort.dir === 'asc' ? x : -x
    })
  }, [course, sort])
  const toggle = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' ? 'asc' : 'desc' }))

  const exportCsv = () => {
    if (!data) return
    const csv = ['date,revenue_usd', ...data.labels.map((l, i) => `"${l}",${data.values[i]}`)].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `coursekit-revenue-${course}-${range}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="bg-canvas pb-20">
      <div className="border-b border-line bg-paper">
        <Container className="flex flex-col gap-5 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[14px] text-flame-ink">Analytics</p>
            <h1 className="mt-1 font-display text-[34px] font-medium tracking-[-0.025em] text-ink">How your school is doing</h1>
            <p className="mt-1 text-[15px] text-muted">Revenue, learners and completion across your courses.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <label htmlFor="an-course" className="sr-only">
              Course
            </label>
            <div className="w-[230px]">
              <Select id="an-course" value={course} onChange={(e) => setCourse(e.target.value as AnalyticsCourseId)}>
                {analyticsCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <Segmented label="Date range" tone="white" value={range} onChange={setRange} options={ranges} />
            <Button variant="outline" onClick={exportCsv} disabled={!data} icon={<Download className="size-4" aria-hidden />}>
              Export CSV
            </Button>
          </div>
        </Container>
      </div>

      <Container className="mt-6">
        {!data ? (
          <EmptyState
            icon={<BarChart3 />}
            title="No sales for this course yet"
            body="Kiln Firing 101 is still a draft. Publish it from the builder and its numbers show up here."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button href="/builder">Open the builder</Button>
                <Button variant="outline" onClick={() => setCourse('all')}>
                  Show all courses
                </Button>
              </div>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy={loading}>
              <StatCard label="Revenue" value={money(data.revenue)} delta={data.deltas[0]} loading={loading} />
              <StatCard label="New learners" value={data.learners.toLocaleString('en-US')} delta={data.deltas[1]} loading={loading} />
              <StatCard label="Completion rate" value={`${data.completion}%`} delta={data.deltas[2]} loading={loading} />
              <StatCard label="Refund rate" value={`${data.refund.toFixed(1)}%`} delta={data.deltas[3]} loading={loading} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
              <Card>
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-[17px] font-medium text-ink">Revenue</h2>
                  <p className="text-[13px] text-muted">{range === '90d' ? 'Weekly' : 'Daily'}, USD</p>
                </div>
                <div className="mt-4">{loading ? <Skeleton className="h-[220px] w-full" /> : <LineChart values={data.values} labels={data.labels} format={money} label="Revenue" />}</div>
              </Card>
              <Card>
                <h2 className="font-display text-[17px] font-medium text-ink">Completion funnel</h2>
                <p className="mt-1 text-[13.5px] text-muted">Share of learners reaching each step</p>
                <FunnelBars className="mt-5" steps={funnel} />
              </Card>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
              <Card pad="none" className="overflow-hidden">
                <h2 className="px-6 pt-5 font-display text-[17px] font-medium text-ink">Courses</h2>
                <div tabIndex={0} role="region" aria-label="Course performance table" className="relative overflow-x-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-flame-strong">
                  <table className="mt-3 w-full min-w-[560px] text-left text-[14px]">
                    <caption className="sr-only">Course performance. Use the column headers to sort.</caption>
                    <thead className="border-y border-line bg-wash text-[13px]">
                      <tr>
                        {(
                          [
                            ['name', 'Course'],
                            ['learners', 'Learners'],
                            ['revenue', 'Revenue'],
                            ['completion', 'Completion'],
                          ] as const
                        ).map(([k, l], i) => (
                          <th key={k} scope="col" aria-sort={ariaSort(sort.key === k, sort.dir)} className={i === 0 ? 'py-1.5 pl-6' : 'py-1.5 pr-6 text-right'}>
                            <SortHeader label={l} active={sort.key === k} dir={sort.dir} onSort={() => toggle(k)} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {rows.map((c) => (
                        <tr key={c.id}>
                          <td className="py-3 pl-6">
                            <span className="flex items-center gap-3">
                              <img src={images.covers[c.cover]} alt="" className="h-9 w-12 rounded-[8px] object-cover" loading="lazy" />
                              <span className="font-medium text-ink">{c.name}</span>
                            </span>
                          </td>
                          <td className="pr-6 text-right tabular-nums text-body">{c.learners.toLocaleString('en-US')}</td>
                          <td className="pr-6 text-right tabular-nums text-ink">{money(c.revenue)}</td>
                          <td className="pr-6 text-right">
                            <Badge tone={c.completion >= 70 ? 'ok' : c.completion >= 60 ? 'neutral' : 'warn'}>{c.completion}%</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <Card>
                <h2 className="font-display text-[17px] font-medium text-ink">Recent sales</h2>
                <ul className="mt-4 flex flex-col divide-y divide-line">
                  {recentSales.map((s) => (
                    <li key={s.who + s.ago} className="flex items-center gap-3 py-3 first:pt-0">
                      <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-flame-soft text-flame-ink">
                        <ShoppingBag className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] text-ink">
                          {s.who} <span className="text-muted">bought</span> {s.what}
                        </span>
                        <span className="block text-[12.5px] text-muted">
                          {s.ago}, {s.plan}
                        </span>
                      </span>
                      <span className="font-display text-[15px] font-medium tabular-nums text-ink">{money(s.amount)}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        )}
      </Container>
    </div>
  )
}
