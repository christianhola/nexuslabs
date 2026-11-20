import { TextLink } from '../components/Button'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/Typography'
import { audiences, cta, photos } from '../content'

/** "Who we're building for": the two launch markets, each with its vessel. */
export function Audiences() {
  return (
    <section aria-labelledby="audiences-title" className="pb-10 pt-24 sm:pb-12 sm:pt-32">
      <Container>
        <Reveal>
          <SectionHeading id="audiences-title" title="Who we’re building for" size="md" />
        </Reveal>
        <ul className="mx-auto mt-14 grid max-w-[820px] gap-14 sm:grid-cols-2 sm:gap-10">
          {audiences.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 0.1} className="flex flex-col items-center text-center">
                <img src={a.id === 'defense' ? photos.shipFrigate : photos.shipCargo} alt="" loading="lazy" decoding="async" width={1100} height={384} className="h-[84px] w-auto" />
                <h3 className="mt-5 text-[17px] font-medium">{a.title}</h3>
                <p className="mt-2 max-w-[300px] text-pretty text-[15px] leading-[1.5] text-muted">{a.body}</p>
                <TextLink href={a.href} className="mt-3 text-[14px]">
                  {cta.label}
                </TextLink>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
