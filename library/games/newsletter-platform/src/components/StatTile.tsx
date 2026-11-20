import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  A bordered metric box like the hero's "Recipients": label, big number and
  either a delta chip or two detail rows underneath.
*/
export function StatTile({ label, value, delta, rows, className, size = 'md' }: { label: string; value: ReactNode; delta?: number; rows?: [string, string][]; className?: string; size?: 'sm' | 'md' }) {
  return (
    <div className={cx('rounded-[10px] border border-line-strong bg-night-2/70', size === 'sm' ? 'p-3' : 'p-4 sm:p-5', className)}>
      <p className={cx('text-muted', size === 'sm' ? 'text-[11px]' : 'text-[14px]')}>{label}</p>
      <p className={cx('mt-1 font-sans font-medium tabular-nums tracking-[-0.02em] text-white', size === 'sm' ? 'text-[26px] leading-tight' : 'text-[32px] leading-tight')}>{value}</p>
      {delta != null ? (
        <p className={cx('mt-2 inline-flex items-center gap-1 text-[13px] font-semibold', delta >= 0 ? 'text-ok' : 'text-bad')}>
          {delta >= 0 ? <ArrowUpRight className="size-4" aria-hidden /> : <ArrowDownRight className="size-4" aria-hidden />}
          {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)}% <span className="font-normal text-muted">vs previous</span>
        </p>
      ) : null}
      {rows ? (
        <dl className="mt-2.5 divide-y divide-line border-t border-line">
          {rows.map(([k, v]) => (
            <div key={k} className={cx('flex justify-between gap-2 py-1.5', size === 'sm' ? 'text-[9.5px]' : 'text-[12px]')}>
              <dt className="text-muted">{k}</dt>
              <dd className="tabular-nums text-body">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  )
}
