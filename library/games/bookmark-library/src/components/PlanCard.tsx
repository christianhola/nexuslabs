import { Check } from 'lucide-react'

import type { PLANS } from '../content'
import { cx } from '../lib/cx'
import { ButtonLink } from './Button'

type Plan = (typeof PLANS)[number]

export function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const price = yearly ? plan.yearly : plan.monthly
  const featured = 'featured' in plan && plan.featured
  return (
    <div className={cx('relative flex flex-col rounded-2xl p-7', featured ? 'bg-ink text-paper shadow-pop' : 'bg-panel shadow-[inset_0_0_0_1px_var(--color-line)]')}>
      {featured && <span className="absolute top-6 right-6 rounded-xs bg-lime px-2 py-1 text-[12px] font-semibold text-ink">Most saved</span>}
      <h3 className="text-[20px] font-semibold tracking-[-0.025em]">{plan.name}</h3>
      <p className={cx('mt-1 text-[15px]', featured ? 'text-white/72' : 'text-muted')}>{plan.blurb}</p>
      <p className="mt-7 flex items-baseline gap-1.5">
        <span className="text-[52px] leading-none font-bold tracking-[-0.05em] tabular-nums">${price}</span>
        <span className={cx('text-[15px]', featured ? 'text-white/72' : 'text-muted')}>{price === 0 ? 'forever' : yearly ? 'a month, billed yearly' : 'a month'}</span>
      </p>
      <ButtonLink href="/#join" variant={featured ? 'lime' : 'soft'} size="md" className="mt-7 w-full">
        {plan.cta}
      </ButtonLink>
      <ul className="mt-7 flex flex-col gap-3 text-[15px]">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span className={cx('mt-0.5 grid size-5 shrink-0 place-items-center rounded-full', featured ? 'bg-lime text-ink' : 'bg-lime-soft text-leaf')}>
              <Check aria-hidden className="size-3" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
