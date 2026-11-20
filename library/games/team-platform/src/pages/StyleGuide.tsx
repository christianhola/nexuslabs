import { Bell, Plus, RotateCcw, Search, Settings, Users } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { Avatar, AvatarStack } from '../components/Avatar'
import { Badge, Chip, Eyebrow } from '../components/Badge'
import type { BadgeTone } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import type { ButtonVariant, Force } from '../components/Button'
import { Card } from '../components/Card'
import { ChatMock } from '../components/ChatMock'
import { CookieMark } from '../components/CookieBanner'
import { Container } from '../components/Container'
import { Dialog } from '../components/Dialog'
import { Dropdown } from '../components/Dropdown'
import { EmailCapture } from '../components/EmailCapture'
import { EmptyState } from '../components/EmptyState'
import { FeedMock } from '../components/FeedMock'
import { Checkbox, Field, Input, Select, Textarea } from '../components/Field'
import { HeroIso } from '../components/HeroIso'
import { IconTile } from '../components/Icon'
import { IntegrationTile } from '../components/IntegrationTile'
import { Logo, LogoMark } from '../components/Logo'
import { Notice } from '../components/Notice'
import { PhoneFrame } from '../components/PhoneFrame'
import { PlanCard } from '../components/PlanCard'
import { ProfileCard } from '../components/ProfileCard'
import { PulseMock } from '../components/PulseMock'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Slider } from '../components/Slider'
import { Squiggle } from '../components/Squiggle'
import { Stars } from '../components/Stars'
import { Switch } from '../components/Switch'
import { Tabs } from '../components/Tabs'
import { ShiftList, TaskList } from '../components/TasksMock'
import { integrations, people, plans, pricingFaq, showcaseTabs } from '../content'
import { colorTokens, motionTokens, radii, shadows, spacing, typeScale } from '../lib/tokens'

/*
  The living style guide at /styleguide. Everything is rendered by the real
  components; hover, focus and pressed are pinned with data-force on the
  same component, so they cannot drift from the site.
*/
const toc = [
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['space', 'Spacing and radii'],
  ['elevation', 'Elevation'],
  ['motion', 'Motion'],
  ['brand', 'Brand marks'],
  ['buttons', 'Buttons'],
  ['badges', 'Badges and chips'],
  ['forms', 'Form fields'],
  ['choice', 'Choice controls'],
  ['nav', 'Menus, tabs, dialogs'],
  ['feedback', 'Feedback and empty'],
  ['people', 'People'],
  ['cards', 'Cards'],
  ['product', 'Product mocks'],
] as const

function Section({ id, title, children, note }: { id: string; title: string; children: ReactNode; note?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-line py-14">
      <h2 id={`${id}-h`} className="font-display text-[30px] font-semibold tracking-[-0.035em] text-ink">
        {title}
      </h2>
      {note ? <p className="mt-2 max-w-[70ch] text-[15px] text-muted">{note}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[12.5px] font-medium text-faint">{children}</p>
}

const states: (Force | 'default')[] = ['default', 'hover', 'focus', 'pressed']

export function StyleGuide() {
  const [replay, setReplay] = useState(0)
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a')
  const [sw, setSw] = useState(true)
  const [cb, setCb] = useState(true)
  const [range, setRange] = useState(40)
  const [tab, setTab] = useState<(typeof showcaseTabs)[number]['id']>('feed')
  const [dialog, setDialog] = useState(false)
  const [drawer, setDrawer] = useState(false)

  return (
    <Container className="pb-10 pt-14">
      <SectionHeading as="h1" eyebrow="Design system" title="Branchwork style guide" body="Tokens and components that make up this template, rendered by the same code as the site. Tokens live in src/styles.css; copy and data in src/content.ts." />
      <nav aria-label="Style guide sections" className="mt-8 flex flex-wrap gap-2">
        {toc.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="inline-flex h-10 items-center rounded-[8px] border border-line px-3 text-[14px] text-body hover:border-ink focus-visible:outline-2 focus-visible:outline-ink">
            {label}
          </a>
        ))}
      </nav>

      <Section id="colour" title="Colour" note="Mint is a fill colour; it never carries text on white. Green text uses leaf (#1f7a2a, 5.6:1 on white). Faint (#666664) is the lightest text colour allowed.">
        <div className="grid gap-8">
          {colorTokens.map((g) => (
            <div key={g.group}>
              <Label>{g.group}</Label>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {g.items.map((c) => (
                  <li key={c.name} className="overflow-hidden rounded-[14px] border border-line">
                    <span className="block h-16" style={{ background: c.hex }} />
                    <span className="block p-3">
                      <span className="block text-[14px] font-semibold text-ink">{c.name}</span>
                      <span className="block font-mono text-[12.5px] text-muted">{c.hex}</span>
                      <span className="mt-1 block text-[12.5px] leading-snug text-faint">{c.use}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="Type" note="Inter Tight for display and numbers, Inter for text. Headings sit at negative tracking; body stays at 0.">
        <ul className="divide-y divide-line">
          {typeScale.map((t) => (
            <li key={t.name} className="grid gap-2 py-4 sm:grid-cols-[140px_1fr_240px] sm:items-baseline">
              <span className="text-[13px] font-medium text-faint">{t.name}</span>
              <span className={`${t.cls} text-ink`}>{t.sample}</span>
              <span className="font-mono text-[12.5px] text-muted">{t.spec}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="space" title="Spacing and radii" note="A 4px base. Everything rounded is a squircle; circles (avatars, dots, switches) opt out with .round.">
        <Label>Spacing</Label>
        <div className="flex flex-wrap items-end gap-4">
          {spacing.map((s) => (
            <div key={s} className="text-center">
              <div className="bg-mint" style={{ width: s, height: s }} />
              <p className="mt-1.5 font-mono text-[12px] text-muted">{s}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Label>Radii</Label>
          <div className="flex flex-wrap gap-4">
            {radii.map((r) => (
              <div key={r.name} className="text-center">
                <div className={r.px > 100 ? 'round size-20 border-[1.5px] border-ink bg-mint-soft' : 'size-20 border-[1.5px] border-ink bg-mint-soft'} style={{ borderRadius: r.px }} />
                <p className="mt-1.5 text-[13px] font-medium text-ink">{r.name}</p>
                <p className="font-mono text-[12px] text-muted">{r.px > 100 ? 'full' : `${r.px}px`}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section id="elevation" title="Elevation" note="Most surfaces are flat with hairlines. Selected or featured things get a hard mint offset shadow, like the line-art drawings.">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {shadows.map((s) => (
            <div key={s.name} className="grid h-28 place-items-center rounded-[16px] border border-line bg-card text-[14px] font-medium text-ink" style={{ boxShadow: s.value }}>
              {s.name}
            </div>
          ))}
          <div className="grid h-28 place-items-center rounded-[16px] border-[1.5px] border-ink bg-card text-[14px] font-medium text-ink shadow-[6px_6px_0_var(--color-mint)]">offset (selected)</div>
        </div>
      </Section>

      <Section id="motion" title="Motion" note="Short and soft. Reduced motion switches off the bob, draw, typing and count-up, and shows final states.">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <ul className="divide-y divide-line rounded-[16px] border border-line">
            {motionTokens.map((m) => (
              <li key={m.name} className="grid grid-cols-[120px_1fr] gap-3 p-3.5 text-[14px]">
                <span className="font-medium text-ink">{m.name}</span>
                <span>
                  <span className="block font-mono text-[12.5px] text-muted">{m.value}</span>
                  <span className="block text-faint">{m.use}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="rounded-[16px] border border-line p-6">
            <Button size="sm" variant="soft" icon={<RotateCcw className="size-4" aria-hidden />} onClick={() => setReplay((r) => r + 1)}>
              Replay
            </Button>
            <div key={replay} className="mt-8 flex flex-wrap items-center gap-10">
              <p className="font-display text-[44px] font-semibold tracking-[-0.045em] text-ink">
                <span className="relative inline-block">
                  draw
                  <Squiggle />
                </span>
              </p>
              <span className="iso-card inline-block">
                <span className="line-art block rounded-[14px] px-4 py-3 text-[14px] font-medium text-ink">bob</span>
              </span>
              <span className="flex gap-1 rounded-[12px] bg-mist-2 px-3 py-3" role="img" aria-label="typing">
                {[0, 1, 2].map((i) => (
                  <i key={i} className="round block size-2 animate-typing rounded-full bg-ink" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
              <span className="animate-pop-in rounded-[12px] border-[1.5px] border-ink bg-mint px-4 py-2.5 text-[14px] font-medium text-ink">pop-in</span>
            </div>
          </div>
        </div>
      </Section>

      <Section id="brand" title="Brand marks">
        <div className="flex flex-wrap items-center gap-10">
          <Logo />
          <LogoMark className="size-10 text-ink" />
          <span className="flex items-center gap-2 text-[15px] text-ink">
            <CookieMark /> Cookie mark
          </span>
          <Stars value={4.6} />
          <Eyebrow>Eyebrow label</Eyebrow>
        </div>
      </Section>

      <Section id="buttons" title="Buttons" note="One mint button per view. Soft is the grey bordered button from the nav.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr>
                <th scope="col" className="pb-3 text-left text-[12.5px] font-medium text-faint">
                  Variant
                </th>
                {[...states, 'disabled', 'loading'].map((s) => (
                  <th key={s} scope="col" className="pb-3 text-left text-[12.5px] font-medium text-faint">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(['mint', 'soft', 'dark', 'outline', 'ghost'] as ButtonVariant[]).map((v) => (
                <tr key={v}>
                  <th scope="row" className="py-2 pr-4 text-left text-[14px] font-medium text-ink">
                    {v}
                  </th>
                  {states.map((s) => (
                    <td key={s} className="py-2 pr-3">
                      <Button variant={v} size="sm" force={s === 'default' ? undefined : s}>
                        Book a demo
                      </Button>
                    </td>
                  ))}
                  <td className="py-2 pr-3">
                    <Button variant={v} size="sm" disabled>
                      Book a demo
                    </Button>
                  </td>
                  <td className="py-2 pr-3">
                    <Button variant={v} size="sm" loading>
                      Book a demo
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="lg" arrow>
            Large with arrow
          </Button>
          <Button>Medium</Button>
          <Button size="sm">Small</Button>
          <Button href="/pricing" variant="soft">
            As a link
          </Button>
        </div>
        <div className="mt-8">
          <Label>Icon buttons: plain, soft, dark, pressed, focus, disabled</Label>
          <div className="flex flex-wrap gap-2">
            <IconButton label="Search">
              <Search aria-hidden />
            </IconButton>
            <IconButton label="Notifications" tone="soft">
              <Bell aria-hidden />
            </IconButton>
            <IconButton label="Add" tone="dark">
              <Plus aria-hidden />
            </IconButton>
            <IconButton label="People" tone="soft" active>
              <Users aria-hidden />
            </IconButton>
            <IconButton label="Settings" force="focus">
              <Settings aria-hidden />
            </IconButton>
            <IconButton label="Disabled" disabled>
              <Settings aria-hidden />
            </IconButton>
          </div>
        </div>
      </Section>

      <Section id="badges" title="Badges and chips">
        <div className="flex flex-wrap gap-2">
          {(['neutral', 'mint', 'dark', 'outline', 'warn', 'bad'] as BadgeTone[]).map((t) => (
            <Badge key={t} tone={t}>
              {t}
            </Badge>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip>Default</Chip>
          <Chip force="hover">Hover</Chip>
          <Chip force="focus">Focus</Chip>
          <Chip active count={12}>
            Active
          </Chip>
          <Chip disabled>Disabled</Chip>
        </div>
      </Section>

      <Section id="forms" title="Form fields">
        <div className="grid gap-6 md:grid-cols-3">
          <Field label="Default" hint="Hint text sits under the field">
            {(c) => <Input {...c} placeholder="you@company.com" />}
          </Field>
          <Field label="Hover">
            {(c) => <Input {...c} force="hover" defaultValue="Maren Holt" />}
          </Field>
          <Field label="Focus">
            {(c) => <Input {...c} force="focus" defaultValue="Maren Holt" />}
          </Field>
          <Field label="Error" error="Enter a valid email, like you@company.com.">
            {(c) => <Input {...c} defaultValue="maren@" />}
          </Field>
          <Field label="Disabled">
            {(c) => <Input {...c} disabled defaultValue="Locked" />}
          </Field>
          <Field label="Select" optional>
            {(c) => (
              <Select {...c} defaultValue="100–499">
                <option>25–99</option>
                <option>100–499</option>
              </Select>
            )}
          </Field>
          <Field label="Textarea" className="md:col-span-3">
            {(c) => <Textarea {...c} placeholder="Number of sites, languages, the tools you use…" />}
          </Field>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <Label>Hero email capture</Label>
            <EmailCapture placeholder="Enter work email" cta="Book a demo" source="styleguide" />
          </div>
          <div>
            <Label>Hero email capture, error</Label>
            <EmailCapture placeholder="Enter work email" cta="Book a demo" source="styleguide" initialError="Enter a valid email, like you@company.com." />
          </div>
        </div>
      </Section>

      <Section id="choice" title="Choice controls">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <Checkbox label="Checked" checked={cb} onChange={setCb} />
            <Checkbox label="Unchecked" checked={false} onChange={() => undefined} description="With a description" />
            <Checkbox label="Disabled" checked onChange={() => undefined} disabled />
          </div>
          <div className="space-y-5">
            <Switch label="Switch" description="On and off" checked={sw} onChange={setSw} />
            <Switch label="Disabled switch" checked={false} onChange={() => undefined} disabled />
          </div>
          <div>
            <Label>Segmented</Label>
            <Segmented label="Example" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Monthly' }, { value: 'b', label: 'Yearly' }, { value: 'c', label: 'Custom' }]} />
          </div>
          <Slider label="Slider" value={range} min={0} max={100} onChange={setRange} display={`${range}%`} hint="Arrow keys move by one" />
        </div>
      </Section>

      <Section id="nav" title="Menus, tabs, dialogs">
        <div className="flex flex-wrap items-start gap-6">
          <Dropdown label="Dropdown" triggerClassName="h-10 rounded-[9px] border border-line px-3.5 text-[14.5px] text-ink">
            {(close) => (
              <ul className="w-48">
                {['Org chart', 'Directory', 'News feed'].map((x) => (
                  <li key={x}>
                    <button type="button" onClick={close} className="w-full rounded-[10px] px-3 py-2.5 text-left text-[15px] hover:bg-mist focus-visible:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
                      {x}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Dropdown>
          <Button variant="soft" onClick={() => setDialog(true)}>
            Open dialog
          </Button>
          <Button variant="soft" onClick={() => setDrawer(true)}>
            Open drawer
          </Button>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <Label>Tabs (vertical)</Label>
            <Tabs label="Example tabs" tabs={showcaseTabs} value={tab} onChange={setTab} />
          </div>
          <div>
            <Label>Tabs (horizontal)</Label>
            <Tabs label="Example tabs, horizontal" tabs={showcaseTabs} value={tab} onChange={setTab} orientation="horizontal" />
            <div className="mt-8">
              <Label>Accordion</Label>
              <Accordion items={pricingFaq.slice(0, 3)} defaultOpen={0} />
            </div>
          </div>
        </div>
        <Dialog open={dialog} onClose={() => setDialog(false)} title="A dialog" description="Focus is trapped; Esc or the backdrop closes it.">
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialog(false)}>Confirm</Button>
          </div>
        </Dialog>
        <Dialog open={drawer} onClose={() => setDrawer(false)} title="A drawer" side="right">
          <p className="text-[15px] text-muted">Used for the mobile menu.</p>
        </Dialog>
      </Section>

      <Section id="feedback" title="Feedback and empty">
        <div className="grid gap-4 md:grid-cols-3">
          <Notice live={false} title="Info">
            Posts stay in this browser.
          </Notice>
          <Notice live={false} tone="ok" title="Request received">
            Reference INT-4F2K9A.
          </Notice>
          <Notice live={false} tone="bad" title="That did not go through">
            You look offline. Try again.
          </Notice>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <EmptyState icon={<Users />} title="Nobody matches those filters" body="Try another spelling, or clear the filters." action={<Button size="sm" variant="outline">Clear filters</Button>} />
          <div className="space-y-3 rounded-[var(--radius-card)] border border-line p-6" role="status" aria-label="Loading skeleton">
            <div className="skeleton h-5 w-1/2 rounded-[6px]" />
            <div className="skeleton h-4 w-full rounded-[6px]" />
            <div className="skeleton h-4 w-4/5 rounded-[6px]" />
            <div className="skeleton h-10 w-32 rounded-[9px]" />
          </div>
        </div>
      </Section>

      <Section id="people" title="People">
        <div className="flex flex-wrap items-end gap-5">
          {[64, 48, 40, 32, 24].map((s, i) => (
            <Avatar key={s} name={people[i].name} face={people[i].face} size={s} presence={people[i].presence} />
          ))}
          <Avatar name="Ada Byrne" size={48} />
          <AvatarStack faces={people.slice(4, 9)} extra={37} />
        </div>
        <div className="mt-8 max-w-md rounded-[var(--radius-card)] border border-line p-6">
          <ProfileCard person={people[5]} onSelect={() => undefined} />
        </div>
      </Section>

      <Section id="cards" title="Cards">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <IconTile name="news" />
            <p className="mt-4 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">Plain card</p>
            <p className="mt-1 text-[15px] text-muted">Hairline, soft shadow.</p>
          </Card>
          <Card tone="mist" className="p-6">
            <IconTile name="chat" />
            <p className="mt-4 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">Mist card</p>
            <p className="mt-1 text-[15px] text-muted">For tinted wells.</p>
          </Card>
          <Card tone="line" className="p-6">
            <IconTile name="tasks" />
            <p className="mt-4 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">Line-art card</p>
            <p className="mt-1 text-[15px] text-muted">Ink border, like the hero drawing.</p>
          </Card>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} yearly seats={250} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {integrations.slice(0, 8).map((i) => (
            <span key={i.id} className="flex items-center gap-2 rounded-[12px] border border-line py-1.5 pl-1.5 pr-3 text-[14px] text-ink">
              <IntegrationTile name={i.name} color={i.color} size={36} />
              {i.name}
            </span>
          ))}
        </div>
      </Section>

      <Section id="product" title="Product mocks" note="Live components, not pictures. They share state with the rest of the site through localStorage.">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Label>Hero drawing (HeroIso)</Label>
            <div className="max-w-[460px]">
              <HeroIso />
            </div>
          </div>
          <div>
            <Label>Phone frame with the feed</Label>
            <PhoneFrame title="News feed">
              <FeedMock compact />
            </PhoneFrame>
          </div>
          <div>
            <Label>Chat</Label>
            <ChatMock />
          </div>
          <div>
            <Label>Pulse survey</Label>
            <PulseMock />
          </div>
          <TaskList />
          <ShiftList />
        </div>
      </Section>
    </Container>
  )
}
