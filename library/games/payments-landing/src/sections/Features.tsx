import { Container } from '../components/Container'
import { Icon } from '../components/Icon'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { features } from '../content'

export function Features() {
  return (
    <section aria-labelledby="features-title" className="relative -mt-[120px]">
      <Container>
        <Reveal className="rounded-panel bg-white px-6 py-12 shadow-card sm:px-12 sm:py-14 lg:px-[88px] lg:py-[72px]">
          <SectionHeading id="features-title" align="split" eyebrow={features.eyebrow} title={features.title} body={features.body} />
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
            {features.items.map((f) => (
              <li key={f.title}>
                <Icon name={f.icon} className="size-9 text-navy" />
                <h3 className="mt-6 text-[19px] font-medium tracking-[-0.02em] text-ink">{f.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-muted">{f.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
