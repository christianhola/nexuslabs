import { motion } from 'motion/react'
import { LayoutTemplate, Plus, RotateCcw, Send, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { AreaChart, BarList } from '../components/AreaChart'
import { Avatar, AvatarStack, Stars } from '../components/Avatar'
import { Badge, Eyebrow } from '../components/Badge'
import type { BadgeTone } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import type { ButtonVariant, Force } from '../components/Button'
import { Card, CardHeader } from '../components/Card'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Field, Input, Select, Textarea } from '../components/Field'
import { HeroMock } from '../components/HeroMock'
import { IssuePreview } from '../components/IssuePreview'
import { Logo, LogoMark } from '../components/Logo'
import { NavMenu } from '../components/Menu'
import { Modal } from '../components/Modal'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { PlanCard } from '../components/PlanCard'
import { PublisherLogo } from '../components/PublisherLogos'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Skeleton } from '../components/Skeleton'
import { Slider } from '../components/Slider'
import { StatTile } from '../components/StatTile'
import { TemplateCard } from '../components/TemplateCard'
import { toast } from '../components/Toast'
import { Toggle } from '../components/Toggle'
import { defaultIssue, heroMock, plans, productMenu, publishers, templates, testimonials } from '../content'
import { colorTokens, motionTokens, radii, shadows, spacing, typeScale } from '../lib/tokens'
import { useReducedMotion } from '../lib/useReducedMotion'

/*
  The living style guide at /styleguide. Everything is rendered by the real
  components; hover, focus and pressed are pinned with `force` (data-force)
  on the same component, so they cannot drift from the app.
*/

const toc = [
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['space', 'Spacing & radii'],
  ['elevation', 'Elevation'],
  ['motion', 'Motion'],
  ['buttons', 'Buttons'],
  ['badges', 'Badges & avatars'],
  ['forms', 'Form fields'],
  ['choice', 'Choice controls'],
  ['feedback', 'Feedback'],
  ['overlays', 'Overlays & disclosure'],
  ['data', 'Data display'],
  ['product', 'Product pieces'],
  ['brand', 'Brand'],
] as const

function Block({ id, title, usage, children }: { id: string; title: string; usage?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-line py-14 first:border-t-0 first:pt-0">
      <h2 id={`${id}-h`} className="display text-[32px] uppercase text-white">
        {title}
      </h2>
      {usage ? <div className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-muted">{usage}</div> : null}
      <div className="mt-8 flex flex-col gap-10">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-faint">{label}</p>
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
const variants: ButtonVariant[] = ['primary', 'white', 'outline', 'pink', 'ghost']

function MotionDemo() {
  const [n, setN] = useState(0)
  const reduce = useReducedMotion()
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {['Reveal', 'Hero line', 'Dialog'].map((label, i) => (
          <motion.div
            key={`${label}-${n}`}
            initial={reduce ? false : i === 2 ? { opacity: 0, y: 24, scale: 0.98 } : { opacity: 0, y: i ? 28 : 18 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: i === 2 ? 0.32 : i ? 0.8 : 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[var(--radius-card)] border border-line bg-panel p-5 text-[15px] text-ink"
          >
            {label}
          </motion.div>
        ))}
      </div>
      <div>
        <Button variant="outline" size="sm" icon={<RotateCcw className="size-4" />} onClick={() => setN((x) => x + 1)}>
          Replay motion
        </Button>
        {reduce ? <p className="mt-2 text-[13px] text-muted">Reduced motion is on, so entrances are instant.</p> : null}
      </div>
    </div>
  )
}

export function StyleGuide() {
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a')
  const [tog, setTog] = useState(true)
  const [check, setCheck] = useState(true)
  const [slide, setSlide] = useState(8)
  const tones: BadgeTone[] = ['neutral', 'pink', 'violet', 'ok', 'warn', 'bad']

  return (
    <>
      <PageHeader eyebrow="Style guide" title="The Inkwell system" intro="Tokens, type and every component in every state, rendered by the components the app uses. The template has one dark theme." />
      <Container className="grid grid-cols-1 gap-10 pb-24 lg:grid-cols-[200px_1fr]">
        <nav aria-label="Style guide sections" className="hidden lg:block">
          <ul className="sticky top-[108px] flex flex-col">
            {toc.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="flex min-h-9 items-center text-[14px] text-muted hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-w-0">
          <Block id="colour" title="Colour" usage="Text-bearing tokens pass WCAG AA on night and panel. Pink is for emphasis and fills; ink blue is the primary action.">
            {colorTokens.map((g) => (
              <div key={g.group}>
                <p className="mb-3 text-[13px] font-semibold text-faint">{g.group}</p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {g.items.map((c) => (
                    <li key={c.name} className="overflow-hidden rounded-[12px] border border-line bg-panel">
                      <div className="h-16 border-b border-line" style={{ background: c.hex }} />
                      <div className="p-3">
                        <p className="text-[14px] font-semibold text-ink">{c.name}</p>
                        <p className="font-mono text-[12px] text-muted">{c.hex}</p>
                        <p className="mt-1 text-[12px] text-faint">{c.use}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="rounded-[12px] border border-line bg-panel p-5">
              <p className="display text-gradient-pink text-[44px] uppercase">One platform.</p>
              <p className="mt-1 text-[13px] text-muted">.text-gradient-pink, display type only</p>
            </div>
          </Block>

          <Block id="type" title="Type" usage="Archivo Black-weight display in caps for headlines; DM Sans for everything else; Fraunces inside issues.">
            <ul className="flex flex-col divide-y divide-line">
              {typeScale.map((t) => (
                <li key={t.name} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline">
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                    <p className="text-[12px] text-faint">{t.size}</p>
                  </div>
                  <p className={`${t.cls} min-w-0 break-words text-white`}>{t.sample}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="space" title="Spacing & radii" usage="A 4 px base. Everything rounded is a squircle; true circles use .round.">
            <div className="flex flex-wrap items-end gap-4">
              {spacing.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className="w-6 rounded-[3px] bg-pink/70" style={{ height: s }} />
                  <span className="text-[12px] text-muted">{s}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {radii.map((r) => (
                <div key={r.name} className="flex flex-col items-start gap-3">
                  <div className={r.name === 'round' ? 'round size-20 rounded-full border border-line-strong bg-panel-2' : 'size-20 border border-line-strong bg-panel-2'} style={r.name === 'round' ? undefined : { borderRadius: r.value }} />
                  <p className="text-[14px] text-ink">
                    {r.name} <span className="text-muted">{r.value}</span>
                  </p>
                  <p className="text-[12px] text-faint">{r.use}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="elevation" title="Elevation">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {shadows.map((s) => (
                <div key={s.name} className="rounded-[var(--radius-card)] border border-line bg-panel p-6" style={{ boxShadow: s.value }}>
                  <p className="text-[15px] font-semibold text-ink">shadow-{s.name}</p>
                  <p className="mt-1 font-mono text-[12px] text-muted">{s.value}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block id="motion" title="Motion" usage="One ease for everything. All non-essential motion turns off with prefers-reduced-motion.">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {motionTokens.map((m) => (
                <li key={m.name} className="rounded-[10px] border border-line bg-panel px-4 py-3">
                  <p className="text-[14px] font-semibold text-ink">{m.name}</p>
                  <p className="font-mono text-[12px] text-muted">{m.value}</p>
                  <p className="text-[12px] text-faint">{m.use}</p>
                </li>
              ))}
            </ul>
            <MotionDemo />
          </Block>

          <Block id="buttons" title="Buttons" usage="One primary (ink blue) per view; white is the nav action. Sizes sm, md, lg share radius and height with neighbouring controls.">
            {variants.map((v) => (
              <Row key={v} label={v}>
                {states.map((s) => (
                  <Button key={s.label} variant={v} force={s.force} disabled={s.disabled} loading={s.loading}>
                    {s.label}
                  </Button>
                ))}
              </Row>
            ))}
            <Row label="Sizes, icon, arrow">
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
              <Button variant="outline" icon={<Send className="size-4" />}>
                With icon
              </Button>
              <Button variant="white" arrow>
                With arrow
              </Button>
            </Row>
            <Row label="Icon buttons: default, hover, focus, pressed, active, disabled">
              <IconButton label="Settings">
                <Settings />
              </IconButton>
              <IconButton label="Settings hover" force="hover">
                <Settings />
              </IconButton>
              <IconButton label="Settings focus" force="focus">
                <Settings />
              </IconButton>
              <IconButton label="Settings pressed" force="pressed">
                <Settings />
              </IconButton>
              <IconButton label="Settings active" active>
                <Settings />
              </IconButton>
              <IconButton label="Delete" disabled>
                <Trash2 />
              </IconButton>
            </Row>
          </Block>

          <Block id="badges" title="Badges & avatars">
            <Row label="Badge tones">
              {tones.map((t) => (
                <Badge key={t} tone={t}>
                  {t}
                </Badge>
              ))}
              <Badge tone="ok" dot>
                With dot
              </Badge>
            </Row>
            <Row label="Eyebrow">
              <Eyebrow>Newsletter</Eyebrow>
            </Row>
            <Row label="Avatars, stack, rating">
              {testimonials.map((t) => (
                <Avatar key={t.initials} initials={t.initials} hue={t.hue} />
              ))}
              <AvatarStack people={testimonials.map((t) => ({ initials: t.initials, hue: t.hue }))} />
              <Stars />
            </Row>
          </Block>

          <Block id="forms" title="Form fields" usage="Labels sit above; hints and errors are tied to the control with aria-describedby.">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Default" hint="We never share your address.">
                {(f) => <Input id={f.id} aria-describedby={f.describedBy} placeholder="you@example.com" />}
              </Field>
              <Field label="Hover">
                {(f) => <Input id={f.id} force="hover" defaultValue="ada@example.com" />}
              </Field>
              <Field label="Focus">
                {(f) => <Input id={f.id} force="focus" defaultValue="ada@example.com" />}
              </Field>
              <Field label="Error" error="Enter an email like name@example.com.">
                {(f) => <Input id={f.id} aria-describedby={f.describedBy} invalid defaultValue="ada@" />}
              </Field>
              <Field label="Disabled">
                {(f) => <Input id={f.id} disabled defaultValue="Locked" />}
              </Field>
              <Field label="Select" optional>
                {(f) => (
                  <Select id={f.id} defaultValue="b">
                    <option value="a">Under 10k</option>
                    <option value="b">10k to 100k</option>
                  </Select>
                )}
              </Field>
              <Field label="Textarea" className="sm:col-span-2">
                {(f) => <Textarea id={f.id} placeholder="Tell us about your publication" />}
              </Field>
            </div>
            <Row label="Checkbox">
              <Checkbox label="Send me the weekly writer tips" checked={check} onChange={setCheck} />
              <Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />
            </Row>
          </Block>

          <Block id="choice" title="Choice controls">
            <Row label="Segmented (arrow keys move the choice)">
              <Segmented
                label="Example"
                value={seg}
                onChange={setSeg}
                options={[
                  { value: 'a', label: '7 days' },
                  { value: 'b', label: '30 days' },
                  { value: 'c', label: '90 days' },
                ]}
              />
              <Segmented
                label="Example small"
                size="sm"
                value={seg}
                onChange={setSeg}
                options={[
                  { value: 'a', label: 'Desktop' },
                  { value: 'b', label: 'Phone' },
                  { value: 'c', label: 'Plain text' },
                ]}
              />
            </Row>
            <div className="grid max-w-[520px] gap-5">
              <Toggle checked={tog} onChange={setTog} label="Offer a paid tier" description="Toggle on and off" />
              <Toggle checked={false} onChange={() => {}} label="Disabled" disabled />
              <Slider label="Monthly price" min={3} max={20} value={slide} onChange={setSlide} display={`$${slide}/mo`} />
            </div>
          </Block>

          <Block id="feedback" title="Feedback" usage="Loading uses skeletons, errors use a red notice with a retry, and every empty list offers a way out.">
            <div className="grid gap-3">
              <Notice title="Your list is importing">About 4 minutes left. You can keep writing.</Notice>
              <Notice tone="ok" title="Issue scheduled">It goes out tomorrow at 8:00.</Notice>
              <Notice tone="bad" title="We couldn’t load your numbers." action={<Button variant="outline" size="sm">Try again</Button>}>
                The analytics service is unavailable.
              </Notice>
            </div>
            <Row label="Toast">
              <Button variant="outline" onClick={() => toast('Draft saved')}>
                Show success toast
              </Button>
              <Button variant="outline" onClick={() => toast('That link looks broken', 'bad')}>
                Show error toast
              </Button>
            </Row>
            <div>
              <p className="mb-3 text-[13px] font-semibold text-faint">Loading skeleton</p>
              <div className="flex flex-col gap-2 rounded-[12px] border border-line bg-panel p-5">
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
            <EmptyState icon={<LayoutTemplate />} title="No templates match" body="Try a different word or category." action={<Button variant="outline" icon={<Plus className="size-4" />}>Clear filters</Button>} />
          </Block>

          <Block id="overlays" title="Overlays & disclosure" usage="Dialogs and drawers trap focus, close on Esc or the backdrop, and return focus to the opener.">
            <Row label="Modal, drawer, nav menu">
              <Button variant="outline" onClick={() => setModal(true)}>
                Open dialog
              </Button>
              <Button variant="outline" onClick={() => setDrawer(true)}>
                Open drawer
              </Button>
              <NavMenu label="Product" items={productMenu} />
            </Row>
            <Accordion items={[{ q: 'An accordion item', a: 'One item open at a time; the button reports aria-expanded.' }, { q: 'Another item', a: 'Hidden panels leave the tab order.' }]} />
          </Block>

          <Block id="data" title="Data display">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatTile label="Subscribers" value="372,096" delta={3.2} />
              <StatTile label="Click rate" value="4.21%" delta={-0.3} />
              <StatTile label="Recipients" value="372,096" rows={heroMock.analytics.recipients.rows as [string, string][]} />
            </div>
            <Card>
              <CardHeader title="Area chart (hover or use arrow keys)" />
              <div className="p-5">
                <AreaChart series={heroMock.analytics.series} labels={heroMock.analytics.series.map((_, i) => `Nov ${i + 1}`)} format={(n) => `${n} opens`} height={180} label="Opens" />
              </div>
            </Card>
            <BarList rows={[{ label: 'Referrals', value: 4120 }, { label: 'Recommendations', value: 3380 }, { label: 'Direct', value: 1910 }]} />
          </Block>

          <Block id="product" title="Product pieces">
            <div className="rounded-[var(--radius-card-lg)] border border-line bg-night p-4 sm:p-8">
              <HeroMock />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <TemplateCard t={templates[1]} onOpen={() => toast('Template card clicked')} />
              <PlanCard plan={plans[1]} price={46} period="/month" note="Billed $552 a year" />
              <PlanCard plan={plans[0]} price={0} period="/month" note="Free forever" />
            </div>
            <div className="rounded-[var(--radius-card-lg)] border border-line bg-panel p-4 sm:p-8">
              <IssuePreview issue={defaultIssue} mode="mobile" />
            </div>
            <SectionHeading eyebrow="Section heading" title="Stand out in the inbox" body="Eyebrow, caps display and a lede." size="md" />
          </Block>

          <Block id="brand" title="Brand" usage="The mark is an ink drop with a nib slit. Publisher logos below are invented for the demo.">
            <Row label="Logo and mark">
              <Logo />
              <LogoMark className="size-12" />
            </Row>
            <div className="flex flex-wrap items-center gap-10 rounded-[12px] border border-line bg-night p-6">
              {publishers.map((p) => (
                <PublisherLogo key={p.name} p={p} />
              ))}
            </div>
          </Block>
        </div>
      </Container>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="A dialog"
        description="Tab stays inside; Esc closes."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModal(false)}>Confirm</Button>
          </>
        }
      >
        <Field label="Something to type">{(f) => <Input id={f.id} data-autofocus />}</Field>
      </Modal>
      <Modal open={drawer} onClose={() => setDrawer(false)} side="right" title="A drawer">
        <p className="text-[15px] text-body">Used for the mobile menu and the chat assistant.</p>
      </Modal>
    </>
  )
}
