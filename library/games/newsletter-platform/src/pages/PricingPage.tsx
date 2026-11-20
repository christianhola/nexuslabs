import { Check, Minus } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { Container } from '../components/Container'
import { PageHeader } from '../components/PageHeader'
import { PlanCard } from '../components/PlanCard'
import { Segmented } from '../components/Segmented'
import { Slider } from '../components/Slider'
import type { Plan } from '../content'
import { compare, faqs, plans, subscriberSteps } from '../content'
import { useStored } from '../lib/storage'
import { Closing } from '../sections/Closing'

/* Monthly price for a plan at a list size. Annual billing gives two months free. */
export function priceFor(plan: Plan, subs: number, annual: boolean) {
  if (plan.base == null) return null
  if (plan.base === 0) return 0
  const extra = Math.max(0, subs - 1000) / 1000
  const monthly = Math.round(plan.base + extra * plan.perK)
  return annual ? Math.round((monthly * 10) / 12) : monthly
}

export function PricingPage() {
  const [step, setStep] = useStored('pricing-step', 2)
  const [billing, setBilling] = useStored<'monthly' | 'annual'>('billing', 'annual')
  const subs = subscriberSteps[Math.min(step, subscriberSteps.length - 1)]
  const annual = billing === 'annual'
  return (
    <>
      <PageHeader eyebrow="Pricing" title="Start free. Grow into it." intro="Every plan includes unlimited issues and a custom domain. Prices scale with your list, and you keep 100% of subscription revenue." />
      <Container className="pb-8">
        <div className="grid grid-cols-1 items-end gap-6 rounded-[var(--radius-card)] border border-line bg-panel p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
          <Slider label="Subscribers" min={0} max={subscriberSteps.length - 1} value={step} onChange={setStep} display={`${subs.toLocaleString('en-US')}${step === subscriberSteps.length - 1 ? '+' : ''}`} />
          <div className="flex items-center gap-3">
            <Segmented
              label="Billing"
              value={billing}
              onChange={setBilling}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Annual' },
              ]}
            />
            <Badge tone="pink">2 months free</Badge>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p) => {
            const price = priceFor(p, subs, annual)
            const overLaunch = p.id === 'launch' && subs > 2500
            return <PlanCard key={p.id} plan={p} price={price} period="/month" note={overLaunch ? 'Your list is over the free limit' : price && annual ? `Billed $${(price * 12).toLocaleString('en-US')} a year` : p.id === 'launch' ? 'Free forever' : ''} />
          })}
        </div>
      </Container>

      <Container className="py-16">
        <h2 className="display text-[34px] uppercase text-white sm:text-[44px]">Compare plans</h2>
        <div tabIndex={0} role="region" aria-label="Plan comparison" className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line">
          <table className="w-full min-w-[680px] text-[15px]">
            <caption className="sr-only">Features by plan</caption>
            <thead className="bg-panel text-left">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium text-muted">
                  Feature
                </th>
                {plans.map((p) => (
                  <th key={p.id} scope="col" className="px-5 py-4 font-semibold text-ink">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {compare.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="px-5 py-3.5 text-left font-normal text-body">
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className="px-5 py-3.5 text-ink">
                      {v === 'yes' ? <Check className="size-4.5 text-pink-text" aria-label="Included" /> : v === '' ? <Minus className="size-4 text-faint" aria-label="Not included" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      <Container className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="display text-[34px] uppercase text-white sm:text-[44px]">Questions, answered</h2>
        <Accordion items={faqs} />
      </Container>
      <Closing />
    </>
  )
}
