import { Check } from 'lucide-react'

import type { Package } from '../content'
import { cx } from '../lib/cx'
import { money } from '../lib/format'
import { ButtonLink } from './Button'
import { Photo } from './Photo'

/** One service package: number, photo, fixed fee, what is included, book. */
export function PackageCard({ pkg, featured, className, compact }: { pkg: Package; featured?: boolean; className?: string; compact?: boolean }) {
  return (
    <article className={cx('flex flex-col rounded-[var(--radius-md)] p-5 md:p-6', featured ? 'on-dark bg-night text-snow' : 'bg-card shadow-[var(--shadow-inset)]', className)}>
      <div className="flex items-start justify-between gap-4">
        <span className={cx('label-sm tabular-nums', featured ? 'text-snow-muted' : 'text-muted')}>{pkg.number}</span>
        {featured && <span className="round rounded-full bg-snow px-2.5 py-1 text-[12px] font-medium text-ink">Most chosen</span>}
      </div>
      <h3 className="mt-6 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none font-medium tracking-[-0.045em]">{pkg.name}</h3>
      <p className={cx('mt-3 text-[15px] leading-snug text-pretty', featured ? 'text-snow-muted' : 'text-ink-2')}>{pkg.summary}</p>
      {!compact && <Photo name={pkg.image} alt="" className="mt-6 aspect-[16/10] rounded-[var(--radius-sm)]" />}
      <p className="mt-6 flex items-baseline gap-2">
        {pkg.from && <span className={cx('text-[14px]', featured ? 'text-snow-muted' : 'text-muted')}>from</span>}
        <span className="text-[40px] leading-none font-medium tracking-[-0.05em] tabular-nums">{money(pkg.price)}</span>
        <span className={cx('text-[14px]', featured ? 'text-snow-muted' : 'text-muted')}>{pkg.unit}</span>
      </p>
      <p className={cx('mt-1 text-[13px]', featured ? 'text-snow-muted' : 'text-muted')}>{pkg.duration}</p>
      {!compact && (
        <ul className={cx('mt-6 flex flex-col gap-2 border-t pt-5 text-[15px]', featured ? 'border-night-line' : 'border-line')}>
          {pkg.includes.map((item) => (
            <li key={item} className="flex gap-2.5">
              <Check className={cx('mt-0.5 size-4 shrink-0', featured ? 'text-snow' : 'text-olive')} strokeWidth={2} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-8">
        <ButtonLink to={`/book?package=${pkg.id}`} variant={featured ? 'light' : 'solid'} className="w-full" icon>
          Book this package<span className="sr-only">: {pkg.name}</span>
        </ButtonLink>
      </div>
    </article>
  )
}
