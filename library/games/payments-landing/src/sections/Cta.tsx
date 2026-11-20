import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { Shapes } from '../components/Shapes'
import { cta } from '../content'

export function Cta() {
  return (
    <section aria-labelledby="cta-title" className="pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-panel bg-mist px-6 py-14 text-center sm:px-12 sm:py-20">
          <Shapes />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-[640px] text-balance text-[32px] font-medium leading-[1.12] tracking-[-0.035em] text-ink sm:text-[44px]">
              {cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-[1.6] text-muted">{cta.body}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={cta.primary.href} size="lg" icon={<ArrowRight className="size-4" aria-hidden />}>
                {cta.primary.label}
              </ButtonLink>
              <ButtonLink href={cta.secondary.href} size="lg" variant="outline">
                {cta.secondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
