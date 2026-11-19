import { useEffect, useRef, useState } from 'react'

import { Accordion } from '../components/Accordion'
import { ButtonLink } from '../components/Button'
import { Label } from '../components/Label'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { PROCESS, PROCESS_PAGE, SERVICES_PAGE } from '../content'
import { cx } from '../lib/cx'

export function Process() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <PageHeader label={PROCESS_PAGE.label} title={PROCESS_PAGE.title} intro={PROCESS_PAGE.intro} />

      <div className="container-page grid gap-10 pb-24 md:grid-cols-12">
        <nav aria-label="Phases" className="hidden md:col-span-4 md:block">
          <ol className="sticky top-24 flex flex-col border-t border-ink">
            {PROCESS.map((p, i) => (
              <li key={p.number} className="border-b border-line">
                <a
                  href={`#phase-${p.number}`}
                  aria-current={active === i ? 'step' : undefined}
                  className={cx('flex min-h-14 items-center gap-4 py-3 transition-colors duration-[var(--duration-base)]', active === i ? 'text-ink' : 'text-muted hover:text-ink')}
                >
                  <span className="w-8 text-[15px] tabular-nums">{p.number}</span>
                  <span className={cx('text-[clamp(1.25rem,1.9vw,1.75rem)] leading-none font-medium tracking-[-0.04em] transition-transform duration-[var(--duration-base)]', active === i && 'translate-x-1')}>
                    {p.name}
                  </span>
                  <span className="label-sm ml-auto">{p.duration}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="flex flex-col gap-20 md:col-span-7 md:col-start-6">
          {PROCESS.map((p, i) => (
            <li
              key={p.number}
              id={`phase-${p.number}`}
              data-index={i}
              ref={(el) => {
                refs.current[i] = el
              }}
              className="scroll-mt-24"
            >
              <Photo name={p.image} alt="" className="aspect-[16/10]" />
              <div className="mt-5 flex items-baseline gap-4">
                <span className="text-[clamp(3rem,6vw,5.5rem)] leading-none font-medium tracking-[-0.06em] tabular-nums">{p.number}</span>
                <div>
                  <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-medium tracking-[-0.045em]">{p.name}</h2>
                  <p className="label-sm mt-1 text-muted">{p.duration}</p>
                </div>
              </div>
              <p className="mt-5 max-w-xl text-[17px] leading-snug text-ink-2">{p.body}</p>
              <div className="mt-6 grid gap-6 border-t border-line pt-5 sm:grid-cols-2">
                <div>
                  <h3 className="label-sm text-muted">{PROCESS_PAGE.youGet}</h3>
                  <ul className="mt-2 flex flex-col gap-1 text-[15px]">
                    {p.youGet.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label-sm text-muted">{PROCESS_PAGE.weNeed}</h3>
                  <ul className="mt-2 flex flex-col gap-1 text-[15px]">
                    {p.weNeed.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <section aria-labelledby="process-faq" className="bg-card py-20">
        <div className="container-page grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Label>Before you book</Label>
            <h2 id="process-faq" className="font-display mt-5 text-[clamp(2.25rem,4vw,4rem)] text-balance">
              Ready when you are
            </h2>
            <ButtonLink to="/book" icon className="mt-8">
              Book a consultation
            </ButtonLink>
          </div>
          <Accordion items={SERVICES_PAGE.faq} className="md:col-span-7 md:col-start-6" />
        </div>
      </section>
    </>
  )
}
