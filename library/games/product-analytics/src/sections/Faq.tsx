import { Accordion } from '../components/Accordion'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { faq } from '../content'
import { Link } from '../lib/router'

export function Faq({ items = faq, title = 'Questions, answered' }: { items?: readonly { q: string; a: string }[]; title?: string }) {
  return (
    <section aria-labelledby="faq-h" className="pb-24 sm:pb-32">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          align="left"
          id="faq-h"
          eyebrow="FAQ"
          title={title}
          lede={
            <>
              Something else on your mind?{' '}
              <Link href="/contact" className="rounded font-semibold text-leaf underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-leaf">
                Talk to us
              </Link>
              .
            </>
          }
        />
        <Accordion items={items} />
      </Container>
    </section>
  )
}
