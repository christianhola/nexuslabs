import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { PageHeader } from '../components/PageHeader'
import { Pedigree } from '../components/Pedigree'
import { Reveal } from '../components/Reveal'
import { ThermalImage } from '../components/ThermalImage'
import { SectionHeading } from '../components/Typography'
import { company, photos, why } from '../content'
import { Milestones } from '../sections/Milestones'

/** Initials on a warm-to-cool gradient, a stand-in until real headshots. */
function Avatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
  const hues = ['#ff9a2e,#8a2a06', '#8cbcff,#1d3263', '#ffd36b,#c24a12', '#6ea2ff,#0b1530']
  return (
    <span
      className="round grid size-14 shrink-0 place-items-center rounded-full text-[17px] font-medium text-white"
      style={{ background: `linear-gradient(140deg,${hues[index % hues.length]})` }}
      aria-hidden
    >
      {initials}
    </span>
  )
}

export function Company() {
  return (
    <>
      <PageHeader
        tone="fire"
        eyebrow={company.eyebrow}
        title={company.title}
        body={company.body}
        aside={
          <Card tone="fire" className="mx-auto aspect-[4/4.4] w-full max-w-[440px]">
            <ThermalImage src={photos.crew} alt="A Tidewell engineer seen through a thermal camera" className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-1.5">
              <Pedigree marks={why.pedigree} />
            </div>
          </Card>
        }
      />

      <section aria-label="Company in numbers" className="py-12">
        <Container size="xl">
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {company.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.05} className="flex flex-col gap-1 border-t border-white/12 pt-5">
                <dt className="order-2 text-[14px] text-muted">{s.label}</dt>
                <dd className="order-1 text-[44px] font-medium tracking-[-0.04em] sm:text-[56px]">{s.value}</dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="team-title" className="py-20 sm:py-28">
        <Container size="xl">
          <Reveal>
            <SectionHeading id="team-title" title="Leadership" body="Engineers and operators from launch, magnets, shipping and nuclear licensing." size="md" />
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {company.team.map((p, i) => (
              <Reveal as="li" key={p.name} delay={(i % 3) * 0.05}>
                <Card className="flex h-full gap-4 p-6">
                  <Avatar name={p.name} index={i} />
                  <div>
                    <h3 className="text-[17px] font-medium">{p.name}</h3>
                    <p className="text-[14px] text-plasma-text">{p.role}</p>
                    <p className="mt-2 text-pretty text-[15px] leading-[1.5] text-muted">{p.bio}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="values-title" className="py-20">
        <Container size="xl">
          <Reveal>
            <SectionHeading id="values-title" title="How we work" size="md" />
          </Reveal>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {company.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.06}>
                <Card tone={i === 0 ? 'fire' : i === 1 ? 'ocean' : 'stripes'} className="flex h-[280px] flex-col justify-end p-7">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
                  <h3 className="text-[22px] font-medium tracking-[-0.02em]">{v.title}</h3>
                  <p className="mt-2 text-pretty text-[16px] leading-[1.5] text-white/85">{v.body}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <Milestones title="Our story so far" />

      <section aria-labelledby="backers-title" className="pb-24 pt-8">
        <Container size="xl" className="flex flex-col items-center gap-8 text-center">
          <h2 id="backers-title" className="text-[15px] font-medium text-muted">
            Backed by
          </h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {company.backers.map((b) => (
              <li key={b} className="text-[20px] font-medium tracking-[-0.02em] text-soft">
                {b}
              </li>
            ))}
          </ul>
          <ButtonLink href="/careers" size="lg" className="mt-6">
            See open roles
          </ButtonLink>
        </Container>
      </section>
    </>
  )
}
