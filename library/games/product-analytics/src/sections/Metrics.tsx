import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { metrics, steps } from '../content'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'

/* Proof numbers on a dark band, then the three setup steps. */
export function Metrics() {
  return (
    <section aria-labelledby="steps-h" className="pb-24 sm:pb-32">
      <Container>
        <div className="rounded-[28px] bg-night px-6 py-10 text-on-dark sm:px-12 sm:py-14">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col-reverse gap-2">
                <dt className="text-[14px] leading-snug text-white/75">{m.label}</dt>
                <dd className="font-display text-[36px] font-bold tracking-[-0.045em] text-lime sm:text-[48px]">
                  <CountUp value={m.value} decimals={m.decimals} suffix={m.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 sm:mt-32">
          <SectionHeading align="left" id="steps-h" eyebrow="How it works" title="From one snippet to your first signal" lede="No tracking plan workshop, no data team on standby. Pulseboard starts useful and gets sharper as it learns your product." />
          <ol className="flex flex-col gap-4">
            {steps.map((s, i) => (
              <li key={s.n}>
                <Reveal delay={i * 0.08} className="flex gap-5 rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-card">
                  <span className="font-display text-[15px] font-bold text-leaf" aria-hidden>
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold tracking-[-0.02em] text-ink">{s.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
