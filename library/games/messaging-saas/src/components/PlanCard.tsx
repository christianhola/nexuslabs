import { Check } from 'lucide-react'

import type { Plan } from '../content'
import { cx } from '../lib/cx'
import { money } from '../lib/format'
import { Badge } from './Badge'
import { Button } from './Button'

export function PlanCard({ plan, annual, discount }: { plan: Plan; annual: boolean; discount: number }) {
  const price = plan.monthly === null ? null : Math.round(plan.monthly * (annual ? 1 - discount : 1))
  return (
    <div
      className={cx(
        'relative grid content-start gap-6 rounded-card border p-7 shadow-card',
        plan.featured ? 'border-cobalt/70 bg-[linear-gradient(180deg,#16244f_0%,#1a1d26_55%)]' : 'border-line bg-panel',
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[22px] font-semibold text-white">{plan.name}</h3>
        {plan.featured ? <Badge tone="cobalt">Most popular</Badge> : null}
      </div>
      <p className="min-h-12 text-[15px] leading-[1.55] text-muted">{plan.blurb}</p>
      <div>
        {price === null ? (
          <p className="font-display text-[44px] font-medium leading-none tracking-[-0.03em] text-white">Custom</p>
        ) : (
          <p className="flex items-baseline gap-1.5">
            <span className="font-display text-[44px] font-medium leading-none tracking-[-0.03em] text-white tabular-nums">{money(price)}</span>
            <span className="text-[14px] text-muted">/ month{annual ? ', billed yearly' : ''}</span>
          </p>
        )}
        <p className="mt-3 text-[14px] text-faint">
          {money(plan.perMessage, 4)} per message{plan.included ? ` · ${plan.included.toLocaleString('en-US')} included` : ' · volume rates'}
        </p>
      </div>
      <Button href={plan.href} variant={plan.featured ? 'primary' : 'subtle'} size="lg" arrow={plan.featured}>
        {plan.cta}
      </Button>
      <ul className="grid gap-3 border-t border-line pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-[15px] text-soft">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt-text" strokeWidth={2.6} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
