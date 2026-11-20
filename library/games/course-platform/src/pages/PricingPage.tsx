import { Check, Minus } from 'lucide-react'
import { Fragment } from 'react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Slider } from '../components/Slider'
import { compare, plans, pricingFaq } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'

/*
  Plans with a monthly/yearly switch, a fee calculator that shows which plan
  is cheapest for your sales, a comparison table and FAQ. Billing period and
  the calculator value persist.
*/
const money = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`

export function PricingPage() {
  const [period, setPeriod] = useStored<'monthly' | 'yearly'>('billing', 'yearly')
  const [sales, setSales] = useStored<number>('calc-sales', 4000)
  const cost = plans.map((p) => (period === 'yearly' ? p.yearly : p.monthly) + (sales * p.fee) / 100)
  const best = cost.indexOf(Math.min(...cost))
  const marketplace = sales * 0.5

  return (
    <>
      <section className="pb-6 pt-10 lg:pt-16">
        <Container className="flex flex-col items-center">
          <SectionHeading as="h1" eyebrow="Pricing" title="Simple Plans That Grow With You" lead="Start free and keep every sale you make on Pro. No per-learner fees, ever." />
          <Segmented
            className="mt-8"
            label="Billing period"
            tone="dark"
            value={period}
            onChange={setPeriod}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly, save 17%' },
            ]}
          />
        </Container>
      </section>

      <section aria-label="Plans" className="pb-20">
        <Container className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {plans.map((p, i) => {
            const price = period === 'yearly' ? p.yearly : p.monthly
            const featured = 'featured' in p && p.featured
            return (
              <Reveal key={p.id} delay={i * 0.05}>
                <div className={cx('relative flex h-full flex-col rounded-[var(--radius-card)] border p-7', featured ? 'border-flame-strong bg-card shadow-float' : 'border-line bg-card shadow-card')}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[20px] font-medium text-ink">{p.name}</h2>
                    {featured ? <Badge tone="solid">Most popular</Badge> : null}
                  </div>
                  <p className="mt-1.5 text-[14.5px] text-muted">{p.blurb}</p>
                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-[46px] font-medium leading-none tracking-[-0.03em] text-ink">{money(price)}</span>
                    <span className="text-[14px] text-muted">{price ? `/ month${period === 'yearly' ? ', billed yearly' : ''}` : 'forever'}</span>
                  </p>
                  <Button href={p.id === 'business' ? '/contact?topic=teams' : `/signup?plan=${p.id}`} variant={featured ? 'primary' : 'outline'} size="lg" className="mt-6 w-full">
                    {p.cta}
                  </Button>
                  <ul className="mt-7 flex flex-col gap-3 border-t border-line pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-body">
                        <Check className="mt-0.5 size-4 shrink-0 text-flame-ink" strokeWidth={2.5} aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </Container>
      </section>

      <section id="calculator" aria-labelledby="calc-title" className="bg-canvas py-20">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading align="left" id="calc-title" eyebrow="Fee calculator" title="What you keep each month" lead="Drag to your monthly course sales. We compare every plan, plus the 50% a typical marketplace takes." />
          </div>
          <Card pad="lg">
            <Slider label="Monthly course sales" value={sales} min={0} max={50000} step={500} onChange={setSales} format={money} />
            <ul className="mt-6 flex flex-col gap-2">
              {plans.map((p, i) => (
                <li key={p.id} className={cx('flex items-center justify-between rounded-[12px] border px-4 py-3', i === best ? 'border-flame-strong bg-flame-soft' : 'border-line')}>
                  <span className="flex items-center gap-2 text-[15px] text-ink">
                    {p.name}
                    {i === best ? <Badge tone="solid" size="xs">Cheapest for you</Badge> : null}
                  </span>
                  <span className="text-right">
                    <span className="block font-display text-[17px] font-medium tabular-nums text-ink">{money(sales - cost[i]!)} kept</span>
                    <span className="block text-[12.5px] text-muted">{money(cost[i]!)} in plan and fees</span>
                  </span>
                </li>
              ))}
              <li className="flex items-center justify-between rounded-[12px] border border-dashed border-line-strong px-4 py-3">
                <span className="text-[15px] text-muted">Typical marketplace</span>
                <span className="font-display text-[17px] font-medium tabular-nums text-muted">{money(sales - marketplace)} kept</span>
              </li>
            </ul>
          </Card>
        </Container>
      </section>

      <section id="compare" aria-labelledby="compare-title" className="py-20">
        <Container>
          <SectionHeading id="compare-title" title="Compare plans" />
          <div tabIndex={0} role="region" aria-label="Plan comparison table" className="relative mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-card shadow-card">
            <table className="w-full min-w-[640px] text-left text-[14.5px]">
              <caption className="sr-only">Features by plan</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[40%] px-6 py-4 font-normal text-muted">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} scope="col" className="px-6 py-4 font-display text-[16px] font-medium text-ink">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compare.map((g) => (
                  <Fragment key={g.group}>
                    <tr className="bg-wash">
                      <th scope="colgroup" colSpan={4} className="px-6 py-2.5 font-display text-[14px] font-medium text-ink">
                        {g.group}
                      </th>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={r[0]} className="border-t border-line">
                        <th scope="row" className="px-6 py-3.5 font-normal text-body">
                          {r[0]}
                        </th>
                        {r.slice(1).map((v, i) => (
                          <td key={i} className="px-6 py-3.5 text-ink">
                            {v === true ? <><Check className="size-4 text-flame-ink" strokeWidth={2.5} aria-hidden /><span className="sr-only">Included</span></> : v === false ? <><Minus className="size-4 text-faint" aria-hidden /><span className="sr-only">Not included</span></> : v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section id="faq" aria-labelledby="faq-title" className="bg-canvas py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading align="left" id="faq-title" eyebrow="FAQ" title="Questions, answered" lead="Anything else? Our team replies within a working day." />
          <Accordion items={pricingFaq} />
        </Container>
      </section>
    </>
  )
}
