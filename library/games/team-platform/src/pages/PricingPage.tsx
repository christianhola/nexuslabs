import { Check, Minus } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { PlanCard } from '../components/PlanCard'
import { PageHeader, SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Slider } from '../components/Slider'
import { compareRows, plans, pricingFaq } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'

export function PricingPage() {
  const [billing, setBilling] = useStored<'monthly' | 'yearly'>('billing', 'yearly')
  const [seats, setSeats] = useStored<number>('seats', 250)
  const yearly = billing === 'yearly'
  return (
    <>
      <Container>
        <PageHeader eyebrow="Pricing" title="Simple pricing per person" body="Pay for the people who can sign in, nothing else. Leavers drop off automatically through your HR sync." />
        <div className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-line bg-mist p-5 sm:p-6 lg:flex-row lg:items-center lg:gap-10">
          <div className="flex items-center gap-3">
            <Segmented
              label="Billing period"
              value={billing}
              onChange={setBilling}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
            <Badge tone="mint">Save 20% yearly</Badge>
          </div>
          <div className="flex-1">
            <Slider label="How many people?" value={seats} min={25} max={5000} step={25} onChange={setSeats} display={seats.toLocaleString('en-US')} />
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} yearly={yearly} seats={seats} />
          ))}
        </div>
        <p className="mt-6 text-[14px] text-faint">Prices in US dollars, excluding tax. Nonprofits and schools get 40% off.</p>
      </Container>

      <Container as="section" className="py-20 sm:py-24">
        <SectionHeading title="Compare plans" />
        <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-line focus-visible:outline-2 focus-visible:outline-ink" tabIndex={0} role="region" aria-label="Plan comparison, scrollable">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <caption className="sr-only">Features by plan</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="p-4 text-[14px] font-medium text-muted sm:p-5">
                  Feature
                </th>
                {plans.map((p) => (
                  <th key={p.id} scope="col" className={cx('w-[20%] p-4 text-center text-[15px] font-semibold text-ink sm:p-5', p.featured && 'bg-mint-soft')}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r) => (
                <tr key={r.label} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-[15px] font-normal text-body sm:p-5">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className={cx('p-4 text-center text-[14.5px] text-ink sm:p-5', plans[i].featured && 'bg-mint-soft')}>
                      {v === true ? <Check className="mx-auto size-5 text-leaf" strokeWidth={2.5} aria-label="Included" /> : v === false ? <Minus className="mx-auto size-5 text-faint" aria-label="Not included" /> : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      <Container as="section" className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading title="Questions" body="Anything else? Our team answers within a working day." />
          <Button href="/demo" variant="soft" className="mt-6" arrow>
            Talk to sales
          </Button>
        </div>
        <Accordion items={pricingFaq} defaultOpen={0} />
      </Container>
    </>
  )
}
