import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { UseCaseCard } from '../components/UseCaseCard'
import { useCases } from '../content'

export function UseCasesTeaser() {
  return (
    <section aria-labelledby="uc-title" className="pb-20 sm:pb-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="uc-title" eyebrow="Use cases" title="Built for everyone who keeps the grid in balance" />
          <ButtonLink href="/use-cases" variant="outline" icon={<ArrowRight className="size-4" aria-hidden />}>
            All use cases
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u, i) => (
            <Reveal key={u.id} delay={i * 0.06} className="h-full">
              <UseCaseCard useCase={u} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
