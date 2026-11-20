import { Check, Minus } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PlanCard } from '../components/PlanCard'
import { SegmentedControl } from '../components/SegmentedControl'
import { Slider } from '../components/Slider'
import { PageHeader, Section, SectionHeading } from '../components/Section'
import { faqs, plans, pricingPage as p } from '../content'
import { money, number } from '../lib/format'
import { useStored } from '../lib/storage'
import { Guarantee } from '../sections/Guarantee'

/** Picks the cheapest plan whose subscriber cap fits, and prices a month of sending. */
function estimate(list: number, annual: boolean) {
  const c = p.calculator
  const messages = Math.round(list * c.campaignsPerMonth * (1 + c.replyRate))
  const plan = list <= 10000 ? plans[0] : list <= 100000 ? plans[1] : plans[2]
  const platform = plan.monthly === null ? 1200 : plan.monthly * (annual ? 1 - p.annualDiscount : 1)
  const billable = Math.max(0, messages - plan.included)
  const usage = billable * plan.perMessage
  return { messages, plan, platform, usage, total: platform + usage }
}

export function Pricing() {
  const [billing, setBilling] = useStored<'monthly' | 'annual'>('billing', 'annual')
  const [list, setList] = useStored<number>('calc-list', p.calculator.initial)
  const annual = billing === 'annual'
  const e = estimate(list, annual)

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} body={p.body}>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <SegmentedControl
            label="Billing period"
            value={billing}
            onChange={setBilling}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'annual', label: 'Yearly' },
            ]}
          />
          <Badge tone="saffron">Save {Math.round(p.annualDiscount * 100)}% yearly</Badge>
        </div>
      </PageHeader>

      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} annual={annual} discount={p.annualDiscount} />
          ))}
        </div>
      </Section>

      <Section aria-labelledby="calc-title" className="border-t border-line">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <SectionHeading title={<span id="calc-title">{p.calculator.title}</span>} body={p.calculator.body} />
          <Card className="grid gap-8 p-7 sm:p-9">
            <Slider label="SMS subscribers" value={list} min={p.calculator.min} max={p.calculator.max} step={p.calculator.step} onChange={setList} format={number} />
            <dl className="grid grid-cols-2 gap-5 border-y border-line py-6 text-[14px] sm:grid-cols-4">
              <div>
                <dt className="text-faint">Plan</dt>
                <dd className="mt-1 font-semibold text-white">{e.plan.name}</dd>
              </div>
              <div>
                <dt className="text-faint">Messages</dt>
                <dd className="mt-1 font-semibold tabular-nums text-white">{number(e.messages)}</dd>
              </div>
              <div>
                <dt className="text-faint">Platform</dt>
                <dd className="mt-1 font-semibold tabular-nums text-white">{money(e.platform)}</dd>
              </div>
              <div>
                <dt className="text-faint">Usage</dt>
                <dd className="mt-1 font-semibold tabular-nums text-white">{money(e.usage)}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div aria-live="polite">
                <p className="text-[14px] text-faint">Estimated monthly total{e.plan.monthly === null ? ' (typical Scale fee)' : ''}</p>
                <p className="font-display text-[44px] font-medium leading-none tracking-[-0.03em] tabular-nums text-white">{money(e.total)}</p>
              </div>
              <Button href={e.plan.href} arrow size="lg">
                {e.plan.cta}
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <Section aria-labelledby="compare-title" className="border-t border-line">
        <SectionHeading title={<span id="compare-title">Compare plans</span>} />
        <div className="mt-10 overflow-x-auto rounded-card border border-line" tabIndex={0} role="region" aria-label="Plan comparison table">
          <table className="w-full min-w-[640px] text-left text-[15px]">
            <thead className="bg-panel">
              <tr>
                <th scope="col" className="p-5 font-medium text-faint">
                  Feature
                </th>
                {p.compare.columns.map((c) => (
                  <th key={c} scope="col" className="p-5 font-display text-[17px] font-semibold text-white">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.compare.rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th scope="row" className="p-5 font-normal text-soft">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className="p-5 text-soft">
                      {v === true ? <Check aria-label="Included" className="size-5 text-mint-text" /> : v === false ? <Minus aria-label="Not included" className="size-5 text-faint" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section aria-labelledby="pfaq" className="border-t border-line">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading title={<span id="pfaq">Billing questions</span>} body="More answers on the FAQ page." />
          <Accordion items={faqs.filter((f) => f.category === 'Billing').map((f, i) => ({ id: `b${i}`, title: f.q, body: f.a }))} defaultOpen="b0" />
        </div>
      </Section>
      <Guarantee />
    </>
  )
}
