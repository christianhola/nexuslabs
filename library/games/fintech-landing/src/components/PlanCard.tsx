import { Check } from 'lucide-react'

import { cx } from '../lib/cx'
import { Badge } from './Badge'
import { Button } from './Button'
import { Card } from './Card'
import { CountUp } from './CountUp'

export type Plan = {
  id: string
  name: string
  monthly: number
  yearly: number
  blurb: string
  features: string[]
  cta: string
  href: string
  featured?: boolean
}

/** One pricing plan. The price eases between monthly and yearly. */
export function PlanCard({ plan, yearly, highlight = false, className }: { plan: Plan; yearly: boolean; highlight?: boolean; className?: string }) {
  const featured = plan.featured || highlight
  return (
    <Card
      variant={featured ? 'featured' : 'surface'}
      className={cx('flex h-full flex-col transition-transform duration-300 hover:-translate-y-1', className)}
    >
      {plan.featured && (
        <Badge tone="violet" className="absolute right-6 top-6">
          Most popular
        </Badge>
      )}
      <h3 className="font-display text-[20px] font-semibold tracking-[-0.02em]">{plan.name}</h3>
      <p className="mt-1.5 text-[14px] text-muted">{plan.blurb}</p>
      <div className="mt-7 flex items-end gap-1.5">
        <CountUp
          value={yearly ? plan.yearly : plan.monthly}
          from={plan.monthly}
          prefix="$"
          duration={0.6}
          className="font-display text-[52px] font-semibold leading-none tracking-[-0.04em] tabular"
        />
        <span className="mb-1.5 text-[14px] text-muted">/ month{yearly && plan.yearly > 0 ? ', billed yearly' : ''}</span>
      </div>
      <Button href={plan.href} variant={featured ? 'primary' : 'outline'} size="lg" className="mt-7 w-full text-[15px]">
        {plan.cta}
      </Button>
      <ul className="mt-7 flex flex-col gap-3 text-[15px]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-soft">
            <span className={cx('grid size-5 shrink-0 place-items-center rounded-full round', featured ? 'bg-violet' : 'bg-white/[0.08]')}>
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </Card>
  )
}
