import { Check, Minus, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { Reveal } from '../components/Reveal'
import { PageHeader, SectionHeading } from '../components/SectionHeading'
import { Slider } from '../components/Slider'
import { whyUs } from '../content'
import { cx } from '../lib/cx'

function Mark({ v }: { v: boolean | 'partial' }) {
  if (v === true)
    return (
      <span className="round inline-grid size-7 place-items-center rounded-full border-[1.5px] border-ink bg-mint" role="img" aria-label="Yes">
        <Check className="size-4" strokeWidth={3} aria-hidden />
      </span>
    )
  if (v === 'partial')
    return (
      <span className="round inline-grid size-7 place-items-center rounded-full border border-line-strong bg-mist" role="img" aria-label="Partly">
        <Minus className="size-4 text-muted" aria-hidden />
      </span>
    )
  return (
    <span className="round inline-grid size-7 place-items-center rounded-full" role="img" aria-label="No">
      <X className="size-4 text-faint" aria-hidden />
    </span>
  )
}

/*
  The ROI estimate. Assumptions (edit to taste): managers save 4 h a week,
  every employee saves 20 minutes a week, and printing costs $1.20 per
  employee a month.
*/
function Roi() {
  const [staff, setStaff] = useState(800)
  const [frontline, setFrontline] = useState(70)
  const [rate, setRate] = useState(28)
  const managers = Math.max(1, Math.round(staff / 12))
  const hours = managers * 4 * 46 + staff * (20 / 60) * 46 * (0.4 + (frontline / 100) * 0.6)
  const value = hours * rate + staff * 1.2 * 12
  const cost = staff * 5 * 12
  return (
    <div className="grid overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-card lg:grid-cols-[1fr_1fr]">
      <div className="space-y-7 p-6 sm:p-10">
        <Slider label="Employees" value={staff} min={50} max={10000} step={50} onChange={setStaff} display={staff.toLocaleString('en-US')} />
        <Slider label="Share without a desk" value={frontline} min={0} max={100} step={5} onChange={setFrontline} display={`${frontline}%`} hint="Warehouse, retail, care, hospitality and field staff" />
        <Slider label="Average hourly cost" value={rate} min={12} max={90} onChange={setRate} display={`$${rate}`} />
      </div>
      <div className="flex flex-col justify-between gap-8 bg-night p-6 text-white sm:p-10">
        <div>
          <p className="text-[14.5px] text-white/70">Estimated value per year</p>
          <p className="mt-2 font-display text-[52px] font-semibold leading-none tracking-[-0.045em] tabular-nums sm:text-[64px]" aria-live="polite">
            ${Math.round(value).toLocaleString('en-US')}
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
          <div>
            <dt className="text-[13.5px] text-white/70">Hours given back</dt>
            <dd className="mt-1 font-display text-[26px] font-semibold tracking-[-0.03em] tabular-nums">{Math.round(hours).toLocaleString('en-US')}</dd>
          </div>
          <div>
            <dt className="text-[13.5px] text-white/70">Return on Growth plan</dt>
            <dd className="mt-1 font-display text-[26px] font-semibold tracking-[-0.03em] text-mint tabular-nums">{(value / cost).toFixed(1)}×</dd>
          </div>
        </dl>
        <p className="text-[13px] leading-relaxed text-white/70">An estimate from customer averages, not a quote. Managers save 4 hours a week, everyone else about 20 minutes.</p>
      </div>
    </div>
  )
}

export function WhyUsPage() {
  const c = whyUs.compare
  return (
    <>
      <Container>
        <PageHeader eyebrow={whyUs.eyebrow} title={whyUs.title} body={whyUs.body} />
        <ul className="grid gap-4 md:grid-cols-3">
          {whyUs.reasons.map((r, i) => (
            <li key={r.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="h-full rounded-[var(--radius-card)] border border-line p-6 sm:p-7">
                  <p className="font-display text-[52px] font-semibold leading-none tracking-[-0.05em] text-ink">{r.stat}</p>
                  <h2 className="mt-5 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">{r.title}</h2>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{r.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>

      <Container as="section" className="py-20 sm:py-24">
        <SectionHeading title="How it compares" body="What you get with Branchwork against the tools most teams start from." />
        <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-line focus-visible:outline-2 focus-visible:outline-ink" tabIndex={0} role="region" aria-label="Comparison table, scrollable">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Branchwork compared with a classic intranet and with email and group chats</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-4 text-[14px] font-medium text-muted sm:p-5">
                  Capability
                </th>
                {c.columns.map((col, i) => (
                  <th key={col} scope="col" className={cx('w-[20%] p-4 text-center text-[15px] font-semibold text-ink sm:p-5', i === 0 && 'bg-mint-soft')}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-[15px] font-normal text-body sm:p-5">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className={cx('p-4 text-center sm:p-5', i === 0 && 'bg-mint-soft')}>
                      <Mark v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      <section className="bg-backdrop py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="ROI" title={whyUs.roi.title} body={whyUs.roi.body} />
          <div className="mt-10">
            <Roi />
          </div>
        </Container>
      </section>

      <Container as="section" className="py-20 text-center">
        <p className="font-display text-[44px] font-semibold tracking-[-0.045em] text-ink sm:text-[64px]">
          <CountUp value={380} /> companies
        </p>
        <p className="mx-auto mt-3 max-w-[46ch] text-[17px] text-muted">already reach their whole workforce with Branchwork. Read how they did it, or see it for yourself.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/demo" arrow>
            Book a demo
          </Button>
          <Button href="/customers" variant="soft">
            Customer stories
          </Button>
        </div>
      </Container>
    </>
  )
}
