import { Check } from 'lucide-react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { images } from '../content'

const points = ['Team seats with SSO and SCIM', 'Learning paths with due dates', 'Completion reports by manager', 'SCORM export and an open API']

/* The B2B band: train your team and customers, with a photo. */
export function Teams() {
  return (
    <section aria-labelledby="teams-title" className="pb-20 lg:pb-28">
      <Container>
        <div className="grid grid-cols-1 overflow-hidden rounded-[var(--radius-panel)] bg-night text-on-dark lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <Reveal>
              <SectionHeading
                align="left"
                id="teams-title"
                title={<span className="text-white">Train your team and your customers too</span>}
                lead={<span className="text-[#c9c9d1]">Coursekit Business turns the same courses you sell into onboarding, enablement and customer education, with the reporting your managers ask for.</span>}
              />
            </Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[15px] text-[#e4e4e9]">
                  <span className="round mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-flame-strong text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/contact?topic=teams" size="lg" arrow>
                Talk to sales
              </Button>
              <Button href="/pricing" size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 data-[force=hover]:bg-white/10">
                See Business plan
              </Button>
            </div>
          </div>
          <img src={images.teamWorkshop} alt="A team watching a training session on a large screen in a bright office" className="h-full min-h-[280px] w-full object-cover" loading="lazy" />
        </div>
      </Container>
    </section>
  )
}
