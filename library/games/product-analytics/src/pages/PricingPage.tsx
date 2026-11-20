import { Check, Minus } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { PageHeader } from '../components/PageHeader'
import { PlanCard, yearly } from '../components/PlanCard'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Slider } from '../components/Slider'
import { comparison, plans, pricingFaq } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'
import { Faq } from '../sections/Faq'

// Slider positions map to event volumes (millions), so small and large teams both get fine control.
const stops = [0.5, 1, 2, 3, 5, 8, 10, 15, 20, 30, 50, 75, 100, 150, 200]

function monthlyCost(plan: (typeof plans)[number], events: number) {
  if (plan.id === 'free') return events <= plan.included ? 0 : null
  const extra = Math.max(0, events - plan.included)
  return plan.monthly + extra * plan.overage
}

const volume = (i: number) => {
  const m = stops[i]!
  return m >= 1 ? `${m}M` : `${m * 1000}k`
}

export function PricingPage() {
  const [billing, setBilling] = useStored<'monthly' | 'yearly'>('billing', 'monthly')
  const [stop, setStop] = useState(4)
  const events = stops[stop]! * 1_000_000
  const costs = plans.map((p) => ({ plan: p, cost: monthlyCost(p, events) }))
  const best = costs.filter((c) => c.cost !== null && !(c.plan.id === 'scale' && events < 30_000_000)).sort((a, b) => a.cost! - b.cost!)[0] ?? costs[2]!
  const factor = billing === 'yearly' ? yearly(1) / 12 : 1

  return (
    <>
      <PageHeader eyebrow="Pricing" title="Simple pricing that grows with your product" lede="Every plan has every analysis. Pay for events; seats are free.">
        <div className="mt-8 flex flex-col items-center gap-2">
          <Segmented
            tone="dark"
            label="Billing period"
            value={billing}
            onChange={setBilling}
            className="bg-white/70"
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
          <p className="text-[13.5px] text-body">Yearly billing gets two months free.</p>
        </div>
      </PageHeader>

      <Container className="pb-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} billing={billing} />
          ))}
        </div>

        <section id="calculator" aria-labelledby="calc-h" className="mt-24 scroll-mt-24">
          <Card pad="lg" className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 id="calc-h" className="font-display text-[28px] font-bold tracking-[-0.04em] text-ink sm:text-[34px]">
                What would you pay?
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">Drag to your monthly event volume. Not sure? A typical B2B product sends 40 to 80 events per active user per day.</p>
              <div className="mt-8">
                <Slider label="Events per month" min={0} max={stops.length - 1} value={stop} onChange={setStop} format={volume} />
              </div>
            </div>
            <ul className="flex flex-col gap-2.5" aria-live="polite">
              {costs.map(({ plan, cost }) => {
                const on = plan.id === best.plan.id
                return (
                  <li key={plan.id} className={cx('flex items-center justify-between rounded-[14px] px-5 py-4', on ? 'bg-night text-on-dark' : 'bg-wash text-ink')}>
                    <span className="flex items-center gap-2 font-display text-[15px] font-semibold">
                      {plan.name}
                      {on ? <Badge tone="lime">Best fit</Badge> : null}
                    </span>
                    <span className="font-display text-[20px] font-bold tracking-[-0.03em]">
                      {cost === null ? (
                        <span className={cx('text-[14px] font-semibold', on ? 'text-white/75' : 'text-muted')}>Over the limit</span>
                      ) : (
                        <>
                          ${Math.round(cost * factor).toLocaleString('en-US')}
                          <span className={cx('ml-1 text-[13px] font-medium', on ? 'text-white/75' : 'text-muted')}>/ mo</span>
                        </>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </section>

        <section id="compare" aria-labelledby="compare-h" className="mt-24 scroll-mt-24">
          <SectionHeading id="compare-h" title="Compare plans" lede="Everything in Free is in Growth, and everything in Growth is in Scale." />
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-card shadow-card" tabIndex={0} role="region" aria-label="Plan comparison table">
            <table className="w-full min-w-[640px] text-left text-[14.5px]">
              <caption className="sr-only">Features by plan</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[34%] px-6 py-5 font-display text-[14px] font-semibold text-muted">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="px-6 py-5 font-display text-[16px] font-bold text-ink">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {comparison.groups.map((g) => (
                <tbody key={g.name}>
                  <tr>
                    <th colSpan={4} scope="colgroup" className="bg-wash px-6 py-2.5 font-display text-[13px] font-semibold text-ink">
                      {g.name}
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <th scope="row" className="px-6 py-3.5 font-normal text-body">
                        {r.label}
                      </th>
                      {r.values.map((v, i) => (
                        <td key={i} className="px-6 py-3.5 text-ink">
                          {v === true ? (
                            <Check className="size-4 text-leaf" strokeWidth={3} aria-label="Included" role="img" />
                          ) : v === false ? (
                            <Minus className="size-4 text-faint" aria-label="Not included" role="img" />
                          ) : (
                            v
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[15px] text-body">
            Over 200M events, or need a security review?
            <Button href="/contact?topic=pricing" variant="dark" size="md">
              Talk to us
            </Button>
          </div>
        </section>
      </Container>
      <Faq items={pricingFaq} title="Pricing questions" />
    </>
  )
}
