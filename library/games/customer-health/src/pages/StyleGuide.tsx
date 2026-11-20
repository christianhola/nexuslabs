import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Columns3, Download, PhoneCall, RotateCw, Sun } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { DataTable, type Column } from '../components/DataTable'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Select, Slider, Switch, TextArea, TextInput } from '../components/Field'
import { HealthDot } from '../components/HealthDot'
import { Kbd } from '../components/Kbd'
import { Kpi } from '../components/Kpi'
import { Link } from '../components/Link'
import { Overlay } from '../components/Overlay'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { Pill, pillClass } from '../components/Pill'
import { Popover } from '../components/Popover'
import { Progress } from '../components/Progress'
import { SegmentTag } from '../components/SegmentTag'
import { Skeleton } from '../components/Skeleton'
import { Sparkline } from '../components/Sparkline'
import { Spinner } from '../components/Spinner'
import { Stat } from '../components/Stat'
import { StatusTag } from '../components/StatusTag'
import { TextTabs } from '../components/TextTabs'
import { ToastCard, useToast } from '../components/Toast'
import { WeeklyChart } from '../components/WeeklyChart'
import { accounts } from '../data'
import { cx } from '../lib/cx'
import { money } from '../lib/format'
import { current, series } from '../lib/metrics'

/*
  The live style guide: tokens read from the CSS at runtime and every
  component in src/components rendered with its variants and states, in both
  themes. Forced states use data-force="hover | focus | active".
*/

const SECTIONS = [
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['space', 'Spacing'],
  ['radii', 'Radii & elevation'],
  ['motion', 'Motion'],
  ['buttons', 'Pill'],
  ['tabs', 'TextTabs'],
  ['fields', 'Fields'],
  ['data', 'Data display'],
  ['charts', 'Charts'],
  ['table', 'DataTable'],
  ['feedback', 'Feedback'],
  ['overlays', 'Overlays'],
  ['layout', 'Layout'],
] as const

const COLOURS: Array<[string, string]> = [
  ['bg', 'Page background'],
  ['panel', 'Raised sections (watchlist)'],
  ['raised', 'Tooltips, popovers, toasts'],
  ['fg', 'Text, solid pill'],
  ['muted', 'Secondary text, labels'],
  ['faint', 'Separators, decoration'],
  ['rule', 'Heavy rules (KPI strip)'],
  ['line', 'Hairlines, borders'],
  ['line-soft', 'Gridlines, nav rule'],
  ['risk', 'At risk, bad deltas, end dots'],
  ['mid', 'Health scale midpoint'],
  ['high', 'Healthy end of the scale'],
  ['scrim', 'Overlay backdrop'],
]

function toHex(v: string) {
  const m = /rgba?\(([^)]+)\)/.exec(v)
  if (!m) return v.trim()
  const [r, g, b, a] = m[1]!.split(/[\s,/]+/).filter(Boolean).map(Number)
  const hex = '#' + [r, g, b].map((n) => n!.toString(16).padStart(2, '0')).join('')
  return a !== undefined && a < 1 ? `${hex} / ${Math.round(a * 100)}%` : hex
}

function Swatches({ theme }: { theme: 'dark' | 'light' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  useEffect(() => {
    if (!ref.current) return
    const cs = getComputedStyle(ref.current)
    const probe = document.createElement('span')
    ref.current.appendChild(probe)
    const out: Record<string, string> = {}
    for (const [k] of COLOURS) {
      const raw = cs.getPropertyValue(`--${k}`).trim()
      probe.style.color = raw
      out[k] = raw.startsWith('#') ? raw : toHex(getComputedStyle(probe).color)
    }
    probe.remove()
    setValues(out)
  }, [])
  return (
    <div ref={ref} data-theme={theme} className="rounded-[4px] border border-line bg-bg p-4 text-fg sm:p-5">
      <p className="caps mb-4 text-[10px] tracking-[0.22em] text-muted">{theme}</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {COLOURS.map(([k, use]) => (
          <li key={k} className="flex items-center gap-3">
            <span className="size-10 shrink-0 rounded-[4px] border border-line" style={{ background: `var(--${k})` }} />
            <span className="min-w-0">
              <span className="block font-mono text-[12.5px]">--{k}</span>
              <span className="tnum block font-mono text-[11px] text-muted">{values[k] ?? '…'}</span>
              <span className="block truncate text-[12px] text-muted">{use}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Renders its children once per theme, side by side. */
function Both({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {(['dark', 'light'] as const).map((t) => (
        <div key={t} data-theme={t} className={cx('relative min-w-0 rounded-[4px] border border-line bg-bg p-5 text-fg', className)}>
          <span className="caps absolute top-2 right-3 text-[9px] tracking-[0.2em] text-muted">{t}</span>
          {children}
        </div>
      ))}
    </div>
  )
}

function Section({ id, title, children, note }: { id: string; title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-6 border-t-2 border-rule pt-8">
      <h2 id={`${id}-h`} className="font-serif text-[28px] leading-none tracking-[-0.01em]">
        {title}
      </h2>
      {note && <div className="mt-3 max-w-[720px] text-[14px] leading-relaxed text-muted">{note}</div>}
      <div className="mt-7 space-y-8">{children}</div>
    </section>
  )
}

function Item({ name, usage, children }: { name: string; usage: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="font-mono text-[14px]">{name}</h3>
        <p className="text-[13px] text-muted">{usage}</p>
      </div>
      {children}
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid items-center gap-x-4 gap-y-2 py-2 sm:grid-cols-[92px_1fr]">
      <span className="caps text-[9.5px] tracking-[0.2em] text-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const TYPE: Array<{ cls: string; label: string; sample: string }> = [
  { cls: 'font-serif text-[36px] leading-none', label: 'Serif 36 / 400 · page title', sample: 'Renewals' },
  { cls: 'font-serif text-[34px] leading-none', label: 'Serif 34 / 400 · app title', sample: 'Customer health' },
  { cls: 'font-serif text-[30px] leading-none', label: 'Serif 30 / 400 · drawer title', sample: 'Fenwick Legal' },
  { cls: 'font-serif text-[25px] leading-none', label: 'Serif 25 / 400 · panel title', sample: 'Watchlist' },
  { cls: 'font-serif text-[20px] leading-none', label: 'Serif 20 / 400 · list title', sample: 'Low adoption' },
  { cls: 'tnum font-mono text-[56px] leading-none font-light', label: 'Mono 56 / 300 · score', sample: '54' },
  { cls: 'tnum font-mono text-[50px] leading-none tracking-[-0.02em]', label: 'Mono 50 / 400 · KPI', sample: '$6.7M' },
  { cls: 'tnum font-mono text-[34px] leading-none tracking-[-0.02em]', label: 'Mono 34 / 400 · small KPI', sample: '$8.4M' },
  { cls: 'tnum font-mono text-[14.5px]', label: 'Mono 14.5 / 400 · table cells', sample: '$720k   22   −37   31%' },
  { cls: 'tnum font-mono text-[12.5px]', label: 'Mono 12.5 / 400 · deltas', sample: '+621k vs. 4 weeks ago' },
  { cls: 'text-[15px]', label: 'Inter 15 / 400 · tabs, names', sample: 'Combined · By segment' },
  { cls: 'text-[14px] font-medium', label: 'Inter 14 / 500 · emphasis', sample: 'Marlowe Capital' },
  { cls: 'text-[14px] leading-relaxed text-muted', label: 'Inter 14 / 400 · body', sample: 'Every number on the page is computed from one array.' },
  { cls: 'text-[12.5px] text-muted', label: 'Inter 12.5 / 400 · hints', sample: 'Share of purchased seats active in 30 days' },
  { cls: 'caps text-[12px]', label: 'Mono caps 12 · meta line', sample: '160 accounts / $26.6M ARR' },
  { cls: 'caps text-[11.5px]', label: 'Mono caps 11.5 · pills', sample: 'Template guide' },
  { cls: 'caps text-[11px]', label: 'Mono caps 11 · KPI label, nav', sample: 'ARR at risk' },
  { cls: 'caps text-[10.5px] tracking-[0.24em]', label: 'Mono caps 10.5 · column headers', sample: 'Drawdown' },
  { cls: 'caps text-[10px] tracking-[0.22em]', label: 'Mono caps 10 · field labels', sample: 'Last touch' },
]

const SPACE = [4, 8, 12, 16, 20, 24, 28, 32, 40, 46, 58]

const MOTION = [
  { name: '--dur-fast', value: '150ms', use: 'Hover colour, row highlight' },
  { name: '--dur-base', value: '250ms', use: 'Tabs dot, scrim, fields' },
  { name: '--dur-slow', value: '600ms', use: 'Rise / fade entrances, height' },
  { name: '--ease-out', value: 'cubic-bezier(.2,.7,.2,1)', use: 'Default: entrances, glides' },
  { name: '--ease-spring', value: 'cubic-bezier(.3,1.4,.5,1)', use: 'Bubble pop, small overshoot' },
  { name: '--ease-draw', value: 'cubic-bezier(.3,.6,.2,1)', use: 'Lines drawing in' },
]

function Replay({ label, children }: { label: string; children: (key: number) => ReactNode }) {
  const [k, setK] = useState(0)
  return (
    <div className="flex flex-col items-start gap-3 rounded-[4px] border border-line p-4">
      <div className="flex w-full items-center justify-between gap-3">
        <span className="font-mono text-[12.5px]">{label}</span>
        <Pill size="sm" variant="ghost" icon={<RotateCw strokeWidth={1.75} />} onClick={() => setK((n) => n + 1)} aria-label={`Replay ${label}`}>
          Replay
        </Pill>
      </div>
      <div className="grid h-16 w-full place-items-center">{children(k)}</div>
    </div>
  )
}

const demoRows = accounts.slice(0, 5)
const demoCols: Column<(typeof accounts)[number]>[] = [
  { key: 'name', label: 'Account', width: 'minmax(160px,1fr)', sort: (a) => a.name, cellClass: 'font-sans', cell: (a) => a.name },
  { key: 'arr', label: 'ARR', align: 'right', width: '80px', sort: (a) => a.arr, cell: (a) => money(a.arr) },
  { key: 'health', label: 'Health', align: 'right', width: '80px', sort: current, cell: (a) => current(a) },
  { key: 'trend', label: '13 wks', align: 'right', width: '140px', cell: (a) => <Sparkline values={series(a).slice(-14)} width={120} height={24} windowStart={9} className="ml-auto" /> },
]

export function StyleGuide() {
  const toast = useToast()
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [tab, setTab] = useState<'Combined' | 'By segment'>('Combined')
  const [range, setRange] = useState<4 | 8 | 13>(4)
  const [check, setCheck] = useState(true)
  const [sw, setSw] = useState(true)
  const [slider, setSlider] = useState(40)
  const [loading, setLoading] = useState(false)
  const fenwick = accounts.find((a) => a.name === 'Fenwick Legal')!

  return (
    <>
      <PageHeader
        eyebrow="Design system"
        title="Style guide"
        lede="Tokens and components, rendered live by the same code the dashboard uses. Hover, focus and press anything; forced states are shown with data-force."
      />

      <nav aria-label="Style guide sections" className="mt-6 flex flex-wrap gap-x-5 gap-y-1">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="caps inline-flex min-h-10 items-center text-[10.5px] tracking-[0.2em] text-muted transition-colors hover:text-fg sm:min-h-8">
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-16">
        <Section id="colour" title="Colour" note={<>Raw values live on <code className="font-mono text-fg">:root</code> (dark) and <code className="font-mono text-fg">[data-theme=light]</code>; Tailwind utilities (<code className="font-mono text-fg">bg-panel</code>, <code className="font-mono text-fg">text-muted</code>…) point at them. Values below are read from the CSS at runtime.</>}>
          <div className="grid gap-3 lg:grid-cols-2">
            <Swatches theme="dark" />
            <Swatches theme="light" />
          </div>
          <Item name="Health scale" usage="--risk → --mid → --high, mixed in oklab by healthFill(score). Used by the swarm, heatmap, bars and dots.">
            <Both>
              <div className="flex flex-wrap items-center gap-1">
                {Array.from({ length: 21 }, (_, i) => (
                  <HealthDot key={i} score={i * 5} size={18} />
                ))}
              </div>
              <div className="tnum mt-2 flex justify-between font-mono text-[11px] text-muted">
                <span>0</span>
                <span>37</span>
                <span>67</span>
                <span>94</span>
                <span>100</span>
              </div>
            </Both>
          </Item>
        </Section>

        <Section id="type" title="Type" note="Newsreader for titles, IBM Plex Mono for every number and the tracked caps labels (.caps, 0.26em), Inter for text. Numbers use tabular figures (.tnum).">
          <ul className="border-t border-line">
            {TYPE.map((t) => (
              <li key={t.label} className="grid items-baseline gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[260px_1fr]">
                <span className="font-mono text-[11.5px] text-muted">{t.label}</span>
                <span className={cx('min-w-0 truncate', t.cls)}>{t.sample}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="space" title="Spacing" note="Tailwind's 4px scale, plus a few measured gaps from the reference (26, 42, 46, 58px). Content is max 1304px wide with 16px (mobile) or 32px gutters; panels pad 20/36px.">
          <ul className="space-y-2">
            {SPACE.map((s) => (
              <li key={s} className="flex items-center gap-4">
                <span className="tnum w-12 text-right font-mono text-[12px] text-muted">{s}px</span>
                <span className="h-3 origin-left animate-grow-x rounded-[2px] bg-risk/80" style={{ width: s * 4 }} />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="radii" title="Radii & elevation" note="The system is flat: rules and hairlines do the structuring. Shadows are reserved for things floating above the page.">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ['2px', 'Panels, cells', 'rounded-[2px]'],
              ['3px', 'Row highlight', 'rounded-[3px]'],
              ['4px', '--radius-panel', 'rounded-panel'],
              ['6px', 'Tooltips, toasts', 'rounded-[6px]'],
              ['full', 'Pills, fields', 'rounded-full'],
              ['50%', 'Dots, avatars', 'rounded-full aspect-square'],
            ].map(([r, use, cls]) => (
              <div key={r} className="text-center">
                <div className={cx('mx-auto h-16 border border-fg/40 bg-panel', cls, r === '50%' ? 'w-16' : 'w-full')} />
                <p className="mt-2 font-mono text-[12px]">{r}</p>
                <p className="text-[12px] text-muted">{use}</p>
              </div>
            ))}
          </div>
          <Both>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['none', 'Page, panels', ''],
                ['shadow-soft', 'Hover lift (spare)', 'shadow-soft'],
                ['shadow-pop', 'Drawer, modal, tooltip', 'shadow-pop'],
              ].map(([n, use, cls]) => (
                <div key={n} className={cx('rounded-[6px] border border-line bg-raised p-4', cls)}>
                  <p className="font-mono text-[12px]">{n}</p>
                  <p className="text-[12px] text-muted">{use}</p>
                </div>
              ))}
            </div>
          </Both>
        </Section>

        <Section id="motion" title="Motion" note="Short and quiet: things rise 10px and fade in, lines draw from the left, bars grow from their base. Everything collapses to instant under prefers-reduced-motion.">
          <ul className="border-t border-line">
            {MOTION.map((m) => (
              <li key={m.name} className="grid gap-x-6 border-b border-line py-3 sm:grid-cols-[160px_220px_1fr]">
                <span className="font-mono text-[12.5px]">{m.name}</span>
                <span className="font-mono text-[12.5px] text-muted">{m.value}</span>
                <span className="text-[13px] text-muted">{m.use}</span>
              </li>
            ))}
          </ul>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Replay label="animate-rise · 700ms">{(k) => <span key={k} className="block h-8 w-28 animate-rise rounded-[3px] bg-fg/80" />}</Replay>
            <Replay label="animate-fade · 600ms">{(k) => <span key={k} className="block h-8 w-28 animate-fade rounded-[3px] bg-fg/80" />}</Replay>
            <Replay label="animate-draw · 1.1s">{(k) => <Sparkline key={k} values={fenwick.history} width={180} height={40} dotRadius={3} />}</Replay>
            <Replay label="animate-grow · 700ms">
              {(k) => (
                <span key={k} className="flex h-12 items-end gap-1">
                  {[30, 55, 40, 70, 90, 60].map((h, i) => (
                    <span key={i} className="block w-4 origin-bottom animate-grow rounded-t-[2px] bg-mid" style={{ height: `${h}%`, animationDelay: `${i * 40}ms` }} />
                  ))}
                </span>
              )}
            </Replay>
            <Replay label="KPI tween · 900ms">{(k) => <Kpi key={k} label="ARR at risk" value={6_700_000} format={money} note="count-up" size="sm" className="!py-0" />}</Replay>
            <Replay label="animate-shimmer · loading">{(k) => <Skeleton key={k} className="h-3 w-40" />}</Replay>
          </div>
        </Section>

        <Section id="buttons" title="Pill" note="The only button. Mono caps, fully rounded. Outline for secondary actions, solid for the primary action on a surface (one per surface), ghost for tertiary, danger for destructive. pillClass() styles links the same way.">
          <Both>
            {(['outline', 'solid', 'ghost', 'danger'] as const).map((v) => (
              <Row key={v} label={v}>
                <Pill variant={v}>Default</Pill>
                <Pill variant={v} data-force="hover">
                  Hover
                </Pill>
                <Pill variant={v} data-force="focus">
                  Focus
                </Pill>
                <Pill variant={v} data-force="active">
                  Active
                </Pill>
                <Pill variant={v} disabled>
                  Disabled
                </Pill>
                <Pill variant={v} loading>
                  Loading
                </Pill>
              </Row>
            ))}
            <Row label="sizes">
              <Pill size="sm" icon={<PhoneCall strokeWidth={1.75} />}>
                Small
              </Pill>
              <Pill size="md" icon={<Download strokeWidth={1.75} />}>
                Medium
              </Pill>
              <Pill variant="solid" icon={<Sun strokeWidth={1.75} />}>
                Light
              </Pill>
              <Link to="/styleguide#buttons" className={pillClass('ghost', 'md')}>
                <span className="-mr-[0.26em]">As a link</span>
              </Link>
            </Row>
            <Row label="try it">
              <Pill
                variant="solid"
                loading={loading}
                onClick={() => {
                  setLoading(true)
                  window.setTimeout(() => {
                    setLoading(false)
                    toast.show({ tone: 'success', title: 'Saved', body: 'The loading state lasted 1.2 s.' })
                  }, 1200)
                }}
              >
                {loading ? 'Saving' : 'Save'}
              </Pill>
            </Row>
          </Both>
        </Section>

        <Section id="tabs" title="TextTabs" note="Text-only tabs with a dot under the active option. Arrow keys move between options. 'text' for chart controls, 'caps' for compact controls like the date range.">
          <Both>
            <Row label="text">
              <TextTabs label="Layout demo" options={['Combined', 'By segment'] as const} value={tab} onChange={setTab} separator="·" />
            </Row>
            <Row label="no separator">
              <TextTabs label="Segment demo" options={['All', 'Enterprise', 'SMB'] as const} value="All" onChange={() => {}} />
            </Row>
            <Row label="caps">
              <TextTabs label="Range demo" variant="caps" options={[4, 8, 13] as const} value={range} onChange={setRange} format={(r) => `${r}W`} />
            </Row>
          </Both>
        </Section>

        <Section id="fields" title="Fields" note="Hairline fields, fully rounded like the pills. Labels are mono caps above the field, or visually hidden in toolbars. Errors turn the hairline orange and are announced.">
          <Both>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput label="Default" placeholder="Account name" />
              <TextInput label="Hover" placeholder="Account name" data-force="hover" />
              <TextInput label="Focus" defaultValue="Fenwick" data-force="focus" />
              <TextInput label="Error" defaultValue="F" error="Use at least 2 characters." />
              <TextInput label="Disabled" placeholder="Read only" disabled />
              <TextInput label="Search" search placeholder="Search by account or owner" />
              <Select label="Select" options={['All segments', 'Enterprise', 'Mid-Market', 'SMB']} />
              <Select label="Select · disabled" options={['Any owner']} disabled />
              <TextArea label="Text area" placeholder="Add a note…" className="sm:col-span-2" rows={2} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Checkbox label="Checked" checked={check} onChange={() => setCheck((c) => !c)} />
              <Checkbox label="Checklist (strike)" strike checked description="With a description line" onChange={() => {}} />
              <Checkbox label="Disabled" checked={false} disabled onChange={() => {}} />
              <Checkbox label="Disabled, checked" checked disabled onChange={() => {}} />
              <span className="flex items-center gap-3 text-[14px]">
                <Switch checked={sw} onChange={setSw} label="Demo switch" /> Switch {sw ? 'on' : 'off'}
              </span>
              <span className="flex items-center gap-3 text-[14px] text-muted">
                <Switch checked={false} onChange={() => {}} label="Disabled switch" disabled /> Disabled
              </span>
            </div>
            <Slider className="mt-6" label="Slider" value={slider} onChange={setSlider} min={10} max={90} display={slider} />
          </Both>
        </Section>

        <Section id="data" title="Data display" note="Small pieces that carry the numbers: KPIs, stats, tags, dots, avatars, key caps, progress.">
          <Both>
            <div className="grid grid-cols-2 border-y-2 border-rule">
              <Kpi label="ARR at risk" value={6_700_000} format={money} note="+621k vs. 4 weeks ago" alert className="border-r border-line py-6 sm:!py-6" />
              <Kpi label="Median health" value={88} format={(n) => String(Math.round(n))} note="+1 vs. 4 weeks ago" size="sm" />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
              <Stat label="ARR">$720k</Stat>
              <Stat label="Last touch" alert>
                47 days ago
              </Stat>
            </dl>
            <Row label="tags">
              <SegmentTag>Enterprise</SegmentTag>
              <StatusTag status="At risk" />
              <StatusTag status="Watch" />
              <StatusTag status="Healthy" />
            </Row>
            <Row label="avatar, kbd">
              <Avatar name="Priya Raman" />
              <Avatar name="Marcus Lee" size={36} />
              <Kbd>g</Kbd>
              <Kbd>a</Kbd>
              <Kbd>?</Kbd>
              <Kbd>Esc</Kbd>
            </Row>
            <div className="mt-2 grid gap-3">
              <Progress value={0} label="Empty" />
              <Progress value={0.4} label="40%" />
              <Progress value={0.3} label="Alert" alert />
              <Progress value={1} label="Done" />
            </div>
          </Both>
        </Section>

        <Section id="charts" title="Charts" note="Sparkline for rows (fixed size, end dot in --risk, selected range drawn at full strength). WeeklyChart for detail pages: responsive, hover or arrow keys to read a week.">
          <Both>
            <Row label="sparkline">
              <Sparkline values={fenwick.history} width={132} height={24} />
              <Sparkline values={series(fenwick).slice(-14)} width={132} height={24} windowStart={9} />
              <Sparkline values={series(fenwick).slice(-14)} width={200} height={60} area threshold={40} domain={[0, 100]} dotRadius={3} windowStart={5} />
            </Row>
            <div className="mt-4">
              <WeeklyChart kind="line" label="Demo line chart" values={series(fenwick)} domain={[0, 100]} threshold={40} range={8} height={180} />
            </div>
            <div className="mt-4">
              <WeeklyChart kind="bars" label="Demo bar chart" values={series(fenwick).map((v) => Math.round(v * 2.4))} reference={{ value: 220, label: '220 seats' }} range={4} height={160} />
            </div>
          </Both>
        </Section>

        <Section id="table" title="DataTable" note="The watchlist table: caps headers sort on click (arrow shows direction), mono tabular cells on hairlines, rows glide when re-sorted and open on click, Enter or Space. Empty state slot for no results.">
          <Both>
            <DataTable label="Demo table" columns={demoCols} rows={demoRows} rowKey={(a) => a.id} onRowClick={(a) => toast.show({ tone: 'info', title: `Row: ${a.name}` })} defaultSort={{ key: 'arr', dir: -1 }} minWidth={480} enterDelay={0} />
            <div className="mt-6">
              <DataTable label="Empty demo table" columns={demoCols} rows={[]} rowKey={(a) => a.id} minWidth={480} empty={<EmptyState title="No accounts match">Try a shorter search.</EmptyState>} />
            </div>
          </Both>
        </Section>

        <Section id="feedback" title="Feedback" note="Toasts confirm actions (with Undo when it is cheap to offer). Skeletons hold the shape while loading; EmptyState covers no-results and errors.">
          <Both>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToastCard toast={{ tone: 'success', title: 'Touch logged', body: 'Fenwick Legal · last touch is now today', action: { label: 'Undo', run: () => {} } }} onClose={() => {}} />
              <ToastCard toast={{ tone: 'info', title: 'Comparing with 8 weeks ago' }} onClose={() => {}} />
              <ToastCard toast={{ tone: 'error', title: 'Could not copy', body: 'The browser blocked clipboard access.' }} onClose={() => {}} />
            </div>
            <Row label="fire one">
              <Pill size="sm" onClick={() => toast.show({ tone: 'success', title: 'Saved', body: 'A success toast' })}>
                Success
              </Pill>
              <Pill size="sm" onClick={() => toast.show({ tone: 'info', title: 'Heads up', body: 'An info toast' })}>
                Info
              </Pill>
              <Pill size="sm" variant="danger" onClick={() => toast.show({ tone: 'error', title: 'Something failed', body: 'An error toast' })}>
                Error
              </Pill>
            </Row>
            <Row label="loading">
              <Spinner label="Loading" />
              <div className="flex flex-1 items-center gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2.5 w-3/4" />
                </div>
              </div>
            </Row>
            <div className="grid gap-3 sm:grid-cols-2">
              <EmptyState title="Nothing on the watchlist" className="py-6">
                Drag the threshold to widen it.
              </EmptyState>
              <EmptyState tone="error" title="Couldn’t load contacts" action={<Pill size="sm" icon={<RotateCw strokeWidth={1.75} />}>Retry</Pill>} className="py-6">
                The server answered 500.
              </EmptyState>
            </div>
          </Both>
        </Section>

        <Section id="overlays" title="Overlays" note="Overlay is the one modal / drawer: scrim, spring entrance, focus trapped inside, Esc or the scrim closes it, focus returns to the trigger. Popover is the small anchored panel for menus.">
          <Both>
            <Row label="open">
              <Pill onClick={() => setModal(true)}>Open modal</Pill>
              <Pill onClick={() => setDrawer(true)}>Open drawer</Pill>
              <Popover
                label="Demo popover"
                align="left"
                trigger={(p) => (
                  <button type="button" {...p} className={pillClass('ghost')}>
                    <Columns3 className="size-3.5" strokeWidth={1.75} />
                    <span className="-mr-[0.26em]">Popover</span>
                  </button>
                )}
              >
                <p className="caps mb-3 text-[10px] tracking-[0.22em] text-muted">Show columns</p>
                <div className="space-y-2.5">
                  <Checkbox label="ARR" checked onChange={() => {}} />
                  <Checkbox label="Health" checked={false} onChange={() => {}} />
                </div>
              </Popover>
            </Row>
            <div className="mt-3 rounded-[6px] border border-line bg-raised px-3.5 py-3 shadow-pop">
              <span className="text-[14px] font-medium">Tooltip surface</span>
              <SegmentTag className="mt-0.5 block">Enterprise</SegmentTag>
            </div>
          </Both>
          <Overlay open={modal} onClose={() => setModal(false)} label="Demo modal" kind="modal" className="max-w-[440px]">
            <div className="px-6 pt-8 pb-8 sm:px-9">
              <p className="caps text-[10.5px] text-muted">Modal</p>
              <h2 className="mt-2 font-serif text-[26px]">A centred card</h2>
              <p className="mt-3 text-[14px] text-muted">Tab cycles inside. Esc closes and focus goes back to the button you pressed.</p>
              <div className="mt-6 flex gap-3">
                <Pill variant="solid" onClick={() => setModal(false)}>
                  Done
                </Pill>
                <Pill variant="ghost" onClick={() => setModal(false)}>
                  Cancel
                </Pill>
              </div>
            </div>
          </Overlay>
          <Overlay open={drawer} onClose={() => setDrawer(false)} label="Demo drawer" kind="drawer">
            <div className="px-6 pt-8 pb-8 sm:px-8">
              <p className="caps text-[10.5px] text-muted">Drawer</p>
              <h2 className="mt-2 font-serif text-[30px]">From the right</h2>
              <p className="mt-3 text-[14px] text-muted">Used for the account summary on the overview.</p>
              <Pill className="mt-6" onClick={() => setDrawer(false)}>
                Close
              </Pill>
            </div>
          </Overlay>
        </Section>

        <Section id="layout" title="Layout" note="Panel is the raised section with a serif title; PageHeader opens every page under the app header with a heavy rule.">
          <Both>
            <PageHeader eyebrow="Eyebrow" title="Page title" lede="A one-line lede in muted Inter." actions={<Pill size="sm">Action</Pill>} className="!animate-none" />
            <Panel title="Panel title" meta="12 accounts" className="mt-5 !px-5 !pt-6">
              <p className="mt-4 text-[14px] text-muted">Panel content sits on --panel.</p>
            </Panel>
          </Both>
        </Section>
      </div>
    </>
  )
}
