import { Check } from 'lucide-react'

import type { Plan } from '../content'
import { cx } from '../lib/cx'
import { Badge } from './Badge'
import { Button } from './Button'

export function PlanCard({ plan, yearly, seats }: { plan: Plan; yearly: boolean; seats: number }) {
  const per = plan.monthly == null ? null : yearly ? plan.monthly * 0.8 : plan.monthly
  const billable = Math.max(seats, plan.minSeats)
  const total = per == null ? null : per * billable
  return (
    <article className={cx('flex flex-col rounded-[var(--radius-card)] p-6 sm:p-7', plan.featured ? 'border-[1.5px] border-ink bg-card shadow-[8px_8px_0_var(--color-mint)]' : 'border border-line bg-card')}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">{plan.name}</h3>
        {plan.featured ? <Badge tone="mint">Most popular</Badge> : null}
      </div>
      <p className="mt-1.5 text-[15px] text-muted">{plan.blurb}</p>
      <div className="mt-6 min-h-[86px]">
        {per == null ? (
          <>
            <p className="font-display text-[40px] font-semibold leading-none tracking-[-0.04em] text-ink">Custom</p>
            <p className="mt-2 text-[14px] text-faint">From {plan.minSeats.toLocaleString('en-US')} people, volume pricing</p>
          </>
        ) : (
          <>
            <p className="flex items-baseline gap-1.5">
              <span className="font-display text-[40px] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">${per.toFixed(2).replace(/\.00$/, '')}</span>
              <span className="text-[14.5px] text-muted">per person / month</span>
            </p>
            <p className="mt-2 text-[14px] text-faint tabular-nums">
              ${Math.round(total!).toLocaleString('en-US')} a month for {billable.toLocaleString('en-US')} people{seats < plan.minSeats ? ` (minimum ${plan.minSeats})` : ''}
              {yearly ? ', billed yearly' : ''}
            </p>
          </>
        )}
      </div>
      <Button href="/demo" variant={plan.featured ? 'mint' : 'soft'} className="mt-6 w-full">
        {plan.cta}
      </Button>
      <ul className="mt-6 space-y-3 border-t border-line pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-[15px] text-body">
            <Check className="mt-0.5 size-[18px] shrink-0 text-leaf" strokeWidth={2.4} aria-hidden />
            {f}
          </li>
        ))}
      </ul>
    </article>
  )
}
