import { Check, Minus, Plus } from 'lucide-react'
import { useState } from 'react'

import { Button, ButtonLink } from '@/components/Button'
import { useContact } from '@/components/Contact'
import { Container, SectionHead } from '@/components/Frame'
import { Badge, Segmented } from '@/components/ui'
import { PRICING } from '@/content'
import { cn } from '@/lib/cn'
import { MarketingPage } from './Shell'

export function Pricing() {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual')
  const [open, setOpen] = useState<number | null>(0)
  const contact = useContact()

  return (
    <MarketingPage
      eyebrow="Pricing"
      title={PRICING.title}
      sub={PRICING.sub}
      aside={
        <Segmented
          label="Billing period"
          value={cycle}
          onChange={setCycle}
          options={[
            { id: 'monthly', label: 'Monthly' },
            { id: 'annual', label: 'Annual · save 20%' },
          ]}
          className="self-start lg:self-auto"
        />
      }
    >
      <Container className="pb-24">
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PRICING.plans.map((p) => {
            const price = cycle === 'annual' ? p.annual : p.monthly
            return (
              <li key={p.id} className={cn('relative flex flex-col rounded-[22px] p-6 ring-1', p.highlight ? 'bg-raised ring-[rgb(255_244_228/0.22)]' : 'bg-surface ring-line')}>
                {p.highlight && (
                  <Badge tone="ember" className="absolute top-6 right-6">
                    For agents
                  </Badge>
                )}
                <h2 className="text-[17px] font-medium">{p.name}</h2>
                <p className="mt-1 text-[14px] text-muted">{p.blurb}</p>
                <p className="mt-6 flex min-h-[64px] items-baseline gap-1.5">
                  {price === null ? (
                    <span className="font-display text-[40px] font-medium tracking-[-0.04em] text-cream">Custom</span>
                  ) : (
                    <>
                      <span className="font-display text-[44px] font-medium tracking-[-0.04em] text-cream tabular-nums">${price}</span>
                      <span className="text-[13px] text-muted">{price === 0 ? 'forever' : `per creator / month${cycle === 'annual' ? ', billed yearly' : ''}`}</span>
                    </>
                  )}
                </p>
                {p.to === 'contact' ? (
                  <Button variant="secondary" className="mt-6 w-full" onClick={contact}>
                    {p.cta}
                  </Button>
                ) : (
                  <ButtonLink to={p.to} variant={p.highlight ? 'primary' : 'secondary'} className="mt-6 w-full">
                    {p.cta}
                  </ButtonLink>
                )}
                <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-[14px] text-fg/90">
                      <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                      {f}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>

        <section className="mt-24" aria-labelledby="compare">
          <h2 id="compare" className="font-display text-[30px] font-medium tracking-[-0.035em]">
            Compare plans
          </h2>
          <div className="mt-6 overflow-x-auto rounded-[18px] ring-1 ring-line" role="region" aria-labelledby="compare" tabIndex={0}>
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-4 font-medium text-muted">
                    Feature
                  </th>
                  {PRICING.compare.columns.map((c) => (
                    <th key={c} scope="col" className="px-5 py-4 font-medium">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING.compare.rows.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-0">
                    <th scope="row" className="px-5 py-3.5 font-normal text-muted">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={i} className="px-5 py-3.5">
                        {v === true ? <Check className="size-4 text-ok" aria-label="Included" /> : v === false ? <Minus className="size-4 text-faint" aria-label="Not included" /> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="faq">
          <SectionHead title="Questions, answered." sub="Anything else? Talk to us and we’ll walk you through it." />
          <ul id="faq" className="divide-y divide-line rounded-[18px] ring-1 ring-line">
            {PRICING.faq.map((f, i) => {
              const on = open === i
              return (
                <li key={f.q}>
                  <h3>
                    <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-medium">
                      {f.q}
                      <Plus className={cn('size-4 shrink-0 text-muted transition-transform duration-200', on && 'rotate-45')} />
                    </button>
                  </h3>
                  <div id={`faq-${i}`} hidden={!on} className="px-5 pb-5 text-[15px] leading-relaxed text-muted">
                    {f.a}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </Container>
    </MarketingPage>
  )
}
