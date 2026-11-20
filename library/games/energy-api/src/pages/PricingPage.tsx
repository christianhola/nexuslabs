import { useState } from 'react'
import { Check, Minus } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Slider } from '../components/Slider'
import { pricing } from '../content'
import type { Plan } from '../content'
import { cx } from '../lib/cx'
import { keys, useStore } from '../lib/store'
import { Cta } from '../sections/Cta'

type Billing = 'monthly' | 'yearly'

const eur = (n: number, digits = 0) => `€${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`

/** Graduated monthly cost for the Scale plan. */
function scaleCost(devices: number) {
  let left = devices
  let prev = 0
  let total = 0
  const rows: { from: number; to: number; count: number; price: number }[] = []
  for (const t of pricing.tiers) {
    const cap = t.upTo - prev
    const n = Math.min(left, cap)
    if (n > 0) {
      rows.push({ from: prev + 1, to: prev + n, count: n, price: t.price })
      total += n * t.price
    }
    left -= n
    prev = t.upTo
    if (left <= 0) break
  }
  return { total, rows }
}

const toDevices = (p: number) => {
  const v = Math.exp(Math.log(100) + (p / 100) * (Math.log(250000) - Math.log(100)))
  const step = v < 1000 ? 50 : v < 10000 ? 250 : 1000
  return Math.round(v / step) * step
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const m = plan.price.monthly
  const price = m == null ? null : billing === 'yearly' ? m * (1 - pricing.yearlyDiscount) : m
  return (
    <Card tone={plan.featured ? 'forest' : 'paper'} className={cx('flex h-full flex-col p-7', plan.featured && 'shadow-float')}>
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-medium tracking-[-0.02em]">{plan.name}</h2>
        {plan.featured && <Badge tone="forest">Most teams</Badge>}
      </div>
      <p className={cx('mt-1.5 text-[14.5px]', plan.featured ? 'text-on-forest-muted' : 'text-muted')}>{plan.blurb}</p>
      <p className="mt-8 flex items-baseline gap-2">
        <span className="text-[48px] font-medium leading-none tracking-[-0.045em] tabular">{price == null || price === 0 ? plan.price.label : eur(price, 2)}</span>
        {plan.price.unit && <span className={cx('text-[14px]', plan.featured ? 'text-on-forest-muted' : 'text-muted')}>{plan.price.unit}</span>}
      </p>
      <p className={cx('mt-2 h-5 text-[13px]', plan.featured ? 'text-on-forest-muted' : 'text-muted')}>
        {price ? (billing === 'yearly' ? `Billed yearly, ${Math.round(pricing.yearlyDiscount * 100)}% off` : 'Billed monthly, lower rates from 1,000 devices') : plan.id === 'sandbox' ? 'No card needed' : 'Annual contract'}
      </p>
      <ButtonLink href={plan.cta.href} variant={plan.featured ? 'volt' : plan.id === 'sandbox' ? 'outline' : 'dark'} block className="mt-7">
        {plan.cta.label}
      </ButtonLink>
      <ul className="mt-7 space-y-3">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[14.5px]">
            <Check className={cx('mt-0.5 size-4 shrink-0', plan.featured ? 'text-volt' : 'text-leaf')} strokeWidth={2.5} aria-hidden />
            {f}
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function PricingPage() {
  const [billing, setBilling] = useStore<Billing>(keys.billing, 'monthly')
  const [pos, setPos] = useState(55)
  const devices = toDevices(pos)
  const { total, rows } = scaleCost(devices)
  const factor = billing === 'yearly' ? 1 - pricing.yearlyDiscount : 1
  const monthly = total * factor

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title={pricing.title}
        body={pricing.body}
        aside={
          <Segmented
            label="Billing period"
            value={billing}
            onChange={setBilling}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: `Yearly, save ${Math.round(pricing.yearlyDiscount * 100)}%` },
            ]}
          />
        }
      />

      <Container>
        <div className="grid gap-4 lg:grid-cols-3">
          {pricing.plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05} className="h-full">
              <PlanCard plan={p} billing={billing} />
            </Reveal>
          ))}
        </div>
      </Container>

      <section id="estimate" aria-labelledby="estimate-title" className="py-20 sm:py-24">
        <Container>
          <Card tone="mint" className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-16 [&>*]:min-w-0">
            <div>
              <h2 id="estimate-title" className="text-[32px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[40px]">
                Estimate your monthly bill
              </h2>
              <p className="mt-4 text-[16px] leading-[1.6] text-muted">Volume tiers are graduated, so every device is billed at the rate of the tier it falls in.</p>
              <Slider
                className="mt-8"
                label="Connected devices"
                value={pos}
                min={0}
                max={100}
                step={0.5}
                onChange={setPos}
                display={devices.toLocaleString('en-US')}
                valueText={`${devices.toLocaleString('en-US')} devices`}
              />
              <table className="mt-6 w-full text-left text-[14.5px]">
                <caption className="sr-only">Cost by volume tier</caption>
                <thead>
                  <tr className="border-b border-line-strong text-muted">
                    <th scope="col" className="py-2 font-medium">
                      Devices
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Rate
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((r) => (
                    <tr key={r.from}>
                      <td className="py-2.5 tabular">
                        {r.from.toLocaleString('en-US')} to {r.to.toLocaleString('en-US')}
                      </td>
                      <td className="py-2.5 text-right tabular">{eur(r.price * factor, 2)}</td>
                      <td className="py-2.5 text-right tabular">{eur(r.count * r.price * factor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col rounded-card bg-paper p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-8">
              <p className="text-[14px] text-muted">Scale plan, {billing === 'yearly' ? 'billed yearly' : 'billed monthly'}</p>
              <p className="mt-2 text-[56px] font-medium leading-none tracking-[-0.05em] tabular sm:text-[72px]" aria-live="polite">
                {eur(monthly)}
                <span className="ml-2 text-[22px] tracking-[-0.02em] text-muted">/ month</span>
              </p>
              <p className="mt-3 text-[15px] text-muted">
                {eur(monthly / devices, 2)} per device on average{billing === 'yearly' && `, ${eur(monthly * 12)} a year`}
              </p>
              {devices >= 100000 && (
                <p className="mt-6 rounded-control bg-volt/50 px-4 py-3 text-[14px] text-ink">At this volume, Enterprise pricing is usually lower. Talk to us for a quote.</p>
              )}
              <ButtonLink href="/contact" className="mt-auto self-start max-lg:mt-8">
                Get a quote in writing
              </ButtonLink>
            </div>
          </Card>
        </Container>
      </section>

      <section id="compare" aria-labelledby="compare-title" className="pb-20 sm:pb-24">
        <Container>
          <SectionHeading id="compare-title" title="Compare plans" />
          <div tabIndex={0} role="region" aria-label="Plan comparison, scrolls sideways" className="relative mt-8 overflow-x-auto rounded-card bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]">
            <table className="w-full min-w-[640px] text-left text-[14.5px]">
              <caption className="sr-only">Features by plan</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-6 py-4 font-medium text-muted">
                    Feature
                  </th>
                  {pricing.plans.map((p) => (
                    <th key={p.id} scope="col" className="px-6 py-4 font-medium">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pricing.compare.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row" className="px-6 py-3.5 font-normal text-ink-2">
                      {row.feature}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-6 py-3.5">
                        {v === true ? (
                          <>
                            <Check className="size-4 text-leaf" strokeWidth={2.5} aria-hidden />
                            <span className="sr-only">Included</span>
                          </>
                        ) : v === false || v === '' ? (
                          <>
                            <Minus className="size-4 text-faint" aria-hidden />
                            <span className="sr-only">Not included</span>
                          </>
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section aria-labelledby="faq-title" className="pb-8">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] [&>*]:min-w-0">
          <SectionHeading id="faq-title" title="Questions, answered" body="Anything else? Our team replies within one business day." />
          <Accordion items={pricing.faq} />
        </Container>
      </section>
      <Cta title="Start free, scale when you are ready" />
    </>
  )
}
