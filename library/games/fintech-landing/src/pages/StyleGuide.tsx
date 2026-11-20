import { motion } from 'motion/react'
import { ArrowRight, Check, CreditCard as CardIcon, Inbox, Play, Plus, RotateCcw, Search, ShieldCheck, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { Avatar } from '../components/Avatar'
import { BalanceCard } from '../components/BalanceCard'
import { Badge } from '../components/Badge'
import { BillingToggle } from '../components/BillingToggle'
import { Button } from '../components/Button'
import type { ButtonSize, ButtonVariant } from '../components/Button'
import { Card } from '../components/Card'
import { CheckBadge } from '../components/CheckBadge'
import { Coin } from '../components/Coin'
import { CountUp } from '../components/CountUp'
import { CreditCard } from '../components/CreditCard'
import { EmptyState } from '../components/EmptyState'
import { Eyebrow } from '../components/Eyebrow'
import { Checkbox, Field, Input, Select, Textarea } from '../components/Field'
import { IconChip } from '../components/IconChip'
import { Logo, LogoMark } from '../components/Logo'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { PasswordInput } from '../components/PasswordInput'
import { PasswordStrength } from '../components/PasswordStrength'
import { PlanCard } from '../components/PlanCard'
import { coverFor, PostCard } from '../components/PostCard'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { SegmentedControl } from '../components/SegmentedControl'
import { Sheet } from '../components/Sheet'
import { Slider } from '../components/Slider'
import { Sparkline } from '../components/Sparkline'
import { Toggle } from '../components/Toggle'
import { hero, posts, pricing } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { colorTokens, ease, keyframes, motionTokens, radii, shadows, spacing, springs, typeScale } from '../lib/tokens'
import { useReducedMotion } from '../lib/useReducedMotion'

/*
  The living style guide at /styleguide. Everything here is rendered by the
  real components, so it cannot drift from the app. States that need a
  pointer or keyboard (hover, focus, pressed) are shown with the same classes
  the component applies, marked "simulated".
*/

const toc = [
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'space', label: 'Spacing & radii' },
  { id: 'elevation', label: 'Elevation' },
  { id: 'motion', label: 'Motion' },
  { id: 'button', label: 'Button' },
  { id: 'badge', label: 'Badge & Eyebrow' },
  { id: 'card', label: 'Card & IconChip' },
  { id: 'forms', label: 'Form fields' },
  { id: 'choice', label: 'Toggle, Segmented, Slider' },
  { id: 'feedback', label: 'Notice & EmptyState' },
  { id: 'disclosure', label: 'Accordion & Sheet' },
  { id: 'people', label: 'Avatar' },
  { id: 'data', label: 'CountUp & Sparkline' },
  { id: 'product', label: 'Product art' },
  { id: 'composites', label: 'Plan & Post cards' },
  { id: 'layout', label: 'Layout & brand' },
]

function Block({ id, title, usage, children }: { id: string; title: string; usage?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t border-white/[0.06] py-14 first:border-t-0 first:pt-0">
      <h2 id={`${id}-h`} className="font-display text-[30px] font-semibold tracking-[-0.035em]">
        {title}
      </h2>
      {usage ? <div className="mt-3 max-w-[680px] text-[15px] leading-relaxed text-muted [&_code]:rounded-[6px] [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_code]:text-soft">{usage}</div> : null}
      <div className="mt-8 flex flex-col gap-8">{children}</div>
    </section>
  )
}

function Specimen({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted">{label}</div>
      <div className={cx('depth relative flex flex-wrap items-center gap-4 rounded-card-sm bg-surface p-5 sm:p-6', className)}>{children}</div>
    </div>
  )
}

function StateCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {children}
      <span className="text-[12px] text-muted">{label}</span>
    </div>
  )
}

const variants: ButtonVariant[] = ['primary', 'dark', 'outline', 'light', 'ghost']
const sizes: ButtonSize[] = ['sm', 'md', 'lg']
const sim: Record<ButtonVariant, string> = {
  primary: '!bg-violet-hover',
  dark: '!bg-[#252527]',
  outline: '!bg-white/[0.07]',
  light: '!bg-[#ececf1]',
  ghost: '!text-white',
}
const focusSim = 'outline outline-2 outline-offset-2 outline-[rgb(109_85_255/0.8)]'

function MotionDemo() {
  const [run, setRun] = useState(0)
  const reduce = useReducedMotion()
  return (
    <Specimen label="Durations and curves (replay to compare)" className="flex-col items-stretch">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[14px] text-muted">{reduce ? 'Reduced motion is on: dots jump to the end.' : 'Each dot travels the same distance with its token.'}</p>
        <Button size="sm" variant="outline" onClick={() => setRun((r) => r + 1)}>
          <RotateCcw className="size-4" aria-hidden /> Replay
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {motionTokens.map((t) => (
          <div key={t.name} className="grid grid-cols-[96px_1fr] items-center gap-4 sm:grid-cols-[140px_1fr_220px]">
            <div className="leading-tight">
              <div className="text-[14px] font-medium">{t.name}</div>
              <div className="text-[12px] text-muted tabular">
                {t.duration * 1000}ms · {t.ease}
              </div>
            </div>
            <div className="relative h-8 rounded-full bg-white/[0.04] round">
              <motion.span
                key={run}
                className="absolute top-1 left-1 size-6 rounded-full bg-violet round"
                initial={{ left: '4px' }}
                animate={{ left: 'calc(100% - 28px)' }}
                transition={reduce ? { duration: 0 } : { duration: t.duration, ease: ease[t.ease] }}
              />
            </div>
            <div className="hidden text-[13px] text-muted sm:block">{t.use}</div>
          </div>
        ))}
      </div>
    </Specimen>
  )
}

function KeyframeDemo() {
  const [run, setRun] = useState(0)
  return (
    <Specimen label="Keyframe animations" className="flex-col items-stretch">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => setRun((r) => r + 1)}>
          <Play className="size-4" aria-hidden /> Restart
        </Button>
      </div>
      <div key={run} className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {keyframes.map((k) => (
          <div key={k.name} className="flex flex-col items-center gap-3 rounded-[16px] bg-white/[0.03] p-4 text-center">
            <div className="grid h-16 w-full place-items-center overflow-hidden">
              {k.name === 'marquee' ? (
                <div className="flex w-max animate-marquee gap-3 text-[13px] text-muted">
                  {Array.from({ length: 8 }, (_, i) => (
                    <span key={i}>Logo</span>
                  ))}
                </div>
              ) : k.name === 'sheen' ? (
                <div className="relative h-10 w-20 overflow-hidden rounded-[8px] bg-raised">
                  <div className="absolute inset-y-[-20%] left-0 w-[40%] animate-sheen bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
              ) : k.name === 'pulse-dot' ? (
                <span className="size-3 animate-pulse-dot rounded-full bg-up round" />
              ) : k.name === 'coin-spin' ? (
                <Coin size={56} thickness={12} segments={40} pose="rotateX(4deg) rotateY(-30deg)" />
              ) : (
                <span className={cx('size-8 rounded-[10px] bg-violet', k.cls)} />
              )}
            </div>
            <div className="leading-tight">
              <div className="text-[13px] font-medium">{k.name}</div>
              <div className="text-[12px] text-muted">{k.note}</div>
            </div>
          </div>
        ))}
      </div>
    </Specimen>
  )
}

function FormStates() {
  const [email, setEmail] = useState('maya@northwind')
  const [pw, setPw] = useState('Revio-2026')
  const [agree, setAgree] = useState(true)
  const [plain, setPlain] = useState(false)
  return (
    <>
      <Specimen label="Input states" className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Default" hint="Helper text sits under the field.">
          {(p) => <Input {...p} placeholder="you@company.com" />}
        </Field>
        <Field label="Focus (simulated)">
          {(p) => <Input {...p} defaultValue="hana@revio.example" className="!bg-white/[0.08] !ring-2 !ring-violet-text" />}
        </Field>
        <Field label="Error" error="Enter a valid email address, like you@company.com.">
          {(p) => <Input {...p} value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Field>
        <Field label="Disabled">
          {(p) => <Input {...p} disabled defaultValue="Locked by your admin" />}
        </Field>
        <Field label="Optional" optional>
          {(p) => <Input {...p} placeholder="Company" />}
        </Field>
        <Field label="Search">
          {(p) => <Input {...p} type="search" placeholder="Search articles" trailing={<Search className="mr-3 size-4 text-muted" aria-hidden />} />}
        </Field>
      </Specimen>
      <Specimen label="Select, Textarea, Checkbox" className="grid items-start gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Field label="Topic">
            {(p) => (
              <Select {...p} defaultValue="sales">
                <option value="sales">Sales and pricing</option>
                <option value="support">Help with my account</option>
              </Select>
            )}
          </Field>
          <Checkbox checked={agree} onChange={setAgree}>
            Checked (click to toggle)
          </Checkbox>
          <Checkbox checked={plain} onChange={setPlain}>
            Unchecked
          </Checkbox>
          <Checkbox checked={false} onChange={() => {}} error="Accept the terms to continue.">
            Error
          </Checkbox>
          <Checkbox checked onChange={() => {}} disabled>
            Disabled
          </Checkbox>
        </div>
        <Field label="Message" hint="At least 20 characters.">
          {(p) => <Textarea {...p} placeholder="Tell us about your team" />}
        </Field>
      </Specimen>
      <Specimen label="PasswordInput + PasswordStrength (type to try it)" className="flex-col items-stretch">
        <Field label="Password">{(p) => <PasswordInput {...p} value={pw} onChange={(e) => setPw(e.target.value)} />}</Field>
        <PasswordStrength password={pw} />
      </Specimen>
    </>
  )
}

function ChoiceStates() {
  const [on, setOn] = useState(true)
  const [seg, setSeg] = useState<'week' | 'month' | 'quarter'>('month')
  const [yearly, setYearly] = useState(false)
  const [val, setVal] = useState(7500)
  return (
    <>
      <Specimen label="Toggle: on, off, disabled">
        <StateCell label={on ? 'On' : 'Off'}>
          <Toggle checked={on} onChange={setOn} label="Demo toggle" />
        </StateCell>
        <StateCell label="Off">
          <Toggle checked={false} onChange={() => {}} label="Off example" />
        </StateCell>
        <StateCell label="Disabled">
          <Toggle checked onChange={() => {}} label="Disabled example" disabled />
        </StateCell>
      </Specimen>
      <Specimen label="SegmentedControl: md, sm, with badge (BillingToggle)">
        <SegmentedControl
          label="Period"
          value={seg}
          onChange={setSeg}
          options={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
          ]}
        />
        <SegmentedControl
          label="Period small"
          size="sm"
          value={seg}
          onChange={setSeg}
          options={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
          ]}
        />
        <BillingToggle yearly={yearly} onChange={setYearly} />
      </Specimen>
      <Specimen label="Slider: default and disabled" className="grid gap-8 sm:grid-cols-2">
        <Slider label="Monthly limit" min={500} max={20000} step={250} value={val} onChange={setVal} format={(n) => `$${n.toLocaleString('en-US')}`} hint="Arrow keys step by $250." />
        <Slider label="Disabled" min={0} max={100} value={40} onChange={() => {}} format={(n) => `${n}%`} disabled />
      </Specimen>
    </>
  )
}

function SheetDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} aria-haspopup="dialog">
        Open sheet
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Example sheet">
        <div className="flex flex-col gap-4 p-2">
          <p className="text-[15px] leading-relaxed text-muted">Focus is trapped here. Press Esc, click the backdrop or the close button; focus returns to “Open sheet”.</p>
          <Field label="Try tabbing">{(p) => <Input {...p} placeholder="First field" />}</Field>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </Sheet>
    </>
  )
}

function DataDemo() {
  const [n, setN] = useState(12099)
  const [key, setKey] = useState(0)
  return (
    <Specimen label="CountUp and Sparkline" className="items-end justify-between">
      <div>
        <CountUp value={n} decimals={2} prefix="$" className="font-display text-[40px] font-semibold tracking-[-0.04em] tabular" />
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setN((v) => Math.round(v * 1.18))}>
            <Plus className="size-4" aria-hidden /> Add 18%
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setN(12099)}>
            Reset
          </Button>
        </div>
      </div>
      <div className="flex items-end gap-3">
        <Sparkline key={key} points={hero.account.spark} width={160} height={60} className="h-[60px] w-[160px]" delay={0.1} />
        <Button size="sm" variant="outline" onClick={() => setKey((k) => k + 1)} aria-label="Replay sparkline">
          <RotateCcw className="size-4" aria-hidden />
        </Button>
      </div>
    </Specimen>
  )
}

function useActiveToc() {
  const [active, setActive] = useState(toc[0].id)
  useEffect(() => {
    const onScroll = () => {
      let cur = toc[0].id
      for (const t of toc) {
        const el = document.getElementById(t.id)
        if (el && el.getBoundingClientRect().top < 160) cur = t.id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}

export function StyleGuide() {
  const active = useActiveToc()
  const [frozen, setFrozen] = useState(false)
  const plan = pricing.plans[1]

  return (
    <>
      <PageHeader
        eyebrow="Design system"
        title="Revio style guide"
        body="Tokens and components, rendered live by the same code the site uses. Edit tokens in src/styles.css and components in src/components."
      />
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 pb-24 sm:px-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:px-[45px]">
        <nav aria-label="Style guide sections" className="hidden lg:block">
          <ul className="sticky top-[96px] flex flex-col gap-0.5 border-l border-white/[0.08]">
            {toc.map((t) => (
              <li key={t.id}>
                <Link
                  href={`#${t.id}`}
                  aria-current={active === t.id ? 'location' : undefined}
                  className={cx(
                    '-ml-px flex min-h-[34px] items-center border-l-2 pl-4 text-[14px] transition-colors',
                    active === t.id ? 'border-violet-text text-white' : 'border-transparent text-muted hover:text-white',
                  )}
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          {/* ---------------- Tokens ---------------- */}
          <Block id="colour" title="Colour" usage={<>Pure black canvas, white type and one violet accent. Use tokens as Tailwind classes: <code>bg-surface</code>, <code>text-muted</code>, <code>bg-violet</code>. Green means money in; coral means a limit or an error.</>}>
            {colorTokens.map((g) => (
              <div key={g.group}>
                <h3 className="mb-3 text-[14px] font-medium text-soft">{g.group}</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                  {g.items.map((c) => (
                    <div key={c.name} className="depth relative overflow-hidden rounded-card-sm bg-surface">
                      <div className="h-20 border-b border-white/[0.06]" style={{ background: c.hex }} />
                      <div className="p-3.5 leading-tight">
                        <div className="text-[14px] font-medium">{c.name}</div>
                        <div className="mt-1 font-mono text-[12px] text-muted uppercase">{c.hex}</div>
                        <div className="mt-1.5 text-[12px] text-muted">{c.use}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Block>

          <Block id="type" title="Type" usage={<>Inter Tight for display and numbers, Inter for everything else. Headings are tight (−3 to −4% tracking) and balanced; numbers use <code>tabular</code>.</>}>
            <div className="depth relative flex flex-col divide-y divide-white/[0.06] rounded-card-sm bg-surface">
              {typeScale.map((t) => (
                <div key={t.name} className="grid gap-2 p-5 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6">
                  <div className="leading-tight">
                    <div className="text-[14px] font-medium">{t.name}</div>
                    <div className="mt-1 text-[12px] text-muted">{t.spec}</div>
                  </div>
                  <div className={cx('min-w-0 break-words', t.cls, /^(Display|Stat)/.test(t.name) && 'max-sm:!text-[38px]')}>{t.sample}</div>
                </div>
              ))}
            </div>
          </Block>

          <Block id="space" title="Spacing & radii" usage={<>A 4px base. Sections use <code>py-20 sm:py-28</code> (Section), the page gutter is 16 / 32 / 45px (Container). Every rounded corner is a squircle via <code>corner-shape</code>; circles opt out with <code>.round</code>.</>}>
            <Specimen label="Spacing scale (px)" className="items-end">
              {spacing.map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div className="w-4 rounded-[3px] bg-violet" style={{ height: s }} />
                  <span className="text-[12px] text-muted tabular">{s}</span>
                </div>
              ))}
            </Specimen>
            <Specimen label="Radii">
              {radii.map((r) => (
                <div key={r.name} className="flex flex-col items-center gap-2">
                  <div className={cx('depth relative size-20 bg-surface-2', r.cls)} />
                  <span className="text-[12px] text-muted">
                    {r.name} · {r.value}
                  </span>
                </div>
              ))}
            </Specimen>
          </Block>

          <Block id="elevation" title="Elevation" usage={<>Surfaces separate by tone and a 1px inset edge (<code>depth</code> utility), not drop shadows. Real shadows are reserved for floating product art.</>}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {shadows.map((s) => (
                <div key={s.name} className="flex flex-col gap-3">
                  <div className={cx('relative h-24 rounded-card-sm', s.cls)} />
                  <div className="leading-tight">
                    <div className="text-[14px] font-medium">{s.name}</div>
                    <div className="mt-1 text-[12px] text-muted">{s.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block id="motion" title="Motion" usage={<>One house curve, <code>--ease-brand</code> (0.22, 1, 0.36, 1), for entrances; springs for things the user drags or toggles. Everything honours <code>prefers-reduced-motion</code>: CSS animations stop and motion values jump to their end.</>}>
            <MotionDemo />
            <Specimen label="Springs" className="grid gap-3 sm:grid-cols-3">
              {springs.map((s) => (
                <div key={s.name} className="leading-tight">
                  <div className="text-[14px] font-medium">{s.name}</div>
                  <div className="mt-1 text-[12px] text-muted">{s.config}</div>
                  <div className="mt-1 text-[12px] text-muted">{s.use}</div>
                </div>
              ))}
            </Specimen>
            <KeyframeDemo />
            <Specimen label="Reveal (scroll-in wrapper)">
              <Reveal key="r" className="flex gap-3">
                {[0, 1, 2].map((i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="grid size-16 place-items-center rounded-[16px] bg-white/[0.06] text-[13px] text-muted">{i + 1}</div>
                  </Reveal>
                ))}
              </Reveal>
              <p className="text-[13px] text-muted">Fades and rises 18px once in view; stagger with <code className="rounded-[6px] bg-white/[0.06] px-1.5">delay</code>.</p>
            </Specimen>
          </Block>

          {/* ---------------- Components ---------------- */}
          <Block id="button" title="Button" usage={<>The only button. <code>primary</code> for the one main action per view, <code>dark</code> in the nav, <code>outline</code> for secondary, <code>ghost</code> for tertiary text actions, <code>light</code> on dark imagery. Pass <code>href</code> to route; <code>loading</code> disables and shows a spinner.</>}>
            <Specimen label="Variants" >
              {variants.map((v) => (
                <Button key={v} variant={v}>
                  {v[0].toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </Specimen>
            <Specimen label="Sizes">
              {sizes.map((s) => (
                <Button key={s} size={s}>
                  Size {s}
                </Button>
              ))}
              <Button size="lg">
                With icon <ArrowRight className="size-[18px] transition-transform group-hover/button:translate-x-1" aria-hidden />
              </Button>
            </Specimen>
            {variants.map((v) => (
              <Specimen key={v} label={`${v} · states`}>
                <StateCell label="Default">
                  <Button variant={v}>Continue</Button>
                </StateCell>
                <StateCell label="Hover (simulated)">
                  <Button variant={v} className={sim[v]} tabIndex={-1}>
                    Continue
                  </Button>
                </StateCell>
                <StateCell label="Focus-visible (simulated)">
                  <Button variant={v} className={focusSim} tabIndex={-1}>
                    Continue
                  </Button>
                </StateCell>
                <StateCell label="Pressed (simulated)">
                  <Button variant={v} className="scale-[0.97]" tabIndex={-1}>
                    Continue
                  </Button>
                </StateCell>
                <StateCell label="Disabled">
                  <Button variant={v} disabled>
                    Continue
                  </Button>
                </StateCell>
                <StateCell label="Loading">
                  <Button variant={v} loading>
                    Saving
                  </Button>
                </StateCell>
              </Specimen>
            ))}
          </Block>

          <Block id="badge" title="Badge & Eyebrow" usage={<>Badges label state (plan flags, deltas, statuses, post tags). Eyebrow sits above every section heading. CheckBadge marks proof points.</>}>
            <Specimen label="Badge tones (md)">
              <Badge>Neutral</Badge>
              <Badge tone="violet">Most popular</Badge>
              <Badge tone="up">+2.09%</Badge>
              <Badge tone="down">Over limit</Badge>
              <Badge tone="info">Demo</Badge>
              <span className="rounded-[10px] bg-[linear-gradient(135deg,#6d55ff,#ff5a36)] p-2">
                <Badge tone="glass">Glass on imagery</Badge>
              </span>
            </Specimen>
            <Specimen label="Badge sizes and icon">
              <Badge size="sm">Small</Badge>
              <Badge>Medium</Badge>
              <Badge tone="up" icon={<Check className="size-3" aria-hidden />}>
                Paid
              </Badge>
            </Specimen>
            <Specimen label="Eyebrow, CheckBadge">
              <Eyebrow>Features</Eyebrow>
              <span className="flex items-center gap-2 text-[15px] text-soft">
                <CheckBadge /> SaaS website design template
              </span>
            </Specimen>
          </Block>

          <Block id="card" title="Card & IconChip" usage={<>Card is the bordered surface for tiles, panels and list rows. <code>interactive</code> adds the hover tone; <code>featured</code> is for one highlighted item per group. IconChip holds a lucide icon at 16/20/24px.</>}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(['surface', 'raised', 'featured', 'glass'] as const).map((v) => (
                <Card key={v} variant={v}>
                  <IconChip tone={v === 'featured' ? 'violet' : 'neutral'}>
                    <CardIcon />
                  </IconChip>
                  <div className="mt-6 font-display text-[20px] font-semibold tracking-[-0.03em]">{v}</div>
                  <p className="mt-1 text-[14px] text-muted">variant=&quot;{v}&quot;</p>
                </Card>
              ))}
            </div>
            <Specimen label="Interactive (hover me), radius card-sm, padding sizes" className="grid gap-4 sm:grid-cols-3">
              <Card interactive>Interactive</Card>
              <Card radius="card-sm" padding="sm">
                card-sm · sm
              </Card>
              <Card padding="lg">padding lg</Card>
            </Specimen>
            <Specimen label="IconChip tones and sizes">
              <IconChip size="sm">
                <Zap />
              </IconChip>
              <IconChip>
                <Zap />
              </IconChip>
              <IconChip size="lg">
                <Zap />
              </IconChip>
              <IconChip tone="violet">
                <ShieldCheck />
              </IconChip>
              <IconChip tone="up">
                <Check />
              </IconChip>
            </Specimen>
          </Block>

          <Block id="forms" title="Form fields" usage={<>Wrap every control in <code>Field</code>: it renders the label, hint and error and wires <code>aria-describedby</code> / <code>aria-invalid</code>. Validate on blur and on submit, then move focus to the first invalid field. Forms use <code>noValidate</code> so our messages replace the browser’s.</>}>
            <FormStates />
          </Block>

          <Block id="choice" title="Toggle, Segmented, Slider" usage={<>Toggle is a <code>role=&quot;switch&quot;</code> for instant settings. SegmentedControl is a radio group (arrow keys move) for 2–5 short options. Slider shows its value in an <code>output</code>.</>}>
            <ChoiceStates />
          </Block>

          <Block id="feedback" title="Notice & EmptyState" usage={<>Notice reports the result of an action inline (errors use <code>role=&quot;alert&quot;</code>). EmptyState replaces a list when filters match nothing; always offer a way out.</>}>
            <div className="grid gap-3">
              <Notice tone="info" title="Info">
                Demo screen: nothing is sent or stored.
              </Notice>
              <Notice tone="success" title="Message sent">
                We will reply within one business day.
              </Notice>
              <Notice tone="error" title="Check the highlighted fields." />
            </div>
            <EmptyState
              icon={<Inbox />}
              title="No articles match"
              body="Try a different word or clear the filters."
              action={
                <Button variant="outline" size="sm">
                  Clear filters
                </Button>
              }
            />
          </Block>

          <Block id="disclosure" title="Accordion & Sheet" usage={<>Accordion keeps one row open; buttons carry <code>aria-expanded</code>. Sheet is the modal drawer used for the mobile nav: focus trap, Esc to close, scroll lock and focus restore.</>}>
            <Accordion
              items={[
                { q: 'Open row', a: 'The plus rotates into a close mark; height animates with the base motion token.' },
                { q: 'Closed row', a: 'Only one row is open at a time.' },
              ]}
            />
            <Specimen label="Sheet">
              <SheetDemo />
            </Specimen>
          </Block>

          <Block id="people" title="Avatar" usage={<>Illustrated SVG faces derived from the name (stable across renders). Pass <code>src</code> to use a photo, <code>hue</code> to pin the background.</>}>
            <Specimen label="Sizes 28 / 36 / 44 / 64 / 96">
              {[28, 36, 44, 64, 96].map((s, i) => (
                <Avatar key={s} name={['Hana Brooks', 'Marcus Lee', 'Isabel Ortega', 'Ravi Shah', 'Amara Diallo'][i]} size={s} />
              ))}
            </Specimen>
          </Block>

          <Block id="data" title="CountUp & Sparkline" usage={<>CountUp counts in when scrolled into view and eases to new values; use it for every changing number. Sparkline draws itself in.</>}>
            <DataDemo />
          </Block>

          <Block id="product" title="Product art" usage={<>Drawn, not photographed. CreditCard has three themes, an optional pointer <code>tilt</code> and a <code>frozen</code> state; Coin is a real CSS 3D object; BalanceCard is the white hero widget.</>}>
            <Specimen label="CreditCard themes and frozen state" className="justify-center">
              {(['graphite', 'violet', 'pearl'] as const).map((t) => (
                <div key={t} className="h-[176px] w-[270px] shrink-0">
                  <div className="origin-top-left scale-[0.6]">
                    <CreditCard data={hero.card} theme={t} frozen={t === 'graphite' && frozen} />
                  </div>
                </div>
              ))}
              <div className="w-full text-center">
                <Button size="sm" variant="outline" onClick={() => setFrozen((f) => !f)} aria-pressed={frozen}>
                  {frozen ? 'Unfreeze graphite' : 'Freeze graphite'}
                </Button>
              </div>
            </Specimen>
            <Specimen label="BalanceCard and Coin" className="justify-center gap-10">
              <BalanceCard {...hero.account} className="max-w-full" />
              <Coin size={180} thickness={40} segments={80} />
            </Specimen>
          </Block>

          <Block id="composites" title="Plan & Post cards" usage={<>Built from Card, Badge, Button and CountUp. Used on the home page, Pricing and the Blog.</>}>
            <div className="grid gap-4 md:grid-cols-2">
              <PlanCard plan={plan} yearly={false} />
              <PostCard post={posts[0]} cover={coverFor(posts[0].slug, posts)} excerpt />
            </div>
          </Block>

          <Block id="layout" title="Layout & brand" usage={<>Container sets the gutter, Section the vertical rhythm, SectionHeading the eyebrow + h2 + lede, PageHeader the top of inner pages. Logo links home.</>}>
            <Specimen label="Logo and mark">
              <Logo />
              <LogoMark className="h-10 w-8" />
            </Specimen>
            <Card>
              <SectionHeading eyebrow="SectionHeading" title="Simple plans that grow with you" body="Start free. Upgrade when your team and volume do." />
            </Card>
          </Block>
        </div>
      </div>
    </>
  )
}
