import { Check } from 'lucide-react'

import type { plans } from '../content'
import { cx } from '../lib/cx'
import { Badge } from './Badge'
import { Button } from './Button'

type Plan = (typeof plans)[number]

export const yearly = (monthly: number) => monthly * 10

/* One plan: name, price for the chosen billing, CTA and what's included. */
export function PlanCard({ plan, billing, price }: { plan: Plan; billing: 'monthly' | 'yearly'; price?: number }) {
  const popular = 'popular' in plan && plan.popular
  const amount = price ?? (billing === 'yearly' ? yearly(plan.monthly) / 12 : plan.monthly)
  return (
    <div className={cx('relative flex h-full flex-col rounded-[var(--radius-card)] border p-7', popular ? 'border-night bg-night text-on-dark shadow-raised' : 'border-line bg-card shadow-card')}>
      <div className="flex items-center justify-between">
        <h3 className={cx('font-display text-[18px] font-bold tracking-[-0.02em]', popular ? 'text-white' : 'text-ink')}>{plan.name}</h3>
        {popular ? <Badge tone="lime">Most teams pick this</Badge> : null}
      </div>
      <p className={cx('mt-1.5 text-[14.5px]', popular ? 'text-white/75' : 'text-muted')}>{plan.blurb}</p>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className={cx('font-display text-[44px] font-bold tracking-[-0.05em]', popular ? 'text-white' : 'text-ink')}>${Math.round(amount).toLocaleString('en-US')}</span>
        <span className={cx('text-[14px]', popular ? 'text-white/75' : 'text-muted')}>{plan.monthly ? (billing === 'yearly' ? '/ month, billed yearly' : '/ month') : 'forever'}</span>
      </p>
      <Button href={plan.href} variant={popular ? 'lime' : 'outline'} size="md" className="mt-6 w-full" arrow={popular}>
        {plan.cta}
      </Button>
      <ul className="mt-7 flex flex-col gap-3 text-[14.5px]">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <span className={cx('round mt-0.5 grid size-5 shrink-0 place-items-center rounded-full', popular ? 'bg-lime text-ink' : 'bg-lime-soft text-leaf')}>
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
            <span className={popular ? 'text-white/90' : 'text-body'}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
