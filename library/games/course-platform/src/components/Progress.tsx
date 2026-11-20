import { cx } from '../lib/cx'

/* A thin progress bar with an accessible value. */
export function Progress({ value, max = 100, label, className, tone = 'flame' }: { value: number; max?: number; label: string; className?: string; tone?: 'flame' | 'ink' | 'violet' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={max} className={cx('round h-1.5 w-full overflow-hidden rounded-full bg-wash-2', className)}>
      <div className={cx('round h-full rounded-full transition-[width] duration-700 ease-[var(--ease-brand)]', tone === 'flame' && 'bg-flame', tone === 'ink' && 'bg-ink', tone === 'violet' && 'bg-violet')} style={{ width: `${pct}%` }} />
    </div>
  )
}
