import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Stat } from '../components/Stat'
import { mission } from '../content'

export function Mission() {
  return (
    <section aria-labelledby="mission-title" className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SectionHeading id="mission-title" align="center" eyebrow={mission.eyebrow} title={mission.title} body={mission.body} />
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-[880px] gap-10 text-center sm:grid-cols-3">
          {mission.stats.map((s) => (
            <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </Container>
    </section>
  )
}
