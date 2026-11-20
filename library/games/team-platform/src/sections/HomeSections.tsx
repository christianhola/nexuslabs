import { ArrowRight, Check, Quote } from 'lucide-react'
import { useState } from 'react'

import { Avatar } from '../components/Avatar'
import { Eyebrow } from '../components/Badge'
import { Button } from '../components/Button'
import { ChatMock } from '../components/ChatMock'
import { Container } from '../components/Container'
import { EmailCapture } from '../components/EmailCapture'
import { FeedMock } from '../components/FeedMock'
import { IconTile } from '../components/Icon'
import { IntegrationTile } from '../components/IntegrationTile'
import { PeopleMock } from '../components/PeopleMock'
import { PhoneFrame } from '../components/PhoneFrame'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs } from '../components/Tabs'
import { TaskList } from '../components/TasksMock'
import { frontline, homeCta, images, integrations, integrationsTeaser, modules, showcaseTabs, testimonial, trustedBy } from '../content'
import { Link } from '../lib/router'

export function LogoStrip() {
  return (
    <Container as="section" className="border-t border-line py-10">
      <h2 className="text-center text-[14.5px] text-muted">Used every day by frontline and office teams at</h2>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
        {trustedBy.map((n, i) => (
          <li key={n} className="font-display text-[21px] font-semibold tracking-[-0.03em] text-ink/70" style={{ fontStyle: i % 3 === 1 ? 'italic' : undefined, letterSpacing: i % 3 === 2 ? '0.06em' : undefined, textTransform: i % 3 === 2 ? 'uppercase' : undefined, fontSize: i % 3 === 2 ? 16 : undefined }}>
            {n}
          </li>
        ))}
      </ul>
    </Container>
  )
}

export function Modules() {
  return (
    <Container as="section" className="py-20 sm:py-28" id="modules">
      <SectionHeading eyebrow="One app, six modules" title="Everything people need to do their job, and feel part of the company" body="Turn on what you need. Every module shares one profile, one feed and your brand." />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m, i) => (
          <li key={m.id}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <Link href={m.href} className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-card p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink hover:shadow-[6px_6px_0_var(--color-mint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                <IconTile name={m.icon} />
                <h3 className="mt-5 font-display text-[21px] font-semibold tracking-[-0.02em] text-ink">{m.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{m.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14.5px] font-medium text-ink">
                  Try it
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export function Frontline() {
  return (
    <section className="bg-backdrop py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative mx-auto max-w-[460px]">
            <img src={images.frontline} alt="A café worker in a green apron smiles at a message on her phone" width={1024} height={1536} loading="lazy" className="aspect-[4/5] w-full rounded-[28px] border-[1.5px] border-ink object-cover object-top" />
            <div className="absolute -bottom-6 -right-2 max-w-[230px] rounded-[18px] border-[1.5px] border-ink bg-card p-4 shadow-[6px_6px_0_var(--color-mint)] sm:-right-10">
              <p className="font-display text-[34px] font-semibold leading-none tracking-[-0.04em] text-ink">{frontline.stat.value}</p>
              <p className="mt-1.5 text-[14px] leading-snug text-muted">{frontline.stat.label}</p>
            </div>
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow={frontline.eyebrow} title={frontline.title} body={frontline.body} />
          <ul className="mt-8 space-y-3.5">
            {frontline.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[16px] text-body">
                <span className="round mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-mint">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Button href="/why-us" variant="dark" arrow className="mt-9">
            Why teams switch
          </Button>
        </div>
      </Container>
    </section>
  )
}

export function Showcase() {
  const [tab, setTab] = useState<(typeof showcaseTabs)[number]['id']>('feed')
  const panelId = 'showcase-panel'
  return (
    <Container as="section" className="py-20 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div>
          <SectionHeading eyebrow="Take it for a spin" title="This is the app your people get" body="Every screen here works. Post an update, send a message, tick off a task. It is all saved in your browser." />
          <div className="mt-10 max-w-[520px]">
            <Tabs label="App screens" tabs={showcaseTabs} value={tab} onChange={setTab} />
          </div>
        </div>
        <div id={panelId} role="tabpanel" aria-label={showcaseTabs.find((t) => t.id === tab)?.label}>
          <PhoneFrame title={showcaseTabs.find((t) => t.id === tab)?.label}>
            {tab === 'feed' ? <FeedMock compact /> : tab === 'chat' ? <ChatMock compact /> : tab === 'tasks' ? <div className="h-full overflow-y-auto pb-4"><TaskList compact /></div> : <PeopleMock />}
          </PhoneFrame>
        </div>
      </div>
    </Container>
  )
}

export function Testimonial() {
  return (
    <Container as="section" className="py-12">
      <Reveal>
        <figure className="relative overflow-hidden rounded-[28px] border-[1.5px] border-ink bg-card p-8 sm:p-14">
          <Quote className="size-10 fill-mint text-ink" strokeWidth={1.5} aria-hidden />
          <blockquote className="mt-6 max-w-[30ch] text-balance font-display text-[28px] font-medium leading-[1.25] tracking-[-0.03em] text-ink sm:text-[38px]">“{testimonial.quote}”</blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <Avatar name={testimonial.name} face={testimonial.face} size={56} />
            <span>
              <span className="block text-[16px] font-semibold text-ink">{testimonial.name}</span>
              <span className="block text-[14.5px] text-muted">{testimonial.role}</span>
            </span>
            <Button href="/customers/nordhavn-logistics" variant="soft" size="sm" className="ml-auto hidden sm:inline-flex" arrow>
              Read the story
            </Button>
          </figcaption>
        </figure>
      </Reveal>
    </Container>
  )
}

export function IntegrationsTeaser() {
  const shown = integrations.filter((i) => i.popular).concat(integrations.filter((i) => !i.popular)).slice(0, 12)
  return (
    <Container as="section" className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <SectionHeading eyebrow="Integrations" title={integrationsTeaser.title} body={integrationsTeaser.body} />
        <Button href="/integrations" variant="soft" arrow className="mt-8">
          Browse all {integrations.length} integrations
        </Button>
      </div>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {shown.map((i, n) => (
          <li key={i.id}>
            <Reveal delay={n * 0.03}>
              <div className="flex flex-col items-center gap-2 rounded-[16px] border border-line bg-card px-2 py-4 text-center">
                <IntegrationTile name={i.name} color={i.color} />
                <span className="text-[13px] font-medium leading-tight text-ink">{i.name}</span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export function Cta() {
  return (
    <Container as="section" className="pb-4 pt-8">
      <div className="relative overflow-hidden rounded-[28px] bg-night px-6 py-14 text-white sm:px-14 sm:py-20">
        <svg className="pointer-events-none absolute -right-10 -top-10 h-[120%] opacity-[0.18]" viewBox="0 0 300 300" fill="none" stroke="#7ee07b" strokeWidth="2" aria-hidden>
          <path d="M40 290c60-20 100-80 112-160l8-50M160 80l90-70M160 80 90 20M152 150l70-30M140 210l-60-30" strokeLinecap="round" />
        </svg>
        <div className="relative max-w-[600px]">
          <Eyebrow className="text-white/80">Book a demo</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-[48px]">{homeCta.title}</h2>
          <p className="mt-4 text-[17px] leading-relaxed text-white/75">{homeCta.body}</p>
          <EmailCapture className="mt-8" placeholder="Enter work email" cta="Book a demo" source="cta" notch={false} onDark />
        </div>
      </div>
    </Container>
  )
}
