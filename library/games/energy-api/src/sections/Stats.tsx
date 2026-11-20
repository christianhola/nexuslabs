import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { Stat } from '../components/Stat'
import { stats } from '../content'

export function Stats() {
  return (
    <section aria-label="Gridwise in numbers" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <Stat value={s.value} suffix={s.suffix} decimals={s.decimals} label={s.label} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
