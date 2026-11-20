import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowRight, Check, FileText, Plus, RotateCcw, Wallet } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import type { BadgeTone } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CountUp } from '../components/CountUp'
import { CreditCard } from '../components/CreditCard'
import type { CardTheme } from '../components/CreditCard'
import { IconChip } from '../components/IconChip'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { SegmentedControl } from '../components/SegmentedControl'
import { featuresPage } from '../content'
import { cx } from '../lib/cx'
import { Link, useLocation } from '../lib/router'
import { useReducedMotion } from '../lib/useReducedMotion'

const { mocks, ui } = featuresPage
const ease = [0.22, 1, 0.36, 1] as const
const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

// A mock is "live" (looping) only while on screen and when motion is allowed.
function useLive(ref: RefObject<Element | null>) {
  const inView = useInView(ref, { amount: 0.35 })
  const reduce = useReducedMotion() ?? false
  return { inView, reduce, live: inView && !reduce }
}

function useTicker(active: boolean, ms: number, onTick: () => void) {
  const cb = useRef(onTick)
  cb.current = onTick
  useEffect(() => {
    if (!active) return
    const t = window.setInterval(() => cb.current(), ms)
    return () => window.clearInterval(t)
  }, [active, ms])
}

function useWidth(ref: RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setW(el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return w
}

/** Frame around every product mock: a surface card with a soft violet bloom. */
function MockFrame({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div role="group" aria-label={label} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_61_246/0.22),transparent)] blur-2xl round"
      />
      <Card padding="none" className={cx('overflow-hidden p-4 sm:p-6', className)}>
        {children}
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cards mock: a fanned stack that cycles, plus "Issue card"           */
/* ------------------------------------------------------------------ */

type StackCard = { id: string; name: string; theme: CardTheme; last: string; limit: string }
const themes: CardTheme[] = ['violet', 'graphite', 'pearl']
const FAN = 20

function CardsMock() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const { live, reduce } = useLive(root)
  const w = useWidth(stage)
  const [cards, setCards] = useState<StackCard[]>(() => mocks.cardHolders.map((c, i) => ({ ...c, id: `c${i}` })))
  const issued = useRef(0)

  useTicker(live, 2800, () => setCards((c) => (c.length > 1 ? [...c.slice(1), c[0]] : c)))

  const issue = () => {
    const n = issued.current++
    const next = ui.cards.issued[n % ui.cards.issued.length]
    setCards((c) =>
      [{ id: `n${n}`, name: next.name, limit: next.limit, theme: themes[n % themes.length], last: String(1000 + ((n + 3) * 7919) % 9000) }, ...c].slice(0, 4),
    )
  }

  const s = Math.min(0.8, Math.max(0.4, (w - 24) / 450))
  const front = cards[0]
  const spring = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 170, damping: 22 }

  return (
    <div ref={root}>
      <MockFrame label={ui.cards.label}>
        <div ref={stage} className="relative overflow-hidden" style={{ height: 293 * s + FAN * 3 + 24 }}>
          {w > 0 && (
            <AnimatePresence initial={false}>
              {cards.map((c, k) => {
                const ks = s * (1 - k * 0.06)
                return (
                  <motion.div
                    key={c.id}
                    className="absolute"
                    style={{ left: (w - 450 * s) / 2, top: FAN * 3 + 8, width: 450, height: 293, transformOrigin: '0 0', zIndex: 10 - k }}
                    initial={{ opacity: 0, y: 140, x: (450 * s - 450 * ks) / 2, scale: ks, rotate: 6 }}
                    animate={{ opacity: k > 2 ? 0 : 1 - k * 0.12, y: -k * FAN, x: (450 * s - 450 * ks) / 2 + k * 6, scale: ks, rotate: -k * 1.5 }}
                    exit={{ opacity: 0, y: -FAN * 4 }}
                    transition={spring}
                  >
                    <CreditCard
                      theme={c.theme}
                      data={{ holder: c.name, number: `5243 •••• •••• ${c.last}`, validFrom: ui.cards.validFrom, validThru: ui.cards.validThru }}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/[0.06] pt-4">
          <div className="min-w-0 leading-tight">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={front.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: reduce ? 0 : 0.2 }}>
                <div className="flex items-center gap-2 text-[15px] font-medium">
                  <span className="truncate">{front.name}</span>
                  <Badge tone="up" size="sm">
                    {ui.cards.active}
                  </Badge>
                </div>
                <div className="mt-1 text-[13px] text-muted tabular">
                  •••• {front.last} · {ui.cards.limit} {front.limit}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <Button size="sm" variant="outline" className="ml-auto" onClick={issue}>
            <Plus className="size-4" aria-hidden /> {ui.cards.issue}
          </Button>
        </div>
      </MockFrame>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Payouts mock: balance feeds a rail; each recipient goes Pending→Sent */
/* ------------------------------------------------------------------ */

function PayoutsMock() {
  const root = useRef<HTMLDivElement>(null)
  const { live, reduce } = useLive(root)
  const n = mocks.payouts.length
  const [step, setStep] = useState(0)
  // n rows, then two ticks holding the finished state, then restart.
  useTicker(live, 1100, () => setStep((s) => (s >= n + 2 ? 0 : s + 1)))
  const shown = reduce ? n : Math.min(step, n)

  return (
    <div ref={root}>
      <MockFrame label={ui.payouts.label}>
        <div className="flex items-center gap-3">
          <IconChip tone="violet">
            <Wallet />
          </IconChip>
          <div className="min-w-0 leading-tight">
            <div className="text-[13px] text-muted">{ui.payouts.from}</div>
            <div className="mt-1 font-display text-[22px] font-semibold tracking-[-0.03em] tabular">{ui.payouts.balance}</div>
          </div>
          <Badge className="ml-auto" tone="neutral">
            {ui.payouts.batch} · {shown}/{n}
          </Badge>
        </div>

        <div className="relative mt-5 pl-7">
          {/* the rail: grey track with a violet fill that grows as payouts land */}
          <div aria-hidden className="absolute left-[11px] top-0 bottom-7 w-[2px] rounded-full bg-white/[0.08]">
            <motion.div
              className="w-full rounded-full bg-violet"
              initial={false}
              animate={{ height: `${(shown / n) * 100}%` }}
              transition={{ duration: reduce ? 0 : 0.6, ease }}
            />
          </div>
          <ul className="flex flex-col gap-2">
            {mocks.payouts.map((p, i) => {
              const status = i < shown ? 'sent' : i === shown && live ? 'sending' : 'pending'
              const tone: BadgeTone = status === 'sent' ? 'up' : status === 'sending' ? 'info' : 'neutral'
              return (
                <li key={p.name} className="relative">
                  {/* branch from the rail to the row, with a travelling dot while sending */}
                  <span aria-hidden className="absolute -left-[16px] top-1/2 h-[2px] w-[16px] -translate-y-1/2 bg-white/[0.08]">
                    {status === 'sending' && (
                      <motion.span
                        className="absolute -top-[3px] size-2 rounded-full bg-violet-text shadow-[0_0_10px_rgb(109_85_255/0.9)] round"
                        initial={{ x: -4 }}
                        animate={{ x: 14 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                    {status === 'sent' && <span className="absolute inset-0 bg-violet" />}
                  </span>
                  <div
                    className={cx(
                      'flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-colors duration-300',
                      status === 'sending' ? 'bg-white/[0.07]' : 'bg-white/[0.035]',
                    )}
                  >
                    <Avatar name={p.name} size={34} />
                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-[14px] font-medium">{p.name}</div>
                      <div className="mt-0.5 truncate text-[12px] text-muted">
                        {p.country} · {p.rail}
                      </div>
                    </div>
                    <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[14px] tabular">{p.amount}</span>
                      <Badge tone={tone} size="sm" icon={status === 'sent' ? <Check className="size-3" strokeWidth={3} aria-hidden /> : undefined}>
                        {ui.payouts[status]}
                      </Badge>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </MockFrame>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Invoice mock: lines type in, then Draft → Sent → Viewed → Paid      */
/* ------------------------------------------------------------------ */

const statusTone: Record<string, BadgeTone> = { Draft: 'neutral', Sent: 'violet', Viewed: 'info', Paid: 'up' }

function InvoiceMock() {
  const root = useRef<HTMLDivElement>(null)
  const { inView, reduce } = useLive(root)
  const { invoice } = mocks
  const L = invoice.lines.length
  const max = L + invoice.statuses.length - 1
  const [step, setStep] = useState(0)
  useTicker(inView && !reduce && step < max, 750, () => setStep((s) => Math.min(max, s + 1)))
  const at = reduce ? max : step
  const visible = invoice.lines.slice(0, Math.min(at, L))
  const statusIdx = at <= L ? 0 : at - L
  const status = invoice.statuses[statusIdx]
  const total = visible.reduce((sum, l) => sum + l.qty * l.amount, 0)
  const paid = status === invoice.statuses[invoice.statuses.length - 1]

  return (
    <div ref={root}>
      <MockFrame label={ui.invoice.label}>
        <div className="relative rounded-[18px] bg-white/[0.035] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-violet-text" aria-hidden />
            <span className="text-[15px] font-medium">{invoice.number}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                className="ml-auto"
                aria-live="polite"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
              >
                <Badge tone={statusTone[status] ?? 'neutral'}>
                  {status}
                </Badge>
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex justify-between text-[13px]">
            <div>
              <div className="text-muted">{ui.invoice.billTo}</div>
              <div className="mt-0.5 font-medium">{invoice.client}</div>
            </div>
            <div className="text-right text-muted">{ui.invoice.due}</div>
          </div>

          <ul className="mt-4 flex min-h-[132px] flex-col border-t border-white/[0.06] pt-2">
            <AnimatePresence initial={false}>
              {visible.map((l) => (
                <motion.li
                  key={l.item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease }}
                  className="flex items-center gap-3 py-2 text-[14px]"
                >
                  <span className="min-w-0 truncate">{l.item}</span>
                  <span className="ml-auto shrink-0 text-muted tabular">×{l.qty}</span>
                  <span className="w-[86px] shrink-0 text-right tabular">{money(l.qty * l.amount)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="flex items-baseline justify-between border-t border-white/[0.06] pt-3">
            <span className="text-[14px] text-muted">{ui.invoice.total}</span>
            <CountUp value={total} from={0} decimals={2} prefix="$" duration={0.5} className="font-display text-[24px] font-semibold tracking-[-0.03em] tabular" />
          </div>

          <AnimatePresence>
            {paid && (
              <motion.div
                aria-hidden
                initial={{ opacity: 0, scale: 1.6, rotate: -24 }}
                animate={{ opacity: 1, scale: 1, rotate: -12 }}
                exit={{ opacity: 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 18 }}
                className="pointer-events-none absolute right-5 top-[46%] rounded-[10px] border-2 border-[#4ade80] px-3 py-1 font-display text-[22px] font-bold uppercase tracking-[0.06em] text-[#4ade80]"
              >
                {ui.invoice.paid}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* status tracker */}
        <div className="mt-4 flex items-center gap-3">
          <ol className="flex flex-1 items-center" aria-hidden>
            {invoice.statuses.map((st, i) => (
              <li key={st} className="flex flex-1 items-center last:flex-none">
                <span className={cx('size-2.5 shrink-0 rounded-full transition-colors duration-300 round', i <= statusIdx ? (i === invoice.statuses.length - 1 ? 'bg-up' : 'bg-violet') : 'bg-white/15')} />
                {i < invoice.statuses.length - 1 && (
                  <span className="mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.span
                      className="block h-full origin-left bg-violet"
                      initial={false}
                      animate={{ scaleX: i < statusIdx ? 1 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.4 }}
                    />
                  </span>
                )}
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => setStep(0)}
            aria-label={ui.invoice.replay}
            title={ui.invoice.replay}
            className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-white/[0.06] text-muted transition-colors hover:bg-white/[0.1] hover:text-white active:scale-95"
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
        </div>
        <div className="mt-1.5 flex justify-between pr-[52px] text-[12px] text-muted" aria-hidden>
          {invoice.statuses.map((st) => (
            <span key={st}>{st}</span>
          ))}
        </div>
      </MockFrame>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Analytics mock: period switcher, bars and a category donut          */
/* ------------------------------------------------------------------ */

function AnalyticsMock() {
  const root = useRef<HTMLDivElement>(null)
  const { live, reduce } = useLive(root)
  // Draw the chart the first time it is seen, then keep it drawn.
  const inView = useInView(root, { once: true, amount: 0.3 })
  const { periods, categories } = mocks.analytics
  const [id, setId] = useState(periods[1].id)
  const [picked, setPicked] = useState(false)
  const period = periods.find((p) => p.id === id) ?? periods[0]
  const max = Math.max(...period.bars)

  useTicker(live && !picked, 4500, () => setId((cur) => periods[(periods.findIndex((p) => p.id === cur) + 1) % periods.length].id))

  let offset = 0
  return (
    <div ref={root}>
      <MockFrame label={ui.analytics.label}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="leading-tight">
            <div className="text-[13px] text-muted">{ui.analytics.spend}</div>
            <CountUp value={period.total} decimals={2} prefix="$" duration={0.9} className="mt-1 block font-display text-[30px] font-semibold tracking-[-0.03em] tabular" />
            <div className="mt-1.5 flex items-center gap-2 text-[12px] text-muted">
              <Badge tone={period.change.startsWith('+') ? 'down' : 'up'} size="sm">
                {period.change}
              </Badge>
              {ui.analytics.vsPrev}
            </div>
          </div>
          <SegmentedControl
            size="sm"
            label={ui.analytics.period}
            value={id}
            onChange={(v) => {
              setPicked(true)
              setId(v)
            }}
            options={periods.map((p) => ({ value: p.id, label: p.label }))}
          />
        </div>

        <div key={period.id} className="mt-6">
          <div className="flex h-[140px] items-end gap-[6px]" aria-hidden>
            {period.bars.map((h, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { height: 0 }}
                animate={{ height: inView || reduce ? `${(h / max) * 100}%` : 0 }}
                transition={{ duration: 0.8, delay: 0.05 + i * 0.04, ease }}
                className={cx('flex-1 rounded-t-[6px]', h === max ? 'bg-violet' : 'bg-white/[0.1]')}
              />
            ))}
          </div>
          <div className="mt-2 flex gap-[6px] text-[11px] text-muted" aria-hidden>
            {period.labels.map((l, i) => (
              <span key={i} className="flex-1 text-center">
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-5 border-t border-white/[0.06] pt-5">
          <svg viewBox="0 0 120 120" className="size-[104px] shrink-0 -rotate-90" aria-hidden>
            <circle cx="60" cy="60" r="44" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="16" />
            {categories.map((c) => {
              const start = offset
              offset += c.share
              return (
                <motion.circle
                  key={c.name}
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke={c.color}
                  strokeWidth="16"
                  pathLength={100}
                  strokeDashoffset={-start}
                  initial={reduce ? false : { strokeDasharray: '0 100' }}
                  animate={{ strokeDasharray: inView || reduce ? `${c.share - 1.2} ${101.2 - c.share}` : '0 100' }}
                  transition={{ duration: 0.9, delay: 0.2 + start / 120, ease }}
                />
              )
            })}
          </svg>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] text-muted">{ui.analytics.byCategory}</div>
            <ul className="mt-2 flex flex-col gap-1.5">
              {categories.map((c) => (
                <li key={c.name} className="flex items-center gap-2 text-[14px]">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full round" style={{ background: c.color }} />
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-muted tabular">{c.share}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MockFrame>
    </div>
  )
}

const mockFor: Record<string, () => ReactNode> = {
  cards: () => <CardsMock />,
  payouts: () => <PayoutsMock />,
  invoicing: () => <InvoiceMock />,
  analytics: () => <AnalyticsMock />,
}

/* ------------------------------------------------------------------ */
/* Sticky sub-nav                                                      */
/* ------------------------------------------------------------------ */

function useSectionInView(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 200) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids])
  return active
}

const sectionIds = featuresPage.sections.map((s) => s.id)

function SubNav() {
  const active = useSectionInView(sectionIds)
  const { path } = useLocation()
  return (
    <div className="sticky top-[84px] z-30 px-4">
      <nav
        aria-label={ui.subnav}
        className="depth relative mx-auto w-max max-w-full overflow-x-auto rounded-full bg-black/75 p-1 backdrop-blur-xl round [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex">
          {featuresPage.sections.map((s) => {
            const on = active === s.id
            return (
              <li key={s.id}>
                <Link
                  href={`${path}#${s.id}`}
                  aria-current={on ? 'location' : undefined}
                  className={cx(
                    'relative flex h-10 items-center whitespace-nowrap rounded-full px-4 text-[14px] font-medium transition-colors round sm:px-5',
                    on ? 'text-white' : 'text-muted hover:text-white',
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="features-subnav"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-violet round"
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function FeaturesPage() {
  const { cta } = featuresPage
  return (
    <>
      <PageHeader eyebrow={featuresPage.eyebrow} title={featuresPage.title} body={featuresPage.body}>
        <Button href={cta.primary.href} size="lg">
          {cta.primary.label}
          <ArrowRight className="size-[18px] transition-transform duration-300 group-hover/button:translate-x-1" aria-hidden />
        </Button>
        <Button href={cta.secondary.href} variant="outline" size="lg">
          {cta.secondary.label}
        </Button>
      </PageHeader>

      <SubNav />

      {featuresPage.sections.map((s, i) => (
        <Section key={s.id} id={s.id} className="!scroll-mt-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className={cx(i % 2 === 1 && 'lg:order-2')}>
              <SectionHeading align="left" eyebrow={s.eyebrow} title={s.title} body={s.body} />
              <Reveal delay={0.08}>
                <ul className="mt-8 flex flex-col gap-3 text-[15px]">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-soft">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-violet round">
                        <Check className="size-3" strokeWidth={3} aria-hidden />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-baseline gap-3 border-t border-white/[0.06] pt-6">
                  <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.04em]">{s.stat.value}</span>
                  <span className="text-[15px] text-muted">{s.stat.label}</span>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.12} className={cx('mx-auto w-full max-w-[520px]', i % 2 === 1 && 'lg:order-1')}>
              {mockFor[s.id]?.()}
            </Reveal>
          </div>
        </Section>
      ))}

      <Section>
        <Reveal>
          <Card variant="featured" padding="lg" className="overflow-hidden text-center">
            <div aria-hidden className="dots pointer-events-none absolute inset-0" />
            <div className="relative flex flex-col items-center">
              <h2 className="max-w-[640px] font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-balance sm:text-[48px]">{cta.title}</h2>
              <p className="mt-4 max-w-[480px] text-[17px] leading-relaxed text-muted">{cta.body}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={cta.primary.href} size="lg">
                  {cta.primary.label}
                  <ArrowRight className="size-[18px] transition-transform duration-300 group-hover/button:translate-x-1" aria-hidden />
                </Button>
                <Button href={cta.secondary.href} variant="outline" size="lg">
                  {cta.secondary.label}
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  )
}
