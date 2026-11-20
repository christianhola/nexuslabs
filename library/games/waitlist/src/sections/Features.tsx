import { FeatureMock } from '../components/FeatureMocks'
import { Reveal } from '../components/Reveal'
import { Card, Container, SectionHeading } from '../components/ui'
import { features } from '../content'

/** Features preview: four cards, each with a small animated product mock. */
export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-6 bg-stage py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading id="features-title" eyebrow={features.eyebrow} title={features.title} body={features.body} />
        </Reveal>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.items.map((item, i) => (
            <li key={item.title} className="flex">
              <Reveal delay={i * 0.06} className="flex w-full">
                <Card interactive padding="none" className="flex w-full flex-col overflow-hidden">
                  <FeatureMock kind={item.mock} className="bg-stage p-4 pb-0 [&>.mock]:rounded-b-none [&>.mock]:border-b-0" />
                  <div className="border-t border-line-soft p-5">
                    <h3 className="text-heading font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-copy text-muted">{item.body}</p>
                  </div>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
