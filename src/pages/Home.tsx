import { motion } from 'motion/react'

import { ArrowLink, ButtonLink } from '../components/Button'
import { Label } from '../components/Label'
import { PackageCard } from '../components/PackageCard'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { RoomCard } from '../components/RoomCard'
import { TeamMember } from '../components/TeamMember'
import { BRAND, HOME, PACKAGES, PROCESS, ROOMS, TEAM } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

function Hero() {
  return (
    <section aria-label="Introduction" className="relative h-[max(34rem,min(58vw,100svh))] overflow-hidden bg-night">
      <Photo name="hero" alt="A calm living room with an ochre and olive painting, oak shelving and a cream sofa" eager className="absolute inset-0 bg-night" imgClassName="animate-drift" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.34)_0%,rgb(0_0_0/0)_22%,rgb(0_0_0/0)_48%,rgb(0_0_0/0.38)_100%)]" />

      <div className="on-dark absolute inset-x-0 bottom-[calc(18.6vw+2.25rem)] text-snow md:bottom-[calc(18.6vw+1.75rem)]">
        <div className="container-page grid grid-cols-12 gap-x-4 text-[12px] leading-[1.25] font-medium md:text-[13px]">
          <motion.p className="col-span-6 md:col-span-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            {HOME.metaLeft}
          </motion.p>
          <motion.p
            className="col-span-6 max-w-[15rem] md:col-span-4 md:col-start-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {BRAND.tagline}
          </motion.p>
          <motion.p className="hidden md:col-span-2 md:col-start-10 md:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            {HOME.metaRight}
          </motion.p>
        </div>
      </div>

      <h1 className="absolute inset-x-0 bottom-0 overflow-hidden text-center text-snow">
        <span className="sr-only">{BRAND.name}, interior design studio</span>
        <motion.span
          aria-hidden
          className="wordmark block translate-y-[0.035em] text-[22.4vw] tracking-[-0.042em]"
          initial={{ y: '40%', opacity: 0 }}
          animate={{ y: '3.5%', opacity: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.1 }}
        >
          {BRAND.wordmark}
        </motion.span>
      </h1>
    </section>
  )
}

function Intro() {
  return (
    <section aria-labelledby="intro-label" className="relative isolate bg-paper">
      {/* Desktop: the collage from the reference, images bleeding under the statement. */}
      <div className="container-page relative hidden min-h-[66vw] md:block xl:min-h-[60rem]">
        <Reveal className="absolute top-[9%] left-[63%] w-[23.5%]">
          <Photo name="house" alt="A dark timber house at dusk with glowing windows" className="aspect-square" />
        </Reveal>
        <Reveal delay={0.1} className="absolute top-[47%] left-[14%] w-[23%]">
          <Photo name="hall" alt="A double-height concrete hall with an olive tree" className="aspect-[3/4]" />
        </Reveal>
        <Reveal delay={0.2} className="absolute top-[88%] left-[49%] w-[23%]">
          <Photo name="kitchen" alt="" className="aspect-[4/3]" />
        </Reveal>
        {/* White text with a difference blend reads as ink on paper and inverts over the photographs. */}
        <Reveal className="absolute inset-x-0 top-[37%] z-10 px-[14%] text-center text-snow mix-blend-difference">
          {/* The blended copy is drawn from pseudo-elements (decoration); the real text sits beside it for assistive tech. */}
          <p aria-hidden data-text={HOME.introLabel} className="label-sm mb-5 before:content-[attr(data-text)]" />
          <p aria-hidden data-text={HOME.intro} className="font-statement text-[4.6vw] text-balance before:content-[attr(data-text)] xl:text-[4.25rem]" />
        </Reveal>
        <h2 id="intro-label" className="sr-only">
          {HOME.introLabel}
        </h2>
        <p className="sr-only">{HOME.intro}</p>
      </div>

      {/* Phones and small tablets: a simple stack. */}
      <div className="container-page py-20 md:hidden">
        <p className="label-sm mb-4 text-ink">{HOME.introLabel}</p>
        <p className="font-statement text-[2.4rem] text-balance">{HOME.intro}</p>
        <div className="mt-10 grid grid-cols-2 gap-3">
          <Photo name="hall" alt="A double-height concrete hall with an olive tree" className="aspect-[3/4]" />
          <Photo name="house" alt="A dark timber house at dusk with glowing windows" className="mt-12 aspect-square" />
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section aria-labelledby="services-title" className="container-page pt-24 pb-24 md:pt-56">
      <div className="grid gap-6 border-t border-ink pt-5 md:grid-cols-12">
        <Label number="01" className="md:col-span-3">
          {HOME.servicesLabel}
        </Label>
        <div className="md:col-span-9">
          <h2 id="services-title" className="font-display text-[clamp(2.5rem,5.4vw,5.25rem)] text-balance">
            {HOME.servicesTitle}
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-snug text-ink-2">{HOME.servicesBody}</p>
        </div>
      </div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PACKAGES.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08} className="h-full">
            <PackageCard pkg={p} featured={p.id === 'room'} compact className="h-full" />
          </Reveal>
        ))}
      </div>
      <ArrowLink to="/services" className="mt-6">
        Compare packages and estimate your fee
      </ArrowLink>
    </section>
  )
}

function Rooms() {
  const picks = ['fen-living', 'alder-kitchen', 'quarry-bath', 'fen-bedroom'].map((id) => ROOMS.find((r) => r.id === id)!)
  return (
    <section aria-labelledby="rooms-title" className="container-page pb-28">
      <div className="grid gap-6 border-t border-ink pt-5 md:grid-cols-12">
        <Label number="02" className="md:col-span-3">
          {HOME.roomsLabel}
        </Label>
        <div className="flex flex-wrap items-end justify-between gap-4 md:col-span-9">
          <h2 id="rooms-title" className="font-display text-[clamp(2.5rem,5.4vw,5.25rem)]">
            {HOME.roomsTitle}
          </h2>
          <ArrowLink to="/portfolio">All rooms</ArrowLink>
        </div>
      </div>
      <div className="mt-12 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((room, i) => (
          <Reveal key={room.id} delay={i * 0.06} className={i % 2 ? 'lg:mt-24' : undefined}>
            <RoomCard room={room} index={i} tall />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Team() {
  return (
    <section aria-labelledby="team-title" className="bg-card py-24 md:py-32">
      <div className="container-page grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-24">
            <Label number="03">The people</Label>
            <h2 id="team-title" className="font-display mt-5 text-[clamp(2.5rem,4.6vw,4.5rem)] text-balance">
              A named lead from first visit to final cushion
            </h2>
            <ArrowLink to="/studio" className="mt-6">
              Meet the studio
            </ArrowLink>
          </div>
        </div>
        <div className="flex flex-col gap-14 md:col-span-7 md:col-start-6">
          {TEAM.map((m) => (
            <Reveal key={m.number}>
              <TeamMember {...m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Highlights() {
  return (
    <section aria-labelledby="highlights-title" className="overflow-hidden py-24 md:py-32">
      <div className="container-page text-center">
        <p className="label-sm text-ink-2">{HOME.highlightsLabel}</p>
        <h2 id="highlights-title" className="font-statement mx-auto mt-4 max-w-[15ch] text-[clamp(2.5rem,4.8vw,4.75rem)] leading-[1.02] text-balance">
          {HOME.highlightsTitle}
        </h2>
      </div>
      <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-12">
        <Photo name="ceramics" alt="Stoneware bowls on an oak shelf" className="col-span-1 aspect-[3/4] md:col-span-2 md:mt-0" />
        <p className="col-span-1 max-w-[17rem] text-[13px] leading-snug text-ink-2 md:col-span-3 md:pt-1">{HOME.highlightsBody}</p>
        <figure className="col-span-1 md:col-span-3">
          <figcaption className="label-sm mb-2 tabular-nums text-ink-2">02</figcaption>
          <Photo name="samples" alt="Material samples: oak, travertine, linen and paint chips" className="aspect-[3/4]" />
        </figure>
        <figure className="col-span-1 md:col-span-4">
          <figcaption className="label-sm mb-2 tabular-nums text-ink-2">03</figcaption>
          <Photo name="stair" alt="A floating oak stair against white plaster" className="aspect-[4/5]" />
        </figure>
      </div>
      <dl className="container-page mt-20 grid grid-cols-2 gap-y-10 border-t border-line pt-8 md:grid-cols-4">
        {HOME.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="label-sm mt-1 text-muted">{s.label}</dt>
            <dd className="text-[clamp(2.75rem,5vw,4.5rem)] leading-none font-medium tracking-[-0.05em] tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ProcessStrip() {
  return (
    <section aria-labelledby="process-title" className="container-page pb-28">
      <div className="grid gap-6 border-t border-ink pt-5 md:grid-cols-12">
        <Label number="04" className="md:col-span-3">
          {HOME.processLabel}
        </Label>
        <div className="flex flex-wrap items-end justify-between gap-4 md:col-span-9">
          <h2 id="process-title" className="font-display max-w-[16ch] text-[clamp(2.25rem,4.4vw,4.25rem)] text-balance">
            {HOME.processTitle}
          </h2>
          <ArrowLink to="/process">How a project runs</ArrowLink>
        </div>
      </div>
      <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-md)] bg-line sm:grid-cols-2 lg:grid-cols-5">
        {PROCESS.map((p, i) => (
          <Reveal as="li" key={p.number} delay={i * 0.06} className="flex min-h-56 flex-col bg-paper p-5">
            <span className="text-[44px] leading-none font-medium tracking-[-0.05em] tabular-nums">{p.number}</span>
            <h3 className="mt-auto pt-10 text-[19px] font-medium tracking-[-0.03em]">{p.name}</h3>
            <p className="label-sm mt-1 text-muted">{p.duration}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

function QuizCta() {
  return (
    <section aria-labelledby="quiz-title" className="container-page pb-28">
      <div className="on-dark relative grid overflow-hidden rounded-[var(--radius-md)] bg-night text-snow md:grid-cols-2">
        <div className="flex flex-col justify-between gap-10 p-6 md:p-10">
          <Label tone="light">{HOME.quizLabel}</Label>
          <div>
            <h2 id="quiz-title" className="font-display text-[clamp(2.5rem,4.6vw,4.5rem)] text-balance">
              {HOME.quizTitle}
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-snug text-snow-muted">{HOME.quizBody}</p>
            <ButtonLink to="/style-quiz" variant="light" icon className="mt-8">
              {HOME.quizCta}
            </ButtonLink>
          </div>
        </div>
        <Photo name="bedroom" alt="" className="aspect-[4/3] md:aspect-auto md:min-h-[32rem]" />
      </div>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Services />
      <Rooms />
      <Team />
      <Highlights />
      <ProcessStrip />
      <QuizCta />
    </>
  )
}
