import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, Inbox, Plus, RotateCcw } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { AreaChart } from '../components/AreaChart'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import type { BadgeTone } from '../components/Badge'
import { Button } from '../components/Button'
import type { ButtonVariant } from '../components/Button'
import { Card } from '../components/Card'
import { CodeBlock } from '../components/CodeBlock'
import { Container } from '../components/Container'
import { CurrencyBadge } from '../components/CurrencyBadge'
import { Dialog } from '../components/Dialog'
import { EmailCapture } from '../components/EmailCapture'
import { EmptyState } from '../components/EmptyState'
import { SelectField, TextArea, TextField } from '../components/Field'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { MoneyInput } from '../components/MoneyInput'
import { Notice } from '../components/Notice'
import type { NoticeTone } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { PartnerLogos } from '../components/PartnerLogos'
import { PasswordField } from '../components/PasswordField'
import { PayWidget } from '../components/PayWidget'
import { PaymentCard } from '../components/PaymentCard'
import { PlanCard } from '../components/PlanCard'
import { RadioCard } from '../components/RadioCard'
import { Segmented } from '../components/Segmented'
import { Skeleton } from '../components/Skeleton'
import { Slider } from '../components/Slider'
import { Spinner } from '../components/Spinner'
import { Stat } from '../components/Stat'
import { Stepper } from '../components/Stepper'
import { Tabs, useTabIds } from '../components/Tabs'
import { Toggle } from '../components/Toggle'
import { checkout, hero, insights, plans, pricing } from '../content'
import { cx } from '../lib/cx'
import type { CurrencyCode } from '../shared/fx'

/*
  The living style guide. Everything here is rendered by the real
  components; hover, focus and pressed are pinned with `force`/`data-force`.
*/

const colours: { group: string; names: string[] }[] = [
  { group: 'Surfaces', names: ['page', 'mist', 'mist-2', 'mist-3', 'line', 'line-strong'] },
  { group: 'Ink', names: ['ink', 'ink-2', 'muted', 'faint'] },
  { group: 'Brand', names: ['teal', 'teal-ink', 'teal-deep', 'teal-50', 'teal-100'] },
  { group: 'Navy', names: ['navy', 'navy-2', 'navy-3', 'on-navy', 'on-navy-muted'] },
  { group: 'Status', names: ['success', 'success-50', 'warning', 'warning-50', 'danger', 'danger-50'] },
]

const typeScale = [
  { name: 'Display', cls: 'text-[66px] leading-[1.14] tracking-[-0.035em] font-medium', spec: '66 / 1.14, 500, −3.5%' },
  { name: 'H1', cls: 'text-[56px] leading-[1.08] tracking-[-0.04em] font-medium', spec: '56 / 1.08, 500, −4%' },
  { name: 'H2', cls: 'text-[42px] leading-[1.12] tracking-[-0.03em] font-medium', spec: '42 / 1.12, 500, −3%' },
  { name: 'H3', cls: 'text-[22px] leading-snug tracking-[-0.02em] font-medium', spec: '22 / 1.375, 500, −2%' },
  { name: 'Body large', cls: 'text-[17px] leading-[1.6]', spec: '17 / 1.6, 400' },
  { name: 'Body', cls: 'text-[15px] leading-[1.6]', spec: '15 / 1.6, 400' },
  { name: 'Small', cls: 'text-[13px] leading-5', spec: '13 / 1.54, 400' },
  { name: 'Eyebrow', cls: 'text-[12px] font-semibold tracking-[0.06em] text-teal-ink', spec: '12, 600, +6%' },
  { name: 'Mono', cls: 'font-mono text-[13px]', spec: 'JetBrains Mono 13' },
]

const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 112]
const radii = [
  { name: 'control-sm', v: 'var(--radius-control-sm)' },
  { name: 'control', v: 'var(--radius-control)' },
  { name: 'card-sm', v: 'var(--radius-card-sm)' },
  { name: 'card', v: 'var(--radius-card)' },
  { name: 'panel', v: 'var(--radius-panel)' },
]
const shadows = [
  { name: 'card', v: 'var(--shadow-card)' },
  { name: 'float', v: 'var(--shadow-float)' },
  { name: 'focus', v: 'var(--shadow-focus)' },
]
const motionTokens = [
  { name: 'float', cls: 'animate-float', note: '7 s ease-in-out loop' },
  { name: 'pulse-ring', cls: 'animate-pulse-ring', note: '1.8 s success halo' },
  { name: 'shimmer', cls: 'skeleton', note: '1.6 s loading sweep' },
  { name: 'spin', cls: 'animate-spin-slow', note: '1 s spinner' },
]

const sections = ['Colour', 'Type', 'Spacing', 'Radii and shadows', 'Motion', 'Buttons', 'Fields', 'Selection', 'Feedback', 'Money', 'Data display', 'Composites']

export function StyleGuide() {
  return (
    <>
      <PageHeader eyebrow="Design system" title="Ledgerly style guide" body="Tokens and every component in every state, rendered by the components the site uses.">
        <nav aria-label="Style guide sections" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s}>
                <a href={`#sg-${slug(s)}`} className="inline-flex h-10 items-center rounded-control-sm bg-white px-3.5 text-[13.5px] font-medium text-ink-2 shadow-card hover:text-ink">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <Container className="space-y-24 py-16 sm:py-20">
        <Colours />
        <Group title="Type">
          <div className="divide-y divide-line">
            {typeScale.map((t) => (
              <div key={t.name} className="grid gap-2 py-5 md:grid-cols-[180px_1fr] md:items-baseline">
                <div>
                  <p className="text-[14px] font-medium text-ink">{t.name}</p>
                  <p className="text-[12.5px] text-faint">{t.spec}</p>
                </div>
                <p className={cx('min-w-0 break-words text-ink', t.cls)}>Get paid</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[14px] text-muted">Family: Inter Tight (Google Fonts), tabular numbers for every amount.</p>
        </Group>
        <Group title="Spacing">
          <ul className="flex flex-wrap items-end gap-5">
            {spacing.map((s) => (
              <li key={s} className="text-center">
                <span className="block rounded-[4px] bg-teal" style={{ width: s, height: s }} aria-hidden />
                <span className="mt-2 block text-[12.5px] text-muted">{s}</span>
              </li>
            ))}
          </ul>
        </Group>
        <Group title="Radii and shadows">
          <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {radii.map((r) => (
              <div key={r.name}>
                <div className="h-24 border border-line-strong bg-mist-2" style={{ borderRadius: r.v }} />
                <p className="mt-2 text-[13px] text-ink">{r.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {shadows.map((s) => (
              <div key={s.name} className="grid h-28 place-items-center rounded-card bg-white text-[13px] text-ink" style={{ boxShadow: s.v }}>
                shadow-{s.name}
              </div>
            ))}
          </div>
          <p className="mt-4 text-[14px] text-muted">Every rounded shape is a squircle (`corner-shape: squircle`); true circles use the `round` class.</p>
        </Group>
        <MotionGroup />
        <Buttons />
        <Fields />
        <Selection />
        <Feedback />
        <Money />
        <DataDisplay />
        <Group title="Composites">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
            <div className="rounded-panel bg-mist p-4 pt-16 sm:p-10 sm:pt-16">
              <PayWidget />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <PlanCard plan={plans[0]} billing="monthly" />
              <PlanCard plan={plans[1]} billing="yearly" />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-10 rounded-card bg-mist p-8">
            <Logo />
            <PartnerLogos names={hero.partners} label={hero.partnersLabel} />
          </div>
          <div className="mt-8 flex items-center gap-6 rounded-card bg-navy p-8">
            <Logo tone="white" />
          </div>
        </Group>
      </Container>
    </>
  )
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z]+/g, '-')
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section id={`sg-${slug(title)}`} aria-labelledby={`sg-${slug(title)}-h`} className="scroll-mt-24">
      <h2 id={`sg-${slug(title)}-h`} className="mb-8 border-b border-line pb-4 text-[28px] font-medium tracking-[-0.03em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx('grid gap-3 py-4 md:grid-cols-[160px_1fr] md:items-center', className)}>
      <p className="text-[13px] font-medium text-muted">{label}</p>
      <div className="flex min-w-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function Colours() {
  const [hex, setHex] = useState<Record<string, string>>({})
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const out: Record<string, string> = {}
    for (const g of colours) for (const n of g.names) out[n] = cs.getPropertyValue(`--color-${n}`).trim()
    setHex(out)
  }, [])
  return (
    <Group title="Colour">
      <div className="space-y-8">
        {colours.map((g) => (
          <div key={g.group}>
            <h3 className="mb-3 text-[15px] font-medium text-ink">{g.group}</h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {g.names.map((n) => (
                <li key={n} className="overflow-hidden rounded-card-sm border border-line">
                  <span className="block h-16" style={{ background: `var(--color-${n})` }} aria-hidden />
                  <span className="block px-3 py-2">
                    <span className="block text-[13px] font-medium text-ink">{n}</span>
                    <span className="block font-mono text-[12px] text-muted">{hex[n] || '…'}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="text-[14px] text-muted">
          teal (#2b8a96) is the brand fill for large type and card faces. Small text on teal uses teal-ink (#1f6f79), which passes WCAG AA with white.
        </p>
      </div>
    </Group>
  )
}

function MotionGroup() {
  const [k, setK] = useState(0)
  return (
    <Group title="Motion">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Button variant="outline" size="sm" iconLeft={<RotateCcw className="size-4" aria-hidden />} onClick={() => setK((x) => x + 1)}>
          Replay
        </Button>
        <p className="text-[13.5px] text-muted">Easing out: cubic-bezier(0.22, 1, 0.36, 1). Durations: fast 150 ms, base 240 ms, slow 600 ms. Reduced motion stops all loops.</p>
      </div>
      <div key={k} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {motionTokens.map((m) => (
          <div key={m.name} className="rounded-card-sm border border-line p-5">
            <div className="grid h-20 place-items-center">
              {m.name === 'shimmer' ? (
                <span className={cx('block h-4 w-full rounded-[6px]', m.cls)} />
              ) : m.name === 'spin' ? (
                <Spinner className="size-8 text-teal-ink" />
              ) : (
                <span className={cx('round block size-10 rounded-full bg-teal', m.cls)} />
              )}
            </div>
            <p className="mt-3 text-[13.5px] font-medium text-ink">{m.name}</p>
            <p className="text-[12.5px] text-muted">{m.note}</p>
          </div>
        ))}
        <div className="rounded-card-sm border border-line p-5">
          <div className="grid h-20 place-items-center">
            <AreaChart points={[2, 4, 3, 6, 7, 9]} labels={[]} height={60} title="Draw-in line demo" />
          </div>
          <p className="mt-3 text-[13.5px] font-medium text-ink">draw</p>
          <p className="text-[12.5px] text-muted">1.6 s chart line</p>
        </div>
      </div>
    </Group>
  )
}

function Buttons() {
  const variants: ButtonVariant[] = ['primary', 'dark', 'outline', 'ghost', 'danger']
  return (
    <Group title="Buttons">
      <div className="divide-y divide-line">
        {variants.map((v) => (
          <Row key={v} label={v}>
            <Button variant={v}>Default</Button>
            <Button variant={v} force="hover">
              Hover
            </Button>
            <Button variant={v} force="focus">
              Focus
            </Button>
            <Button variant={v} force="pressed">
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
        <Row label="light (on navy)" className="rounded-card-sm bg-navy px-4 [&>p]:text-on-navy-muted">
          <Button variant="light">Default</Button>
          <Button variant="light" force="hover">
            Hover
          </Button>
          <Button variant="light" force="focus">
            Focus
          </Button>
          <Button variant="light" disabled>
            Disabled
          </Button>
        </Row>
        <Row label="sizes and icons">
          <Button size="sm">Small</Button>
          <Button size="md" icon={<ArrowRight className="size-4" aria-hidden />}>
            Medium
          </Button>
          <Button size="lg" iconLeft={<Plus className="size-4" aria-hidden />}>
            Large
          </Button>
        </Row>
      </div>
    </Group>
  )
}

function Fields() {
  return (
    <Group title="Fields">
      <div className="grid gap-6 md:grid-cols-3">
        <TextField label="Default" placeholder="name@company.com" />
        <TextField label="Hover" placeholder="name@company.com" force="hover" />
        <TextField label="Focus" placeholder="name@company.com" force="focus" />
        <TextField label="With hint" hint="We never share it." defaultValue="mara@harbor.co" />
        <TextField label="Error" defaultValue="mara@" error="Enter a valid email address, like name@company.com." />
        <TextField label="Disabled" defaultValue="Locked" disabled />
        <SelectField label="Select" options={['United States', 'Germany']} defaultValue="Germany" />
        <PasswordField label="Password" meter value="ledger2026" readOnly />
        <TextField label="Optional" optional placeholder="Reference" />
        <TextArea className="md:col-span-3" label="Text area" placeholder="Tell us more" />
      </div>
      <h3 className="mb-4 mt-10 text-[15px] font-medium text-ink">Email capture</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <EmailCapture placeholder={hero.emailPlaceholder} cta={hero.cta} success={hero.success} />
        <EmailCapture placeholder={hero.emailPlaceholder} cta={hero.cta} success={hero.success} force="loading" />
        <EmailCapture placeholder={hero.emailPlaceholder} cta={hero.cta} success={hero.success} force="error" />
        <EmailCapture placeholder={hero.emailPlaceholder} cta={hero.cta} success={hero.success} force="success" />
      </div>
    </Group>
  )
}

function Selection() {
  const [radio, setRadio] = useState('a')
  const [seg, setSeg] = useState('6m')
  const [tab, setTab] = useState('curl')
  const [on, setOn] = useState(true)
  const [off, setOff] = useState(false)
  const [slider, setSlider] = useState(40)
  const ids = useTabIds('sg-tabs')
  return (
    <Group title="Selection">
      <div className="grid gap-3 md:grid-cols-3">
        <RadioCard name="sg-r" value="a" checked={radio === 'a'} onChange={setRadio} label="Checked" detail="Selected option" />
        <RadioCard name="sg-r" value="b" checked={radio === 'b'} onChange={setRadio} label="Unchecked" detail="Click to select" />
        <RadioCard name="sg-r2" value="c" checked={false} onChange={() => {}} label="Hover" detail="Pinned" force="hover" />
        <RadioCard name="sg-r3" value="d" checked={false} onChange={() => {}} label="Focus" detail="Pinned" force="focus" />
        <RadioCard name="sg-r4" value="e" checked={false} onChange={() => {}} label="Disabled" detail="Unavailable" disabled />
      </div>
      <div className="mt-6 divide-y divide-line">
        <Row label="Segmented">
          <Segmented label="Range" value={seg} onChange={setSeg} options={insights.summary.ranges.map((r) => ({ id: r.id, label: r.label }))} />
          <Segmented size="sm" tone="mist" label="Range small" value={seg} onChange={setSeg} options={insights.summary.ranges.map((r) => ({ id: r.id, label: r.label.replace(' months', 'M') }))} />
        </Row>
        <Row label="Tabs">
          <div>
            <Tabs label="Language" ids={ids} value={tab} onChange={setTab} tabs={[{ id: 'curl', label: 'cURL' }, { id: 'node', label: 'Node.js' }, { id: 'python', label: 'Python' }]} />
            {['curl', 'node', 'python'].map((t) => (
              <p key={t} id={ids.panel(t)} role="tabpanel" aria-labelledby={ids.tab(t)} hidden={tab !== t} className="mt-2 text-[13.5px] text-muted">
                Panel for {t}
              </p>
            ))}
          </div>
        </Row>
        <Row label="Toggle">
          <div className="grid w-full max-w-[640px] gap-4 sm:grid-cols-2">
            <Toggle label="On" checked={on} onChange={setOn} />
            <Toggle label="Off" checked={off} onChange={setOff} />
            <Toggle label="Focus" checked={on} onChange={setOn} force="focus" />
            <Toggle label="Disabled" checked={false} onChange={() => {}} disabled />
          </div>
        </Row>
        <Row label="Slider">
          <Slider className="w-full max-w-[420px]" label="Volume" value={slider} min={0} max={100} step={1} onChange={setSlider} format={(v) => `${v}%`} />
        </Row>
        <Row label="Stepper">
          <div className="grid w-full max-w-[520px] gap-5">
            <Stepper steps={['Amount', 'Recipient', 'Review', 'Done']} current={0} />
            <Stepper steps={['Amount', 'Recipient', 'Review', 'Done']} current={2} />
          </div>
        </Row>
      </div>
    </Group>
  )
}

function Feedback() {
  const [open, setOpen] = useState(false)
  const tones: BadgeTone[] = ['neutral', 'teal', 'success', 'warning', 'danger', 'navy']
  const notices: NoticeTone[] = ['info', 'success', 'warning', 'danger']
  return (
    <Group title="Feedback">
      <div className="divide-y divide-line">
        <Row label="Badge">
          {tones.map((t) => (
            <Badge key={t} tone={t} dot={t === 'success'}>
              {t}
            </Badge>
          ))}
        </Row>
        <Row label="Notice">
          <div className="grid w-full gap-3 md:grid-cols-2">
            {notices.map((t) => (
              <Notice key={t} tone={t} title={t[0].toUpperCase() + t.slice(1)} live={false}>
                A short message about what happened and what to do.
              </Notice>
            ))}
          </div>
        </Row>
        <Row label="Loading">
          <Spinner className="size-5 text-teal-ink" label="Loading" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-24" />
        </Row>
        <Row label="Empty">
          <EmptyState className="w-full max-w-[420px]" icon={<Inbox className="size-5" aria-hidden />} title="Nothing here yet" body="Empty states explain what will appear and how to start." />
        </Row>
        <Row label="Dialog">
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open dialog
          </Button>
          <Dialog open={open} onClose={() => setOpen(false)} title="Confirm transfer" description="Focus is trapped here; Esc or the close button returns focus.">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </div>
          </Dialog>
        </Row>
        <Row label="Accordion">
          <div className="w-full max-w-[640px]">
            <Accordion items={pricing.faq.slice(0, 2)} />
          </div>
        </Row>
      </div>
    </Group>
  )
}

function Money() {
  const [code, setCode] = useState<CurrencyCode>('USD')
  const [amt, setAmt] = useState('2,500')
  return (
    <Group title="Money">
      <div className="grid gap-6 md:grid-cols-2">
        <MoneyInput label="Default" amount={amt} onAmount={setAmt} code={code} onCode={setCode} />
        <MoneyInput label="Focus" amount="2,500" onAmount={() => {}} code="EUR" onCode={() => {}} force="focus" />
        <MoneyInput label="Error" amount="0" onAmount={() => {}} code="GBP" onCode={() => {}} error="Enter an amount to send." />
        <MoneyInput label="Loading" amount="" code="JPY" onCode={() => {}} loading />
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'INR', 'MXN', 'SGD', 'BRL'] as CurrencyCode[]).map((c) => (
          <span key={c} className="inline-flex items-center gap-2 text-[13px] text-ink-2">
            <CurrencyBadge code={c} />
            {c}
          </span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-6">
        {checkout.accents.map((a) => (
          <PaymentCard key={a.id} label={`${a.label} card`} last4="4242" accent={a.hex} network={a.id === 'plum' ? 'mastercard' : a.id === 'ember' ? 'amex' : 'visa'} />
        ))}
      </div>
    </Group>
  )
}

function DataDisplay() {
  return (
    <Group title="Data display">
      <div className="grid gap-5 lg:grid-cols-3">
        <Card tone="mist">
          <Stat value={3200} suffix="+" label="Stat, counts up when visible" />
        </Card>
        <Card className="lg:col-span-2">
          <AreaChart points={insights.summary.ranges[1].points} labels={insights.summary.months['6m']} title="Six-month balance chart" />
        </Card>
        <Card tone="navy">
          <Stat value={180} suffix="K" label="Stat on navy" tone="on-navy" />
        </Card>
        <div className="lg:col-span-2">
          <CodeBlock title="Code block" code={`{\n  "id": "qt_8fK2mZ",\n  "rate": 0.921843,\n  "receive_amount": 2289.18\n}`} />
        </div>
        <Card tone="outline" className="flex items-center gap-4">
          <Avatar initials="ML" />
          <Avatar initials="TM" tone="navy" />
          <Avatar initials="ID" tone="mist" />
        </Card>
        <Card tone="outline" className="lg:col-span-2">
          <div className="flex flex-wrap gap-8">
            {['transfer', 'bank', 'shield', 'lock', 'key', 'eye', 'vault'].map((n) => (
              <span key={n} className="flex flex-col items-center gap-2 text-[12px] text-muted">
                <Icon name={n} className="size-8 text-navy" />
                {n}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </Group>
  )
}
