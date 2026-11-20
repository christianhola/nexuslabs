import { useState } from 'react'
import type { ReactNode } from 'react'
import { Bell, Inbox, Play, Plus, Settings } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { AiPanel } from '../components/AiPanel'
import { Badge } from '../components/Badge'
import type { Tone } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import type { ButtonVariant, Force } from '../components/Button'
import { Card, CardHeader } from '../components/Card'
import { CodeEditor } from '../components/CodeEditor'
import { Container } from '../components/Container'
import { Drawer } from '../components/Drawer'
import { Checkbox, Input, MiniSelect, Select, Switch, Textarea } from '../components/Field'
import { FingerprintBadge, SparkBadge } from '../components/HeroGlyphs'
import { Logo } from '../components/Logo'
import { Avatar, CountUp, EmptyState, Kbd, Notice, Skeleton } from '../components/Misc'
import { Window } from '../components/Mocks'
import { Modal } from '../components/Modal'
import { PageIntro } from '../components/PageIntro'
import { Meter, ScorePill, ScoreRing } from '../components/Score'
import { Tabs } from '../components/Tabs'
import { ConsoleOutput, TestResults } from '../components/TestResults'
import { useToast } from '../components/Toast'
import { getProblem } from '../data'
import type { RunResult } from '../lib/runner'
import type { AiTurn } from '../lib/store'

/* Every token and component, rendered by the real code. Tokens mirror src/styles.css. */

const COLOURS = [
  ['bg', '#050b0d', 'Page'],
  ['surface', '#0a1315', 'Cards'],
  ['surface-2', '#0e1a1d', 'Raised rows'],
  ['raised', '#142427', 'Selected tab'],
  ['fg', '#edf4f1', 'Text'],
  ['muted', '#9fb1ad', 'Secondary text'],
  ['faint', '#7c8f8b', 'Hints, captions'],
  ['brand', '#1fdc8a', 'Fills, glows'],
  ['brand-text', '#45e8a0', 'Mint text on dark'],
  ['brand-deep', '#0b7a4b', 'Pressed'],
  ['on-brand', '#03160d', 'Text on mint'],
  ['amber', '#f4bd5a', 'Warnings, medium'],
  ['danger', '#ff7a7a', 'Errors text'],
  ['danger-fill', '#c4363d', 'Destructive fills'],
  ['info', '#7cc4ff', 'Information'],
  ['syn-kw', '#c79bff', 'Keywords'],
] as const

const TYPE = [
  ['Display', 'text-[76px] leading-[1.02] tracking-[-0.035em] text-stage', '76 / Jost 400'],
  ['Script', 'font-script text-[64px] leading-none text-white', '64 / Caveat 500'],
  ['Heading 1', 'text-[56px] leading-[1.05] tracking-[-0.03em]', '56 / Jost 400'],
  ['Heading 2', 'text-[48px] leading-[1.08] tracking-[-0.025em]', '48 / Jost 400'],
  ['Heading 3', 'text-[28px] leading-tight tracking-[-0.02em]', '28 / Jost 400'],
  ['Title', 'text-[19px] font-medium', '19 / Jost 500'],
  ['Body', 'text-[17px] leading-relaxed text-muted', '17 / Jost 400'],
  ['Small', 'text-[14.5px] text-muted', '14.5 / Jost 400'],
  ['Caption', 'text-[13px] text-faint', '13 / Jost 400'],
  ['Code', 'font-mono text-[13.5px]', '13.5 / JetBrains Mono'],
] as const

const SPACE = [4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 128]
const RADII = [
  ['control', 12],
  ['control-lg', 14],
  ['card-sm', 16],
  ['window', 18],
  ['card', 22],
] as const
const SHADOWS = [
  ['float', 'shadow-float'],
  ['glow', 'shadow-glow'],
  ['cta', 'shadow-cta'],
] as const
const MOTION = [
  ['pop', 'animate-pop', '320 ms, ease-out'],
  ['rise', 'animate-rise', '700 ms, ease-out'],
  ['twinkle', 'animate-twinkle', '3.6 s loop'],
  ['glow', 'animate-glow', '4 s loop'],
  ['caret', 'animate-caret', '1.1 s steps'],
  ['shimmer', 'skeleton', '1.6 s loop'],
] as const

const VARIANTS: ButtonVariant[] = ['primary', 'dark', 'secondary', 'ghost', 'danger']
const STATES: { label: string; force?: Force; disabled?: boolean; loading?: boolean }[] = [{ label: 'Default' }, { label: 'Hover', force: 'hover' }, { label: 'Focus', force: 'focus' }, { label: 'Pressed', force: 'pressed' }, { label: 'Disabled', disabled: true }, { label: 'Loading', loading: true }]
const TONES: Tone[] = ['neutral', 'brand', 'amber', 'danger', 'info']

const SAMPLE_RUN: RunResult = {
  ms: 18,
  logs: ['sorted [[1,3],[2,6],[8,10],[15,18]]', 'merged 3 windows'],
  results: [
    { id: 't1', label: 'Overlapping pairs', hidden: false, pass: true, expected: '[[1,6],[8,10],[15,18]]', got: '[[1,6],[8,10],[15,18]]', ms: 0.12 },
    { id: 't2', label: 'Touching windows', hidden: false, pass: false, expected: '[[1,5]]', got: '[[1,4],[4,5]]', ms: 0.04 },
    { id: 't3', label: 'Empty input', hidden: false, pass: true, expected: '[]', got: '[]', ms: 0.01 },
    { id: 'h1', label: 'Hidden', hidden: true, pass: true, expected: '', ms: 0 },
  ],
}
const ERROR_RUN: RunResult = { ...SAMPLE_RUN, error: 'TypeError: Cannot read properties of undefined (reading "0")', results: SAMPLE_RUN.results.map((r) => ({ ...r, pass: false })) }

function Section({ id, title, children, sub }: { id: string; title: string; sub?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-white/7 py-14">
      <h2 id={`${id}-h`} className="text-[26px] font-normal tracking-[-0.02em]">
        {title}
      </h2>
      {sub && <p className="mt-1 text-[15px] text-muted">{sub}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid items-center gap-3 border-b border-white/5 py-4 last:border-0 md:grid-cols-[140px_1fr]">
      <p className="text-[13.5px] text-faint">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export function Styleguide() {
  const [replay, setReplay] = useState(0)
  const [tab, setTab] = useState<'a' | 'b' | 'c'>('a')
  const [check, setCheck] = useState(true)
  const [sw, setSw] = useState(true)
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [code, setCode] = useState(getProblem('merge-windows').solution)
  const [log, setLog] = useState<AiTurn[]>([])
  const toast = useToast()

  const nav = ['colours', 'type', 'space', 'radii', 'shadows', 'motion', 'buttons', 'forms', 'feedback', 'data', 'product', 'overlays']

  return (
    <>
      <PageIntro eyebrow="Design system" title="Codetrial style guide" sub="Tokens and components as the product renders them. Hover, focus and pressed states are pinned with data-force on the real components." />
      <Container className="pb-24">
        <nav aria-label="Style guide sections" className="flex flex-wrap gap-2">
          {nav.map((n) => (
            <a key={n} href={`#${n}`} className="inline-flex h-10 items-center rounded-[10px] bg-white/5 px-3 text-[14px] text-muted capitalize hover:bg-white/8 hover:text-fg sm:h-8">
              {n}
            </a>
          ))}
        </nav>

        <Section id="colours" title="Colour" sub="Text-bearing tokens pass WCAG AA on bg and surface. Brand is for fills and large display type.">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {COLOURS.map(([name, hex, use]) => (
              <li key={name} className="overflow-hidden rounded-card-sm bg-surface ring-1 ring-inset ring-line">
                <div className="h-16" style={{ background: hex }} />
                <div className="p-3">
                  <p className="text-[13.5px] font-medium">{name}</p>
                  <p className="font-mono text-[12px] text-muted">{hex}</p>
                  <p className="mt-1 text-[12px] text-faint">{use}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="type" title="Type" sub="Jost for everything, Caveat for the one handwritten word, JetBrains Mono for code.">
          <div className="grid gap-5">
            {TYPE.map(([label, cls, spec]) => (
              <div key={label} className="grid items-baseline gap-2 overflow-hidden md:grid-cols-[160px_1fr]">
                <p className="text-[13px] text-faint">
                  {label}
                  <span className="block">{spec}</span>
                </p>
                <p className={`${cls} truncate`}>{label === 'Code' ? 'const merged = mergeWindows(input);' : label === 'Script' ? 'human' : 'Hire on evidence'}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="space" title="Spacing" sub="A 4 px base.">
          <div className="grid gap-2">
            {SPACE.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="w-12 text-right font-mono text-[12.5px] text-muted">{s}</span>
                <span className="h-3 rounded-[4px] bg-brand/70" style={{ width: s * 2 }} />
              </div>
            ))}
          </div>
        </Section>

        <Section id="radii" title="Radii" sub="Every corner is a squircle; circles use the round class.">
          <div className="flex flex-wrap gap-4">
            {RADII.map(([n, r]) => (
              <div key={n} className="text-center">
                <div className="size-24 bg-surface-2 ring-1 ring-inset ring-line-strong" style={{ borderRadius: r }} />
                <p className="mt-2 text-[13px]">{n}</p>
                <p className="font-mono text-[12px] text-faint">{r}px</p>
              </div>
            ))}
            <div className="text-center">
              <div className="round size-24 rounded-full bg-surface-2 ring-1 ring-inset ring-line-strong" />
              <p className="mt-2 text-[13px]">round</p>
              <p className="font-mono text-[12px] text-faint">full</p>
            </div>
          </div>
        </Section>

        <Section id="shadows" title="Shadows and depth">
          <div className="flex flex-wrap gap-6">
            {SHADOWS.map(([n, cls]) => (
              <div key={n} className={`grid h-28 w-44 place-items-center rounded-card bg-surface ${cls}`}>
                <span className="text-[14px] text-muted">{n}</span>
              </div>
            ))}
            <Card className="grid h-28 w-44 place-items-center">
              <span className="text-[14px] text-muted">depth edge</span>
            </Card>
          </div>
        </Section>

        <Section id="motion" title="Motion" sub="All motion stops under prefers-reduced-motion.">
          <Button variant="secondary" icon={<Play className="size-4" />} onClick={() => setReplay((r) => r + 1)}>
            Replay
          </Button>
          <div key={replay} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {MOTION.map(([n, cls, spec]) => (
              <div key={n} className="grid justify-items-center gap-3 rounded-card-sm bg-surface p-5 ring-1 ring-inset ring-line">
                <span className={`block size-10 rounded-[12px] bg-brand ${cls}`} />
                <p className="text-[13.5px]">{n}</p>
                <p className="text-[12px] text-faint">{spec}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="buttons" title="Buttons">
          {VARIANTS.map((v) => (
            <Row key={v} label={v}>
              {STATES.map((s) => (
                <Button key={s.label} variant={v} force={s.force} disabled={s.disabled} loading={s.loading}>
                  {s.label}
                </Button>
              ))}
            </Row>
          ))}
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
            <Button icon={<Plus className="size-4" />}>With icon</Button>
          </Row>
          <Row label="Icon button">
            <IconButton label="Settings">
              <Settings className="size-5" />
            </IconButton>
            <IconButton label="Notifications hover" force="hover">
              <Bell className="size-5" />
            </IconButton>
            <IconButton label="Notifications pressed" force="pressed">
              <Bell className="size-5" />
            </IconButton>
            <IconButton label="Disabled" disabled>
              <Bell className="size-5" />
            </IconButton>
          </Row>
        </Section>

        <Section id="forms" title="Form controls">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Input label="Default" placeholder="name@company.com" />
            <Input label="Hover" placeholder="Hover state" force="hover" />
            <Input label="Focus" placeholder="Focus state" force="focus" />
            <Input label="Error" defaultValue="not-an-email" error="Enter a valid email address." />
            <Input label="Disabled" placeholder="Not editable" disabled />
            <Input label="With hint" optional hint="We never share it." />
            <Select label="Select" defaultValue="60">
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </Select>
            <Select label="Select error" error="Choose your team size." defaultValue="">
              <option value="">Choose one</option>
            </Select>
            <Textarea label="Textarea" placeholder="Notes for the next round" />
          </div>
          <div className="mt-6 grid gap-2 md:grid-cols-2">
            <Checkbox label="Checked" checked={check} onChange={setCheck} />
            <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
            <Checkbox label="Hover" checked={false} onChange={() => {}} force="hover" />
            <Checkbox label="Error" checked={false} onChange={() => {}} error="Accept the terms to continue." />
            <Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />
          </div>
          <div className="mt-4 flex flex-wrap gap-6">
            <Switch label="Switch" checked={sw} onChange={setSw} />
            <Switch label="Off" checked={false} onChange={() => {}} />
            <Switch label="Disabled" checked disabled onChange={() => {}} />
            <MiniSelect label="Toolbar select" defaultValue="a">
              <option value="a">Toolbar select</option>
              <option value="b">Second</option>
            </MiniSelect>
          </div>
        </Section>

        <Section id="feedback" title="Feedback">
          <Row label="Badges">
            {TONES.map((t) => (
              <Badge key={t} tone={t}>
                {t}
              </Badge>
            ))}
            <Badge tone="brand" dot>
              With dot
            </Badge>
          </Row>
          <Row label="Notices">
            <Notice className="w-full max-w-md">Hidden tests run when you submit.</Notice>
            <Notice tone="error" title="Could not reach the server" className="w-full max-w-md">
              Check your connection and try again.
            </Notice>
          </Row>
          <Row label="Toast">
            <Button variant="secondary" onClick={() => toast('Report link copied.')}>
              Show a toast
            </Button>
          </Row>
          <Row label="Loading">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-24" />
          </Row>
          <Row label="Empty">
            <EmptyState className="w-full" icon={<Inbox className="size-5" />} title="No candidates match" body="Try a different stage or clear the search." action={<Button variant="secondary">Clear filters</Button>} />
          </Row>
        </Section>

        <Section id="data" title="Data display">
          <Row label="Score ring">
            <ScoreRing score={94} />
            <ScoreRing score={67} />
            <ScoreRing score={41} />
            <ScoreRing score={null} size={80} />
          </Row>
          <Row label="Meters">
            <div className="grid w-full max-w-md gap-4">
              <Meter label="Correctness" value={100} />
              <Meter label="Efficiency" value={70} />
              <Meter label="Working with AI" value={48} />
            </div>
          </Row>
          <Row label="Score pill">
            <ScorePill score={92} />
            <ScorePill score={64} />
            <ScorePill score={null} />
          </Row>
          <Row label="Count up">
            <span className="text-[40px] text-mint">
              <CountUp value={4.1} decimals={1} suffix="M" />
            </span>
          </Row>
          <Row label="Avatar, kbd">
            <Avatar name="Amara Okafor" />
            <Avatar name="Lucas Ferreira" size={44} />
            <Kbd>Ctrl</Kbd>
            <Kbd>Enter</Kbd>
          </Row>
          <Row label="Tabs">
            <Tabs idBase="sg" panel={false} label="Example tabs" value={tab} onChange={setTab} items={[{ id: 'a', label: 'Screen' }, { id: 'b', label: 'Interview', count: 3 }, { id: 'c', label: 'Report' }]} />
          </Row>
          <Row label="Accordion">
            <div className="w-full max-w-xl">
              <Accordion items={[{ q: 'Can candidates use AI?', a: 'If you allow it, and every prompt is in the report.' }, { q: 'Which languages?', a: 'Over 40.' }]} />
            </div>
          </Row>
        </Section>

        <Section id="product" title="Product components">
          <Row label="Brand">
            <Logo />
            <FingerprintBadge className="size-16" />
            <SparkBadge className="size-14" />
          </Row>
          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            <Window title="CodeEditor">
              <CodeEditor label="Style guide editor" value={code} onChange={setCode} className="h-[320px]" minLines={14} />
            </Window>
            <Card className="h-[365px] overflow-hidden">
              <AiPanel problem={getProblem('merge-windows')} log={log} onAsk={(t) => setLog((l) => [...l, t])} className="h-full" />
            </Card>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Empty', <TestResults key="e" run={null} running={false} />],
              ['Running', <TestResults key="r" run={null} running />],
              ['Results', <TestResults key="s" run={SAMPLE_RUN} running={false} />],
              ['Error', <TestResults key="x" run={ERROR_RUN} running={false} />],
            ].map(([label, el]) => (
              <Card key={label as string} className="p-4">
                <CardHeader title={label as string} className="mb-3" />
                {el}
              </Card>
            ))}
          </div>
          <Card className="mt-5 p-4">
            <CardHeader title="Console" className="mb-3" />
            <ConsoleOutput run={SAMPLE_RUN} />
          </Card>
        </Section>

        <Section id="overlays" title="Overlays" sub="Focus is trapped inside, Escape closes, focus returns to the button that opened it.">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setModal(true)}>
              Open modal
            </Button>
            <Button variant="secondary" onClick={() => setDrawer(true)}>
              Open drawer
            </Button>
          </div>
          <Modal open={modal} onClose={() => setModal(false)} title="Submit your solution?" description="Hidden tests run when you submit, and you cannot edit afterwards.">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setModal(false)}>
                Keep working
              </Button>
              <Button onClick={() => setModal(false)}>Submit</Button>
            </div>
          </Modal>
          <Drawer open={drawer} onClose={() => setDrawer(false)} title="Question preview" footer={<Button className="w-full" onClick={() => setDrawer(false)}>Add to draft</Button>}>
            <p className="text-[15px] text-muted">Drawers hold previews and the mobile menu.</p>
          </Drawer>
        </Section>
      </Container>
    </>
  )
}
