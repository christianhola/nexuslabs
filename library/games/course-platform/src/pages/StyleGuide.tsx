import { motion } from 'motion/react'
import { BookOpen, Heart, Play, Plus, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { AvatarStack, Avatar, Stars } from '../components/Avatar'
import { Badge } from '../components/Badge'
import type { BadgeTone } from '../components/Badge'
import { BarSpark } from '../components/BarSpark'
import { Button, IconButton } from '../components/Button'
import type { ButtonVariant, Force } from '../components/Button'
import { Card } from '../components/Card'
import { Chip } from '../components/Chip'
import { Container } from '../components/Container'
import { CourseIcon } from '../components/CourseIcon'
import { CursorTag } from '../components/CursorTag'
import { DashboardMock } from '../components/DashboardMock'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Field, Input, PasswordInput, Select, Textarea } from '../components/Field'
import { FunnelBars } from '../components/FunnelBars'
import { HERO_MOCK, HeroMock } from '../components/HeroMock'
import { LessonTypeIcon } from '../components/LessonTypeIcon'
import { LineChart } from '../components/LineChart'
import { Mark } from '../components/Logo'
import { Modal } from '../components/Modal'
import { NavDropdown } from '../components/NavDropdown'
import { Notice } from '../components/Notice'
import { Progress } from '../components/Progress'
import { ScaledFrame } from '../components/ScaledFrame'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Sheet } from '../components/Sheet'
import { Skeleton } from '../components/Skeleton'
import { Slider } from '../components/Slider'
import { SortableList } from '../components/SortableList'
import { StatCard } from '../components/StatCard'
import { useToast } from '../components/Toast'
import { Toggle } from '../components/Toggle'
import { featureLinks, funnel, people, seedCourse } from '../content'
import { colorTokens, motionTokens, radii, shadows, spacing, typeScale } from '../lib/tokens'

/*
  The living style guide, rendered by the real components. Forced states
  (hover, focus, pressed) use each component's `force` prop, which sets
  data-force so the same CSS that styles the real state applies.
*/
const states: (Force | undefined | 'disabled' | 'loading')[] = [undefined, 'hover', 'focus', 'pressed', 'disabled', 'loading']
const variants: ButtonVariant[] = ['primary', 'outline', 'dark', 'soft', 'ghost']
const sections = ['Colour', 'Type', 'Spacing', 'Radii and shadows', 'Motion', 'Buttons', 'Forms', 'Selection', 'Feedback', 'Overlays', 'Data', 'Course', 'Product mocks']

function Section({ title, children, lead }: { title: string; children: ReactNode; lead?: string }) {
  return (
    <section id={title.toLowerCase().replace(/[^a-z]+/g, '-')} aria-labelledby={`sg-${title}`} className="border-t border-line py-14">
      <h2 id={`sg-${title}`} className="font-display text-[26px] font-medium tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {lead ? <p className="mt-1 max-w-[640px] text-[15px] text-muted">{lead}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

const Label = ({ children }: { children: ReactNode }) => <p className="mb-2 text-[12.5px] text-faint">{children}</p>

export function StyleGuide() {
  const [replay, setReplay] = useState(0)
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a')
  const [tog, setTog] = useState(true)
  const [chk, setChk] = useState(true)
  const [slider, setSlider] = useState(40)
  const [modal, setModal] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [items, setItems] = useState(() => seedCourse.modules[0]!.lessons)
  const toast = useToast()

  return (
    <div className="pb-24 pt-10">
      <Container>
        <SectionHeading as="h1" align="left" eyebrow="Design system" title="Coursekit style guide" lead="Every token and component in the template, rendered by the code the pages use. Change a token in src/styles.css and it changes here." />
        <nav aria-label="Style guide sections" className="mt-8 flex flex-wrap gap-2">
          {sections.map((s) => (
            <a key={s} href={`#${s.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="inline-flex h-10 items-center rounded-[10px] border border-line px-3.5 text-[14px] text-body hover:bg-wash focus-visible:outline-2 focus-visible:outline-flame-strong sm:h-9">
              {s}
            </a>
          ))}
        </nav>

        <Section title="Colour" lead="Text tokens pass WCAG AA on the surfaces they are used on. Bright flame is for fills and large type; flame-strong and flame-ink carry text.">
          <div className="flex flex-col gap-8">
            {colorTokens.map((g) => (
              <div key={g.group}>
                <h3 className="font-display text-[16px] font-medium text-ink">{g.group}</h3>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {g.items.map((c) => (
                    <li key={c.name} className="overflow-hidden rounded-[14px] border border-line bg-card">
                      <span className="block h-16" style={{ background: c.hex }} />
                      <span className="block p-3">
                        <span className="block font-display text-[14px] font-medium text-ink">{c.name}</span>
                        <span className="block font-mono text-[12px] text-muted">{c.hex}</span>
                        <span className="mt-1 block text-[12px] leading-snug text-faint">{c.use}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type" lead="Outfit for display and UI labels, Figtree for reading text, JetBrains Mono for codes.">
          <ul className="flex flex-col divide-y divide-line">
            {typeScale.map((t) => (
              <li key={t.name} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[180px_1fr] md:items-baseline">
                <span>
                  <span className="block text-[14px] text-ink">{t.name}</span>
                  <span className="block text-[12.5px] text-faint">{t.spec}</span>
                </span>
                <span className={`${t.cls} break-words max-sm:!text-[min(100%,36px)]`}>{t.sample}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Spacing" lead="A 4px base. Sections use 80 to 112px of vertical rhythm.">
          <ul className="flex flex-wrap items-end gap-4">
            {spacing.map((s) => (
              <li key={s} className="flex flex-col items-center gap-2">
                <span className="block rounded-[4px] bg-flame-tint" style={{ width: s, height: s }} />
                <span className="text-[12.5px] text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Radii and shadows" lead="All corners are squircles; circles opt out with .round.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {radii.map((r) => (
              <div key={r.name} className="flex flex-col gap-2">
                <span className={`block h-20 border border-line-strong bg-wash ${r.name === 'full' ? 'round' : ''}`} style={{ borderRadius: r.value }} />
                <span className="text-[14px] text-ink">
                  {r.name} <span className="text-faint">{r.value}</span>
                </span>
                <span className="text-[12.5px] text-muted">{r.use}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shadows.map((s) => (
              <div key={s.name} className={`rounded-[var(--radius-card)] bg-card p-5 ${s.cls}`}>
                <p className="font-display text-[15px] font-medium text-ink">{s.name}</p>
                <p className="text-[13px] text-muted">{s.use}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Motion" lead="Motion stays off with prefers-reduced-motion (non-essential animation is skipped).">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
            <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-card)] border border-line bg-card">
              {motionTokens.map((m) => (
                <li key={m.name} className="px-4 py-3">
                  <p className="text-[14px] text-ink">
                    {m.name} <span className="font-mono text-[12px] text-muted">{m.value}</span>
                  </p>
                  <p className="text-[13px] text-muted">{m.use}</p>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-4">
              <Button variant="outline" onClick={() => setReplay((r) => r + 1)} className="self-start" icon={<Play className="size-4" aria-hidden />}>
                Replay entrances
              </Button>
              <div key={replay} className="relative grid h-[220px] place-items-center overflow-hidden rounded-[var(--radius-card)] bg-flame-soft">
                {[0.15, 0.4, 0.55].map((d, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] }} className="absolute rounded-[14px] bg-card px-4 py-3 text-[13px] text-ink shadow-float" style={{ left: 30 + i * 90, top: 40 + i * 50 }}>
                    rise {d * 1000} ms
                  </motion.div>
                ))}
                <CursorTag name="float" tone="violet" className="right-8 top-6" />
                <span className="absolute bottom-4 right-4 w-28">
                  <Skeleton className="h-4 w-full" />
                </span>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Buttons" lead="One primary action per view. States are pinned with force; the last two are real disabled and loading.">
          <div tabIndex={0} role="region" aria-label="Button states" className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="text-[12.5px] text-faint">
                  <th scope="col" className="pb-3 font-normal">Variant</th>
                  {states.map((s) => (
                    <th key={s ?? 'default'} scope="col" className="pb-3 font-normal">
                      {s ?? 'default'}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v}>
                    <th scope="row" className="py-2 pr-4 text-[14px] font-normal text-ink">
                      {v}
                    </th>
                    {states.map((s) => (
                      <td key={s ?? 'd'} className="py-2 pr-3">
                        <Button variant={v} force={s === 'disabled' || s === 'loading' ? undefined : s} disabled={s === 'disabled'} loading={s === 'loading'}>
                          Button
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg" arrow>
              Large with arrow
            </Button>
            <Button variant="outline" icon={<Plus className="size-4" aria-hidden />}>
              With icon
            </Button>
            <Button href="/styleguide#buttons" variant="soft">
              As a link
            </Button>
          </div>
          <Label>Icon buttons: default, hover, focus, pressed, active (aria-pressed), disabled</Label>
          <div className="flex gap-2">
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
            <IconButton label="Favourite" active>
              <Heart />
            </IconButton>
            <IconButton label="Delete" disabled>
              <Trash2 />
            </IconButton>
          </div>
        </Section>

        <Section title="Forms" lead="Field owns label, hint and error and wires aria-describedby and aria-invalid.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Field label="Default" hint="A hint under the field.">
              {(ctl) => <Input {...ctl} placeholder="Placeholder" />}
            </Field>
            <Field label="Hover">
              {(ctl) => <Input {...ctl} force="hover" defaultValue="Hovered" />}
            </Field>
            <Field label="Focus">
              {(ctl) => <Input {...ctl} force="focus" defaultValue="Focused" />}
            </Field>
            <Field label="Error" error="Enter a valid email, like you@company.com.">
              {(ctl) => <Input {...ctl} defaultValue="amara@" />}
            </Field>
            <Field label="Disabled">
              {(ctl) => <Input {...ctl} disabled defaultValue="Cannot edit" />}
            </Field>
            <Field label="Optional field" optional>
              {(ctl) => <Input {...ctl} />}
            </Field>
            <Field label="Select">
              {(ctl) => (
                <Select {...ctl} defaultValue="b">
                  <option value="a">Independent creator</option>
                  <option value="b">School or academy</option>
                </Select>
              )}
            </Field>
            <Field label="Password">
              {(ctl) => <PasswordInput {...ctl} defaultValue="correct horse" />}
            </Field>
            <Field label="Textarea" className="md:col-span-2 lg:col-span-1">
              {(ctl) => <Textarea {...ctl} defaultValue="What will learners take away?" />}
            </Field>
          </div>
        </Section>

        <Section title="Selection">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Label>Segmented, white and dark tones</Label>
              <Segmented label="Example white" tone="white" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Video' }, { value: 'b', label: 'Text' }, { value: 'c', label: 'Quiz' }]} />
              <Segmented label="Example dark" tone="dark" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Monthly' }, { value: 'b', label: 'Yearly' }, { value: 'c', label: 'Lifetime' }]} />
              <Label>Toggle on, off, disabled</Label>
              <div className="flex flex-col">
                <Toggle checked={tog} onChange={setTog} label="Free preview" />
                <Toggle checked={!tog} onChange={(v) => setTog(!v)} label="Show reviews" />
                <Toggle checked={false} onChange={() => {}} label="Disabled" disabled />
              </div>
              <Checkbox checked={chk} onChange={setChk} label="I agree to the terms" description="Checkbox with description" />
              <Checkbox checked={false} onChange={() => {}} label="Disabled checkbox" disabled />
            </div>
            <div className="flex flex-col gap-4">
              <Label>Chips: default, hover, focus, active with count</Label>
              <div className="flex flex-wrap gap-2">
                <Chip>Payments</Chip>
                <Chip force="hover">Email</Chip>
                <Chip force="focus">Video</Chip>
                <Chip active count={4}>
                  Community
                </Chip>
              </div>
              <Slider label="Monthly course sales" value={slider * 500} min={0} max={50000} step={500} onChange={(v) => setSlider(v / 500)} format={(v) => `$${v.toLocaleString('en-US')}`} />
              <Label>Badges</Label>
              <div className="flex flex-wrap gap-2">
                {(['neutral', 'flame', 'solid', 'indigo', 'violet', 'ok', 'warn', 'bad', 'outline'] as BadgeTone[]).map((t) => (
                  <Badge key={t} tone={t}>
                    {t}
                  </Badge>
                ))}
                <Badge tone="ok" dot size="md">
                  Published
                </Badge>
                <Badge tone="solid" size="xs">
                  Expert
                </Badge>
              </div>
              <Label>Nav dropdown, pinned open</Label>
              <div className="h-[300px]">
                <div className="flex justify-center">
                  <NavDropdown label="Features" items={featureLinks} force="open" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Feedback" lead="Notices, empty states, loading and progress.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Notice tone="info" title="Info">Learners can join live with a code.</Notice>
            <Notice tone="ok" title="Success">Course published to your storefront.</Notice>
            <Notice tone="bad" title="Error">Add at least one lesson before publishing.</Notice>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <EmptyState icon={<BookOpen />} title="Empty state" body="What a list shows when there is nothing in it." action={<Button size="sm">Add the first one</Button>} />
            <div className="grid gap-4">
              <StatCard label="Loading stat" value="" loading />
              <StatCard label="Revenue" value="$18,420" delta={12.4} />
              <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line p-5">
                <Progress value={72} label="Course progress" />
                <Progress value={40} label="Quiz progress" tone="violet" />
                <Progress value={90} label="Upload progress" tone="ink" />
              </div>
            </div>
          </div>
          <Button variant="outline" className="mt-6" onClick={() => toast('Lesson deleted', { action: { label: 'Undo', run: () => toast('Restored') } })}>
            Show a toast
          </Button>
        </Section>

        <Section title="Overlays" lead="Focus is trapped inside, Esc closes and focus returns to the trigger.">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setModal(true)}>Open modal</Button>
            <Button variant="outline" onClick={() => setSheet(true)}>
              Open sheet
            </Button>
          </div>
          <Modal open={modal} onClose={() => setModal(false)} title="Publish this course?" description="It goes on your storefront.">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModal(false)}>Publish now</Button>
            </div>
          </Modal>
          <Sheet open={sheet} onClose={() => setSheet(false)} title="Side sheet">
            <p className="text-[15px] text-muted">Used for the mobile menu and integration details.</p>
            <Button className="mt-6" onClick={() => setSheet(false)}>
              Done
            </Button>
          </Sheet>
          <div className="mt-6">
            <Accordion items={[{ q: 'Accordion item', a: 'One open at a time, with aria-expanded and aria-controls.' }, { q: 'Second item', a: 'Closed by default.' }]} />
          </div>
        </Section>

        <Section title="Data">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <Label>LineChart (hover or arrow keys)</Label>
              <LineChart values={[120, 140, 132, 170, 165, 190, 214, 208, 240, 262, 255, 300]} labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']} format={(v) => `$${v}k`} label="Revenue" />
            </Card>
            <Card>
              <Label>FunnelBars</Label>
              <FunnelBars steps={funnel} />
              <div className="mt-6 h-20">
                <BarSpark values={[12, 14, 13, 17, 16, 19, 22, 21, 25, 27, 26, 31]} label="BarSpark example" />
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Course" lead="Pieces of the builder and storefront.">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card pad="sm">
              <Label>SortableList: drag the grip, or focus it and press the arrow keys</Label>
              <SortableList
                items={items}
                onChange={setItems}
                label="Example lessons"
                itemLabel={(l) => l.title}
                itemClassName="rounded-[10px] pr-2 hover:bg-wash"
                render={(l) => (
                  <span className="flex min-h-11 flex-1 items-center gap-2.5">
                    <LessonTypeIcon type={l.type} />
                    <span className="text-[14px] text-ink">{l.title}</span>
                  </span>
                )}
              />
            </Card>
            <Card pad="sm" className="flex flex-col gap-4">
              <Label>Lesson types and course glyphs</Label>
              <div className="flex gap-2">
                <LessonTypeIcon type="video" />
                <LessonTypeIcon type="text" />
                <LessonTypeIcon type="quiz" />
                <LessonTypeIcon type="assignment" />
                <CourseIcon name="pen" />
                <CourseIcon name="code" />
                <CourseIcon name="cup" />
                <CourseIcon name="camera" />
                <CourseIcon name="wheat" />
              </div>
              <Label>Avatars, stack and stars</Label>
              <div className="flex items-center gap-4">
                <Avatar src={people[0].src} name={people[0].name} size={44} ring={false} />
                <Avatar name="Jonah Park" size={44} ring={false} />
                <AvatarStack people={people} size={32} label="Example stack" />
                <Stars value={4} />
              </div>
              <Label>Collaborator cursors and logo mark</Label>
              <div className="relative h-14">
                <CursorTag name="Editor" tone="violet" flip className="left-0 top-0" float={false} />
                <CursorTag name="Maya Chen" tone="azure" className="left-32 top-0" float={false} />
                <Mark className="absolute left-64 top-2 size-9" />
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Product mocks" lead="Live components laid out at a fixed size and scaled to fit with ScaledFrame.">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <ScaledFrame width={HERO_MOCK.width} height={HERO_MOCK.height} label="Hero mock" interactiveFrom={500}>
              <HeroMock />
            </ScaledFrame>
            <ScaledFrame width={620} height={360} label="Dashboard mock" interactiveFrom={420}>
              <DashboardMock />
            </ScaledFrame>
          </div>
        </Section>
      </Container>
    </div>
  )
}
