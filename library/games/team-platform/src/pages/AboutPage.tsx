import { ArrowUpRight } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Container } from '../components/Container'
import { byId } from '../components/ProfileCard'
import { Reveal } from '../components/Reveal'
import { PageHeader, SectionHeading } from '../components/SectionHeading'
import { about, images } from '../content'

export function AboutPage() {
  return (
    <>
      <Container>
        <PageHeader eyebrow={about.eyebrow} title={about.title} body={about.body} />
        <img src={images.aboutTeam} alt={about.imageAlt} width={1536} height={1024} className="aspect-[16/8] w-full rounded-[28px] object-cover" />
        <dl className="mt-10 grid grid-cols-2 gap-6 border-b border-line pb-10 md:grid-cols-4">
          {about.numbers.map((n) => (
            <div key={n.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-[15px] text-muted">{n.label}</dt>
              <dd className="font-display text-[44px] font-semibold leading-none tracking-[-0.045em] text-ink">{n.value}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container as="section" className="grid gap-12 py-20 lg:grid-cols-2">
        <SectionHeading eyebrow="Our story" title="From one warehouse to a million people" />
        <ol className="relative space-y-8 border-l-[1.5px] border-ink pl-8">
          {about.timeline.map((t) => (
            <li key={t.year} className="relative">
              <span className="round absolute -left-[41px] top-1 size-4 rounded-full border-[1.5px] border-ink bg-mint" aria-hidden />
              <p className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">{t.year}</p>
              <p className="mt-1 text-[16px] text-muted">{t.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="bg-backdrop py-20">
        <Container>
          <SectionHeading eyebrow="What we believe" title="Three rules we build by" />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {about.values.map((v, i) => (
              <li key={v.title}>
                <Reveal delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-[var(--radius-card)] border border-line bg-card p-7">
                    <p className="font-display text-[15px] font-semibold text-faint">0{i + 1}</p>
                    <h3 className="mt-3 font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">{v.title}</h3>
                    <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{v.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container as="section" className="py-20">
        <SectionHeading eyebrow="Leadership" title="The people who answer the hard emails" />
        <ul className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {about.leadership.map((id) => {
            const p = byId(id)!
            return (
              <li key={id}>
                <div className="aspect-square overflow-hidden rounded-[22px] bg-mist">
                  <Avatar name={p.name} face={p.face} size={1} className="!size-full [&>span]:rounded-[22px]" />
                </div>
                <p className="mt-3 text-[16px] font-semibold text-ink">{p.name}</p>
                <p className="text-[14.5px] text-muted">{p.role}</p>
              </li>
            )
          })}
        </ul>
      </Container>

      <Container as="section" id="careers" className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="Careers" title="Come build with us" body="We are 96 people across Lisbon, Berlin and Austin, plus a few who work from anywhere in Europe." />
        <ul className="divide-y divide-line border-y border-line">
          {about.roles.map((r) => (
            <li key={r.title}>
              <a href={`mailto:${about.jobsEmail}?subject=${encodeURIComponent(r.title)}`} className="group flex items-center justify-between gap-4 py-5 focus-visible:outline-2 focus-visible:outline-ink">
                <span>
                  <span className="block text-[17px] font-semibold text-ink group-hover:underline">{r.title}</span>
                  <span className="block text-[14.5px] text-muted">
                    {r.team} · {r.place}
                  </span>
                </span>
                <ArrowUpRight className="size-5 text-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
