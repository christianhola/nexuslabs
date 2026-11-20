import { motion as m } from 'motion/react'
import { Menu, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Button, ButtonLink, IconButton, TextLink } from '../components/Button'
import type { ButtonVariant, ForceState } from '../components/Button'
import { Card, CardText } from '../components/Card'
import type { CardTone } from '../components/Card'
import { Container } from '../components/Container'
import { Badge, ChoiceGroup, Chip, EmptyState, LinkRow, Notice, SaveToggle, Skeleton, Slider, Stepper } from '../components/Controls'
import { Checkbox, Field, Input, Select, Textarea } from '../components/Field'
import { FireStreaks } from '../components/FireStreaks'
import { Logo } from '../components/Logo'
import { Newsletter } from '../components/Newsletter'
import { Pedigree } from '../components/Pedigree'
import { PostCard } from '../components/PostCard'
import { Reactor } from '../components/Reactor'
import { Sheet } from '../components/Sheet'
import { Ship } from '../components/Ship'
import { Skyline } from '../components/Skyline'
import { ThermalImage } from '../components/ThermalImage'
import { Eyebrow, SectionHeading } from '../components/Typography'
import { photos, posts, why } from '../content'
import { colorGroups, motion, radii, shadows, spacing, typeScale } from '../lib/tokens'

const states: Array<{ label: string; force?: ForceState; disabled?: boolean; loading?: boolean }> = [
  { label: 'Default' },
  { label: 'Hover', force: 'hover' },
  { label: 'Focus', force: 'focus' },
  { label: 'Pressed', force: 'pressed' },
  { label: 'Disabled', disabled: true },
  { label: 'Loading', loading: true },
]

function Block({ id, title, children, note }: { id: string; title: string; children: ReactNode; note?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-white/10 py-14">
      <h2 id={`${id}-h`} className="text-[28px] font-medium tracking-[-0.02em]">
        {title}
      </h2>
      {note ? <p className="mt-2 max-w-[640px] text-[15px] text-muted">{note}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[13px] text-faint">{children}</p>
}

function MotionDemo({ kind, run }: { kind: (typeof motion)[number]['kind']; run: number }) {
  if (kind === 'reveal')
    return (
      <m.div key={run} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="h-10 w-24 rounded-[12px] bg-white" />
    )
  if (kind === 'plasma') return <div key={run} className="round size-12 animate-plasma rounded-full bg-plasma shadow-glow-plasma" />
  if (kind === 'float') return <Ship key={run} kind="cargo" className="h-12 w-auto animate-float" decorative />
  if (kind === 'press')
    return (
      <Button key={run} size="sm" force="pressed">
        Pressed
      </Button>
    )
  return (
    <div key={run} className="h-14 w-40 overflow-hidden rounded-[12px] bg-black">
      <FireStreaks />
    </div>
  )
}

export function StyleGuide() {
  const [run, setRun] = useState(0)
  const [sheet, setSheet] = useState(false)
  const [chip, setChip] = useState(true)
  const [saved, setSaved] = useState(false)
  const [choice, setChoice] = useState<'a' | 'b' | ''>('a')
  const [slider, setSlider] = useState(40)
  const [check, setCheck] = useState(true)
  const nav = ['colours', 'type', 'spacing', 'radii', 'shadows', 'motion', 'buttons', 'links', 'chips', 'badges', 'forms', 'feedback', 'cards', 'imagery', 'patterns']

  return (
    <div className="pb-24 pt-28 sm:pt-36">
      <Container size="xl">
        <Eyebrow>Design system</Eyebrow>
        <h1 className="display mt-3 text-[48px] sm:text-[64px]">Style guide</h1>
        <p className="mt-4 max-w-[620px] text-[18px] text-muted">
          Every token and component on the site, rendered by the real components. States are pinned with a <code className="text-soft">data-force</code> attribute. The site is dark only, so there is one theme.
        </p>
        <nav aria-label="Style guide sections" className="mt-8 flex flex-wrap gap-2">
          {nav.map((n) => (
            <ButtonLink key={n} href={`#${n}`} variant="secondary" size="sm" className="capitalize">
              {n}
            </ButtonLink>
          ))}
        </nav>

        <Block id="colours" title="Colours" note="Text tokens are AA on black. Fire and plasma are for fills, glows and display type.">
          <div className="flex flex-col gap-8">
            {colorGroups.map((g) => (
              <div key={g.name}>
                <Label>{g.name}</Label>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {g.colors.map((c) => (
                    <li key={c.name} className="flex flex-col gap-2">
                      <span className="h-16 rounded-[16px] ring-1 ring-inset ring-white/12" style={{ background: c.hex }} />
                      <span className="text-[14px] text-white">{c.name}</span>
                      <span className="font-mono text-[13px] text-muted">{c.hex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block id="type" title="Type scale" note="Inter. Display sizes run tight; body stays at the default tracking.">
          <ul className="flex flex-col gap-6">
            {typeScale.map((t) => (
              <li key={t.name} className="grid gap-2 sm:grid-cols-[180px_1fr] sm:items-baseline">
                <span className="text-[13px] text-faint">
                  {t.name}
                  <span className="block font-mono">{t.size}</span>
                </span>
                <span className={`${t.cls} truncate`}>Fusion for the open ocean</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="spacing" title="Spacing" note="Tailwind's 4px grid. These are the steps the layout uses.">
          <ul className="flex flex-wrap items-end gap-4">
            {spacing.map((s) => (
              <li key={s} className="flex flex-col items-center gap-2">
                <span className="rounded-[4px] bg-plasma" style={{ width: s, height: s }} />
                <span className="font-mono text-[13px] text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="radii" title="Radii" note="Every rounded shape is a squircle; true circles opt out with the round class.">
          <ul className="flex flex-wrap gap-4">
            {radii.map((r) => (
              <li key={r.name} className="flex flex-col items-center gap-2">
                <span className="block h-20 w-28 bg-surface-2 ring-1 ring-inset ring-white/15" style={{ borderRadius: r.px }} />
                <span className="text-[13px] text-muted">
                  {r.name} <span className="font-mono">{r.px}</span>
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="shadows" title="Shadows and edges">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shadows.map((s) => (
              <li key={s.name} className="flex flex-col gap-3">
                <span className={`relative block h-24 rounded-card bg-surface-2 ${s.cls}`} />
                <span className="text-[14px] text-white">{s.name}</span>
                <span className="font-mono text-[12px] text-muted">{s.value}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="motion" title="Motion" note="All non-essential motion stops with prefers-reduced-motion.">
          <Button variant="secondary" size="sm" onClick={() => setRun((r) => r + 1)}>
            <RotateCcw className="size-4" aria-hidden />
            Replay
          </Button>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {motion.map((t) => (
              <li key={t.name} className="flex flex-col gap-3 rounded-card bg-surface p-5">
                <div className="grid h-20 place-items-center">
                  <MotionDemo kind={t.kind} run={run} />
                </div>
                <span className="text-[14px] text-white">{t.name}</span>
                <span className="text-[13px] text-muted">{t.value}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="buttons" title="Buttons" note="Primary is the one action per view. Pills share a height per size.">
          <div className="flex flex-col gap-8">
            {(['primary', 'secondary', 'ghost'] as ButtonVariant[]).map((v) => (
              <div key={v}>
                <Label>{v}</Label>
                <div className="flex flex-wrap items-center gap-3">
                  {states.map((s) => (
                    <Button key={s.label} variant={v} force={s.force} disabled={s.disabled} loading={s.loading}>
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <Label>Sizes</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </div>
        </Block>

        <Block id="links" title="Links and rows">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Label>Text link: default, hover, focus, muted</Label>
              <div className="flex flex-wrap items-center gap-6">
                <TextLink href="/early-access">Get early access</TextLink>
                <TextLink href="/early-access" force="hover">
                  Get early access
                </TextLink>
                <TextLink href="/early-access" force="focus">
                  Get early access
                </TextLink>
                <TextLink href="/contact" tone="muted">
                  Contact us
                </TextLink>
              </div>
            </div>
            <div className="rounded-card bg-ocean-2 px-6 pb-2">
              <Label>
                <span className="block pt-4 text-white/80">Link row: default, hover, focus</span>
              </Label>
              <LinkRow href="/careers" title="For Engineers" body="Default" />
              <LinkRow href="/careers" title="For Engineers" body="Hover" force="hover" />
              <LinkRow href="/careers" title="For Engineers" body="Focus" force="focus" />
            </div>
          </div>
        </Block>

        <Block id="chips" title="Chips and toggles">
          <div className="flex flex-col gap-6">
            <div>
              <Label>Filter chip: selected, default, hover, focus, pressed, disabled</Label>
              <div className="flex flex-wrap gap-2">
                <Chip selected={chip} onClick={() => setChip((c) => !c)} count={6}>
                  Interactive
                </Chip>
                <Chip selected={false} onClick={() => {}}>
                  Default
                </Chip>
                <Chip selected={false} onClick={() => {}} force="hover">
                  Hover
                </Chip>
                <Chip selected={false} onClick={() => {}} force="focus">
                  Focus
                </Chip>
                <Chip selected={false} onClick={() => {}} force="pressed">
                  Pressed
                </Chip>
                <Chip selected={false} onClick={() => {}} disabled>
                  Disabled
                </Chip>
              </div>
            </div>
            <div>
              <Label>Icon button: default, hover, focus, pressed, disabled</Label>
              <div className="flex gap-2">
                {(['default', 'hover', 'focus', 'pressed'] as const).map((f) => (
                  <IconButton key={f} aria-label={`Menu, ${f}`} force={f === 'default' ? undefined : f}>
                    <Menu className="size-5" aria-hidden />
                  </IconButton>
                ))}
                <IconButton aria-label="Menu, disabled" disabled className="disabled:opacity-45">
                  <Menu className="size-5" aria-hidden />
                </IconButton>
              </div>
            </div>
            <div>
              <Label>Save toggle: interactive, saved, hover, focus</Label>
              <div className="flex gap-2">
                <SaveToggle saved={saved} onToggle={() => setSaved((s) => !s)} label="this role" />
                <SaveToggle saved onToggle={() => {}} label="saved role" />
                <SaveToggle saved={false} onToggle={() => {}} label="hovered role" force="hover" />
                <SaveToggle saved={false} onToggle={() => {}} label="focused role" force="focus" />
              </div>
            </div>
          </div>
        </Block>

        <Block id="badges" title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Neutral</Badge>
            <Badge tone="plasma" pulse>
              Live
            </Badge>
            <Badge tone="fire">Fire</Badge>
            <Badge tone="success">Applied</Badge>
          </div>
        </Block>

        <Block id="forms" title="Form controls" note="Field wires the label, hint and error to its control.">
          <div className="grid gap-6 lg:grid-cols-3">
            <Field label="Default" hint="A hint below the field.">
              {(p) => <Input {...p} placeholder="you@company.com" />}
            </Field>
            <Field label="Hover">{(p) => <Input {...p} data-force="hover" defaultValue="Hovered" />}</Field>
            <Field label="Focus">{(p) => <Input {...p} data-force="focus" defaultValue="Focused" />}</Field>
            <Field label="Error" error="Enter a valid email address, like you@company.com.">
              {(p) => <Input {...p} defaultValue="not-an-email" />}
            </Field>
            <Field label="Disabled">{(p) => <Input {...p} disabled defaultValue="Disabled" />}</Field>
            <Field label="Select">
              {(p) => (
                <Select {...p} defaultValue="b">
                  <option value="a">Commercial shipping</option>
                  <option value="b">Defense</option>
                </Select>
              )}
            </Field>
            <Field label="Textarea" optional className="lg:col-span-2">
              {(p) => <Textarea {...p} placeholder="Routes, vessel classes, power needs." />}
            </Field>
            <div className="flex flex-col gap-4">
              <Checkbox checked={check} onChange={setCheck}>
                Checkbox, interactive
              </Checkbox>
              <Checkbox checked={false} onChange={() => {}} error="Please confirm.">
                Checkbox with error
              </Checkbox>
              <Checkbox checked onChange={() => {}} disabled>
                Disabled
              </Checkbox>
            </div>
            <div className="lg:col-span-2">
              <ChoiceGroup
                legend="Choice group (selected, default)"
                columns={2}
                options={[
                  { id: 'a', label: 'Commercial shipping', hint: 'Owners, operators' },
                  { id: 'b', label: 'Defense', hint: 'Navies, coast guards' },
                ]}
                value={choice}
                onChange={setChoice}
              />
            </div>
            <ChoiceGroup legend="Choice group error" columns={2} options={[{ id: 'x', label: 'Option' }]} value="" onChange={() => {}} error="Choose a segment." />
            <Slider label="Slider" value={slider} min={0} max={100} onChange={setSlider} format={(n) => `${n}%`} />
            <div className="lg:col-span-2">
              <Label>Stepper</Label>
              <Stepper steps={['Who you are', 'Your fleet', 'Review']} current={1} />
            </div>
          </div>
        </Block>

        <Block id="feedback" title="Feedback: notices, empty and loading">
          <div className="grid gap-4 lg:grid-cols-3">
            <Notice tone="info" title="Info">
              Your draft saves on this device.
            </Notice>
            <Notice tone="success" title="Success">
              Application sent.
            </Notice>
            <Notice tone="error" title="Error">
              You appear to be offline.
            </Notice>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <EmptyState title="No roles match" body="Try a different search or team." action={<Button variant="secondary">Clear filters</Button>} />
            <div className="flex flex-col gap-3 rounded-card bg-surface p-6" aria-label="Loading example">
              <Label>Loading skeleton</Label>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="mt-3 h-11 w-36 rounded-control" />
            </div>
          </div>
          <div className="mt-6">
            <Label>Newsletter (live: subscribe, error, receipt)</Label>
            <div className="max-w-[440px]">
              <Newsletter />
            </div>
          </div>
        </Block>

        <Block id="cards" title="Cards" note="One surface, five lights.">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(['plain', 'fire', 'ocean', 'stripes', 'steel'] as CardTone[]).map((t) => (
              <li key={t}>
                <Card tone={t} className="h-[220px]">
                  <CardText title={t} body="Card text sits at the top." />
                </Card>
              </li>
            ))}
          </ul>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            <li>
              <PostCard post={posts[1]} />
            </li>
            <li>
              <PostCard post={posts[2]} />
            </li>
          </ul>
        </Block>

        <Block id="imagery" title="Imagery" note="Photos and renders come from photos in content.ts; the reactor explorer, ships, skyline and streaks are drawn in SVG and canvas.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card tone="ocean" className="grid h-[280px] place-items-center">
              <Reactor className="h-[90%] w-auto" />
            </Card>
            <Card className="flex h-[280px] flex-col items-center justify-center gap-4">
              <Ship kind="cargo" className="h-14 w-auto" />
              <Ship kind="frigate" className="h-14 w-auto" />
              <Ship kind="platform" className="h-14 w-auto" />
            </Card>
            <Card tone="fire" className="h-[280px]">
              <ThermalImage src={photos.crew} alt="The crew photo through the thermal filter" className="absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-1.5">
                <Pedigree marks={why.pedigree} />
              </div>
            </Card>
            <Card className="h-[220px] bg-black md:col-span-2">
              <FireStreaks />
            </Card>
            <Card tone="ocean" className="flex h-[220px] items-end">
              <Skyline className="w-full" />
            </Card>
            <Card tone="ocean" className="grid h-[280px] place-items-center">
              <img src={photos.reactor} alt="The reactor render" loading="lazy" className="h-[90%] w-auto" />
            </Card>
            <Card className="flex h-[280px] flex-col items-center justify-center gap-4">
              <img src={photos.shipCargo} alt="The cargo ship render" loading="lazy" className="h-20 w-auto" />
              <img src={photos.shipFrigate} alt="The frigate render" loading="lazy" className="h-20 w-auto" />
            </Card>
            <Card tone="ocean" className="h-[280px]">
              <img src={photos.seaCargo} alt="A market photo" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </Card>
          </div>
        </Block>

        <Block id="patterns" title="Patterns">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <Logo />
              <SectionHeading title={['Why', 'Maritime Fusion?']} align="left" size="md" eyebrow="Section heading" body="With an optional lede." />
            </div>
            <div>
              <Label>Sheet (the mobile menu): focus trap, Esc, focus restore</Label>
              <Button variant="secondary" onClick={() => setSheet(true)}>
                Open sheet
              </Button>
              <Sheet open={sheet} onClose={() => setSheet(false)} title="Example sheet">
                <p className="mt-4 px-2 text-[15px] text-muted">Tab stays inside. Press Esc or the close button to return focus.</p>
                <div className="mt-6 flex gap-2 px-2">
                  <Button onClick={() => setSheet(false)}>Done</Button>
                  <Button variant="ghost" onClick={() => setSheet(false)}>
                    Cancel
                  </Button>
                </div>
              </Sheet>
            </div>
          </div>
        </Block>
      </Container>
    </div>
  )
}
