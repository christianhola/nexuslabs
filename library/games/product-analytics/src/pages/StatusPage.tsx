import { CircleCheck, RefreshCw, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { UptimeBars } from '../components/UptimeBars'
import type { DayStatus } from '../components/UptimeBars'
import { statusCopy } from '../content'
import { getJson, wait } from '../lib/api'
import { cx } from '../lib/cx'
import { SubscribeForm } from '../sections/SubscribeForm'

export type StatusReport = {
  updatedAt: string
  overall: 'operational' | 'degraded' | 'outage'
  components: { id: string; name: string; description: string; status: 'operational' | 'degraded' | 'outage'; uptime: number; days: { date: string; status: DayStatus; note?: string }[] }[]
  incidents: { id: string; date: string; title: string; status: 'resolved' | 'monitoring'; body: string }[]
}

type Load = { state: 'loading' } | { state: 'error'; error: string } | { state: 'ready'; data: StatusReport }

const label = { operational: 'Operational', degraded: 'Degraded', outage: 'Outage' } as const

/* Reads /api/status from the Worker; shows a skeleton, an error with retry, or the report. */
export function StatusPage() {
  const [load, setLoad] = useState<Load>({ state: 'loading' })
  const fetchIt = useCallback(async () => {
    setLoad({ state: 'loading' })
    const fail = new URLSearchParams(window.location.search).has('fail')
    const [res] = await Promise.all([getJson<StatusReport>(fail ? '/api/status?fail=1' : '/api/status'), wait(450)])
    setLoad(res.ok ? { state: 'ready', data: res.data } : { state: 'error', error: res.error })
  }, [])
  useEffect(() => {
    void fetchIt()
  }, [fetchIt])

  return (
    <>
      <PageHeader eyebrow="Status" title={statusCopy.title} lede={statusCopy.lede} />
      <Container className="pb-24">
        <div className="mx-auto flex max-w-[880px] flex-col gap-6">
          {load.state === 'loading' ? (
            <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading status">
              <div className="skeleton h-[88px] rounded-[var(--radius-card)]" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-[112px] rounded-[var(--radius-card)]" />
              ))}
            </div>
          ) : load.state === 'error' ? (
            <Notice
              tone="bad"
              title="We couldn’t load the status report"
              action={
                <Button size="sm" variant="dark" onClick={fetchIt} icon={<RefreshCw className="size-4" aria-hidden />}>
                  Try again
                </Button>
              }
            >
              {load.error}
            </Notice>
          ) : (
            <Report data={load.data} onRefresh={fetchIt} />
          )}
          <Card className="grid gap-4 sm:grid-cols-[1fr_1.1fr] sm:items-center">
            <div>
              <h2 className="font-display text-[18px] font-bold tracking-[-0.02em] text-ink">Get incident updates</h2>
              <p className="mt-1 text-[14.5px] text-muted">We email when an incident opens and when it’s resolved. Nothing else.</p>
            </div>
            <SubscribeForm source="status" label="Email" />
          </Card>
        </div>
      </Container>
    </>
  )
}

function Report({ data, onRefresh }: { data: StatusReport; onRefresh: () => void }) {
  const ok = data.overall === 'operational'
  return (
    <>
      <div className={cx('flex flex-wrap items-center gap-4 rounded-[var(--radius-card)] px-6 py-5', ok ? 'bg-ok-soft' : 'bg-warn-soft')} role="status">
        {ok ? <CircleCheck className="size-7 text-ok" aria-hidden /> : <TriangleAlert className="size-7 text-warn" aria-hidden />}
        <div className="flex-1">
          <p className="font-display text-[20px] font-bold tracking-[-0.025em] text-ink">{ok ? 'All systems operational' : 'Some systems are degraded'}</p>
          <p className="text-[13.5px] text-body">Updated {new Date(data.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
        </div>
        <Button size="sm" variant="outline" onClick={onRefresh} icon={<RefreshCw className="size-4" aria-hidden />}>
          Refresh
        </Button>
      </div>

      <ul className="flex flex-col gap-4">
        {data.components.map((c) => (
          <li key={c.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-[16px] font-bold tracking-[-0.015em] text-ink">{c.name}</h2>
                  <p className="text-[13.5px] text-muted">{c.description}</p>
                </div>
                <Badge tone={c.status === 'operational' ? 'ok' : c.status === 'degraded' ? 'warn' : 'bad'} dot>
                  {label[c.status]}
                </Badge>
              </div>
              <div className="mt-5">
                <UptimeBars days={c.days} label={`${c.name}: ${c.uptime}% uptime over 90 days, ${c.days.filter((d) => d.status !== 'ok').length} days with incidents`} />
              </div>
              <div className="mt-2 flex justify-between text-[12.5px] text-faint">
                <span>
                  <span className="sm:hidden">45</span>
                  <span className="max-sm:hidden">90</span> days ago
                </span>
                <span className="font-medium text-body">{c.uptime}% uptime</span>
                <span>Today</span>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <section aria-labelledby="incidents-h">
        <h2 id="incidents-h" className="mt-6 font-display text-[22px] font-bold tracking-[-0.03em] text-ink">
          Past incidents
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {data.incidents.map((i) => (
            <li key={i.id} className="rounded-[var(--radius-card-sm)] border border-line bg-card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-[15px] font-semibold text-ink">{i.title}</p>
                <Badge tone={i.status === 'resolved' ? 'ok' : 'warn'}>{i.status === 'resolved' ? 'Resolved' : 'Monitoring'}</Badge>
              </div>
              <p className="mt-1 text-[13px] text-faint">{i.date}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-body">{i.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
