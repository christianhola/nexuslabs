import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { PlanCard } from '../components/PlanCard'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { plans, plansTeaser } from '../content'

export function PlansTeaser() {
  return (
    <section aria-labelledby="plans-title" className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="plans-title" eyebrow={plansTeaser.eyebrow} title={plansTeaser.title} />
          <ButtonLink href="/pricing" variant="ghost" icon={<ArrowRight className="size-4" aria-hidden />}>
            Compare every plan
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <PlanCard plan={p} billing="monthly" className="h-full" />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
