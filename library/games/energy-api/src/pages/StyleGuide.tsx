import { motion } from 'motion/react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, Play, RotateCcw, SearchX } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import type { ButtonVariant, ForceState } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { Chip } from '../components/Chip'
import { CodeBlock } from '../components/CodeBlock'
import { Container } from '../components/Container'
import { Dialog } from '../components/Dialog'
import { DotColumns } from '../components/DotColumns'
import { EmptyState } from '../components/EmptyState'
import { Eyebrow } from '../components/Eyebrow'
import { Input, Select, Textarea } from '../components/Field'
import { Logo } from '../components/Logo'
import { Media } from '../components/Media'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { RadioCard } from '../components/RadioCard'
import { SearchInput } from '../components/SearchInput'
import { Segmented } from '../components/Segmented'
import { Skeleton } from '../components/Skeleton'
import { Slider } from '../components/Slider'
import { Stat } from '../components/Stat'
import { Tabs, TabPanel, useIdBase } from '../components/Tabs'
import { UseCaseCard } from '../components/UseCaseCard'
import { pricing, useCases } from '../content'
import { cx } from '../lib/cx'

/* Mirrors the @theme block in src/styles.css. Keep the two in step. */
const colours: { group: string; items: { name: string; hex: string; note?: string }[] }[] = [
  {
    group: 'Surfaces',
    items: [
      { name: 'mint', hex: '#eefbe6', note: 'Page' },
      { name: 'mint-2', hex: '#e3f5d8', note: 'Tinted card' },
      { name: 'mint-3', hex: '#d4ecc6', note: 'Track, skeleton' },
      { name: 'paper', hex: '#ffffff', note: 'Card, field' },
      { name: 'paper-2', hex: '#f7fdf3', note: 'Hover' },
      { name: 'line', hex: '#d7e8cc', note: 'Hairline' },
      { name: 'line-strong', hex: '#bcd3ae', note: 'Field border' },
    ],
  },
  {
    group: 'Ink',
    items: [
      { name: 'ink', hex: '#1c1e1b', note: 'Text, dark pill' },
      { name: 'ink-2', hex: '#393d36', note: 'Secondary text' },
      { name: 'muted', hex: '#545b50', note: 'Body on mint, AA' },
      { name: 'faint', hex: '#677061', note: 'Placeholder, AA' },
    ],
  },
  {
    group: 'Brand',
    items: [
      { name: 'volt', hex: '#b9ec6c', note: 'Fills, dots, never small text' },
      { name: 'volt-2', hex: '#a6de52', note: 'Volt hover' },
      { name: 'leaf', hex: '#2f6a1d', note: 'Small green text, AA' },
      { name: 'forest', hex: '#142016', note: 'Dark band, code' },
      { name: 'forest-2', hex: '#1c2b1e', note: 'Dark card' },
      { name: 'forest-3', hex: '#26382a', note: 'Dark control' },
      { name: 'on-forest', hex: '#eaf6e1', note: 'Text on forest' },
      { name: 'on-forest-muted', hex: '#a9bba3', note: 'Muted on forest' },
    ],
  },
  {
    group: 'Status',
    items: [
      { name: 'success', hex: '#2f6a1d' },
      { name: 'success-50', hex: '#ddf3cf' },
      { name: 'warning', hex: '#85570a' },
      { name: 'warning-50', hex: '#fbf0d6' },
      { name: 'danger', hex: '#b02e24' },
      { name: 'danger-50', hex: '#fbe7e3' },
    ],
  },
]

const typeScale = [
  { name: 'Display', cls: 'text-[68px] leading-[1.01] tracking-[-0.042em] font-medium', spec: '68 / 1.01, -4.2%, 500' },
  { name: 'H1', cls: 'text-[60px] leading-[1.04] tracking-[-0.035em] font-medium', spec: '60 / 1.04, -3.5%, 500' },
  { name: 'H2', cls: 'text-[46px] leading-[1.08] tracking-[-0.035em] font-medium', spec: '46 / 1.08, -3.5%, 500' },
  { name: 'H3', cls: 'text-[24px] leading-tight tracking-[-0.025em] font-medium', spec: '24 / 1.25, -2.5%, 500' },
  { name: 'Lede', cls: 'text-[17px] leading-[1.6] text-muted', spec: '17 / 1.6, 400' },
  { name: 'Body', cls: 'text-[15.5px] leading-[1.65]', spec: '15.5 / 1.65, 400' },
  { name: 'Small', cls: 'text-[13.5px] text-muted', spec: '13.5, 400' },
  { name: 'Mono', cls: 'font-mono text-[13px]', spec: 'Geist Mono 13 / 1.7' },
]

const spacing = [4, 8, 12, 16, 24, 32, 40, 64, 96, 112]
const radii = [
  { name: 'control-sm', px: 12 },
  { name: 'control', px: 14 },
  { name: 'media', px: 14 },
  { name: 'card-sm', px: 16 },
  { name: 'card', px: 22 },
  { name: 'panel', px: 30 },
  { name: 'pill', px: 999 },
]
const shadows = [
  { name: 'card', v: 'var(--shadow-card)' },
  { name: 'float', v: 'var(--shadow-float)' },
  { name: 'inset', v: 'var(--shadow-inset)' },
]
const motionTokens = [
  { name: 'duration-fast', spec: '150ms, hover and press' },
  { name: 'duration-base', spec: '260ms, dialogs and accordions' },
  { name: 'duration-slow', spec: '700ms, scroll reveals' },
  { name: 'ease-out', spec: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  { name: 'breathe', spec: '6s, hero dot columns' },
  { name: 'flow', spec: '2.4s, platform diagram lines' },
]

const states: { label: string; force?: ForceState; disabled?: boolean; loading?: boolean }[] = [
  { label: 'Default' },
  { label: 'Hover', force: 'hover' },
  { label: 'Focus', force: 'focus' },
  { label: 'Pressed', force: 'pressed' },
  { label: 'Disabled', disabled: true },
  { label: 'Loading', loading: true },
]
const variants: ButtonVariant[] = ['dark', 'outline', 'ghost', 'volt', 'light', 'danger']

const toc = ['Colour', 'Type', 'Spacing', 'Radii', 'Shadows', 'Motion', 'Buttons', 'Selection', 'Fields', 'Feedback', 'Content', 'Overlays']
const slug = (s: string) => `sg-${s.toLowerCase()}`

function Section({ title, children, note }: { title: string; children: ReactNode; note?: ReactNode }) {
  return (
    <section id={slug(title)} aria-labelledby={`${slug(title)}-h`} className="border-t border-line py-14">
      <h2 id={`${slug(title)}-h`} className="text-[28px] font-medium tracking-[-0.03em]">
        {title}
      </h2>
      {note && <p className="mt-2 max-w-[640px] text-[15px] text-muted">{note}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[12.5px] font-medium text-muted">{children}</p>
}

export function StyleGuide() {
  const [replay, setReplay] = useState(0)
  const [seg, setSeg] = useState<'monthly' | 'yearly'>('monthly')
  const [tab, setTab] = useState<'one' | 'two' | 'three'>('one')
  const [chips, setChips] = useState<string[]>(['EVs'])
  const [check, setCheck] = useState(true)
  const [radio, setRadio] = useState('a')
  const [slider, setSlider] = useState(40)
  const [q, setQ] = useState('heat pump')
  const [dialog, setDialog] = useState(false)
  const tabsId = useIdBase()

  return (
    <>
      <PageHeader eyebrow="Design system" title="Style guide" body="Every token and component on the site, rendered by the real components. Hover, focus and pressed states are pinned with data-force.">
        <nav aria-label="Style guide sections" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {toc.map((t) => (
              <li key={t}>
                <a href={`#${slug(t)}`} className="round inline-flex h-10 items-center rounded-pill bg-paper px-4 text-[14px] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] hover:text-ink">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Container className="pb-24">
        <Section title="Colour" note="Volt is for fills, dots and display type only. Text in green uses leaf, which passes AA on mint and white.">
          <div className="space-y-8">
            {colours.map((g) => (
              <div key={g.group}>
                <Label>{g.group}</Label>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {g.items.map((c) => (
                    <li key={c.name} className="overflow-hidden rounded-card-sm bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]">
                      <div className="h-16 shadow-[inset_0_-1px_0_var(--color-line)]" style={{ background: c.hex }} />
                      <div className="p-3">
                        <p className="text-[13.5px] font-medium">{c.name}</p>
                        <p className="font-mono text-[12px] text-muted">{c.hex}</p>
                        {c.note && <p className="mt-0.5 text-[12px] text-muted">{c.note}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type" note="Geist for everything, Geist Mono for code. Tight negative tracking on headings, as in the reference.">
          <div className="divide-y divide-line">
            {typeScale.map((t) => (
              <div key={t.name} className="grid gap-2 py-4 sm:grid-cols-[160px_1fr] sm:items-baseline">
                <div>
                  <p className="text-[14px] font-medium">{t.name}</p>
                  <p className="text-[12.5px] text-muted">{t.spec}</p>
                </div>
                <p className={cx('truncate', t.cls)}>Energy for the next grid</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Spacing" note="A 4px base. Sections breathe at 96–112px; cards pad at 24–40px.">
          <ul className="space-y-2">
            {spacing.map((s) => (
              <li key={s} className="flex items-center gap-4">
                <span className="w-12 text-right font-mono text-[12.5px] text-muted">{s}</span>
                <span className="round h-3 rounded-full bg-ink" style={{ width: s * 2 }} />
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Radii" note="Squircle corners everywhere; pills and dots opt out with the round class.">
          <ul className="flex flex-wrap gap-4">
            {radii.map((r) => (
              <li key={r.name} className="text-center">
                <div className={cx('size-24 bg-paper shadow-[inset_0_0_0_1px_var(--color-line-strong)]', r.name === 'pill' && 'round')} style={{ borderRadius: r.px }} />
                <p className="mt-2 text-[13px] font-medium">{r.name}</p>
                <p className="font-mono text-[12px] text-muted">{r.px === 999 ? 'full' : `${r.px}px`}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Shadows">
          <ul className="grid gap-6 sm:grid-cols-3">
            {shadows.map((s) => (
              <li key={s.name}>
                <div className="h-28 rounded-card bg-paper" style={{ boxShadow: s.v }} />
                <p className="mt-3 text-[13.5px] font-medium">{s.name}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Motion" note="All non-essential motion stops under prefers-reduced-motion: the dot columns hold still, reveals appear without moving, counters show their final value.">
          <div className="grid gap-8 lg:grid-cols-2">
            <ul className="divide-y divide-line">
              {motionTokens.map((m) => (
                <li key={m.name} className="flex justify-between gap-4 py-3 text-[14px]">
                  <span className="font-mono text-[13px]">{m.name}</span>
                  <span className="text-muted">{m.spec}</span>
                </li>
              ))}
            </ul>
            <Card tone="mint" className="relative overflow-hidden p-6">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium">Reveal, counter and dots</p>
                <Button size="sm" variant="outline" iconLeft={<RotateCcw className="size-3.5" aria-hidden />} onClick={() => setReplay((n) => n + 1)}>
                  Replay
                </Button>
              </div>
              <div key={replay} className="relative mt-6 h-[180px]">
                <DotColumns
                  className="!block"
                  columns={[
                    { left: 900, top: 0, height: 170, delay: 0 },
                    { left: 1100, top: 30, height: 140, delay: -2 },
                  ]}
                />
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative w-[55%]">
                  <Stat value={6.4} decimals={1} suffix=" GW" label="Counts up on view" />
                </motion.div>
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Buttons" note="Pills share a height per size: sm 34px (40px on phones), md 44px, lg 48px.">
          <div className="space-y-6 overflow-x-auto">
            {variants.map((v) => (
              <div key={v} className={cx('rounded-card p-4', v === 'light' && 'on-forest bg-forest')}>
                <Label>
                  <span className={v === 'light' ? 'text-on-forest-muted' : undefined}>{v}</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {states.map((s) => (
                    <Button key={s.label} variant={v} size="sm" force={s.force} disabled={s.disabled} loading={s.loading}>
                      {s.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 px-4">
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
              <Button icon={<ArrowRight className="size-4" aria-hidden />}>With icon</Button>
              <Button variant="outline" iconLeft={<Play className="size-3.5" aria-hidden />}>
                Leading icon
              </Button>
              <ButtonLink href="/styleguide#sg-buttons" variant="outline">
                As a link
              </ButtonLink>
            </div>
          </div>
        </Section>

        <Section title="Selection">
          <div className="grid gap-10 lg:grid-cols-2 [&>*]:min-w-0">
            <div className="space-y-6">
              <div>
                <Label>Chip: off, on, hover, focus, pressed, disabled</Label>
                <div className="flex flex-wrap gap-2">
                  {['EVs', 'Heat pumps', 'Batteries'].map((c) => (
                    <Chip key={c} pressed={chips.includes(c)} onClick={() => setChips((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))} count={c.length}>
                      {c}
                    </Chip>
                  ))}
                  <Chip pressed={false} onClick={() => {}} force="hover">
                    Hover
                  </Chip>
                  <Chip pressed={false} onClick={() => {}} force="focus">
                    Focus
                  </Chip>
                  <Chip pressed onClick={() => {}} force="pressed">
                    Pressed
                  </Chip>
                  <Chip pressed={false} onClick={() => {}} disabled>
                    Disabled
                  </Chip>
                </div>
              </div>
              <div>
                <Label>Segmented</Label>
                <div className="flex flex-wrap gap-3">
                  <Segmented label="Billing" value={seg} onChange={setSeg} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
                  <Segmented label="Billing (small)" size="sm" value={seg} onChange={setSeg} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
                </div>
              </div>
              <div>
                <Label>Tabs</Label>
                <Tabs label="Example" idBase={tabsId} value={tab} onChange={setTab} items={[{ value: 'one', label: 'cURL' }, { value: 'two', label: 'Node' }, { value: 'three', label: 'Python' }]} className="border-b border-line" />
                <TabPanel idBase={tabsId} value={tab} className="pt-3 text-[14px] text-muted">
                  Panel for {tab}. Arrow keys move between tabs.
                </TabPanel>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Label>Checkbox: on, off, disabled</Label>
                <Checkbox checked={check} onChange={setCheck} label="Live only" hint="Hide beta and upcoming brands" />
                <Checkbox checked={false} onChange={() => {}} label="Unchecked" />
                <Checkbox checked onChange={() => {}} label="Disabled" disabled />
              </div>
              <div>
                <Label>Radio card: selected, default, hover, disabled</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <RadioCard name="sg" value="a" checked={radio === 'a'} onChange={setRadio} title="Under 1,000" hint="Pilot" />
                  <RadioCard name="sg" value="b" checked={radio === 'b'} onChange={setRadio} title="1,000 to 10,000" hint="Growing" />
                  <RadioCard name="sg2" value="c" checked={false} onChange={() => {}} title="Hover" force="hover" />
                  <RadioCard name="sg2" value="d" checked={false} onChange={() => {}} title="Disabled" disabled />
                </div>
              </div>
              <Slider label="Slider" value={slider} min={0} max={100} onChange={setSlider} display={`${slider}%`} />
            </div>
          </div>
        </Section>

        <Section title="Fields">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Default" placeholder="name@company.com" />
            <Input label="Hover" placeholder="name@company.com" force="hover" />
            <Input label="Focus" defaultValue="ada@" force="focus" />
            <Input label="Error" defaultValue="ada@gmail.com" error="Use your work email so we can route you to the right team." />
            <Input label="Disabled" defaultValue="Read only" disabled />
            <Input label="With hint" optional hint="Shown under the field" />
            <Select label="Select" placeholder="Choose one" options={['Energy retailer', 'Utility']} defaultValue="" />
            <SearchInput label="Search" value={q} onValueChange={setQ} placeholder="Search brands" className="self-end" />
            <SearchInput label="Search, empty" value="" onValueChange={() => {}} placeholder="Empty search" className="self-end" />
            <Textarea label="Textarea" placeholder="What are you building?" className="sm:col-span-2 lg:col-span-3" />
          </div>
        </Section>

        <Section title="Feedback">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Notice tone="info" title="Info">Sandbox keys only reach simulated devices.</Notice>
              <Notice tone="success" title="Success">Voltaro linked.</Notice>
              <Notice tone="error" title="Error">Your request was not sent.</Notice>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge tone="live" dot>
                  Live
                </Badge>
                <Badge tone="beta">Beta</Badge>
                <Badge tone="soon">Coming soon</Badge>
                <Badge>Neutral</Badge>
                <Badge tone="danger">Danger</Badge>
                <Badge tone="forest">Forest</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Loading skeleton</Label>
              <Card className="space-y-3 p-5" aria-busy="true">
                <Skeleton className="h-11 w-11" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
              <EmptyState icon={<SearchX className="size-5" aria-hidden />} title="Empty state" body="Shown when a search or filter has no results." action={<Button size="sm" variant="outline">Clear filters</Button>} />
            </div>
          </div>
        </Section>

        <Section title="Content">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-8">
              <Logo />
              <Eyebrow>Eyebrow</Eyebrow>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6">Card, paper</Card>
              <Card tone="mint" className="p-6">
                Card, mint
              </Card>
              <Card tone="forest" className="p-6">
                Card, forest
              </Card>
            </div>
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] [&>*]:min-w-0">
              <UseCaseCard useCase={useCases[0]} />
              <div className="space-y-6">
                <Media name="grid" className="aspect-[16/9]" />
                <CodeBlock title="read.sh" code={'curl https://api.gridwise.example/v1/devices \\\n  -H "Authorization: Bearer $GRIDWISE_KEY"'} />
              </div>
            </div>
            <Accordion items={pricing.faq.slice(0, 3)} />
          </div>
        </Section>

        <Section title="Overlays" note="Dialogs and the mobile drawer trap focus, close on Esc or the backdrop, and return focus to the opener.">
          <Button onClick={() => setDialog(true)}>Open dialog</Button>
          <Dialog open={dialog} onClose={() => setDialog(false)} title="Dialog" description="A modal with a trapped focus loop.">
            <Input label="A field inside" />
            <div className="mt-6 flex gap-2">
              <Button onClick={() => setDialog(false)}>Done</Button>
              <Button variant="outline" onClick={() => setDialog(false)}>
                Cancel
              </Button>
            </div>
          </Dialog>
        </Section>
      </Container>
    </>
  )
}
