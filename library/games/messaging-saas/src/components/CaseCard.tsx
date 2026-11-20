import { ArrowUpRight } from 'lucide-react'

import type { CaseStudy } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Badge } from './Badge'

export function CaseCard({ study, className }: { study: CaseStudy; className?: string }) {
  return (
    <article className={cx('group relative grid overflow-hidden rounded-card border border-line bg-panel shadow-card transition-[border-color,transform] duration-300 ease-brand hover:-translate-y-1 hover:border-line-strong', className)}>
      <div className="relative overflow-hidden">
        <img src={study.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-panel via-transparent" />
        <Badge className="absolute left-4 top-4 bg-bg/70 backdrop-blur">{study.industry}</Badge>
      </div>
      <div className="grid gap-4 p-6">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">{study.brand}</p>
        <h3 className="font-display text-[22px] font-medium leading-[1.25] tracking-[-0.02em] text-white">
          <Link href={`/customers/${study.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {study.title}
          </Link>
        </h3>
        <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <dt className="sr-only">{m.label}</dt>
              <dd className="font-display text-[22px] font-semibold text-white">{m.value}</dd>
              <dd aria-hidden className="text-[12px] leading-tight text-faint">{m.label}</dd>
            </div>
          ))}
        </dl>
        <ArrowUpRight aria-hidden className="absolute right-5 top-5 size-9 rounded-full bg-white p-2 text-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </article>
  )
}
