import { motion } from 'motion/react'
import { Bell, Inbox, Plus, RotateCcw, Search, Share2, Star } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { AppMock } from '../components/AppMock'
import { Avatar } from '../components/Avatar'
import { Badge, Eyebrow } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import type { ButtonVariant, Force } from '../components/Button'
import { Card } from '../components/Card'
import { Chip } from '../components/Chip'
import { CodeBlock } from '../components/CodeBlock'
import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Field, Input, PasswordInput, Select, Textarea } from '../components/Field'
import { FunnelChart } from '../components/FunnelChart'
import { JourneyList } from '../components/JourneyList'
import { LineChart } from '../components/LineChart'
import { Logo, LogoMark } from '../components/Logo'
import { FilterMenu } from '../components/Menu'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { PasswordStrength } from '../components/PasswordStrength'
import { PlanCard } from '../components/PlanCard'
import { RetentionGrid } from '../components/RetentionGrid'
import { ScaledFrame } from '../components/ScaledFrame'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Sheet } from '../components/Sheet'
import { SignalFeed } from '../components/SignalFeed'
import { Slider } from '../components/Slider'
import { Sparkline } from '../components/Sparkline'
import { Toggle } from '../components/Toggle'
import { UptimeBars } from '../components/UptimeBars'
import { accounts, funnels, journeys, overview, plans, retention } from '../content'
import { colorTokens, motionTokens, radii, shadows, spacing, typeScale } from '../lib/tokens'

/*
  The living style guide at /styleguide. Everything is rendered by the real
  components; hover, focus and pressed are pinned with data-force on the
  same component, so they cannot drift from the app.
*/

const toc = [
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['space', 'Spacing & radii'],
  ['elevation', 'Elevation'],
  ['motion', 'Motion'],
  ['button', 'Buttons'],
  ['badge', 'Badges & chips'],
  ['forms', 'Form fields'],
  ['choice', 'Choice controls'],
  ['feedback', 'Feedback'],
  ['disclosure', 'Disclosure & overlays'],
  ['data', 'Data display'],
  ['product', 'Product mock'],
  ['brand', 'Brand & layout'],
] as const

function Block({ id, title, usage, children }: { id: string; title: string; usage?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-line py-14 first:border-t-0 first:pt-0">
      <h2 id={`${id}-h`} className="font-display text-[28px] font-bold tracking-[-0.035em] text-ink">
        {title}
      </h2>
      {usage ? <div className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-muted">{usage}</div> : null}
      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </section>
  )
}

function Row({ label, children, mock }: { label: string; children: ReactNode; mock?: boolean }) {
  return (
    <div data-density={mock ? 'mock' : undefined}>
      <p className="mb-3 font-display text-[13px] font-semibold text-faint">
        {label}
        {mock ? <span className="font-normal"> (mock density: used only inside the scaled product mock, not on phones)</span> : null}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const states: { label: string; force?: Force; disabled?: boolean; loading?: boolean }[] = [
  { label: 'Default' },
  { label: 'Hover', force: 'hover' },
  { label: 'Focus', force: 'focus' },
  { label: 'Pressed', force: 'pressed' },
  { label: 'Disabled', disabled: true },
  { label: 'Loading', loading: true },
]

export function StyleGuide() {
  const [replay, setReplay] = useState(0)
  const [seg, setSeg] = useState<'web' | 'ios'>('web')
  const [toggle, setToggle] = useState(true)
  const [check, setCheck] = useState(true)
  const [slider, setSlider] = useState(40)
  const [menu, setMenu] = useState<string[]>(['Growth'])
  const [sheet, setSheet] = useState(false)
  const [pw, setPw] = useState('Meadow-42')
  const days = Array.from({ length: 90 }, (_, i) => ({ date: `Day ${i + 1}`, status: (i === 40 ? 'outage' : i === 12 || i === 70 ? 'degraded' : 'ok') as 'ok' | 'degraded' | 'outage' }))

  return (
    <>
      <PageHeader eyebrow="Design system" title="Pulseboard style guide" lede="Tokens and every component in every state, rendered by the same code the site uses." />
      <Container className="pb-24">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
          <nav aria-label="Style guide" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex flex-wrap gap-1 lg:flex-col">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="flex min-h-9 items-center rounded-[10px] px-3 text-[14px] text-body hover:bg-wash-2 focus-visible:outline-2 focus-visible:outline-leaf">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <Block id="colour" title="Colour" usage="Lime is for one primary action per view and for data fills. Text never uses lime; accent text uses leaf. Status colours always come with an icon or a word.">
              {colorTokens.map((g) => (
                <div key={g.group}>
                  <p className="mb-3 font-display text-[13px] font-semibold text-faint">{g.group}</p>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                    {g.items.map((c) => (
                      <li key={c.name} className="overflow-hidden rounded-[16px] border border-line bg-card">
                        <span className="block h-16 border-b border-line" style={{ background: c.hex }} />
                        <span className="block p-3">
                          <span className="block font-display text-[14px] font-semibold text-ink">{c.name}</span>
                          <span className="block font-mono text-[12px] text-muted">{c.hex}</span>
                          <span className="mt-1 block text-[12.5px] leading-snug text-faint">{c.use}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Block>

            <Block id="type" title="Type" usage="Plus Jakarta Sans for display and UI labels, Inter for reading, JetBrains Mono for code.">
              <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-card)] border border-line bg-card">
                {typeScale.map((t) => (
                  <li key={t.name} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-baseline sm:gap-6">
                    <span className="w-24 shrink-0 font-display text-[13px] font-semibold text-faint">{t.name}</span>
                    <span className={`min-w-0 flex-1 truncate text-ink ${t.cls}`}>Where customers drift</span>
                    <span className="shrink-0 font-mono text-[12px] text-muted">{t.spec}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block id="space" title="Spacing & radii" usage="A 4px base. Sections step 96 → 128px; cards pad 24–40px. Everything rounded is a squircle; circles opt out with .round.">
              <div className="flex flex-wrap items-end gap-3">
                {spacing.map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <span className="block rounded-[4px] bg-lime" style={{ width: s, height: s }} />
                    <span className="font-mono text-[12px] text-muted">{s}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {radii.map((r) => (
                  <div key={r.name} className="flex flex-col gap-2">
                    <span className="block h-20 border border-line-strong bg-wash" style={{ borderRadius: r.value }} />
                    <span className="font-display text-[13px] font-semibold text-ink">
                      {r.name} <span className="font-mono font-normal text-muted">{r.value}</span>
                    </span>
                    <span className="text-[12.5px] text-faint">{r.use}</span>
                  </div>
                ))}
              </div>
            </Block>

            <Block id="elevation" title="Elevation">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {shadows.map((s) => (
                  <div key={s.name} className={`flex h-28 flex-col justify-end rounded-[var(--radius-card)] bg-card p-4 ${s.cls}`}>
                    <span className="font-display text-[14px] font-semibold text-ink">{s.name}</span>
                    <span className="text-[12.5px] text-faint">{s.use}</span>
                  </div>
                ))}
              </div>
            </Block>

            <Block id="motion" title="Motion" usage="One house curve for entrances. Reduced motion removes movement and keeps fades.">
              <ul className="grid gap-2 sm:grid-cols-2">
                {motionTokens.map((m) => (
                  <li key={m.name} className="rounded-[14px] bg-wash px-4 py-3">
                    <span className="font-display text-[14px] font-semibold text-ink">{m.name}</span> <span className="font-mono text-[12px] text-muted">{m.value}</span>
                    <span className="block text-[13px] text-faint">{m.use}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-6 rounded-[var(--radius-card)] border border-line bg-card p-6">
                <Button variant="outline" size="sm" icon={<RotateCcw className="size-4" aria-hidden />} onClick={() => setReplay((r) => r + 1)}>
                  Replay
                </Button>
                {[0, 0.08, 0.16].map((d) => (
                  <motion.span key={`${replay}-${d}`} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] }} className="block h-16 w-24 rounded-[14px] bg-lime" />
                ))}
                <span className="skeleton block h-16 w-40 rounded-[14px]" aria-label="Loading skeleton" role="img" />
              </div>
            </Block>

            <Block id="button" title="Buttons" usage={<>Pills. <code>lime</code> once per view, <code>dark</code> beside it, <code>outline</code>/<code>white</code> on cards and photos, <code>ghost</code> in toolbars. Phones get 40px+ targets.</>}>
              {(['lime', 'dark', 'outline', 'white', 'ghost'] as ButtonVariant[]).map((v) => (
                <Row key={v} label={v}>
                  <div className={`flex flex-wrap items-center gap-3 rounded-[16px] p-3 ${v === 'white' ? 'bg-sky' : ''}`}>
                    {states.map((s) => (
                      <Button key={s.label} variant={v} size="sm" force={s.force} disabled={s.disabled} loading={s.loading} arrow={v === 'lime'}>
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </Row>
              ))}
              <Row label="Sizes">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg" arrow>
                  Large
                </Button>
              </Row>
              <Row label="Icon buttons: plain, lime, dark; default, hover, focus, pressed/on, disabled">
                <IconButton label="Search">
                  <Search aria-hidden />
                </IconButton>
                <IconButton label="Search (hover)" force="hover">
                  <Search aria-hidden />
                </IconButton>
                <IconButton label="Search (focus)" force="focus">
                  <Search aria-hidden />
                </IconButton>
                <IconButton label="Notify" tone="lime">
                  <Bell aria-hidden />
                </IconButton>
                <IconButton label="Notify (on)" tone="lime" active>
                  <Bell aria-hidden />
                </IconButton>
                <IconButton label="Share" tone="dark">
                  <Share2 aria-hidden />
                </IconButton>
                <IconButton label="Watched" tone="dark" active>
                  <Star fill="currentColor" aria-hidden />
                </IconButton>
                <IconButton label="Add (disabled)" disabled>
                  <Plus aria-hidden />
                </IconButton>
              </Row>
            </Block>

            <Block id="badge" title="Badges & chips">
              <Row label="Badge tones">
                {(['lime', 'neutral', 'dark', 'outline', 'ok', 'warn', 'bad'] as const).map((t) => (
                  <Badge key={t} tone={t} dot={t === 'ok' || t === 'warn' || t === 'bad'}>
                    {t}
                  </Badge>
                ))}
                <Badge tone="outline" size="lg">
                  Large outline
                </Badge>
              </Row>
              <Row label="Eyebrow">
                <Eyebrow>What you get</Eyebrow>
              </Row>
              <Row label="Chips: removable, read-only">
                <Chip label="Plan" value="Growth" onRemove={() => undefined} />
                <Chip label="Region" value="EU" />
              </Row>
              <Row label="Chip, small" mock>
                <Chip size="sm" label="Drop" value="> 30%" onRemove={() => undefined} />
              </Row>
            </Block>

            <Block id="forms" title="Form fields" usage="Labels sit above. Errors replace the hint, turn the border red and are announced. Fields are 48px tall.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Default" hint="Hint text explains the field.">
                  {(c) => <Input {...c} placeholder="you@company.com" />}
                </Field>
                <Field label="Hover">{(c) => <Input {...c} force="hover" defaultValue="Hovered input" />}</Field>
                <Field label="Focus">{(c) => <Input {...c} force="focus" defaultValue="Focused input" />}</Field>
                <Field label="Error" error="Enter a valid email, like you@company.com.">
                  {(c) => <Input {...c} defaultValue="maren@" />}
                </Field>
                <Field label="Disabled">{(c) => <Input {...c} disabled defaultValue="Locked value" />}</Field>
                <Field label="Optional field" optional>
                  {(c) => <Input {...c} placeholder="Leave blank if you like" />}
                </Field>
                <Field label="Select">
                  {(c) => (
                    <Select {...c} defaultValue="11-50">
                      <option value="1-10">1–10 people</option>
                      <option value="11-50">11–50 people</option>
                    </Select>
                  )}
                </Field>
                <Field label="Password, with strength">
                  {(c) => (
                    <div className="flex flex-col gap-2">
                      <PasswordInput {...c} value={pw} onChange={(e) => setPw(e.target.value)} />
                      <PasswordStrength value={pw} />
                    </div>
                  )}
                </Field>
                <Field label="Textarea" className="sm:col-span-2">
                  {(c) => <Textarea {...c} placeholder="What you track today, and what you wish you knew." />}
                </Field>
              </div>
              <Row label="Checkbox: on, off, disabled">
                <Checkbox label="Email me product updates" checked={check} onChange={setCheck} />
                <Checkbox label="Off" checked={false} onChange={() => undefined} />
                <Checkbox label="Disabled" checked disabled onChange={() => undefined} />
              </Row>
            </Block>

            <Block id="choice" title="Choice controls">
              <Row label="Segmented: dark, white">
                <Segmented label="Platform" value={seg} onChange={setSeg} options={[{ value: 'web', label: 'Web' }, { value: 'ios', label: 'iOS' }]} />
                <Segmented label="Platform, white" tone="white" size="sm" value={seg} onChange={setSeg} options={[{ value: 'web', label: 'Web' }, { value: 'ios', label: 'iOS' }]} />
              </Row>
              <Row label="Segmented, extra small" mock>
                <Segmented label="Platform, xs" size="xs" value={seg} onChange={setSeg} options={[{ value: 'web', label: 'Web' }, { value: 'ios', label: 'iOS' }]} />
              </Row>
              <Row label="Toggle: on/off, disabled">
                <Toggle label="Weekly digest" checked={toggle} onChange={setToggle} />
                <Toggle label="Disabled" checked={false} disabled onChange={() => undefined} />
              </Row>
              <div className="max-w-[420px]">
                <Slider label="Threshold" value={slider} min={0} max={100} onChange={setSlider} format={(v) => `${v}%`} />
              </div>
              <Row label="Filter menu (click, arrows, Esc)">
                <FilterMenu label="Plan & seats" options={['Starter', 'Growth', 'Scale']} selected={menu} onToggle={(o) => setMenu((m) => (m.includes(o) ? m.filter((x) => x !== o) : [...m, o]))} />
              </Row>
              <Row label="Filter menu, small" mock>
                <FilterMenu size="sm" label="Region" options={['EU', 'US', 'APAC']} selected={[]} onToggle={() => undefined} />
              </Row>
            </Block>

            <Block id="feedback" title="Feedback">
              <div className="grid gap-3 sm:grid-cols-2">
                <Notice title="Info">Events show up within a few seconds.</Notice>
                <Notice tone="ok" title="Success">Your workspace is ready.</Notice>
                <Notice tone="warn" title="Warning">You have used 92% of this month’s events.</Notice>
                <Notice tone="bad" title="Error">We couldn’t load the status report.</Notice>
              </div>
              <EmptyState icon={<Inbox aria-hidden />} title="No rules yet" body="Automatic signals still run. Add a rule to be told about a metric you care about." action={<Button size="sm" variant="dark">Add rule</Button>} />
              <div className="flex flex-col gap-2" aria-label="Loading state" role="group">
                <span className="skeleton block h-10 rounded-[12px]" />
                <span className="skeleton block h-10 w-2/3 rounded-[12px]" />
              </div>
            </Block>

            <Block id="disclosure" title="Disclosure & overlays">
              <Accordion items={[{ q: 'Accordion item, open', a: 'One item opens at a time. The plus turns into a cross on a lime disc.' }, { q: 'Accordion item, closed', a: 'Closed items keep the wash disc.' }]} />
              <Row label="Sheet (focus trap, Esc, focus restore)">
                <Button variant="dark" onClick={() => setSheet(true)}>
                  Open sheet
                </Button>
              </Row>
              <Sheet open={sheet} onClose={() => setSheet(false)} title="Example sheet">
                <p className="px-2 text-[15px] text-body">The mobile menu uses this sheet. Tab stays inside; Esc closes it.</p>
                <div className="mt-6 px-2">
                  <Button onClick={() => setSheet(false)}>Done</Button>
                </div>
              </Sheet>
            </Block>

            <Block id="data" title="Data display" usage="Single series, one green hue for magnitude, thin marks, recessive grids, hover or focus for exact values. Retention uses a light-to-dark green ramp.">
              <Row label="Avatars and sparklines">
                {accounts.slice(0, 4).map((a) => (
                  <Avatar key={a.id} name={a.name} hue={a.hue} size={40} />
                ))}
                <Sparkline values={accounts[0]!.trend} />
                <Sparkline values={[3, 4, 4, 5, 7, 8, 9]} tone="ok" />
                <span className="font-display text-[32px] font-bold tracking-[-0.04em] text-ink">
                  <CountUp value={99.98} decimals={2} suffix="%" />
                </span>
              </Row>
              <Card>
                <p className="font-display text-[14px] font-semibold text-ink">Line chart: weekly active users, thousands</p>
                <LineChart className="mt-3" values={overview.series} labels={overview.seriesLabels} format={(v) => `${v.toFixed(1)}k`} label="Weekly active users, thousands" />
              </Card>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-2">
                <Card>
                  <p className="mb-4 font-display text-[14px] font-semibold text-ink">Funnel</p>
                  <FunnelChart steps={funnels.steps.map((s) => ({ label: s.label, value: s.values[0]! }))} selected={2} onSelect={() => undefined} />
                </Card>
                <Card>
                  <p className="mb-4 font-display text-[14px] font-semibold text-ink">Retention grid</p>
                  <div className="overflow-x-auto">
                    <RetentionGrid cohorts={retention.cohorts.slice(0, 6).map((c) => ({ ...c, values: c.values.slice(0, 6) }))} className="min-w-[460px]" />
                  </div>
                </Card>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-2">
                <Card>
                  <p className="mb-4 font-display text-[14px] font-semibold text-ink">Signal feed</p>
                  <SignalFeed rows={3} />
                </Card>
                <Card>
                  <p className="mb-4 font-display text-[14px] font-semibold text-ink">Journeys</p>
                  <JourneyList items={journeys.slice(0, 3)} />
                </Card>
              </div>
              <Card>
                <p className="mb-4 font-display text-[14px] font-semibold text-ink">Uptime bars</p>
                <UptimeBars days={days} label="Example: 90 days, one outage, two degraded days" />
              </Card>
              <CodeBlock lang="ts" code={"pulse.track('Report exported', { format: 'csv' })"} />
              <div className="grid gap-5 lg:grid-cols-2">
                <PlanCard plan={plans[1]} billing="monthly" />
                <PlanCard plan={plans[0]} billing="yearly" />
              </div>
            </Block>

            <Block id="product" title="Product mock" usage="The live workspace from the hero, scaled from 1200px. Its state is stored separately here so playing with it does not change the home page.">
              <div className="overflow-hidden rounded-[14px] shadow-mock ring-1 ring-black/5">
                <ScaledFrame width={1200} height={720} label="Product mock in the style guide" interactiveFrom={560}>
                  <AppMock storageKey="mock-styleguide" />
                </ScaledFrame>
              </div>
            </Block>

            <Block id="brand" title="Brand & layout">
              <Row label="Logo and mark">
                <Logo />
                <Logo mark />
                <LogoMark className="size-10" />
              </Row>
              <SectionHeading eyebrow="Section heading" title="Signals, not another wall of charts" lede="Centred by default; pass align=left beside content." />
            </Block>
          </div>
        </div>
      </Container>
    </>
  )
}
