import { Stat } from '../components/Stat'
import { Section } from '../components/Section'
import { stats } from '../content'

export function Stats() {
  return (
    <Section aria-label="Results" className="py-16 sm:py-20">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </Section>
  )
}
