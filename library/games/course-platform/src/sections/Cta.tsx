import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { cta } from '../content'

export function Cta() {
  return (
    <section aria-labelledby="cta-title" className="py-20 lg:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-flame-soft px-6 py-16 text-center sm:px-12">
            <div className="grid-dots pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" aria-hidden />
            <h2 id="cta-title" className="relative mx-auto max-w-[640px] text-balance font-display text-[34px] font-medium leading-[1.1] tracking-[-0.025em] text-ink sm:text-[44px]">
              {cta.title}
            </h2>
            <p className="relative mx-auto mt-4 max-w-[480px] text-[16px] text-muted">{cta.lead}</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Button href={cta.primary.href} size="lg" arrow>
                {cta.primary.label}
              </Button>
              <Button href={cta.secondary.href} size="lg" variant="outline">
                {cta.secondary.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
