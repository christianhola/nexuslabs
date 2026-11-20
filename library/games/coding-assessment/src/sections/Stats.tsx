import { Container } from '../components/Container'
import { CountUp } from '../components/Misc'
import { STATS } from '../content'

export function Stats() {
  return (
    <section aria-label="Results" className="border-y border-white/6 bg-[linear-gradient(180deg,#071214,#050b0d)] py-16">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-l border-brand/25 pl-5">
              <dt className="text-[14.5px] text-muted">{s.label}</dt>
              <dd className="mt-2 text-[40px] leading-none font-normal tracking-[-0.03em] text-mint sm:text-[52px]">
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
