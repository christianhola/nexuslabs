import { Heart, Plus, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { BeforeAfter } from '../components/BeforeAfter'
import { ArrowLink, Button, IconButton } from '../components/Button'
import { Checkbox, ChipPreview, ChoiceChips, SelectField, TextArea, TextField } from '../components/Field'
import { FilterBar } from '../components/FilterBar'
import { Label } from '../components/Label'
import { Logo } from '../components/Logo'
import { Modal } from '../components/Modal'
import { NewsletterForm } from '../components/NewsletterForm'
import { PackageCard } from '../components/PackageCard'
import { Photo } from '../components/Photo'
import { RoomCard } from '../components/RoomCard'
import { SaveButton } from '../components/SaveButton'
import { Stepper } from '../components/Stepper'
import { Swatch } from '../components/Swatch'
import { TeamMember } from '../components/TeamMember'
import { useToast } from '../components/Toast'
import { PACKAGES, ROOMS, SERVICES_PAGE, TEAM } from '../content'

// Mirrors the @theme tokens in src/styles.css.
const COLORS = [
  { group: 'Surfaces', items: [['paper', '#f2f1ee'], ['paper-2', '#e9e7e2'], ['card', '#fbfaf8'], ['line', '#d9d7d1'], ['line-strong', '#b7b4ac']] },
  { group: 'Ink', items: [['ink', '#111110'], ['ink-2', '#2b2a27'], ['muted', '#5c5a55'], ['night', '#121211'], ['night-2', '#1d1c1a'], ['snow', '#ffffff'], ['snow-muted', '#b9b7b1']] },
  { group: 'Accents', items: [['oak', '#b08a5e'], ['olive', '#3f4a33'], ['olive-soft', '#dfe2d4'], ['rust', '#c0612f'], ['rust-ink', '#9c4519'], ['success', '#2f5a2c'], ['danger', '#a3261b']] },
] as const

const TYPE = [
  { name: 'Wordmark', cls: 'wordmark text-[8rem]', spec: '600, 22.4vw in the hero, tracking -0.042em', sample: 'linen&oak' },
  { name: 'Display', cls: 'font-display text-[5.5rem]', spec: '500, clamp(3rem, 8.6vw, 8.5rem), line 0.92', sample: 'Room by room' },
  { name: 'Statement', cls: 'font-statement text-[3.25rem]', spec: '400, 4.6vw, line 1.04, tracking -0.04em', sample: 'We design refined homes' },
  { name: 'Title', cls: 'text-[2.5rem] leading-none font-medium tracking-[-0.045em]', spec: '500, clamp(1.75rem, 3vw, 2.75rem)', sample: 'Design consultation' },
  { name: 'Body large', cls: 'text-[17px] leading-snug', spec: '400, 17px, line 1.375', sample: 'Fixed fees, agreed before we begin.' },
  { name: 'Body', cls: 'text-[15px]', spec: '400, 15px, line 1.5', sample: 'Trade prices go straight to you.' },
  { name: 'Label', cls: 'label-sm', spec: '500, 12px, sentence case', sample: 'Studio highlights' },
]

const SPACE = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128]
const RADII = [
  ['none', '0px', 'Photographs'],
  ['xs', '3px', 'Checkboxes'],
  ['sm', '6px', 'Inputs, swatches'],
  ['md', '10px', 'Cards, panels'],
  ['pill', '999px', 'Buttons, chips'],
] as const
const SHADOWS = [
  ['card', 'var(--shadow-card)'],
  ['float', 'var(--shadow-float)'],
  ['inset', 'var(--shadow-inset)'],
] as const
const MOTION = [
  ['fast', '160ms', 'Hover colour, chips'],
  ['base', '320ms', 'Buttons, arrows, accordions'],
  ['slow', '900ms', 'Reveals, photo fade-in'],
  ['drift', '28s', 'Hero photograph drift'],
] as const

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 border-t border-ink pt-5 pb-20">
      <h2 id={`${id}-h`} className="text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-medium tracking-[-0.045em]">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-line py-5 md:grid-cols-[10rem_minmax(0,1fr)]">
      <p className="label-sm pt-2 text-muted">{label}</p>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const STATES = ['default', 'hover', 'focus', 'pressed'] as const

export function Styleguide() {
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [chips, setChips] = useState<string[]>(['Kitchen'])
  const [filter, setFilter] = useState('All')
  const toast = useToast()

  const nav = ['Colour', 'Type', 'Spacing', 'Radii', 'Shadows', 'Motion', 'Buttons', 'Fields', 'Choices', 'Cards', 'Feedback', 'Media']

  return (
    <div className="container-page pt-28 pb-12 md:pt-36">
      <Label>Design system</Label>
      <h1 className="font-display mt-5 text-[clamp(3rem,8vw,8rem)]">Style guide</h1>
      <p className="mt-5 max-w-lg text-[17px] leading-snug text-ink-2">
        Every token and component on the site, rendered by the real components. Tokens live in <code className="text-[15px]">src/styles.css</code>; copy and seed data in{' '}
        <code className="text-[15px]">src/content.ts</code>.
      </p>
      <nav aria-label="Style guide sections" className="mt-8 mb-16 flex flex-wrap gap-2">
        {nav.map((n) => (
          <a key={n} href={`#${n.toLowerCase()}`} className="round inline-flex min-h-10 items-center rounded-full border border-line-strong bg-card px-4 text-[14px] font-medium hover:border-ink">
            {n}
          </a>
        ))}
      </nav>

      <Section id="colour" title="Colour">
        <div className="flex flex-col gap-10">
          {COLORS.map((g) => (
            <div key={g.group}>
              <Label>{g.group}</Label>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                {g.items.map(([name, hex]) => (
                  <Swatch key={name} hex={hex} name={name} size="lg" />
                ))}
              </div>
            </div>
          ))}
          <p className="max-w-xl text-[14px] text-muted">
            Text tokens pass WCAG AA on paper and card. Rust (#c0612f) is for fills and the saved heart only; text in that hue uses rust-ink (#9c4519).
          </p>
        </div>
      </Section>

      <Section id="type" title="Type scale">
        <p className="mb-6 text-[15px] text-ink-2">Inter Tight throughout, tracked tight as the size grows.</p>
        {TYPE.map((t) => (
          <div key={t.name} className="grid gap-2 border-b border-line py-6 md:grid-cols-[12rem_minmax(0,1fr)]">
            <div>
              <p className="text-[15px] font-medium">{t.name}</p>
              <p className="label-sm mt-1 text-muted">{t.spec}</p>
            </div>
            <p className={`${t.cls} min-w-0 overflow-hidden`}>{t.sample}</p>
          </div>
        ))}
      </Section>

      <Section id="spacing" title="Spacing">
        <div className="flex flex-col gap-2">
          {SPACE.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <span className="label-sm w-12 tabular-nums text-muted">{s}px</span>
              <span className="h-3 rounded-full bg-ink" style={{ width: s * 2 }} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-[14px] text-muted">Page gutters: 16px on phones, 28px from 768px. Sections step in 96 to 128px.</p>
      </Section>

      <Section id="radii" title="Radii">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {RADII.map(([name, v, use]) => (
            <div key={name}>
              <div className={`h-24 bg-card shadow-[var(--shadow-inset)] ${name === 'pill' ? 'round' : ''}`} style={{ borderRadius: v }} />
              <p className="mt-2 text-[14px] font-medium">
                {name} <span className="text-muted">{v}</span>
              </p>
              <p className="label-sm text-muted">{use}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="shadows" title="Shadows">
        <div className="grid gap-6 sm:grid-cols-3">
          {SHADOWS.map(([name, v]) => (
            <div key={name}>
              <div className="h-28 rounded-[var(--radius-md)] bg-card" style={{ boxShadow: v }} />
              <p className="mt-3 text-[14px] font-medium">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="motion" title="Motion">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            {MOTION.map(([name, v, use]) => (
              <div key={name} className="flex justify-between gap-4 border-b border-line py-3 text-[15px]">
                <span className="font-medium">{name}</span>
                <span className="text-muted">
                  {v}, {use}
                </span>
              </div>
            ))}
            <p className="mt-3 text-[14px] text-muted">Easing: out-soft cubic-bezier(0.22, 1, 0.36, 1). Reduced motion turns off reveals, drift and page fades.</p>
          </div>
          <div className="flex flex-col gap-4 rounded-[var(--radius-md)] bg-card p-6 shadow-[var(--shadow-inset)]">
            <div key={replay} className="flex flex-col gap-3">
              <motion.p className="wordmark text-[4.5rem]" initial={{ y: '40%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
                linen&oak
              </motion.p>
              <p className="animate-rise text-[15px] text-ink-2">Rise: 900ms out-soft</p>
              <div className="h-24 overflow-hidden rounded-[var(--radius-sm)]">
                <Photo name="hero" alt="" className="size-full" imgClassName="animate-drift" />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setReplay((n) => n + 1)} className="self-start">
              Replay motion
            </Button>
          </div>
        </div>
      </Section>

      <Section id="buttons" title="Buttons">
        {(['solid', 'outline', 'ghost'] as const).map((v) => (
          <Row key={v} label={v}>
            {STATES.map((s) => (
              <Button key={s} variant={v} data-force={s === 'default' ? undefined : s}>
                {s === 'default' ? 'Book a consultation' : s}
              </Button>
            ))}
            <Button variant={v} disabled>
              Disabled
            </Button>
            <Button variant={v} loading>
              Loading
            </Button>
          </Row>
        ))}
        <div className="on-dark mt-4 rounded-[var(--radius-md)] bg-night p-4">
          {(['light', 'outline-light'] as const).map((v) => (
            <div key={v} className="flex flex-wrap items-center gap-3 border-b border-night-line py-4 last:border-0">
              <span className="label-sm w-28 text-snow-muted">{v}</span>
              {STATES.map((s) => (
                <Button key={s} variant={v} data-force={s === 'default' ? undefined : s}>
                  {s === 'default' ? 'Take the quiz' : s}
                </Button>
              ))}
              <Button variant={v} disabled>
                Disabled
              </Button>
            </div>
          ))}
        </div>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg" icon>
            Large with arrow
          </Button>
        </Row>
        <Row label="Icon buttons">
          {STATES.slice(0, 3).map((s) => (
            <IconButton key={s} aria-label={`Add, ${s}`} data-force={s === 'default' ? undefined : s}>
              <Plus className="size-4" strokeWidth={1.75} />
            </IconButton>
          ))}
          <IconButton tone="glass" aria-label="Close">
            <X className="size-4" strokeWidth={1.75} />
          </IconButton>
          <IconButton aria-label="Disabled" disabled>
            <Plus className="size-4" strokeWidth={1.75} />
          </IconButton>
        </Row>
        <Row label="Arrow link">
          <ArrowLink to="/portfolio">All rooms</ArrowLink>
          <ArrowLink to="/portfolio" data-force="hover">
            Hover
          </ArrowLink>
          <ArrowLink to="/portfolio" data-force="focus">
            Focus
          </ArrowLink>
        </Row>
        <Row label="Save heart">
          <SaveButton id="sg-a" name="Example room" pinned={false} />
          <SaveButton id="sg-b" name="Example room" pinned data-force="hover" />
          <SaveButton id="sg-c" name="Example room" pinned />
          <SaveButton id="sg-d" name="Example room" pinned={false} data-force="focus" />
        </Row>
        <Row label="Logo">
          <Logo />
        </Row>
      </Section>

      <Section id="fields" title="Fields">
        <div className="grid gap-6 md:grid-cols-3">
          <TextField label="Default" placeholder="Your name" />
          <TextField label="Hover" placeholder="Your name" data-force="hover" />
          <TextField label="Focus" defaultValue="Edith Marlowe" data-force="focus" />
          <TextField label="Error" defaultValue="edith@" error="Enter a valid email address." />
          <TextField label="Disabled" placeholder="Not editable" disabled />
          <TextField label="With hint" optional hint="So we can match you with a nearby designer" />
          <SelectField label="Select" options={['Flat', 'Terrace', 'Detached house']} placeholder="Choose one" />
          <SelectField label="Select, error" options={['Flat']} placeholder="Choose one" error="Choose the type of property." />
          <TextArea label="Text area" optional placeholder="The one thing that has to stay" />
        </div>
      </Section>

      <Section id="choices" title="Choices">
        <Row label="Chip states">
          <ChipPreview>Default</ChipPreview>
          <ChipPreview force="hover">Hover</ChipPreview>
          <ChipPreview force="focus">Focus</ChipPreview>
          <ChipPreview checked>Selected</ChipPreview>
          <ChipPreview disabled>Disabled</ChipPreview>
        </Row>
        <Row label="Multi select">
          <ChoiceChips
            label="Rooms"
            hideLabel
            name="sg-rooms"
            multiple
            options={['Living', 'Kitchen', 'Bedroom']}
            value={chips}
            onChange={(v) => setChips((c) => (c.includes(v) ? c.filter((x) => x !== v) : [...c, v]))}
          />
        </Row>
        <Row label="Error">
          <ChoiceChips label="Budget" hideLabel name="sg-budget" options={['Under £20k', '£20k to £50k']} value="" onChange={() => {}} error="Choose a budget range." />
        </Row>
        <Row label="Filter bar">
          <FilterBar label="Example filter" options={['All', 'Living', 'Kitchen']} value={filter} onChange={setFilter} counts={{ All: 9, Living: 2, Kitchen: 1 }} />
        </Row>
        <Row label="Checkbox">
          <Checkbox label="Attach my style quiz result" description="Warm minimal" defaultChecked />
          <Checkbox label="Unchecked" />
          <Checkbox label="Disabled" disabled />
        </Row>
        <Row label="Stepper">
          <Stepper steps={['Package', 'Your project', 'Date and time', 'Your details']} current={2} className="w-full max-w-xl" />
        </Row>
      </Section>

      <Section id="cards" title="Cards">
        <div className="grid gap-4 md:grid-cols-3">
          <PackageCard pkg={PACKAGES[0]} compact />
          <PackageCard pkg={PACKAGES[1]} featured compact />
          <RoomCard room={ROOMS[0]} />
        </div>
        <div className="mt-10 max-w-2xl">
          <TeamMember {...TEAM[2]} />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="flex min-w-0 flex-col items-start gap-4 rounded-[var(--radius-md)] bg-card p-6 shadow-[var(--shadow-inset)] sm:p-8">
            <Heart className="size-5 text-muted" strokeWidth={1.75} aria-hidden />
            <p className="text-[19px] leading-snug tracking-[-0.02em]">Empty state: nothing saved yet.</p>
            <Button variant="outline" size="sm">
              Browse the portfolio
            </Button>
          </div>
          <div className="on-dark min-w-0 rounded-[var(--radius-md)] bg-night p-6 text-snow sm:p-8">
            <p className="mb-4 text-[19px] tracking-[-0.02em]">Newsletter on dark</p>
            <NewsletterForm />
          </div>
        </div>
      </Section>

      <Section id="feedback" title="Feedback">
        <Row label="Overlays">
          <Button variant="outline" onClick={() => setModal(true)}>
            Open modal
          </Button>
          <Button variant="outline" onClick={() => toast('Saved to your ideas board')}>
            Show toast
          </Button>
        </Row>
        <Row label="Form error">
          <p role="alert" className="rounded-[var(--radius-sm)] bg-danger/8 px-4 py-3 text-[14px] font-medium text-danger">
            That time has just been taken. Choose another.
          </p>
        </Row>
        <Row label="Loading">
          <span className="skeleton round h-10 w-20 rounded-full" />
          <span className="skeleton round h-10 w-20 rounded-full" />
          <span className="skeleton h-16 w-40 rounded-[var(--radius-sm)]" />
        </Row>
        <div className="mt-6 max-w-2xl">
          <Accordion items={SERVICES_PAGE.faq.slice(0, 2)} />
        </div>
      </Section>

      <Section id="media" title="Media">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Photo name="kitchen" alt="Example photograph" className="aspect-[4/3]" />
            <p className="label-sm mt-2 text-muted">Photo: skeleton until loaded, then fades in. All sources route through IMAGES in content.ts.</p>
          </div>
          <div>
            <BeforeAfter before="before" after="after" label="Style guide before and after slider" />
            <p className="label-sm mt-2 text-muted">Before and after: drag or use arrow keys.</p>
          </div>
        </div>
      </Section>

      <Modal open={modal} onClose={() => setModal(false)} title="Example modal" description="Focus is trapped here; Escape closes and focus returns to the trigger.">
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setModal(false)}>Confirm</Button>
        </div>
      </Modal>
    </div>
  )
}
