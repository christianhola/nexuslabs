import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { steps } from '../content'

export function Steps() {
  return (
    <section aria-labelledby="steps-title" className="relative overflow-hidden bg-navy py-20 sm:py-28">
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-[0.05]" viewBox="0 0 1440 600" preserveAspectRatio="xMaxYMid slice">
        <path d="M980 0 L1440 0 L1440 220 L1120 600 L760 600 Z" fill="white" />
      </svg>
      <Container className="relative">
        <SectionHeading id="steps-title" tone="on-navy" eyebrow={steps.eyebrow} title={steps.title} className="max-w-[640px]" />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.items.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.08} className="h-full rounded-card-sm bg-navy-2 p-7 ring-1 ring-navy-line">
                <span aria-hidden className="block text-[56px] font-medium leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-on-navy-muted)]">
                  {s.n}
                </span>
                <h3 className="mt-6 text-[18px] font-medium text-white">
                  <span className="sr-only">Step {s.n}: </span>
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.6] text-on-navy-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  )
}
