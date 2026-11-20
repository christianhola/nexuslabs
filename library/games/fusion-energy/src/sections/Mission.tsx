import { Container } from '../components/Container'
import { LinkRow } from '../components/Controls'
import { Reveal } from '../components/Reveal'
import { Skyline } from '../components/Skyline'
import { mission } from '../content'

/** "Be part of the mission": the blue panel with three ways in. */
export function Mission() {
  return (
    <section aria-labelledby="mission-title" className="pb-24 pt-8 sm:pb-32">
      <Container>
        <Reveal>
          <div className="depth relative isolate grid overflow-hidden rounded-panel bg-[radial-gradient(90%_120%_at_0%_100%,#a9bde3_0%,#6c88c4_30%,#2f4a86_60%,#1a2c57_100%)] p-7 sm:p-10 lg:min-h-[420px] lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:p-14">
            <div className="grain pointer-events-none absolute inset-0 -z-10" aria-hidden />
            <div className="flex flex-col">
              <h2 id="mission-title" className="display text-[44px] sm:text-[56px]">
                {mission.title.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </h2>
              <Skyline className="-mb-14 -ml-14 mt-10 w-[min(520px,calc(100%+56px))] sm:-mb-10 sm:-ml-10 lg:-mb-14 lg:-ml-14 lg:mt-auto" />
            </div>
            <ul className="mt-12 flex flex-col self-center lg:mt-0">
              {mission.rows.map((r) => (
                <li key={r.title}>
                  <LinkRow href={r.href} title={r.title} body={r.body} />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
