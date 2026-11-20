import { Accordion } from '../components/Accordion'
import { Reveal } from '../components/Reveal'
import { Container, SectionHeading } from '../components/ui'
import { faq } from '../content'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 bg-page py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-20">
        <Reveal>
          <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion items={faq.items.map((i) => ({ q: i.q, a: i.a }))} defaultOpen={[0]} />
        </Reveal>
      </Container>
    </section>
  )
}
