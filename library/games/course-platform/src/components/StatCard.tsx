import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

import { cx } from '../lib/cx'
import { Skeleton } from './Skeleton'

/* A KPI tile: label, big value, change versus the previous period. */
export function StatCard({ label, value, delta, loading, className }: { label: string; value: string; delta?: number; loading?: boolean; className?: string }) {
  const up = (delta ?? 0) >= 0
  return (
    <div className={cx('rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-card', className)}>
      <p className="text-[14px] text-muted">{label}</p>
      {loading ? (
        <>
          <Skeleton className="mt-2.5 h-8 w-28" />
          <Skeleton className="mt-2 h-4 w-20" />
        </>
      ) : (
        <>
          <p className="mt-1.5 font-display text-[30px] font-medium tracking-[-0.03em] text-ink">{value}</p>
          {delta != null ? (
            <p className={cx('mt-1 inline-flex items-center gap-1 text-[13px] font-medium', up ? 'text-ok' : 'text-bad')}>
              {up ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
              {up ? '+' : ''}
              {delta.toFixed(1)}% <span className="font-normal text-muted">vs previous</span>
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}
