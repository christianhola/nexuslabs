import { ArrowRight, Info, Mail, Play, RotateCcw, Trophy } from 'lucide-react'
import { useEffect, useState, type ComponentProps, type CSSProperties, type ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { Logo, LogoMark } from '../components/Brand'
import { CopyField } from '../components/CopyField'
import { Countdown } from '../components/Countdown'
import { Laptop, Phone } from '../components/Devices'
import { FeatureMock, type MockKind } from '../components/FeatureMocks'
import { PageShell, SiteHeader } from '../components/Layout'
import { Leaderboard } from '../components/Leaderboard'
import { Reveal } from '../components/Reveal'
import { SegmentedControl } from '../components/SegmentedControl'
import { SuccessCheck, SuccessPanel } from '../components/SuccessPanel'
import {
  Avatar,
  AvatarStack,
  Badge,
  Button,
  ButtonLink,
  Callout,
  Card,
  Container,
  Eyebrow,
  FieldMessage,
  Input,
  Label,
  LiveDot,
  SectionHeading,
  Skeleton,
  Spinner,
  Stat,
  TextLink,
} from '../components/ui'
import { WaitlistForm } from '../components/WaitlistForm'
import { Wallpaper } from '../components/Wallpaper'
import { palettes } from '../components/wallpaper-palettes'
import { deviceLabel, faq } from '../content'
import { cx } from '../lib/cx'
import { useTitle } from '../lib/router'
import { colorTokens, motionTokens, radii, shadows, spacing, typeScale } from '../tokens'

const sections = [
  ['colours', 'Colours'],
  ['type', 'Type'],
  ['space', 'Spacing, radii, shadows'],
  ['motion', 'Motion'],
  ['buttons', 'Buttons and links'],
  ['fields', 'Fields'],
  ['feedback', 'Badges and feedback'],
  ['surfaces', 'Cards and stats'],
  ['identity', 'Avatars and brand'],
  ['interactive', 'Copy, switch, accordion'],
  ['waitlist', 'Waitlist'],
  ['leaderboard', 'Leaderboard'],
  ['mocks', 'Feature mocks'],
  ['devices', 'Devices and wallpaper'],
  ['layout', 'Layout'],
] as const

/** Reads a CSS custom property from :root. */
function useCssVar(name: string) {
  const [value, setValue] = useState('')
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim())
  }, [name])
  return value
}

function Section({ id, title, intro, children }: { id: string; title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line-soft py-14 first:border-t-0 first:pt-0">
      <h2 id={`${id}-title`} className="text-[26px] font-bold tracking-[-0.035em] text-ink">
        {title}
      </h2>
      {intro && <p className="mt-2 max-w-[640px] text-copy text-muted">{intro}</p>}
      <div className="mt-8 space-y-10">{children}</div>
    </section>
  )
}

/** One component: name, usage note, and the rendered examples. */
function Specimen({ name, note, children, className }: { name: string; note?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div>
      <h3 className="font-mono text-[14px] font-semibold text-ink">{name}</h3>
      {note && <p className="mt-1 max-w-[680px] text-small text-muted">{note}</p>}
      <div className={cx('mt-4 rounded-card border border-line-soft bg-white p-5 sm:p-6', className)}>{children}</div>
    </div>
  )
}

/** A labelled cell in a state grid. */
function Cell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-start gap-2.5', className)}>
      {children}
      <span className="text-micro text-muted">{label}</span>
    </div>
  )
}

function Swatch({ name, note }: { name: string; note: string }) {
  const value = useCssVar(`--color-${name}`)
  return (
    <li className="flex items-center gap-3">
      <span className="size-12 shrink-0 rounded-card border border-line-soft" style={{ background: `var(--color-${name})` }} />
      <span className="min-w-0">
        <span className="block font-mono text-[13px] font-semibold text-ink">{name}</span>
        <span className="block font-mono text-micro uppercase text-muted">{value}</span>
        <span className="block text-micro text-muted">{note}</span>
      </span>
    </li>
  )
}

function TokenValue({ name }: { name: string }) {
  const value = useCssVar(name)
  return <span className="font-mono text-micro text-muted">{value}</span>
}

function MotionDemo() {
  const [run, setRun] = useState(0)
  const row = (label: string, note: string, style: CSSProperties, token: string) => (
    <li key={label} className="grid items-center gap-3 sm:grid-cols-[200px_1fr]">
      <span>
        <span className="block font-mono text-[13px] font-semibold text-ink">{label}</span>
        <span className="block text-micro text-muted">{note}</span>
        <TokenValue name={token} />
      </span>
      <span className="relative h-9 overflow-hidden rounded-control bg-stage [container-type:inline-size]">
        <span
          key={run}
          className="absolute left-1 top-1 size-7 rounded-control bg-accent"
          style={{ ['--sg-distance' as string]: 'calc(100cqw - 36px)', animation: run ? `sg-slide ${style.animationDuration} ${style.animationTimingFunction} both` : undefined }}
        />
      </span>
    </li>
  )
  return (
    <div>
      <Button size="sm" variant="secondary" onClick={() => setRun((r) => r + 1)} icon={run ? <RotateCcw className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}>
        {run ? 'Replay' : 'Play'}
      </Button>
      <ul className="mt-5 space-y-4">
        {motionTokens.durations.map((d) =>
          row(`duration-${d.name}`, d.note, { animationDuration: `var(--duration-${d.name})`, animationTimingFunction: 'var(--ease-out-expo)' }, `--duration-${d.name}`),
        )}
        {motionTokens.easings.map((e) =>
          row(`ease-${e.name}`, e.note, { animationDuration: '900ms', animationTimingFunction: `var(--ease-${e.name})` }, `--ease-${e.name}`),
        )}
      </ul>
      <p className="mt-4 text-micro text-muted">With reduced motion on, these jump to the end: that is the point.</p>
    </div>
  )
}

const buttonStates: Array<[string, Partial<ComponentProps<typeof Button>> & { 'data-force'?: string }]> = [
  ['default', {}],
  ['hover', { 'data-force': 'hover' }],
  ['focus-visible', { 'data-force': 'focus' }],
  ['active', { 'data-force': 'active' }],
  ['disabled', { disabled: true }],
  ['loading', { loading: true }],
]

const sampleResult = { status: 'joined' as const, position: 42, count: 2140, code: 'demo2k7', referrals: 0, email: 'jane@example.com' }

export function StyleGuidePage() {
  useTitle('Style guide')
  const [segment, setSegment] = useState<'desktop' | 'mobile'>('desktop')
  const [panelKey, setPanelKey] = useState(0)
  const [revealKey, setRevealKey] = useState(0)
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [mockKind, setMockKind] = useState<MockKind>('board')

  return (
    <PageShell tone="page">
      <Container className="py-12 lg:py-16">
        <Eyebrow>Design system</Eyebrow>
        <h1 className="mt-2 text-[34px] font-bold tracking-[-0.04em] text-ink sm:text-display">Style guide</h1>
        <p className="mt-3 max-w-[640px] text-lead text-muted">
          Every token and component in this template, rendered by the real code. Tokens live in <code className="font-mono text-[14px] text-ink">src/styles.css</code>, components in{' '}
          <code className="font-mono text-[14px] text-ink">src/components/</code>.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[200px_1fr]">
          <nav aria-label="Style guide sections" className="lg:sticky lg:top-6 lg:self-start">
            <ul className="flex flex-wrap gap-1 lg:flex-col">
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-flex h-10 items-center rounded-control px-2.5 text-[14px] text-muted outline-none transition-colors duration-150 is-hover:bg-stage is-hover:text-ink is-focus:shadow-focus lg:h-9"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <Section id="colours" title="Colours" intro="One warm accent on quiet neutrals. Orange text uses the darker accent tokens so it passes WCAG AA; the brand orange stays for fills and rings.">
              {colorTokens.map((group) => (
                <div key={group.group}>
                  <h3 className="text-[15px] font-semibold text-ink">{group.group}</h3>
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {group.tokens.map((t) => (
                      <Swatch key={t.name} {...t} />
                    ))}
                  </ul>
                </div>
              ))}
            </Section>

            <Section id="type" title="Type" intro="Inter throughout. Tight negative tracking on display sizes, neutral on body copy.">
              <ul className="divide-y divide-line-soft">
                {typeScale.map((t) => (
                  <li key={t.token} className="grid gap-2 py-5 sm:grid-cols-[180px_1fr] sm:items-baseline">
                    <span>
                      <span className="block font-mono text-[13px] font-semibold text-ink">text-{t.token}</span>
                      <span className="block text-micro text-muted">
                        <TokenValue name={`--text-${t.token}`} /> · weight {t.weights}
                      </span>
                      <span className="block text-micro text-muted">{t.use}</span>
                    </span>
                    <span className={cx('min-w-0 break-words text-ink', t.className)}>Join the waitlist.</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="space" title="Spacing, radii, shadows">
              <Specimen name="spacing" note="Tailwind's 4px grid. These are the steps in use, from icon gaps to section padding.">
                <ul className="space-y-2">
                  {spacing.map((px) => (
                    <li key={px} className="flex items-center gap-4">
                      <span className="w-12 font-mono text-micro text-muted">{px}px</span>
                      <span className="h-3 rounded-[1px] bg-accent-soft ring-1 ring-accent/30" style={{ width: px }} />
                    </li>
                  ))}
                </ul>
              </Specimen>
              <Specimen name="radius-*">
                <ul className="flex flex-wrap gap-6">
                  {radii.map((r) => (
                    <li key={r.name} className="flex flex-col gap-2">
                      <span className="size-20 border border-line bg-stage" style={{ borderRadius: r.name === 'full' ? 9999 : `var(--radius-${r.name})` }} />
                      <span className="font-mono text-[13px] font-semibold text-ink">rounded-{r.name}</span>
                      {r.name !== 'full' && <TokenValue name={`--radius-${r.name}`} />}
                      <span className="max-w-[160px] text-micro text-muted">{r.note}</span>
                    </li>
                  ))}
                </ul>
              </Specimen>
              <Specimen name="shadow-*" className="bg-stage">
                <ul className="grid gap-6 sm:grid-cols-3 xl:grid-cols-5">
                  {shadows.map((s) => (
                    <li key={s.name} className="flex flex-col gap-2">
                      <span className="h-20 rounded-card bg-white" style={{ boxShadow: `var(--shadow-${s.name})` }} />
                      <span className="font-mono text-[13px] font-semibold text-ink">shadow-{s.name}</span>
                      <span className="text-micro text-muted">{s.note}</span>
                    </li>
                  ))}
                </ul>
              </Specimen>
            </Section>

            <Section id="motion" title="Motion" intro="Things arrive with an expo ease-out and never bounce, except the success pop. JS animations use the same values from src/lib/motion.ts.">
              <Specimen name="duration-* / ease-*">
                <MotionDemo />
              </Specimen>
              <Specimen name="Reveal" note="Wrap a block to rise it in the first time it scrolls into view. Pass delay to stagger siblings. Replay remounts it.">
                <div className="flex flex-col items-start gap-4">
                  <Button variant="secondary" size="sm" onClick={() => setRevealKey((k) => k + 1)} icon={<RotateCcw className="size-4" aria-hidden="true" />}>
                    Replay
                  </Button>
                  <Reveal key={revealKey} className="w-full">
                    <Card tone="stage">This card rises in when it first scrolls into view.</Card>
                  </Reveal>
                </div>
              </Specimen>
            </Section>

            <Section id="buttons" title="Buttons and links">
              <Specimen name="Button" note="Primary for the one main action on a screen, secondary next to it, ghost for low-key actions in a row. md (44px) lines up with Input; sm (36px) for toolbars. Pass loading while a request runs: the label keeps its width.">
                <div className="space-y-8">
                  {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
                    <div key={variant}>
                      <p className="mb-3 font-mono text-micro text-muted">variant="{variant}"</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-5">
                        {buttonStates.map(([label, props]) => (
                          <Cell key={label} label={label}>
                            <Button variant={variant} {...props}>
                              Notify me
                            </Button>
                          </Cell>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <p className="mb-3 font-mono text-micro text-muted">size and icons</p>
                    <div className="flex flex-wrap items-end gap-x-6 gap-y-5">
                      <Cell label="md">
                        <Button>Notify me</Button>
                      </Cell>
                      <Cell label="sm">
                        <Button size="sm">Notify me</Button>
                      </Cell>
                      <Cell label="icon">
                        <Button variant="secondary" icon={<Mail className="size-4" aria-hidden="true" />}>
                          Email a friend
                        </Button>
                      </Cell>
                      <Cell label="sm ghost + icon">
                        <Button variant="ghost" size="sm" icon={<Mail className="size-4" aria-hidden="true" />}>
                          Email a friend
                        </Button>
                      </Cell>
                    </div>
                  </div>
                </div>
              </Specimen>
              <Specimen name="ButtonLink" note="Same looks as Button for navigation. In-app paths use the router; mailto: and external links behave natively.">
                <div className="flex flex-wrap gap-4">
                  <ButtonLink href="/">Back home</ButtonLink>
                  <ButtonLink href="/email-preview" variant="secondary" iconEnd={<ArrowRight className="size-4" aria-hidden="true" />}>
                    Email preview
                  </ButtonLink>
                  <ButtonLink href="/#faq" variant="ghost">
                    FAQ
                  </ButtonLink>
                </div>
              </Specimen>
              <Specimen name="TextLink" note="Inline links inside copy. Accent ink with a soft underline that firms up on hover.">
                <p className="text-copy text-body">
                  Read the <TextLink href="/#faq">frequently asked questions</TextLink>, or{' '}
                  <TextLink href="/#faq" data-force="hover">
                    a hovered link
                  </TextLink>{' '}
                  and{' '}
                  <TextLink href="/#faq" data-force="focus">
                    a focused one
                  </TextLink>
                  .
                </p>
              </Specimen>
            </Section>

            <Section id="fields" title="Fields">
              <Specimen name="Input + Label + FieldMessage" note="Always pair an Input with a Label (or aria-label). Put errors in FieldMessage tone=error, link it with aria-describedby, and set invalid.">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Cell label="default" className="items-stretch">
                    <Label htmlFor="sg-in-1">Get early access</Label>
                    <Input id="sg-in-1" placeholder="Enter your email" />
                  </Cell>
                  <Cell label="hover" className="items-stretch">
                    <Label htmlFor="sg-in-2">Get early access</Label>
                    <Input id="sg-in-2" placeholder="Enter your email" data-force="hover" />
                  </Cell>
                  <Cell label="focus" className="items-stretch">
                    <Label htmlFor="sg-in-3">Get early access</Label>
                    <Input id="sg-in-3" defaultValue="jane@example.com" data-force="focus" />
                  </Cell>
                  <Cell label="invalid + error" className="items-stretch">
                    <Label htmlFor="sg-in-4">Get early access</Label>
                    <Input id="sg-in-4" defaultValue="jane@" invalid aria-describedby="sg-in-4-err" />
                    <FieldMessage id="sg-in-4-err" tone="error">
                      Enter a valid email address.
                    </FieldMessage>
                  </Cell>
                  <Cell label="disabled" className="items-stretch">
                    <Label htmlFor="sg-in-5">Get early access</Label>
                    <Input id="sg-in-5" placeholder="Enter your email" disabled />
                  </Cell>
                  <Cell label="tone=subtle, readOnly" className="items-stretch">
                    <Label htmlFor="sg-in-6">Share link</Label>
                    <Input id="sg-in-6" tone="subtle" readOnly value="https://example.com/?ref=demo2k7" />
                  </Cell>
                  <Cell label="inputSize=sm + hint" className="items-stretch">
                    <Label htmlFor="sg-in-7">Search</Label>
                    <Input id="sg-in-7" inputSize="sm" placeholder="Search email or code" aria-describedby="sg-in-7-hint" />
                    <FieldMessage id="sg-in-7-hint">Matches email or share code.</FieldMessage>
                  </Cell>
                </div>
              </Specimen>
            </Section>

            <Section id="feedback" title="Badges and feedback">
              <Specimen name="Badge" note="Short status or metadata. Neutral by default; accent for boosts, success and danger for states.">
                <div className="flex flex-wrap gap-3">
                  <Badge>Preview only</Badge>
                  <Badge tone="accent">+5 places per friend</Badge>
                  <Badge tone="success">Joined</Badge>
                  <Badge tone="danger">Bounced</Badge>
                </div>
              </Specimen>
              <Specimen name="Callout" note="Boxed messages: empty states (info), failures (error, announced to screen readers) and confirmations. Add action for the next step.">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Callout title="No signups yet" icon={<Info className="size-5" aria-hidden="true" />}>
                    Share the page and new signups will appear here.
                  </Callout>
                  <Callout
                    tone="error"
                    title="Couldn't load signups"
                    action={
                      <Button size="sm" variant="secondary">
                        Try again
                      </Button>
                    }
                  >
                    We couldn't reach the server.
                  </Callout>
                  <Callout tone="success" title="Export ready">
                    Your CSV has downloaded.
                  </Callout>
                </div>
              </Specimen>
              <Specimen name="Spinner · Skeleton · LiveDot" note="Spinner inside buttons and small waits; Skeleton holds the layout while data loads; LiveDot marks live counts.">
                <div className="flex flex-wrap items-center gap-10">
                  <Cell label="Spinner">
                    <Spinner className="text-accent" label="Loading" />
                  </Cell>
                  <Cell label="Skeleton">
                    <span className="flex w-48 flex-col gap-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </span>
                  </Cell>
                  <Cell label="LiveDot">
                    <span className="inline-flex items-center gap-2 text-small text-muted">
                      <LiveDot /> 2,140 people already waiting
                    </span>
                  </Cell>
                </div>
              </Specimen>
            </Section>

            <Section id="surfaces" title="Cards and stats">
              <Specimen name="Card" note="White with a hairline and soft shadow; stage tone for nested or quiet panels. interactive lifts on hover (used by feature cards)." className="bg-stage">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card>
                    <p className="text-[15px] font-semibold text-ink">tone="white"</p>
                    <p className="mt-1 text-small text-muted">Default.</p>
                  </Card>
                  <Card tone="stage">
                    <p className="text-[15px] font-semibold text-ink">tone="stage"</p>
                    <p className="mt-1 text-small text-muted">Quiet panel.</p>
                  </Card>
                  <Card interactive data-force="hover">
                    <p className="text-[15px] font-semibold text-ink">interactive · hover</p>
                    <p className="mt-1 text-small text-muted">Lifts with shadow-raised.</p>
                  </Card>
                </div>
              </Specimen>
              <Specimen name="Stat" note="A big number with a label. sm for dashboards, md for the success panel, lg for the status page. accent tone for the one number that matters.">
                <div className="flex flex-wrap items-end gap-10">
                  <Stat size="sm" label="Total signups" value="2,140" />
                  <Stat label="Your spot" value="#42" suffix="of 2,140" tone="accent" />
                  <Stat size="lg" label="Your spot" value="#7" tone="accent" />
                </div>
              </Specimen>
              <Specimen name="SectionHeading · Eyebrow" note="The head of every section below the fold. Give the title an id and point the section's aria-labelledby at it.">
                <SectionHeading eyebrow="A first look" title="Everything your team juggles, in one calm place." body="A peek at what founding members get on day one." />
              </Specimen>
            </Section>

            <Section id="identity" title="Avatars and brand">
              <Specimen name="Avatar · AvatarStack" note="Initials only (no photos to source). Decorative: give the name in text next to it.">
                <div className="flex flex-wrap items-center gap-6">
                  <Avatar initials="ML" size="sm" />
                  <Avatar initials="ML" />
                  <Avatar initials="ML" size="lg" tone="ink" />
                  <Avatar initials="JD" tone="neutral" />
                  <AvatarStack people={['JD', 'AK', 'SM', 'RT']} />
                </div>
              </Specimen>
              <Specimen name="Logo · LogoMark" note="Same drawing as public/favicon.svg. Logo links home.">
                <div className="flex items-center gap-8">
                  <Logo />
                  <LogoMark className="size-12" />
                </div>
              </Specimen>
            </Section>

            <Section id="interactive" title="Copy, switch, accordion">
              <Specimen name="CopyField" note="Read-only value plus Copy. Falls back to selecting the text when the clipboard is blocked, and announces the copy.">
                <CopyField value="https://example.com/?ref=demo2k7" label="Example share link" className="max-w-[480px]" />
              </Specimen>
              <Specimen name="SegmentedControl" note="A radio group for 2–4 views. Arrow keys move between options.">
                <SegmentedControl
                  label="Preview width"
                  value={segment}
                  onChange={setSegment}
                  options={[
                    { value: 'desktop', label: 'Desktop' },
                    { value: 'mobile', label: 'Mobile' },
                  ]}
                />
              </Specimen>
              <Specimen name="Accordion" note="Disclosure buttons with aria-expanded. One open at a time by default; pass multiple to allow more.">
                <Accordion items={faq.items.slice(0, 3)} defaultOpen={[0]} />
              </Specimen>
            </Section>

            <Section id="waitlist" title="Waitlist">
              <Specimen name="WaitlistForm" note="Live: it posts to /api/waitlist. Submit empty or with a bad address to see the shake and error; a good address swaps to the success panel.">
                <WaitlistForm />
              </Specimen>
              <Specimen name="SuccessPanel · SuccessCheck" note="Shown after joining: counted-up spot, share link and next steps. Sample data here.">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <SuccessCheck key={panelKey} />
                    <Button variant="secondary" size="sm" onClick={() => setPanelKey((k) => k + 1)} icon={<RotateCcw className="size-4" aria-hidden="true" />}>
                      Replay
                    </Button>
                  </div>
                  <SuccessPanel key={`p${panelKey}`} result={sampleResult} onReset={() => setPanelKey((k) => k + 1)} />
                </div>
              </Specimen>
              <Specimen name="Countdown" note="Rolling digits to launch.at in content.ts; swaps to launch.live once the date passes.">
                <Countdown className="text-small text-muted" />
              </Specimen>
            </Section>

            <Section id="leaderboard" title="Leaderboard" intro="Top referrers with masked names. Every state below is the real component.">
              <div className="grid gap-6 lg:grid-cols-2">
                <Specimen name="ready (you highlighted)">
                  <Leaderboard
                    state={{
                      status: 'ready',
                      boost: 5,
                      entries: [
                        { name: 'ma•••', referrals: 12, position: 1 },
                        { name: 'jo•••', referrals: 7, position: 3 },
                        { name: 'ja•••', referrals: 3, position: 9, you: true },
                      ],
                    }}
                  />
                </Specimen>
                <Specimen name="loading">
                  <Leaderboard state={{ status: 'loading' }} />
                </Specimen>
                <Specimen name="empty">
                  <Leaderboard state={{ status: 'ready', boost: 5, entries: [] }} />
                </Specimen>
                <Specimen name="error">
                  <Leaderboard state={{ status: 'error' }} />
                </Specimen>
              </div>
            </Section>

            <Section id="mocks" title="Feature mocks" intro="Tiny CSS-animated product scenes. They play only while on screen and hold a still frame with reduced motion.">
              <SegmentedControl
                label="Mock"
                value={mockKind}
                onChange={setMockKind}
                options={(['board', 'docs', 'chat', 'dashboard'] as const).map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) }))}
              />
              <div className="grid gap-6 sm:grid-cols-2">
                <Specimen name={`FeatureMock kind="${mockKind}"`} className="bg-stage">
                  <FeatureMock key={mockKind} kind={mockKind} />
                </Specimen>
                <Specimen name="paused (off screen)" className="bg-stage">
                  <FeatureMock kind={mockKind} forcePlaying={false} />
                </Specimen>
              </div>
            </Section>

            <Section id="devices" title="Devices and wallpaper" intro="The hero's CSS laptop and phone, sized in stage units (--u). The wallpaper is a seeded SVG with one palette per time of day.">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Wallpaper palette">
                {palettes.map((p, i) => (
                  <Button key={p.name} size="sm" variant={i === paletteIndex ? 'primary' : 'secondary'} aria-pressed={i === paletteIndex} onClick={() => setPaletteIndex(i)}>
                    {p.name}
                  </Button>
                ))}
              </div>
              <Specimen name="Laptop · Phone · Wallpaper" className="overflow-hidden bg-stage p-0 sm:p-0">
                <div className="relative [container-type:inline-size]">
                  <div className="relative" style={{ ['--u' as string]: 'calc(100cqw / 1180)', height: 'calc(100cqw / 1180 * 720)' } as CSSProperties}>
                    <div className="absolute" style={{ left: 'calc(var(--u) * 150)', top: 'calc(var(--u) * 15)' }}>
                      <Laptop label={deviceLabel}>
                        <Wallpaper palette={palettes[paletteIndex]} />
                      </Laptop>
                    </div>
                    <div className="absolute" style={{ left: 'calc(var(--u) * 30)', top: 'calc(var(--u) * 230)' }}>
                      <Phone>
                        <Wallpaper palette={palettes[paletteIndex]} variant="phone" />
                      </Phone>
                    </div>
                  </div>
                </div>
              </Specimen>
            </Section>

            <Section id="layout" title="Layout">
              <Specimen name="SiteHeader" note="Inner pages only; the home page keeps the reference's header-free hero." className="p-0 sm:p-0">
                <SiteHeader />
              </Specimen>
              <Specimen name="Container · PageShell · SiteFooter" note="Container caps the width at 1440px and the reference's 75px desktop gutter. PageShell = SiteHeader + main + SiteFooter; the footer is at the bottom of this page.">
                <div className="rounded-control border border-dashed border-line bg-stage">
                  <Container className="py-4">
                    <span className="block rounded-control bg-white py-3 text-center text-small text-muted shadow-control">Container content</span>
                  </Container>
                </div>
                <p className="mt-4 inline-flex items-center gap-2 text-small text-muted">
                  <Trophy className="size-4 text-accent" aria-hidden="true" />
                  Sections alternate page and stage backgrounds with 80–112px vertical padding.
                </p>
              </Specimen>
            </Section>
          </div>
        </div>
      </Container>
    </PageShell>
  )
}
