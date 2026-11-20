import { Container } from '../components/Container'
import { PlanCard } from '../components/PlanCard'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { plans } from '../content'
import { Link } from '../lib/router'

export function PricingTeaser() {
  return (
    <section aria-labelledby="pricing-h" className="pb-24 sm:pb-32">
      <Container>
        <SectionHeading id="pricing-h" eyebrow="Pricing" title="Pay for events, not for seats" lede="Every plan includes every analysis. Invite the whole company; you only pay when your product grows." />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <PlanCard plan={p} billing="monthly" />
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-[14.5px] text-muted">
          Need more than 50M events or a custom contract?{' '}
          <Link href="/pricing#compare" className="rounded font-semibold text-leaf underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-leaf">
            Compare every plan
          </Link>
        </p>
      </Container>
    </section>
  )
}
