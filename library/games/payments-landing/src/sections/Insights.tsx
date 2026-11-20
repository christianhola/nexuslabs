import { useState } from 'react'
import { ArrowLeftRight, Landmark, Zap } from 'lucide-react'

import { AreaChart } from '../components/AreaChart'
import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { LogoMark } from '../components/Logo'
import { Reveal } from '../components/Reveal'
import { Segmented } from '../components/Segmented'
import { insights } from '../content'

export function Insights() {
  const [range, setRange] = useState('6m')
  const r = insights.summary.ranges.find((x) => x.id === range)!
  const last = r.points[r.points.length - 1]
  const first = r.points[0]
  const growth = Math.round(((last - first) / first) * 100)
  return (
    <section aria-label="Account highlights" className="py-20 sm:py-28">
      <Container className="grid gap-5 lg:grid-cols-[1fr_1fr_1.35fr]">
        <Reveal className="flex flex-col justify-between rounded-card bg-mist-2 p-8">
          <p className="tabular text-[64px] font-medium leading-none tracking-[-0.05em] text-ink">
            <CountUp value={insights.stat.value} suffix={insights.stat.suffix} />
          </p>
          <p className="mt-10 max-w-[220px] text-[19px] font-medium leading-snug tracking-[-0.02em] text-ink">{insights.stat.label}</p>
        </Reveal>
        <Reveal delay={0.06} className="flex flex-col justify-between rounded-card bg-mist-2 p-8">
          <p className="max-w-[260px] text-[19px] font-medium leading-snug tracking-[-0.02em] text-ink">{insights.withdraw.title}</p>
          <div className="mt-10 flex items-center gap-4" aria-hidden>
            <span className="grid size-14 place-items-center rounded-[14px] bg-teal text-white">
              <LogoMark className="size-7" />
            </span>
            <span className="relative h-6 flex-1">
              <ArrowLeftRight className="absolute left-1/2 top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-faint" strokeWidth={1.5} />
              <span className="absolute inset-x-0 top-1/2 h-px bg-[repeating-linear-gradient(90deg,var(--color-line-strong)_0_6px,transparent_6px_10px)]" />
            </span>
            <span className="round grid size-14 place-items-center rounded-full bg-navy text-white">
              <Landmark className="size-6" strokeWidth={1.5} />
            </span>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[13.5px] text-muted">
            <Zap className="size-4 text-teal-ink" aria-hidden />
            {insights.withdraw.note}
          </p>
        </Reveal>
        <Reveal delay={0.12} className="rounded-card bg-mist-2 p-3">
          <div className="h-full rounded-card-sm bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[12px] text-faint">{insights.summary.label}</p>
                <p className="tabular mt-1 text-[24px] font-medium tracking-[-0.03em] text-ink">
                  ${last.toLocaleString('en-US')}
                </p>
                <p className="mt-0.5 text-[12.5px] font-medium text-success">+{growth}% this period</p>
              </div>
              <Segmented size="sm" tone="mist" label="Chart range" value={range} onChange={setRange} options={insights.summary.ranges.map((x) => ({ id: x.id, label: x.label.replace(' months', 'M') }))} />
            </div>
            <AreaChart className="mt-6" points={r.points} labels={insights.summary.months[range]} title={`Balance over ${r.label}, from $${first.toLocaleString('en-US')} to $${last.toLocaleString('en-US')}`} />
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
