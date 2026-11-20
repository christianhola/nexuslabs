import { useMemo, useState } from 'react'
import { Check, Minus } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { PageHeader } from '../components/PageHeader'
import { PlanCard } from '../components/PlanCard'
import { Segmented } from '../components/Segmented'
import { SectionHeading } from '../components/SectionHeading'
import { Slider } from '../components/Slider'
import { plans, pricing } from '../content'
import { cx } from '../lib/cx'
import { keys, useStore } from '../lib/store'

const usd = (n: number, d = 0) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: d, minimumFractionDigits: d })
const AVG_TICKET = 60

export function PricingPage() {
  const [billing, setBilling] = useStore<'monthly' | 'yearly'>(keys.billing, 'monthly')
  const [cardVol, setCardVol] = useState(25_000)
  const [fxVol, setFxVol] = useState(10_000)

  const costs = useMemo(
    () =>
      plans.map((p) => {
        const sub = billing === 'yearly' ? p.yearly : p.monthly
        const card = cardVol * (p.cardRate / 100) + (cardVol / AVG_TICKET) * 0.3
        const fx = fxVol * (p.fxRate / 100)
        return { id: p.id, name: p.name, sub, card, fx, total: sub + card + fx }
      }),
    [billing, cardVol, fxVol],
  )
  const cheapest = costs.reduce((a, b) => (b.total < a.total ? b : a))

  return (
    <>
      <PageHeader eyebrow="Pricing" title={pricing.title} body={pricing.body}>
        <div className="mt-8 flex items-center gap-3">
          <Segmented
            label="Billing period"
            value={billing}
            onChange={setBilling}
            options={[
              { id: 'monthly', label: pricing.monthly },
              { id: 'yearly', label: pricing.yearly },
            ]}
          />
          <Badge tone="teal">{pricing.yearlyNote}</Badge>
        </div>
      </PageHeader>
      <section className="relative -mt-8 pb-16">
        <Container className="grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} billing={billing} className="h-full" />
          ))}
        </Container>
      </section>

      <section id="calculator" aria-labelledby="calc-title" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <Card tone="mist" padding="lg" className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading id="calc-title" title={pricing.calculator.title} body={pricing.calculator.body} />
              <div className="mt-10 space-y-8">
                <Slider label={pricing.calculator.cardLabel} value={cardVol} min={0} max={250_000} step={1000} onChange={setCardVol} format={(v) => usd(v)} />
                <Slider label={pricing.calculator.fxLabel} value={fxVol} min={0} max={250_000} step={1000} onChange={setFxVol} format={(v) => usd(v)} />
              </div>
            </div>
            <ul className="grid gap-3 self-center" aria-live="polite">
              {costs.map((c) => {
                const best = c.id === cheapest.id
                return (
                  <li key={c.id} className={cx('rounded-card-sm bg-white p-5 transition-shadow', best ? 'shadow-[0_0_0_2px_var(--color-teal)]' : 'shadow-card')}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-[16px] font-medium text-ink">
                        {c.name}
                        {best && <Badge tone="teal">{pricing.calculator.cheapest}</Badge>}
                      </p>
                      <p className="tabular text-[22px] font-medium tracking-[-0.02em] text-ink">
                        {usd(c.total, 2)}
                        <span className="text-[13px] font-normal text-muted"> /mo</span>
                      </p>
                    </div>
                    <p className="tabular mt-1 text-[13px] text-muted">
                      Plan {usd(c.sub)} + cards {usd(c.card, 2)} + FX {usd(c.fx, 2)}
                    </p>
                  </li>
                )
              })}
            </ul>
          </Card>
        </Container>
      </section>

      <section id="compare" aria-labelledby="compare-title" className="scroll-mt-24 py-16 sm:py-20">
        <Container>
          <SectionHeading id="compare-title" title={pricing.compare.title} />
          <div className="mt-10 overflow-x-auto rounded-card border border-line" tabIndex={0} role="region" aria-label="Plan comparison table, scrolls sideways">
            <table className="w-full min-w-[640px] text-left text-[14.5px]">
              <caption className="sr-only">Plan comparison</caption>
              <thead>
                <tr className="border-b border-line bg-mist-2">
                  <th scope="col" className="px-5 py-4 font-medium text-muted">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="px-5 py-4 text-[15px] font-semibold text-ink">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {pricing.compare.rows.map((r) => (
                  <tr key={r.label}>
                    <th scope="row" className="px-5 py-3.5 font-normal text-ink-2">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className="tabular px-5 py-3.5 text-ink">
                        {v === true ? (
                          <Check className="size-4 text-teal-ink" aria-label="Included" />
                        ) : v === false ? (
                          <Minus className="size-4 text-faint" aria-label="Not included" />
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

      <section aria-labelledby="faq-title" className="pb-24 pt-8">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading id="faq-title" eyebrow="Questions" title="Pricing, answered" />
          <Accordion items={pricing.faq} />
        </Container>
      </section>
    </>
  )
}
