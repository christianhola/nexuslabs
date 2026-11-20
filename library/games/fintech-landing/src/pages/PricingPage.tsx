import { motion } from 'motion/react'
import { ArrowRight, Check, Minus, Sparkles } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { BillingToggle } from '../components/BillingToggle'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CountUp } from '../components/CountUp'
import { PageHeader } from '../components/PageHeader'
import { PlanCard } from '../components/PlanCard'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { SegmentedControl } from '../components/SegmentedControl'
import { Slider } from '../components/Slider'
import { pricing, pricingPage } from '../content'
import { cx } from '../lib/cx'

const plans = pricing.plans
type PlanId = keyof typeof pricingPage.calculator.revio

const usd = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits })

export function PricingPage() {
  const [yearly, setYearly] = useState(false)
  return (
    <>
      <PageHeader eyebrow={pricingPage.eyebrow} title={pricingPage.title} body={pricingPage.body}>
        <BillingToggle yearly={yearly} onChange={setYearly} />
      </PageHeader>

      <Section className="!pt-0">
        <div className="mx-auto grid max-w-[1120px] gap-4 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.id} delay={i * 0.08} className="h-full">
              <PlanCard plan={plan} yearly={yearly} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Calculator />
      <Compare yearly={yearly} />

      <Section id="faq">
        <SectionHeading eyebrow={pricingPage.faqHeading.eyebrow} title={pricingPage.faqHeading.title} />
        <Reveal className="mx-auto mt-12 max-w-[760px]">
          <Accordion items={pricingPage.faq} />
        </Reveal>
      </Section>

      <Section className="!pt-0">
        <Reveal>
          <Card
            padding="lg"
            className="overflow-hidden bg-[radial-gradient(90%_120%_at_0%_0%,#241a5c_0%,#0d0b1a_50%,#050506_100%)] text-center sm:!py-16"
          >
            <h2 className="mx-auto max-w-[640px] font-display text-[34px] font-semibold leading-[1.06] tracking-[-0.04em] text-balance sm:text-[48px]">
              {pricingPage.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-relaxed text-muted">{pricingPage.cta.body}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href={pricingPage.cta.primary.href} size="lg">
                {pricingPage.cta.primary.label}
                <ArrowRight className="size-[18px] transition-transform group-hover/button:translate-x-1" aria-hidden />
              </Button>
              <Button href={pricingPage.cta.secondary.href} variant="outline" size="lg">
                {pricingPage.cta.secondary.label}
              </Button>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Fee calculator                                                       */
/* ------------------------------------------------------------------ */

function Calculator() {
  const c = pricingPage.calculator
  const { inputs, labels } = c
  const [spend, setSpend] = useState(inputs.spend.initial)
  const [fx, setFx] = useState(inputs.fx.initial)
  const [payouts, setPayouts] = useState(inputs.payouts.initial)
  const [cards, setCards] = useState(inputs.cards.initial)

  const result = useMemo(() => {
    const fxSpend = spend * (fx / 100)
    const bank = c.bank.monthly + fxSpend * c.bank.fxRate + payouts * c.bank.perTransfer + cards * c.bank.perCard
    const options = plans
      .map((p) => {
        const m = c.revio[p.id as PlanId]
        return { plan: p, eligible: cards <= m.maxCards, cost: m.monthly + fxSpend * m.fxRate + payouts * m.perTransfer + cards * m.perCard }
      })
      .filter((o) => o.eligible)
      .sort((a, b) => a.cost - b.cost)
    const best = options[0]
    const saving = Math.max(0, bank - best.cost)
    return { bank, revio: best.cost, plan: best.plan, saving, cashback: spend * c.cashbackRate }
  }, [spend, fx, payouts, cards, c])

  const max = Math.max(result.bank, result.revio, 1)
  const bars = [
    { label: labels.bank, value: result.bank, cls: 'bg-white/25' },
    { label: labels.revio, value: result.revio, cls: 'bg-violet' },
  ]

  return (
    <Section id="calculator">
      <SectionHeading eyebrow={c.eyebrow} title={c.title} body={c.body} />
      <div className="mx-auto mt-14 grid max-w-[1120px] grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_440px]">
        <Reveal className="h-full">
          <Card className="flex h-full flex-col justify-around gap-8">
            <Slider label={inputs.spend.label} min={inputs.spend.min} max={inputs.spend.max} step={inputs.spend.step} value={spend} onChange={setSpend} format={(n) => usd(n)} />
            <Slider label={inputs.fx.label} min={inputs.fx.min} max={inputs.fx.max} step={inputs.fx.step} value={fx} onChange={setFx} format={(n) => `${n}%`} hint={`${usd(spend * (fx / 100))} a month in foreign currency`} />
            <Slider label={inputs.payouts.label} min={inputs.payouts.min} max={inputs.payouts.max} step={inputs.payouts.step} value={payouts} onChange={setPayouts} />
            <Slider label={inputs.cards.label} min={inputs.cards.min} max={inputs.cards.max} step={inputs.cards.step} value={cards} onChange={setCards} />
          </Card>
        </Reveal>

        <Reveal delay={0.08} className="h-full">
          <Card variant="featured" className="flex h-full flex-col">
            <h3 className="text-[14px] text-muted">{labels.results}</h3>
            <div className="mt-5 flex flex-col gap-4">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between text-[14px]">
                    <span className="text-soft">{b.label}</span>
                    <span className="font-medium tabular">{usd(b.value, 2)}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className={cx('h-full rounded-full', b.cls)}
                      initial={false}
                      animate={{ width: `${Math.max(2, (b.value / max) * 100)}%` }}
                      transition={{ type: 'spring', stiffness: 180, damping: 28 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-white/[0.08] pt-6">
              <div className="text-[14px] text-muted">{labels.save}</div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2" aria-live="polite" aria-atomic="true">
                <CountUp
                  value={result.saving}
                  from={result.saving}
                  prefix="$"
                  duration={0.5}
                  className="font-display text-[48px] font-semibold leading-none tracking-[-0.04em] tabular"
                />
                <span className="text-[15px] text-muted">{labels.perMonth}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px] text-soft">
                <Badge tone="up">
                  <CountUp value={result.saving * 12} from={result.saving * 12} prefix="$" duration={0.5} className="tabular" /> {labels.perYear}
                </Badge>
                <Badge tone="neutral" icon={<Sparkles className="size-3" aria-hidden />}>
                  <CountUp value={result.cashback} from={result.cashback} prefix="+$" duration={0.5} className="tabular" /> {labels.cashback}
                </Badge>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-white/[0.05] p-4">
              <div>
                <div className="text-[13px] text-muted">{labels.recommended}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-display text-[20px] font-semibold tracking-[-0.02em]">{result.plan.name}</span>
                  <Badge tone="violet" size="sm">
                    {result.plan.monthly === 0 ? 'Free' : `${usd(result.plan.monthly)}/mo`}
                  </Badge>
                </div>
              </div>
              <Button href={result.plan.href} size="sm">
                {labels.choose} {result.plan.name}
                <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" aria-hidden />
              </Button>
            </div>
            <p className="mt-5 text-[12px] leading-relaxed text-muted">{c.note}</p>
          </Card>
        </Reveal>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/* Comparison table                                                     */
/* ------------------------------------------------------------------ */

function Value({ v }: { v: string | boolean }) {
  const { included, notIncluded } = pricingPage.compare
  if (v === true)
    return (
      <span className="inline-grid size-6 place-items-center rounded-full bg-violet round">
        <Check className="size-3.5" strokeWidth={3} aria-hidden />
        <span className="sr-only">{included}</span>
      </span>
    )
  if (v === false)
    return (
      <span className="inline-flex text-muted">
        <Minus className="size-4" aria-hidden />
        <span className="sr-only">{notIncluded}</span>
      </span>
    )
  return <span className="text-soft">{v}</span>
}

function Compare({ yearly }: { yearly: boolean }) {
  const cmp = pricingPage.compare
  const featuredIdx = plans.findIndex((p) => p.featured)
  const [pick, setPick] = useState<string>(plans[featuredIdx >= 0 ? featuredIdx : 0].id)
  const pickIdx = plans.findIndex((p) => p.id === pick)
  const picked = plans[pickIdx]

  return (
    <Section id="compare">
      <SectionHeading eyebrow={cmp.eyebrow} title={cmp.title} />

      {/* md+: full table */}
      <Reveal className="mx-auto mt-14 hidden max-w-[1120px] md:block">
        <Card padding="none" className="px-2 pb-2">
          <table className="w-full border-separate border-spacing-0 text-left text-[15px]">
            <caption className="sr-only">{cmp.caption}</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky top-[68px] z-10 w-[34%] rounded-tl-card border-b border-white/[0.08] bg-surface px-5 pt-6 pb-5 align-bottom text-[13px] font-medium text-muted">
                  {cmp.feature}
                </th>
                {plans.map((p, i) => (
                  <th
                    key={p.id}
                    scope="col"
                    className={cx(
                      'sticky top-[68px] z-10 border-b border-white/[0.08] bg-surface px-5 pt-6 pb-5 align-bottom font-normal',
                      i === featuredIdx && 'bg-[#141129]',
                      i === plans.length - 1 && 'rounded-tr-card',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[18px] font-semibold tracking-[-0.02em]">{p.name}</span>
                      {p.featured ? (
                        <Badge tone="violet" size="sm">
                          Popular
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-1 text-[14px] text-muted tabular">
                      {usd(yearly ? p.yearly : p.monthly)} / month
                    </div>
                    <Button href={p.href} size="sm" variant={p.featured ? 'primary' : 'outline'} className="mt-4 w-full">
                      {p.cta}
                    </Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cmp.groups.map((g) => (
                <Fragment key={g.name}>
                  <tr>
                    <th scope="colgroup" colSpan={plans.length + 1} className="px-5 pt-8 pb-3 text-[13px] font-medium uppercase tracking-[0.08em] text-violet-text">
                      {g.name}
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.label} className="group/row">
                      <th scope="row" className="border-t border-white/[0.06] px-5 py-4 font-normal transition-colors group-hover/row:bg-white/[0.02]">
                        <div className="text-white">{r.label}</div>
                        {r.hint ? <div className="mt-0.5 text-[13px] text-muted">{r.hint}</div> : null}
                      </th>
                      {r.values.map((v, i) => (
                        <td
                          key={i}
                          className={cx(
                            'border-t border-white/[0.06] px-5 py-4 transition-colors group-hover/row:bg-white/[0.02]',
                            i === featuredIdx && 'bg-violet/[0.06]',
                          )}
                        >
                          <Value v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </Card>
      </Reveal>

      {/* phones: one plan at a time */}
      <div className="mt-10 md:hidden">
        <div className="flex justify-center">
          <SegmentedControl
            label={cmp.pick}
            value={pick}
            onChange={setPick}
            options={plans.map((p) => ({ value: p.id, label: p.name }))}
          />
        </div>
        <Card padding="sm" className="mt-6">
          <div className="flex items-center justify-between gap-3 px-2 pt-2">
            <div>
              <div className="font-display text-[20px] font-semibold tracking-[-0.02em]">{picked.name}</div>
              <div className="text-[14px] text-muted tabular">{usd(yearly ? picked.yearly : picked.monthly)} / month</div>
            </div>
            <Button href={picked.href} size="sm" variant={picked.featured ? 'primary' : 'outline'}>
              {picked.cta}
            </Button>
          </div>
          {cmp.groups.map((g) => (
            <div key={g.name} className="mt-6">
              <h3 className="px-2 text-[12px] font-medium uppercase tracking-[0.08em] text-violet-text">{g.name}</h3>
              <dl className="mt-2">
                {g.rows.map((r) => (
                  <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-white/[0.06] px-2 py-3 text-[14px]">
                    <dt className="text-white">{r.label}</dt>
                    <dd className="text-right">
                      <Value v={r.values[pickIdx]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </Card>
      </div>
    </Section>
  )
}
