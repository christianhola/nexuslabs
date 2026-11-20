import { ArrowUpRight } from 'lucide-react'

import type { UseCase } from '../content'
import { Link } from '../lib/router'
import { Media } from './Media'

export function UseCaseCard({ useCase }: { useCase: UseCase }) {
  return (
    <Link href={`/use-cases#${useCase.id}`} className="group block h-full rounded-card bg-paper p-2 shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_var(--color-line-strong),var(--shadow-card)]">
      <Media name={useCase.image} className="aspect-[4/3] rounded-card-sm transition-transform" />
      <div className="px-4 pb-4 pt-5">
        <p className="text-[13.5px] font-medium text-leaf">{useCase.label}</p>
        <h3 className="mt-1 flex items-start justify-between gap-3 text-[20px] font-medium leading-tight tracking-[-0.02em]">
          {useCase.title}
          <ArrowUpRight className="mt-0.5 size-5 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
        </h3>
        <p className="mt-4 border-t border-line pt-4 text-[14px] text-muted">
          <span className="text-[17px] font-medium tracking-[-0.02em] text-ink">{useCase.metric.value}</span> {useCase.metric.label}
        </p>
      </div>
    </Link>
  )
}
