import { Check, Minus } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { PlanCard } from '../components/PlanCard'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { COMPARE, FAQ, PLANS } from '../content'
import { useStored } from '../lib/storage'

export function Pricing() {
  const [billing, setBilling] = useStored<'monthly' | 'yearly'>('billing', 'yearly')
  const yearly = billing === 'yearly'
  return (
    <>
      <section aria-labelledby="pricing-title" className="pt-[72px] pb-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
          <SectionHeading id="pricing-title" eyebrow="Pricing" title="Free until you save a lot" lead="Every plan has natural-language search and a note on every save. Pay when your shelf outgrows 500 links." />
          <div className="mt-10 flex justify-center">
            <Segmented
              label="Billing period"
              value={billing}
              onChange={setBilling}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: <>Yearly <span className="rounded-xs bg-lime-soft px-1.5 text-[12px] text-leaf">2 months free</span></> },
              ]}
            />
          </div>
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <PlanCard key={p.id} plan={p} yearly={yearly} />
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="compare-title" className="border-t border-line bg-panel py-24">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
          <h2 id="compare-title" className="text-[32px] font-bold tracking-[-0.04em]">
            Compare plans
          </h2>
          <div className="relative mt-8 overflow-x-auto rounded-xl ring-1 ring-line" tabIndex={0} role="region" aria-label="Plan comparison table">
            <table className="w-full min-w-[560px] border-collapse bg-paper text-left text-[15px]">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-4 font-medium text-muted">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className="px-5 py-4 font-semibold">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.feature} className="border-b border-line last:border-0">
                    <th scope="row" className="px-5 py-3.5 font-normal text-ink-2">
                      {row.feature}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-5 py-3.5">
                        {v === true ? (
                          <>
                            <Check aria-hidden className="size-4.5 text-leaf" strokeWidth={2.5} />
                            <span className="sr-only">Included</span>
                          </>
                        ) : v === false ? (
                          <>
                            <Minus aria-hidden className="size-4.5 text-faint" />
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
        </div>
      </section>
      <section aria-labelledby="pfaq-title" className="py-24">
        <div className="mx-auto max-w-[880px] px-5 sm:px-8">
          <h2 id="pfaq-title" className="mb-8 text-[32px] font-bold tracking-[-0.04em]">
            Billing questions
          </h2>
          <Accordion items={FAQ.slice(2)} defaultOpen={null} />
        </div>
      </section>
    </>
  )
}
