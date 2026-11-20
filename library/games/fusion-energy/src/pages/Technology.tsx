import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { PageHeader } from '../components/PageHeader'
import { Reactor } from '../components/Reactor'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/Typography'
import { technology } from '../content'
import { cx } from '../lib/cx'
import { Milestones } from '../sections/Milestones'
import { Mission } from '../sections/Mission'

export function Technology() {
  const [active, setActive] = useState(technology.parts[0].id)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const part = technology.parts.find((p) => p.id === active)!

  // Arrow keys move between parts, as in any tab list.
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = technology.parts.length
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (i + 1) % n : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (i - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1
    if (next < 0) return
    e.preventDefault()
    setActive(technology.parts[next].id)
    tabs.current[next]?.focus()
  }

  return (
    <>
      <PageHeader
        eyebrow={technology.eyebrow}
        title={technology.title}
        body={technology.body}
        aside={
          <div className="relative mx-auto max-w-[520px]">
            <div className="absolute inset-[10%] -z-10 rounded-full bg-plasma/25 blur-[80px]" aria-hidden />
            <Reactor className="w-full" />
          </div>
        }
      >
        <ButtonLink href="#explore" variant="secondary" className="mt-2">
          Explore the reactor
        </ButtonLink>
      </PageHeader>

      <section id="explore" aria-labelledby="explore-title" className="scroll-mt-20 py-20 sm:py-28">
        <Container size="xl">
          <Reveal>
            <SectionHeading id="explore-title" title="Inside the plant" body="Select a part to see what it does." size="md" />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <Card tone="ocean" className="relative aspect-[4/3.4] lg:aspect-auto lg:min-h-[520px]">
              <Reactor className="absolute inset-x-[8%] bottom-[2%] w-[84%]" label="Reactor cutaway with selectable parts" />
              {technology.parts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p.id)}
                  tabIndex={-1}
                  aria-hidden
                  className="group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span className={cx('round absolute size-11 rounded-full transition-colors', p.id === active ? 'bg-white/25' : 'bg-white/10 group-hover:bg-white/20')} />
                  <span className={cx('round relative size-3.5 rounded-full ring-2 ring-white transition-colors', p.id === active ? 'bg-fire-2' : 'bg-plasma')} />
                  {p.id === active ? <span className="round absolute size-11 animate-ping rounded-full ring-2 ring-fire-2/60" /> : null}
                </button>
              ))}
            </Card>
            <div className="flex flex-col gap-4">
              <div role="tablist" aria-label="Reactor parts" aria-orientation="vertical" className="flex flex-col gap-2">
                {technology.parts.map((p, i) => (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    role="tab"
                    id={`tab-${p.id}`}
                    aria-selected={p.id === active}
                    aria-controls="part-panel"
                    tabIndex={p.id === active ? 0 : -1}
                    onClick={() => setActive(p.id)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cx(
                      'flex min-h-14 items-center justify-between gap-4 rounded-[18px] px-5 text-left text-[16px] font-medium transition-colors',
                      p.id === active ? 'bg-white text-black' : 'bg-surface text-soft ring-1 ring-inset ring-white/10 hover:bg-surface-2 hover:text-white',
                    )}
                  >
                    {p.name}
                    <span className={cx('text-[13px] font-normal', p.id === active ? 'text-black/60' : 'text-faint')}>{p.spec}</span>
                  </button>
                ))}
              </div>
              <div id="part-panel" role="tabpanel" aria-labelledby={`tab-${part.id}`} className="depth relative min-h-[180px] rounded-card bg-surface p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={part.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                    <p className="text-[14px] font-medium text-plasma-text">{part.spec}</p>
                    <h3 className="mt-2 text-[22px] font-medium tracking-[-0.02em]">{part.name}</h3>
                    <p className="mt-2 text-pretty text-[16px] leading-[1.55] text-muted">{part.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="principles-title" className="py-20 sm:py-24">
        <Container size="xl">
          <Reveal>
            <SectionHeading id="principles-title" title="Why a stellarator" size="md" />
          </Reveal>
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {technology.principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.06}>
                <Card className="h-full p-7">
                  <span className="text-[14px] font-medium tabular-nums text-faint">0{i + 1}</span>
                  <h3 className="mt-6 text-[20px] font-medium tracking-[-0.02em]">{p.title}</h3>
                  <p className="mt-2 text-pretty text-[16px] leading-[1.55] text-muted">{p.body}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="specs-title" className="py-20 sm:py-24">
        <Container size="xl">
          <Card tone="stripes" className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-14">
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d1a3a] via-[#0d1a3a]/80 to-[#0d1a3a]/40" aria-hidden />
            <SectionHeading id="specs-title" title={['Plant at', 'a glance']} align="left" size="md" body="Design targets for the first marine unit." className="[&_p]:text-white/80" />
            <dl className="grid gap-x-8 sm:grid-cols-2">
              {technology.specs.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 border-t border-white/20 py-5">
                  <dt className="text-[14px] text-white/80">{s.label}</dt>
                  <dd className="text-[26px] font-medium tracking-[-0.03em]">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Container>
      </section>

      <Milestones />
      <Mission />
    </>
  )
}
