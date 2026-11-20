import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Check } from 'lucide-react'

import { Badge } from '../components/Badge'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { pricing } from '../content'
import { cn } from '../lib/cn'

export function Pricing() {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('yearly')
  return (
    <section id="pricing" tabIndex={-1} className="scroll-mt-20 bg-canvas px-4 py-24 outline-none sm:px-9 sm:py-28">
      <SectionHeading title={pricing.title} sub={pricing.sub} />
      <div className="mt-8 flex justify-center">
        <Segmented
          label="Billing"
          value={cycle}
          onChange={setCycle}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: <>Yearly <span className="text-[#0b6b53]">−20%</span></> },
          ]}
        />
      </div>
      <ul className="mx-auto mt-10 grid max-w-[1080px] gap-4 lg:grid-cols-3">
        {pricing.plans.map((p, i) => {
          const price = cycle === 'monthly' ? p.monthly : p.yearly
          const featured = 'featured' in p && p.featured
          return (
            <Reveal as="li" key={p.name} delay={i * 0.07} className="h-full">
                <Card className={cn('flex h-full flex-col p-7', featured && 'border-brand-bright/60 shadow-pop ring-1 ring-brand-bright/40')}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-ink">{p.name}</h3>
                    {featured && <Badge tone="brand">Most popular</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted">{p.blurb}</p>
                  <p className="mt-6 flex items-end gap-1.5">
                    <span className="relative inline-block h-12 min-w-[2ch] overflow-hidden text-[44px] leading-[48px] font-bold tracking-[-0.04em] text-ink tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={price} className="inline-block" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} transition={{ duration: 0.3 }}>
                          ${price}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="pb-1.5 text-sm text-muted">{price ? 'per person / month' : 'forever'}</span>
                  </p>
                  <ButtonLink href="/app" variant={featured ? 'primary' : 'outline'} className="mt-6 w-full">
                    {p.cta}
                  </ButtonLink>
                  <ul className="mt-6 grid gap-2.5 border-t border-line-soft pt-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-body">
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-free" strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
          )
        })}
      </ul>
    </section>
  )
}
