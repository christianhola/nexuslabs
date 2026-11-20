import { Check } from 'lucide-react'

import type { Plan } from '../content'
import { cx } from '../lib/cx'
import { ButtonLink } from './Button'

export function PlanCard({ plan, billing, className }: { plan: Plan; billing: 'monthly' | 'yearly'; className?: string }) {
  const price = billing === 'yearly' ? plan.yearly : plan.monthly
  const featured = plan.featured
  return (
    <article
      className={cx(
        'relative flex flex-col overflow-hidden rounded-card p-7 sm:p-8',
        featured ? 'bg-teal-ink text-white shadow-float' : 'border border-line bg-white',
        className,
      )}
    >
      {featured && (
        <svg aria-hidden className="absolute inset-0 size-full opacity-[0.1]" viewBox="0 0 400 520" preserveAspectRatio="none">
          <path d="M240 0 L400 0 L400 300 L120 520 L60 520 Z" fill="white" />
        </svg>
      )}
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[26px] font-medium tracking-[-0.03em]">{plan.name}</h3>
          {featured && <span className="rounded-[8px] bg-white/15 px-2 py-1 text-[12px] font-medium">Most popular</span>}
        </div>
        <p className={cx('mt-2 text-[14px]', featured ? 'text-white/85' : 'text-muted')}>{plan.blurb}</p>
        <p className="mt-6 flex items-baseline gap-1.5">
          <span className="tabular text-[48px] font-medium leading-none tracking-[-0.04em]">${price}</span>
          <span className={cx('text-[14px]', featured ? 'text-white/85' : 'text-muted')}>per month{billing === 'yearly' && price > 0 ? ', billed yearly' : ''}</span>
        </p>
        <ul className="mt-7 space-y-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[14.5px]">
              <Check className={cx('mt-0.5 size-4 shrink-0', featured ? 'text-teal-100' : 'text-teal-ink')} aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      </div>
      <ButtonLink
        href={plan.id === 'scale' ? '/security#request' : `/signup?plan=${plan.id}`}
        variant={featured ? 'light' : 'outline'}
        block
        className="relative mt-8"
      >
        {plan.cta}
      </ButtonLink>
    </article>
  )
}
