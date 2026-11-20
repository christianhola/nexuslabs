import { Check, Minus } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Badge } from '../components/Badge'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { PageIntro } from '../components/PageIntro'
import { Tabs } from '../components/Tabs'
import { PRICING } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'

export function Pricing() {
  const [billing, setBilling] = useStored<'monthly' | 'annual'>('ui:billing', 'annual')
  return (
    <>
      <PageIntro eyebrow="Pricing" title={PRICING.title} sub={PRICING.sub}>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Tabs idBase="billing" label="Billing period" value={billing} onChange={setBilling} items={[{ id: 'monthly', label: 'Monthly' }, { id: 'annual', label: 'Annual' }]} />
          <Badge tone="brand">{PRICING.annualNote}</Badge>
        </div>
      </PageIntro>
      <Container className="pb-20">
        <div id="billing-panel" tabIndex={-1} role="tabpanel" aria-labelledby={`billing-tab-${billing}`} className="grid gap-4 md:grid-cols-3">
          {PRICING.plans.map((p) => {
            const price = billing === 'annual' ? p.annual : p.monthly
            return (
              <Card key={p.id} className={cx('flex flex-col p-7', p.featured && 'bg-surface-2 [--depth-edge:rgb(31_220_138/0.45)]')}>
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-medium">{p.name}</h2>
                  {p.featured && <Badge tone="brand">Most teams pick this</Badge>}
                </div>
                <p className="mt-2 text-[14.5px] text-muted">{p.blurb}</p>
                <p className="mt-6 flex items-baseline gap-1.5">
                  {price === null ? (
                    <span className="text-[40px] leading-none tracking-[-0.03em]">Custom</span>
                  ) : (
                    <>
                      <span className="text-[44px] leading-none tracking-[-0.03em] tabular-nums">${price}</span>
                      <span className="text-[14.5px] text-muted">{price === 0 ? 'forever' : billing === 'annual' ? 'a month, billed yearly' : 'a month'}</span>
                    </>
                  )}
                </p>
                <ButtonLink href={p.id === 'enterprise' ? '/request-demo' : '/signup'} variant={p.featured ? 'primary' : 'secondary'} className="mt-7 w-full">
                  {p.cta}
                </ButtonLink>
                <ul className="mt-7 grid gap-3 text-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-text" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        <h2 className="mt-24 text-center text-[30px] font-normal tracking-[-0.02em] text-stage sm:text-[36px]">Compare plans</h2>
        <Card className="mt-8 overflow-hidden">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Plan comparison">
            <table className="w-full min-w-[600px] text-left text-[15px]">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="px-6 py-4 font-normal text-muted">
                    Feature
                  </th>
                  {PRICING.compare.columns.map((c) => (
                    <th key={c} scope="col" className="px-4 py-4 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING.compare.rows.map((r) => (
                  <tr key={r.label} className="border-b border-white/5 last:border-0">
                    <th scope="row" className="px-6 py-3.5 font-normal text-muted">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className="px-4 py-3.5">
                        {v === true ? <Check aria-label="Included" className="size-4 text-brand-text" /> : v === false ? <Minus aria-label="Not included" className="size-4 text-faint" /> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mx-auto mt-24 max-w-[760px]">
          <h2 className="mb-6 text-center text-[30px] font-normal tracking-[-0.02em] text-stage sm:text-[36px]">Questions</h2>
          <Accordion items={PRICING.faq} />
        </div>
      </Container>
    </>
  )
}
