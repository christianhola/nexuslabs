import { ArrowRight, Check, Clock3, Eye, MessageSquare, Scissors, Sparkles, Video } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { type FormEvent, type ReactNode, useState } from 'react'

import { Button, ButtonLink } from '@/components/Button'
import { Container, FrameLines, SectionHead } from '@/components/Frame'
import { ClipCard } from '@/components/Library'
import { ScreenMock } from '@/components/ScreenMock'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { Terminal } from '@/components/Terminal'
import { Avatar, Input, Segmented } from '@/components/ui'
import { AGENTS, CTA, CUSTOMERS, FEATURES, PRESENTERS, TEAMS, seedRecordings } from '@/content'
import { short, timeAgo } from '@/lib/format'
import { Hero } from './Hero'

/** Scroll-in reveal; off under reduced motion. */
function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}

export function Landing() {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <FrameLines center className="h-[620px]" />
      <SiteNav />
      <main>
        <Hero />
        <Features />
        <Teams />
        <Agents />
        <Customers />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}

const FEATURE_ICONS = { record: Video, share: MessageSquare, agents: Sparkles }

function FeatureArt({ id }: { id: string }) {
  if (id === 'record')
    return (
      <div className="relative">
        <ScreenMock scene="dashboard" presenter="theo" className="aspect-video rounded-[12px] ring-1 ring-line" />
        <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-raised px-3 py-2 text-[12px] shadow-pop">
          <span className="size-2.5 animate-rec-pulse rounded-full bg-ember" />
          <span className="font-mono tabular-nums">00:42</span>
          <span className="mx-1 h-4 w-px bg-line-strong" />
          <Scissors className="size-3.5 text-muted" />
        </div>
      </div>
    )
  if (id === 'share')
    return (
      <div className="space-y-2.5">
        {[
          { t: '0:14', who: 'TM', text: 'One sentence reads so much better.' },
          { t: '0:52', who: 'RA', text: 'Crop tighter on mobile?' },
          { t: '2:10', who: 'AS', text: 'Partnerships signed off.' },
        ].map((c) => (
          <div key={c.t} className="flex items-center gap-2.5 rounded-[12px] bg-surface-2 px-3 py-2.5 ring-1 ring-line">
            <Avatar initials={c.who} size={24} />
            <span className="rounded-full bg-ember/15 px-1.5 py-0.5 font-mono text-[11px] text-ember-text">{c.t}</span>
            <span className="truncate text-[13px] text-muted">{c.text}</span>
          </div>
        ))}
      </div>
    )
  return (
    <div className="rounded-[12px] bg-[#121110] p-4 font-mono text-[12px] leading-5 ring-1 ring-line">
      <p className="text-faint">// clip rec-bug · 1:36</p>
      <p className="text-muted">
        <span className="text-ok">●</span> transcript <span className="text-faint">5 segments</span>
      </p>
      <p className="text-muted">
        <span className="text-ok">●</span> chapters <span className="text-faint">Repro, Expected, Fix</span>
      </p>
      <p className="text-muted">
        <span className="text-ember-text">→</span> ticket WEB-3483 created
      </p>
    </div>
  )
}

function Features() {
  return (
    <section id="product" className="relative scroll-mt-6 py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHead eyebrow={FEATURES.eyebrow} title={FEATURES.title} sub={FEATURES.sub} />
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {FEATURES.items.map((f, i) => {
            const Icon = FEATURE_ICONS[f.id as keyof typeof FEATURE_ICONS]
            return (
              <Reveal key={f.id} delay={i * 0.08} className="flex flex-col rounded-[20px] bg-surface p-6 ring-1 ring-line">
                <span className="flex size-10 items-center justify-center rounded-full bg-surface-2 text-fg ring-1 ring-line-strong">
                  <Icon className="size-[18px]" />
                </span>
                <h3 className="mt-5 text-[19px] font-medium tracking-[-0.02em]">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
                <div className="mt-8 mb-4 flex-1">
                  <FeatureArt id={f.id} />
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {f.points.map((p) => (
                    <li key={p} className="rounded-full px-2.5 py-1 text-[12px] text-muted ring-1 ring-line-strong">
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

function Teams() {
  const [tab, setTab] = useState(TEAMS.tabs[0].id)
  const t = TEAMS.tabs.find((x) => x.id === tab)!
  const rec = seedRecordings().find((r) => r.id === t.clip)!
  return (
    <section id="teams" className="relative scroll-mt-6 border-t border-line py-24 sm:py-32">
      <Container>
        <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHead eyebrow={TEAMS.eyebrow} title={TEAMS.title} />
          <Segmented label="Team" value={tab} onChange={setTab} options={TEAMS.tabs.map((x) => ({ id: x.id, label: x.label }))} className="self-start overflow-x-auto lg:self-auto" />
        </Reveal>
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="mt-12 grid items-center gap-10 rounded-[24px] bg-surface p-6 ring-1 ring-line sm:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h3 className="font-display text-[28px] leading-[1.15] font-medium tracking-[-0.03em] text-balance sm:text-[32px]">{t.title}</h3>
            <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-muted">{t.body}</p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-display text-[44px] font-medium tracking-[-0.04em] text-cream">{t.stat.value}</span>
              <span className="text-sm text-muted">{t.stat.label}</span>
            </div>
            <ButtonLink to={`/v/${rec.id}`} variant="secondary" className="mt-8" iconRight={<ArrowRight className="size-4" />}>
              Watch the example
            </ButtonLink>
          </div>
          <ClipCard layout="stacked" to={`/v/${rec.id}`} title={rec.title} scene={rec.scene} presenter={rec.presenter} duration={short(rec.duration)} ago={timeAgo(rec.createdAt)} views={rec.views} />
        </motion.div>
      </Container>
    </section>
  )
}

function Agents() {
  return (
    <section id="agents" className="relative scroll-mt-6 border-t border-line py-24 sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHead eyebrow={AGENTS.eyebrow} title={AGENTS.title} sub={AGENTS.sub} />
          <ul className="mt-10 space-y-6">
            {AGENTS.bullets.map((b) => (
              <li key={b.title} className="flex gap-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ok-bg text-ok">
                  <Check className="size-3.5" />
                </span>
                <div>
                  <p className="font-medium">{b.title}</p>
                  <p className="mt-1 text-[15px] text-muted">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <pre className="mt-10 overflow-x-auto rounded-[14px] bg-[#121110] p-5 font-mono text-[12.5px] leading-[1.7] text-muted ring-1 ring-line">
            <code>{AGENTS.code.join('\n')}</code>
          </pre>
        </Reveal>
        <Reveal delay={0.1}>
          <Terminal className="lg:sticky lg:top-8" />
        </Reveal>
      </Container>
    </section>
  )
}

function Customers() {
  return (
    <section id="customers" className="relative scroll-mt-6 border-t border-line py-24 sm:py-32">
      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <SectionHead eyebrow={CUSTOMERS.eyebrow} title={CUSTOMERS.title} />
          <dl className="grid grid-cols-3 gap-4">
            {CUSTOMERS.stats.map((s) => (
              <div key={s.label}>
                <dt className="order-2 text-[13px] text-muted">{s.label}</dt>
                <dd className="font-display text-[34px] font-medium tracking-[-0.04em] text-cream sm:text-[40px]">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {CUSTOMERS.quotes.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08} className="flex flex-col justify-between rounded-[20px] bg-surface p-6 ring-1 ring-line">
              <blockquote className="text-[17px] leading-[1.55] text-fg/90">“{q.body}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <Avatar initials={PRESENTERS[q.presenter].initials} image={PRESENTERS[q.presenter].image} size={40} />
                <div>
                  <p className="text-sm font-medium">{q.name}</p>
                  <p className="text-[13px] text-muted">{q.role}</p>
                </div>
              </figcaption>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock3, text: 'Average clip: 2m 41s' },
            { icon: Eye, text: '87% of clips watched within a day' },
            { icon: MessageSquare, text: '1.9M timestamped comments' },
          ].map(({ icon: Icon, text }) => (
            <p key={text} className="flex items-center gap-2.5 rounded-full px-4 py-3 text-[13px] text-muted ring-1 ring-line">
              <Icon className="size-4 text-faint" />
              {text}
            </p>
          ))}
        </div>
      </Container>
    </section>
  )
}

function Cta() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'done' } | { kind: 'error'; message: string }>({ kind: 'idle' })

  async function submit(e: FormEvent) {
    e.preventDefault()
    setState({ kind: 'sending' })
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) return setState({ kind: 'error', message: body.error ?? 'Something went wrong.' })
      setState({ kind: 'done' })
    } catch {
      setState({ kind: 'error', message: 'You look offline. Try again in a moment.' })
    }
  }

  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[360px] w-[1100px] max-w-[160%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(124_36_24/0.4),transparent)]" aria-hidden />
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-[16ch] font-display text-[40px] leading-[1.05] font-medium tracking-[-0.045em] text-cream sm:text-[60px]">{CTA.title}</h2>
        <p className="mt-4 text-[18px] text-muted">{CTA.sub}</p>
        {state.kind === 'done' ? (
          <p role="status" className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full bg-ok-bg px-5 py-3 text-sm text-ok">
            <Check className="size-4" /> {CTA.success}
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto mt-10 flex max-w-[480px] flex-col gap-3 text-left sm:flex-row sm:items-start">
            <Input
              label="Work email"
              hideLabel
              type="email"
              autoComplete="email"
              placeholder={CTA.placeholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state.kind === 'error') setState({ kind: 'idle' })
              }}
              error={state.kind === 'error' ? state.message : null}
              className="flex-1 [&_input]:h-12 [&_input]:rounded-full [&_input]:px-5"
            />
            <Button type="submit" variant="primary" size="lg" loading={state.kind === 'sending'}>
              {CTA.button}
            </Button>
          </form>
        )}
      </Container>
    </section>
  )
}
