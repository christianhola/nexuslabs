import { Check } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Eyebrow } from '../components/Badge'
import { FunnelChart } from '../components/FunnelChart'
import { JourneyList } from '../components/JourneyList'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { RetentionGrid } from '../components/RetentionGrid'
import { RuleBuilder } from '../components/RuleBuilder'
import { Segmented } from '../components/Segmented'
import { SignalFeed } from '../components/SignalFeed'
import { featureSections, funnels, journeys, retention } from '../content'
import { cx } from '../lib/cx'
import { Link, useLocation } from '../lib/router'
import { Cta } from '../sections/Cta'

export function FeaturesPage() {
  const { hash } = useLocation()
  return (
    <>
      <PageHeader eyebrow="Features" title="Everything you need to keep the customers you win" lede="Four tools that share one data model. Start with a funnel, follow a journey, watch the cohort, get the signal.">
        <nav aria-label="Features" className="mx-auto mt-10 flex max-w-max flex-wrap justify-center gap-1 rounded-full bg-white/60 p-1 backdrop-blur">
          {featureSections.map((f) => (
            <Link
              key={f.id}
              href={`#${f.id}`}
              aria-current={hash === `#${f.id}` ? 'true' : undefined}
              className={cx('round inline-flex h-10 items-center rounded-full px-4 font-display text-[14px] font-semibold text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-leaf', hash === `#${f.id}` && 'bg-night text-on-dark hover:bg-night')}
            >
              {f.eyebrow}
            </Link>
          ))}
        </nav>
      </PageHeader>
      <Container className="flex flex-col gap-24 py-16 sm:gap-32 sm:py-24">
        {featureSections.map((f, i) => (
          <section key={f.id} id={f.id} aria-labelledby={`${f.id}-h`} className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={cx(i % 2 === 1 && 'lg:order-2')}>
              <Eyebrow>{f.eyebrow}</Eyebrow>
              <h2 id={`${f.id}-h`} className="mt-4 text-balance font-display text-[32px] font-bold leading-[1.06] tracking-[-0.04em] text-ink sm:text-[40px]">
                {f.title}
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">{f.body}</p>
              <ul className="mt-6 flex flex-col gap-3">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-[15px] text-body">
                    <span className="round grid size-5 place-items-center rounded-full bg-lime-soft text-leaf">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <Reveal>
              <Card className="bg-[linear-gradient(180deg,#f2f6ee,#ffffff)]">{demos[f.id]}</Card>
            </Reveal>
          </section>
        ))}
      </Container>
      <Cta />
    </>
  )
}

function FunnelDemo() {
  const [seg, setSeg] = useState('0')
  const [step, setStep] = useState(2)
  const steps = funnels.steps.map((s) => ({ label: s.label, value: s.values[Number(seg)]! }))
  const lost = step ? steps[step - 1]!.value - steps[step]!.value : 0
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[15px] font-semibold text-ink">{funnels.name}, last 30 days</p>
        <Segmented size="sm" tone="white" label="Segment" value={seg} onChange={setSeg} options={funnels.segments.map((l, i) => ({ value: String(i), label: l }))} />
      </div>
      <FunnelChart className="mt-6" steps={steps} selected={step} onSelect={setStep} />
      <p className="mt-5 rounded-[12px] bg-night px-4 py-3 text-[14px] text-on-dark" aria-live="polite">
        {step ? (
          <>
            <span className="font-semibold text-lime">{lost.toLocaleString('en-US')} people</span> dropped before “{steps[step]!.label}”. Open them in Journeys to see where they went.
          </>
        ) : (
          <>Everyone starts here. Select a later step to see who dropped.</>
        )}
      </p>
    </div>
  )
}

function RetentionDemo() {
  const [range, setRange] = useState<'8' | '5'>('8')
  const rows = retention.cohorts.slice(0, Number(range))
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[15px] font-semibold text-ink">Weekly retention</p>
        <Segmented size="sm" tone="white" label="Cohorts shown" value={range} onChange={setRange} options={[{ value: '5', label: '5 cohorts' }, { value: '8', label: '8 cohorts' }]} />
      </div>
      <div className="mt-5 overflow-x-auto">
        <RetentionGrid cohorts={rows} className="min-w-[520px]" />
      </div>
      <p className="mt-4 text-[13px] text-muted">Outlined cells beat or miss the average for that week by 4 points or more.</p>
    </div>
  )
}

function JourneyDemo() {
  const [show, setShow] = useState<'all' | 'converted' | 'dropped'>('all')
  const items = journeys.filter((j) => show === 'all' || j.outcome === show)
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[15px] font-semibold text-ink">Top paths this week</p>
        <Segmented size="sm" tone="white" label="Outcome" value={show} onChange={setShow} options={[{ value: 'all', label: 'All' }, { value: 'converted', label: 'Converted' }, { value: 'dropped', label: 'Dropped' }]} />
      </div>
      <div className="mt-5">
        <JourneyList items={items} />
      </div>
    </div>
  )
}

function SignalsDemo() {
  return (
    <div className="grid gap-6">
      <div>
        <p className="font-display text-[15px] font-semibold text-ink">Live signals</p>
        <SignalFeed className="mt-3" rows={3} />
      </div>
      <RuleBuilder />
    </div>
  )
}

const demos: Record<(typeof featureSections)[number]['id'], ReactNode> = {
  funnels: <FunnelDemo />,
  retention: <RetentionDemo />,
  journeys: <JourneyDemo />,
  signals: <SignalsDemo />,
}
