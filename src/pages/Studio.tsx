import { ButtonLink } from '../components/Button'
import { Label } from '../components/Label'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { TeamMember } from '../components/TeamMember'
import { BRAND, HOME, STUDIO_PAGE, TEAM } from '../content'

export function Studio() {
  return (
    <>
      <PageHeader label={STUDIO_PAGE.label} title={STUDIO_PAGE.title} intro={STUDIO_PAGE.intro} />
      <div className="container-page grid grid-cols-12 gap-3 pb-24">
        <Photo name="samples" alt="Material samples on the studio table" className="col-span-5 aspect-[3/4] md:col-span-3" />
        <Photo name="house" alt="A finished house at dusk" className="col-span-7 aspect-[4/3] self-end md:col-span-5" />
        <Photo name="ceramics" alt="" className="hidden aspect-[3/4] md:col-span-3 md:col-start-10 md:block" />
      </div>

      <section aria-labelledby="team-heading" className="bg-card py-24">
        <div className="container-page">
          <div className="border-t border-ink pt-5">
            <Label number="01">{STUDIO_PAGE.teamLabel}</Label>
          </div>
          <h2 id="team-heading" className="sr-only">
            {STUDIO_PAGE.teamLabel}
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-16 lg:grid-cols-2">
            {TEAM.map((m, i) => (
              <Reveal key={m.number} delay={(i % 2) * 0.08} className={i % 2 ? 'lg:mt-40' : undefined}>
                <TeamMember {...m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="container-page py-24">
        <div className="border-t border-ink pt-5">
          <Label number="02">{STUDIO_PAGE.valuesLabel}</Label>
        </div>
        <h2 id="values-heading" className="font-statement mt-8 max-w-[18ch] text-[clamp(2.5rem,4.8vw,4.75rem)] text-balance">
          {HOME.highlightsTitle}
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3">
          {STUDIO_PAGE.values.map((v, i) => (
            <li key={v.title} className="border-t border-line pt-5">
              <span className="label-sm tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 text-[clamp(1.5rem,2.4vw,2.25rem)] leading-none font-medium tracking-[-0.045em]">{v.title}</h3>
              <p className="mt-3 max-w-xs text-[15px] leading-snug text-ink-2">{v.body}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-20 grid grid-cols-2 gap-y-10 border-t border-line pt-8 md:grid-cols-4">
          {HOME.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="label-sm mt-1 text-muted">{s.label}</dt>
              <dd className="text-[clamp(2.75rem,5vw,4.5rem)] leading-none font-medium tracking-[-0.05em] tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="visit-heading" className="on-dark bg-night text-snow">
        <div className="container-page grid gap-10 py-20 md:grid-cols-12">
          <div className="md:col-span-6">
            <Label tone="light">Visit the studio</Label>
            <h2 id="visit-heading" className="font-display mt-5 text-[clamp(2.5rem,5vw,5rem)]">
              {BRAND.address[0]}
            </h2>
            <p className="mt-4 text-[16px] text-snow-muted">
              {BRAND.address[1]}. {BRAND.hours}.
            </p>
            <ButtonLink to="/book" variant="light" icon className="mt-8">
              Book a studio visit
            </ButtonLink>
          </div>
          <Photo name="hall" alt="" className="aspect-[4/3] md:col-span-5 md:col-start-8" />
        </div>
      </section>
    </>
  )
}
