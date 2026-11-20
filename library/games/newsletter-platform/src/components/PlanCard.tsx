import { Check } from 'lucide-react'

import type { Plan } from '../content'
import { cx } from '../lib/cx'
import { Badge } from './Badge'
import { Button } from './Button'

/* One pricing tier. `price` is null for "talk to us" plans. */
export function PlanCard({ plan, price, period, note }: { plan: Plan; price: number | null; period: string; note?: string }) {
  return (
    <div className={cx('relative flex flex-col rounded-[var(--radius-card)] border p-6', plan.featured ? 'border-pink/50 bg-[linear-gradient(180deg,rgb(229_72_191/0.12),rgb(19_17_27)_45%)] shadow-[0_0_0_1px_rgb(229_72_191/0.2),0_30px_60px_-30px_rgb(229_72_191/0.4)]' : 'border-line bg-panel')}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-[22px] font-extrabold tracking-[-0.03em] text-white">{plan.name}</h3>
        {plan.featured ? <Badge tone="pink">Most popular</Badge> : null}
      </div>
      <p className="mt-2 min-h-[44px] text-[14px] text-muted">{plan.blurb}</p>
      <p className="mt-5 flex items-baseline gap-1.5">
        {price == null ? (
          <span className="font-display text-[40px] font-black tracking-[-0.04em] text-white">Custom</span>
        ) : (
          <>
            <span className="font-display text-[44px] font-black tabular-nums tracking-[-0.04em] text-white">${price}</span>
            <span className="text-[14px] text-muted">{period}</span>
          </>
        )}
      </p>
      <p className="mt-1 min-h-[20px] text-[13px] text-faint">{note}</p>
      <Button href={plan.href} variant={plan.featured ? 'primary' : plan.id === 'enterprise' ? 'outline' : 'white'} className="mt-6 w-full">
        {plan.cta}
      </Button>
      <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[14px] text-body">
            <Check className="mt-0.5 size-4 shrink-0 text-pink-text" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
