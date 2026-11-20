import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, CreditCard as CardIcon, FileText, Lock, Plus, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { features } from '../content'
import { cx } from '../lib/cx'

function Tile({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal delay={delay} className={cx('h-full', className)}>
      <Card interactive className="flex h-full flex-col overflow-hidden">
        {children}
      </Card>
    </Reveal>
  )
}

function TileText({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative mt-auto pt-6">
      <h3 className="font-display text-[22px] font-semibold tracking-[-0.03em]">{title}</h3>
      <p className="mt-2 max-w-[420px] text-[15px] leading-relaxed text-muted text-pretty">{body}</p>
    </div>
  )
}

function AnalyticsViz() {
  const { bars } = features.analytics
  return (
    <div className="relative">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[13px] text-faint">Spend this month</div>
          <CountUp value={84210.5} decimals={2} prefix="$" className="font-display text-[34px] font-semibold tracking-[-0.03em] tabular" />
        </div>
        <Badge tone="up">−12.4% vs plan</Badge>
      </div>
      <div className="mt-6 flex h-[150px] items-end gap-[6px]">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={cx(
              'flex-1 rounded-t-[6px] transition-colors duration-300',
              i === bars.length - 1 ? 'bg-violet' : 'bg-white/[0.08] group-hover:bg-white/[0.12]',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function CardsViz() {
  const [cards, setCards] = useState([
    { name: 'Figma', last: '4512', hue: 262 },
    { name: 'AWS', last: '8830', hue: 28 },
  ])
  const names = ['Notion', 'Slack', 'Linear', 'Vercel', 'GitHub', 'Stripe']
  const add = () =>
    setCards((c) =>
      c.length >= 4
        ? c.slice(1).concat({ name: names[(c.length + Date.now()) % names.length], last: String(1000 + Math.floor(Math.random() * 8999)), hue: Math.floor(Math.random() * 360) })
        : c.concat({ name: names[c.length % names.length], last: String(1000 + Math.floor(Math.random() * 8999)), hue: Math.floor(Math.random() * 360) }),
    )
  return (
    <div className="relative flex flex-col gap-2">
      {cards.map((c) => (
        <motion.div
          key={c.name + c.last}
          layout
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="flex items-center gap-3 rounded-[14px] bg-white/[0.04] px-3 py-2.5"
        >
          <span className="grid h-7 w-10 place-items-center rounded-[6px]" style={{ background: `linear-gradient(135deg, hsl(${c.hue} 80% 62%), hsl(${c.hue + 30} 70% 40%))` }}>
            <CardIcon className="size-3.5 text-white/90" />
          </span>
          <span className="text-[14px] font-medium">{c.name}</span>
          <span className="ml-auto text-[13px] text-faint tabular">•••• {c.last}</span>
        </motion.div>
      ))}
      <button
        type="button"
        onClick={add}
        className="mt-1 flex items-center justify-center gap-2 rounded-[14px] border border-dashed border-white/15 py-2.5 text-[14px] text-muted transition-colors hover:border-violet-text hover:text-white active:scale-[0.98]"
      >
        <Plus className="size-4" /> New virtual card
      </button>
    </div>
  )
}

function CurrencyViz() {
  return (
    <div className="relative flex flex-col divide-y divide-white/[0.06]">
      {features.currencies.rows.map((r) => (
        <div key={r.code} className="flex items-center gap-3 py-3">
          <span className="grid size-8 place-items-center rounded-full text-[11px] font-semibold round" style={{ background: r.flag }}>
            {r.code.slice(0, 2)}
          </span>
          <div className="leading-tight">
            <div className="text-[14px] font-medium">{r.code}</div>
            <div className="text-[12px] text-faint">{r.name}</div>
          </div>
          <span className="ml-auto text-[15px] tabular">{r.amount}</span>
        </div>
      ))}
    </div>
  )
}

function InvoiceViz() {
  const steps = ['Sent', 'Viewed', 'Paid']
  return (
    <div className="relative rounded-[16px] bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-[14px]">
        <FileText className="size-4 text-violet-text" />
        <span className="font-medium">INV-2041</span>
        <span className="ml-auto tabular">$3,480.00</span>
      </div>
      <div className="mt-4 flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <motion.span
              initial={{ scale: 0.5, backgroundColor: 'rgb(255 255 255 / 0.12)' }}
              whileInView={{ scale: 1, backgroundColor: i === 2 ? '#16a34a' : '#5b3df6' }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.45, type: 'spring', stiffness: 300, damping: 18 }}
              className="size-3 rounded-full round"
            />
            {i < steps.length - 1 && (
              <div className="mx-1 h-[2px] flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 + i * 0.45, duration: 0.4 }}
                  className="h-full origin-left bg-violet"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-faint">
        {steps.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow={features.eyebrow} title={features.title} body={features.body} />

        <Reveal className="mx-auto mt-14 grid max-w-[880px] grid-cols-1 gap-6 sm:grid-cols-3">
          {features.stats.map((s) => (
            <div key={s.label} className="text-center">
              <CountUp
                value={s.value}
                decimals={s.decimals ?? 0}
                prefix={s.prefix ?? ''}
                suffix={s.suffix}
                className="font-display text-[44px] font-semibold tracking-[-0.04em] tabular"
              />
              <div className="mt-1 text-[14px] text-muted">{s.label}</div>
            </div>
          ))}
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-6">
          <Tile className="md:col-span-4">
            <AnalyticsViz />
            <TileText title={features.analytics.title} body={features.analytics.body} />
          </Tile>
          <Tile className="md:col-span-2" delay={0.08}>
            <CardsViz />
            <TileText title={features.cards.title} body={features.cards.body} />
          </Tile>
          <Tile className="md:col-span-2" delay={0.04}>
            <CurrencyViz />
            <TileText title={features.currencies.title} body={features.currencies.body} />
          </Tile>
          <Tile className="md:col-span-2" delay={0.1}>
            <InvoiceViz />
            <TileText title={features.invoices.title} body={features.invoices.body} />
          </Tile>
          <Tile className="md:col-span-2" delay={0.16}>
            <div className="relative grid h-[124px] place-items-center">
              <div className="absolute size-[120px] rounded-full bg-[radial-gradient(closest-side,rgb(91_61_246/0.35),transparent)] round" />
              <motion.div
                whileHover={{ rotate: -8, scale: 1.06 }}
                className="depth relative grid size-[72px] place-items-center rounded-[22px] bg-[#141418]"
              >
                <ShieldCheck className="size-8 text-violet-text" strokeWidth={1.6} />
              </motion.div>
              <Lock className="absolute right-[22%] top-3 size-4 text-faint" />
              <ArrowUpRight className="absolute bottom-3 left-[24%] size-4 text-faint" />
            </div>
            <TileText title={features.security.title} body={features.security.body} />
          </Tile>
        </div>
        <Reveal className="mt-10 flex justify-center">
          <Button href="/features" variant="outline" size="sm">
            Explore every feature <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" aria-hidden />
          </Button>
        </Reveal>
      </Container>
    </section>
  )
}
