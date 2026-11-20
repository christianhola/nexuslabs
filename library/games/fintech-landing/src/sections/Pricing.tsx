import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { BillingToggle } from '../components/BillingToggle'
import { Button } from '../components/Button'
import { PlanCard } from '../components/PlanCard'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { pricing } from '../content'

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  return (
    <Section id="pricing">
      <SectionHeading eyebrow={pricing.eyebrow} title={pricing.title} body={pricing.body} />
      <Reveal className="mt-10 flex justify-center">
        <BillingToggle yearly={yearly} onChange={setYearly} />
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-[1120px] gap-4 lg:grid-cols-3">
        {pricing.plans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 0.08} className="h-full">
            <PlanCard plan={plan} yearly={yearly} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex justify-center">
        <Button href="/pricing#compare" variant="ghost" size="sm" className="text-[15px]">
          Compare every feature <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" aria-hidden />
        </Button>
      </Reveal>
    </Section>
  )
}
