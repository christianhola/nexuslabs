import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { ArrowRight, Bell, Car, CalendarCheck2, Inbox, Lock, Monitor, Plus, RotateCcw, Trash2 } from 'lucide-react'

import { Avatar, AvatarStack } from '../components/Avatar'
import { Badge, IconChip, type Tone } from '../components/Badge'
import { Button, ButtonLink, forcedState, IconButton, type ButtonSize, type ButtonVariant } from '../components/Button'
import { Card, CardTitle } from '../components/Card'
import { ChoiceChip } from '../components/ChoiceChip'
import { DateStepper } from '../components/DatePicker'
import { Dialog } from '../components/Dialog'
import { EmptyState, Skeleton } from '../components/EmptyState'
import { Field, Input, Select } from '../components/Field'
import { Logo } from '../components/Logo'
import { Popover } from '../components/Popover'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Spinner } from '../components/Spinner'
import { TimeRange } from '../components/TimeRange'
import { ToastView, useToast } from '../components/Toast'
import { WindowFrame } from '../components/WindowFrame'
import { people, seedDesks } from '../data'
import { FloorPlan, Legend } from '../app/FloorPlan'
import { cn } from '../lib/cn'
import { addDays, todayKey } from '../lib/dates'
import { duration, ease, motionTokens, spring } from '../lib/motion'
import { Link } from '../lib/router'
import { colorGroups, radii, shadows, spacing, typeScale, weights } from '../lib/tokens'

const sections = [
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['space', 'Spacing & radii'],
  ['elevation', 'Elevation'],
  ['motion', 'Motion'],
  ['buttons', 'Button'],
  ['fields', 'Field, Input, Select'],
  ['pickers', 'DateStepper, TimeRange'],
  ['segmented', 'Segmented, ChoiceChip'],
  ['cards', 'Card'],
  ['badges', 'Badge, IconChip'],
  ['avatars', 'Avatar'],
  ['overlays', 'Dialog, Drawer, Popover'],
  ['toasts', 'Toast'],
  ['feedback', 'Empty, Skeleton, Spinner'],
  ['brand', 'Logo, WindowFrame'],
  ['plan', 'FloorPlan'],
  ['layout', 'Reveal, SectionHeading'],
] as const

/** The design system, rendered by the real components. */
export default function Styleguide() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="DeskFlow home" className="inline-flex min-h-10 items-center rounded-sm">
            <Logo size={15} />
          </Link>
          <span className="text-sm font-semibold text-muted">Style guide</span>
          <div className="ml-auto flex gap-2">
            <ButtonLink href="/" variant="ghost" size="sm" className="max-sm:hidden">
              Landing
            </ButtonLink>
            <ButtonLink href="/app" size="sm" className="max-md:h-10">
              Open app
            </ButtonLink>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,1fr)] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="sticky top-24 grid gap-0.5">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded-sm px-2 py-1.5 text-sm text-muted hover:bg-subtle hover:text-fg">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main id="main" className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-14">
          <div>
            <h1 className="text-[32px] leading-10 font-bold tracking-[-0.03em] text-ink">DeskFlow design system</h1>
            <p className="mt-2 max-w-2xl text-base text-muted">
              Tokens live in <Code>src/styles.css</Code>, components in <Code>src/components/</Code>. Everything below is rendered by those components, so this page
              is always current. Plus Jakarta Sans, white surfaces, one orange-red accent, small radii.
            </p>
          </div>
          <Colours />
          <Type />
          <Space />
          <Elevation />
          <Motion />
          <Buttons />
          <Fields />
          <Pickers />
          <SegmentedDemo />
          <Cards />
          <Badges />
          <Avatars />
          <Overlays />
          <Toasts />
          <Feedback />
          <Brand />
          <Plan />
          <LayoutDemo />
        </main>
      </div>
    </div>
  )
}

function Section({ id, title, note, children }: { id: string; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20">
      <h2 id={`${id}-h`} className="text-h3 font-bold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {note && <p className="mt-1 max-w-3xl text-sm text-muted">{note}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Panel({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <div className={cn('rounded-md border border-line bg-surface p-5', className)}>
      {label && <p className="mb-3 text-2xs font-semibold tracking-wider text-muted uppercase">{label}</p>}
      {children}
    </div>
  )
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded-xs bg-subtle px-1 py-0.5 text-[0.9em] text-body">{children}</code>
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid items-center gap-2 border-t border-line-soft py-3 first:border-t-0 first:pt-0 sm:grid-cols-[120px_minmax(0,1fr)]">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

/* ---------------- tokens ---------------- */

function Colours() {
  return (
    <Section id="colour" title="Colour" note="Use the Tailwind names: bg-brand, text-muted, ring-line and so on.">
      <div className="grid gap-6">
        {colorGroups.map((g) => (
          <Panel key={g.name} label={g.name}>
            <p className="-mt-1 mb-4 text-xs text-muted">{g.note}</p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {g.colors.map(([name, hex, note]) => (
                <li key={name}>
                  <span className="block h-14 rounded-sm ring-1 ring-black/5 ring-inset" style={{ background: hex }} />
                  <p className="mt-1.5 text-xs font-semibold text-fg">{name}</p>
                  <p className="text-2xs text-muted uppercase tabular-nums">
                    {hex}
                    {note && <span className="normal-case"> · {note}</span>}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </Section>
  )
}

function Type() {
  return (
    <Section id="type" title="Type" note="Plus Jakarta Sans throughout. Headings track tight (−0.02 to −0.04em); body copy at −0.01em.">
      <Panel>
        <ul className="grid">
          {typeScale.map((t) => (
            <li key={t.token} className="grid items-baseline gap-1 border-t border-line-soft py-3 first:border-t-0 first:pt-0 md:grid-cols-[220px_minmax(0,1fr)]">
              <span className="text-xs text-muted">
                <span className="font-semibold text-fg">{t.token}</span> · {t.size}/{t.line} · {t.weight}
              </span>
              <span
                className="truncate text-ink"
                style={{ fontSize: Math.min(t.size, 56), lineHeight: `${Math.min(t.line, 64)}px`, fontWeight: t.weight, letterSpacing: t.size >= 22 ? '-0.03em' : undefined }}
              >
                {t.token === 'display (hero, 72 on desktop)' ? (
                  <>
                    {t.sample} <span className="rounded-[7px] bg-brand-soft px-2 text-brand-bright">organised</span>
                  </>
                ) : (
                  t.sample
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-6 border-t border-line-soft pt-4">
          {weights.map((w) => (
            <span key={w} className="text-lg text-fg" style={{ fontWeight: w }}>
              Aa {w}
            </span>
          ))}
        </div>
      </Panel>
    </Section>
  )
}

function Space() {
  return (
    <Section id="space" title="Spacing & radii" note="Tailwind's 4px spacing scale; the app runs dense (13px UI text, 30px nav rows). Radii stay small: buttons 2–5px, cards 5px, dialogs 10px.">
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label="Spacing">
          <ul className="grid gap-1.5">
            {spacing.map((s) => (
              <li key={s} className="flex items-center gap-3">
                <span className="w-8 text-right text-2xs text-muted tabular-nums">{s}</span>
                <span className="h-3 rounded-xs bg-brand-soft ring-1 ring-brand-bright/40 ring-inset" style={{ width: s * 2 }} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel label="Radii">
          <ul className="grid grid-cols-3 gap-4">
            {radii.map(([n, v]) => (
              <li key={n} className="text-center">
                <span className="mx-auto block size-16 border-2 border-brand-bright bg-brand-tint" style={{ borderRadius: v }} />
                <p className="mt-1.5 text-xs font-semibold text-fg">{n}</p>
                <p className="text-2xs text-muted">{v}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Section>
  )
}

function Elevation() {
  return (
    <Section id="elevation" title="Elevation" note="Hairline borders do most of the work; shadows are reserved for things that float.">
      <ul className="grid grid-cols-2 gap-5 rounded-md bg-canvas p-6 ring-1 ring-line ring-inset sm:grid-cols-3 lg:grid-cols-5">
        {shadows.map(([n, use]) => (
          <li key={n} className="rounded-md bg-surface p-4" style={{ boxShadow: `var(--shadow-${n})` }}>
            <p className="text-sm font-semibold text-fg">shadow-{n}</p>
            <p className="mt-1 text-2xs text-muted">{use}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Motion() {
  const [run, setRun] = useState(0)
  const curves: Array<[string, object]> = [
    ['fast · ease-out', { duration: duration.fast, ease }],
    ['base · ease-out', { duration: duration.base, ease }],
    ['slow · ease-out', { duration: duration.slow, ease }],
    ['reveal · ease-out', { duration: duration.reveal, ease }],
    ['spring', spring],
  ]
  return (
    <Section
      id="motion"
      title="Motion"
      note={
        <>
          From <Code>src/lib/motion.ts</Code>. Things enter with ease-out, toggles use the spring. With reduced motion on, CSS animations collapse to 0.01ms and Motion
          entrances are skipped.
        </>
      }
    >
      <Panel>
        <div className="mb-4 flex justify-between gap-3">
          <ul className="grid gap-1 text-xs text-muted">
            {motionTokens.map((m) => (
              <li key={m.name}>
                <span className="font-semibold text-fg">{m.name}</span> {m.value} · {m.use}
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" icon={<RotateCcw className="size-3.5" aria-hidden />} onClick={() => setRun((r) => r + 1)}>
            Replay
          </Button>
        </div>
        <ul className="grid gap-2">
          {curves.map(([label, t]) => (
            <li key={label} className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-3">
              <span className="text-xs text-muted">{label}</span>
              <span className="relative h-7 rounded-sm bg-canvas ring-1 ring-line-soft ring-inset">
                <motion.span
                  key={run}
                  className="absolute top-1 left-1 size-5 rounded-xs bg-brand-bright"
                  initial={{ left: '0%' }}
                  animate={{ left: 'calc(100% - 24px)' }}
                  transition={t}
                />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line-soft pt-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span key={`p${run}`} className="size-6 rounded-sm bg-brand-soft animate-pop" /> pop
          </span>
          <span className="flex items-center gap-2">
            <span key={`f${run}`} className="size-6 rounded-sm bg-teal-soft animate-fade-in" /> fade-in
          </span>
          <span className="relative flex items-center gap-2">
            <span className="relative grid size-6 place-items-center">
              <span className="absolute size-3 rounded-full ring-2 ring-brand-bright animate-pulse-ring" />
              <span className="size-2 rounded-full bg-brand-bright" />
            </span>
            pulse-ring (find on map)
          </span>
        </div>
      </Panel>
    </Section>
  )
}

/* ---------------- components ---------------- */

const variants: ButtonVariant[] = ['primary', 'soft', 'outline', 'ghost', 'danger']
const sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg']

function Buttons() {
  const [loading, setLoading] = useState(false)
  return (
    <Section
      id="buttons"
      title="Button"
      note={
        <>
          <Code>Button</Code>, <Code>ButtonLink</Code> (same look, in-app link) and <Code>IconButton</Code> (always has a label). Primary for the one main action per view;
          soft for the nav CTA; outline for secondary and lists of actions; ghost inside toolbars; danger for removing things. Loading keeps the width and blocks
          clicks. On phones, small buttons in the app grow to 40px tall.
        </>
      }
    >
      <Panel>
        {variants.map((v) => (
          <Row key={v} label={v}>
            <Button variant={v}>Default</Button>
            <Button variant={v} className={forcedState[v].hover}>
              Hover
            </Button>
            <Button variant={v} className={forcedState[v].focus}>
              Focus
            </Button>
            <Button variant={v} className={forcedState[v].active}>
              Pressed
            </Button>
            <Button variant={v} disabled>
              Disabled
            </Button>
            <Button variant={v} loading>
              Loading
            </Button>
          </Row>
        ))}
        <Row label="sizes">
          {sizes.map((s) => (
            <Button key={s} size={s}>
              Size {s}
            </Button>
          ))}
        </Row>
        <Row label="with icons">
          <Button iconRight={<ArrowRight className="size-4" aria-hidden />}>Get started free</Button>
          <Button variant="outline" icon={<Plus className="size-4" aria-hidden />}>
            Add desk
          </Button>
          <Button variant="danger" size="sm" icon={<Trash2 className="size-3.5" aria-hidden />}>
            Remove desk
          </Button>
          <Button
            variant="outline"
            loading={loading}
            onClick={() => {
              setLoading(true)
              window.setTimeout(() => setLoading(false), 1200)
            }}
          >
            {loading ? 'Saving…' : 'Click to load'}
          </Button>
        </Row>
        <Row label="IconButton">
          <IconButton label="Notifications">
            <Bell className="size-[18px]" />
          </IconButton>
          <IconButton label="Notifications (small)" size="sm">
            <Bell className="size-4" />
          </IconButton>
          <IconButton label="Disabled" disabled>
            <Bell className="size-[18px]" />
          </IconButton>
        </Row>
        <Row label="ButtonLink">
          <ButtonLink href="/app" variant="soft">
            Get started free
          </ButtonLink>
          <ButtonLink href="/app/floor" variant="outline" size="sm">
            Book a desk
          </ButtonLink>
        </Row>
      </Panel>
    </Section>
  )
}

function Fields() {
  const [v, setV] = useState('')
  const touched = v.length > 0
  const err = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address.' : undefined
  return (
    <Section
      id="fields"
      title="Field, Input, Select"
      note={
        <>
          <Code>Field</Code> wires the label, hint and error to its control by id (render prop). Errors set <Code>aria-invalid</Code> and are announced. 40px tall
          everywhere.
        </>
      }
    >
      <Panel className="grid gap-5 md:grid-cols-2">
        <Field label="Default" hint="Helper text sits under the control.">
          {(p) => <Input {...p} placeholder="Weekly sync" />}
        </Field>
        <Field label="Focused">
          {(p) => <Input {...p} defaultValue="Roadmap review" className="ring-2 ring-brand" />}
        </Field>
        <Field label="Live validation (type an email)" error={err}>
          {(p) => <Input {...p} type="email" value={v} onChange={(e) => setV(e.target.value)} placeholder="you@company.com" />}
        </Field>
        <Field label="Error" error="Give the meeting a title.">
          {(p) => <Input {...p} />}
        </Field>
        <Field label="Disabled">
          {(p) => <Input {...p} disabled defaultValue="D-01" />}
        </Field>
        <Field label="Select">
          {(p) => (
            <Select {...p} defaultValue="Product">
              <option>Product</option>
              <option>Design</option>
              <option>Engineering</option>
            </Select>
          )}
        </Field>
      </Panel>
    </Section>
  )
}

function Pickers() {
  const [date, setDate] = useState(todayKey())
  const [range, setRange] = useState<[string, string]>(['09:00', '17:00'])
  return (
    <Section id="pickers" title="DateStepper, TimeRange" note="Booking controls. DateStepper never goes before today and also opens the native date picker. TimeRange keeps the end after the start, in 30-minute steps.">
      <Panel className="grid gap-4">
        <Row label="DateStepper">
          <DateStepper value={date} onChange={setDate} />
          <DateStepper value={addDays(todayKey(), 3)} onChange={() => {}} />
        </Row>
        <Row label="TimeRange">
          <TimeRange compact start={range[0]} end={range[1]} onChange={(s, e) => setRange([s, e])} />
          <span className="text-xs text-muted">
            {range[0]}–{range[1]}
          </span>
        </Row>
        <Row label="conflict">
          <TimeRange compact start="14:00" end="15:00" invalid onChange={() => {}} />
          <span className="text-xs text-danger">Taken: Omar has it 14:00–15:00.</span>
        </Row>
      </Panel>
    </Section>
  )
}

function SegmentedDemo() {
  const [a, setA] = useState('map')
  const [b, setB] = useState('office')
  return (
    <Section id="segmented" title="Segmented, ChoiceChip" note="ChoiceChip is a pill toggle (aria-pressed), or a radio inside a radiogroup: equipment in the editor, home team in onboarding. Segmented is a radio group with a sliding indicator (spring). Arrow keys move the selection. Use for 2–5 short options: floor, view, billing cycle, office/remote.">
      <Panel className="grid gap-4">
        <Row label="md">
          <Segmented label="View" value={a} onChange={setA} options={[{ value: 'map', label: 'Map' }, { value: 'list', label: 'List' }]} />
        </Row>
        <Row label="ChoiceChip">
          <ChipDemo />
        </Row>
        <Row label="sm">
          <Segmented size="sm" label="Where" value={b} onChange={setB} options={[{ value: 'office', label: 'Office' }, { value: 'remote', label: 'Remote' }, { value: 'off', label: 'Off' }]} />
        </Row>
      </Panel>
    </Section>
  )
}

function Cards() {
  return (
    <Section id="cards" title="Card" note="White surface, 1px line border, 5px radius. `rule` adds the orange left accent for the one thing that matters today; `interactive` lifts on hover.">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <CardTitle>Plain</CardTitle>
          <p className="mt-2 text-xs text-muted">Quick actions, lists, panels.</p>
        </Card>
        <Card rule className="p-4">
          <CardTitle icon={<CalendarCheck2 aria-hidden className="size-[15px] text-brand-bright" />}>Rule</CardTitle>
          <p className="mt-2 text-xs text-muted">Today’s booking.</p>
        </Card>
        <Card interactive className="p-4">
          <CardTitle action={<Badge tone="free">Hover me</Badge>}>Interactive</CardTitle>
          <p className="mt-2 text-xs text-muted">Team members, features.</p>
        </Card>
      </div>
    </Section>
  )
}

const tones: Tone[] = ['brand', 'teal', 'slate', 'amber', 'violet', 'free', 'busy', 'danger']

function Badges() {
  return (
    <Section id="badges" title="Badge, IconChip" note="Badges label status; IconChips sit behind icons in the resource strip and features. Desk brand, room teal, parking slate, locker amber.">
      <Panel className="grid gap-4">
        <Row label="Badge">
          {tones.map((t) => (
            <Badge key={t} tone={t}>
              {t}
            </Badge>
          ))}
        </Row>
        <Row label="with dot">
          <Badge tone="free" dot>
            In · D-02 until 17:00
          </Badge>
          <Badge tone="busy">Remote today</Badge>
        </Row>
        <Row label="IconChip">
          <IconChip tone="teal" size="sm">
            <Monitor />
          </IconChip>
          <IconChip tone="slate">
            <Car />
          </IconChip>
          <IconChip tone="amber" size="lg">
            <Lock />
          </IconChip>
          <IconChip tone="brand" size="lg">
            <CalendarCheck2 />
          </IconChip>
        </Row>
      </Panel>
    </Section>
  )
}

function Avatars() {
  return (
    <Section id="avatars" title="Avatar" note="Initials on a tint from the person’s hue. The accessible name is the person’s name. Stacks cap at `max` and show +N.">
      <Panel className="grid gap-4">
        <Row label="sizes">
          {[24, 32, 40, 56].map((s, i) => (
            <Avatar key={s} person={people[i]} size={s} />
          ))}
        </Row>
        <Row label="AvatarStack">
          <AvatarStack people={people.slice(1, 9)} max={5} />
        </Row>
      </Panel>
    </Section>
  )
}

function Overlays() {
  const [dialog, setDialog] = useState(false)
  const [drawer, setDrawer] = useState(false)
  return (
    <Section id="overlays" title="Dialog, Drawer, Popover" note="All three trap focus, close on Esc and on an outside click, and hand focus back to the button that opened them. Dialogs become bottom sheets on phones.">
      <Panel>
        <Row label="open">
          <Button variant="outline" onClick={() => setDialog(true)}>
            Open dialog
          </Button>
          <Button variant="outline" onClick={() => setDrawer(true)}>
            Open drawer
          </Button>
          <Popover
            label="Example popover"
            align="left"
            trigger={(p) => (
              <Button variant="outline" {...p}>
                Open popover
              </Button>
            )}
          >
            {(close) => (
              <div className="grid gap-3 p-4">
                <p className="text-sm font-semibold text-fg">Popover</p>
                <p className="text-xs text-muted">Anchored to its trigger. The notifications panel uses this.</p>
                <Button size="sm" onClick={close}>
                  Got it
                </Button>
              </div>
            )}
          </Popover>
        </Row>
      </Panel>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Book desk D-07"
        description="Ground floor · Product"
        footer={
          <>
            <Button variant="outline" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialog(false)}>Confirm booking</Button>
          </>
        }
      >
        <Field label="Meeting title">{(p) => <Input {...p} placeholder="Weekly sync" />}</Field>
      </Dialog>
      <Dialog open={drawer} onClose={() => setDrawer(false)} title="Drawer" side="left">
        <p className="text-sm text-muted">The app’s mobile menu is this drawer.</p>
      </Dialog>
    </Section>
  )
}

function Toasts() {
  const toast = useToast()
  return (
    <Section id="toasts" title="Toast" note="Short confirmations at the bottom (right on desktop). Success and info dismiss after 4s, ones with an action (Undo) after 6s. Errors use role=alert.">
      <Panel className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          <ToastView static item={{ tone: 'success', title: 'Desk D-07 booked', body: 'Today · 09:00–17:00', action: { label: 'Undo', run: () => {} } }} />
          <ToastView static item={{ tone: 'info', title: 'Checked out of D-01' }} />
          <ToastView static item={{ tone: 'error', title: 'Couldn’t book', body: 'Omar has D-02 09:00–17:00.' }} />
        </div>
        <Row label="fire one">
          <Button variant="outline" size="sm" onClick={() => toast({ tone: 'success', title: 'Desk D-07 booked', body: 'Today · 09:00–17:00', action: { label: 'Undo', run: () => toast({ tone: 'info', title: 'Undone' }) } })}>
            Success
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ tone: 'info', title: 'Locker L-06 released' })}>
            Info
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ tone: 'error', title: 'Couldn’t book', body: 'That slot was just taken.' })}>
            Error
          </Button>
        </Row>
      </Panel>
    </Section>
  )
}

function Feedback() {
  return (
    <Section id="feedback" title="EmptyState, Skeleton, Spinner" note="Every list has an empty state with a next step. Skeletons shimmer while data loads; Spinner sits inside loading buttons.">
      <div className="grid gap-4 md:grid-cols-3">
        <EmptyState icon={<Inbox />} title="Nothing booked yet" body="Pick a desk on the floor map." action={<Button size="sm">Open floor map</Button>} />
        <Panel label="Skeleton (loading)">
          <div className="grid gap-2.5" aria-busy="true">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Panel>
        <Panel label="Spinner">
          <div className="flex items-center gap-4 text-brand">
            <Spinner />
            <Spinner className="size-6" />
            <span className="text-muted">
              <Spinner />
            </span>
          </div>
        </Panel>
      </div>
    </Section>
  )
}

function Brand() {
  return (
    <Section id="brand" title="Logo, WindowFrame" note="The wordmark is SVG text in brand-bright (logos are exempt from contrast rules). WindowFrame wraps any content in desktop window chrome.">
      <div className="grid gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
        <Panel className="grid content-start gap-4">
          <Logo size={24} />
          <Logo size={18} />
          <Logo size={15} />
        </Panel>
        <WindowFrame title="DeskFlow — Dashboard">
          <div className="grid h-36 place-items-center bg-canvas text-sm text-muted">Window content</div>
        </WindowFrame>
      </div>
    </Section>
  )
}

function Plan() {
  const status = (d: { id: string }) => (d.id === 'D-03' ? 'mine' : ['D-02', 'D-05', 'D-10'].includes(d.id) ? 'busy' : 'free') as 'mine' | 'busy' | 'free'
  return (
    <Section id="plan" title="FloorPlan" note="The office as SVG. Desks and rooms are focusable buttons named by status; in edit mode they drag and nudge with the arrow keys. Colour always pairs with a text label.">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto blueprint bg-canvas p-4">
          <FloorPlan
            className="min-w-[680px]"
            floorId="ground"
            desks={seedDesks}
            statusOf={status}
            holderOf={(id) => (id === 'D-03' ? 'u-lisa' : id === 'D-02' ? 'u-omar' : id === 'D-05' ? 'u-ana' : id === 'D-10' ? 'u-ben' : undefined)}
            roomBusy={(rid) => (rid === 'r-atlas' ? { id: 'x', kind: 'room', resourceId: rid, personId: 'u-tom', date: '', start: '09:30', end: '10:30' } : undefined)}
            highlight="D-10"
            onDesk={() => {}}
          />
        </div>
        <div className="border-t border-line-soft px-4 py-3">
          <Legend />
        </div>
      </Card>
    </Section>
  )
}

function LayoutDemo() {
  const [k, setK] = useState(0)
  return (
    <Section id="layout" title="Reveal, SectionHeading" note="Landing sections fade and rise once as they scroll in; stagger siblings with `delay`. SectionHeading is the centred eyebrow, title and sub.">
      <Panel>
        <div className="mb-4 flex justify-end">
          <Button variant="outline" size="sm" icon={<RotateCcw className="size-3.5" aria-hidden />} onClick={() => setK((x) => x + 1)}>
            Replay
          </Button>
        </div>
        <div key={k}>
          <SectionHeading eyebrow="Eyebrow" title="Section heading" sub="One or two sentences that explain the section." />
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="h-16 rounded-sm bg-brand-tint ring-1 ring-brand-bright/30 ring-inset" />
              </Reveal>
            ))}
          </div>
        </div>
      </Panel>
    </Section>
  )
}


function ChipDemo() {
  const [on, setOn] = useState<string[]>(['Monitor'])
  return (
    <>
      {['Monitor', 'Dual monitor', 'Standing'].map((f) => (
        <ChoiceChip key={f} selected={on.includes(f)} onClick={() => setOn((o) => (o.includes(f) ? o.filter((x) => x !== f) : [...o, f]))}>
          {f}
        </ChoiceChip>
      ))}
      <ChoiceChip selected={false} disabled>
        Disabled
      </ChoiceChip>
    </>
  )
}
