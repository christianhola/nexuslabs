import { cx } from '../lib/cx'

/* A tiny bar series; the last bar is highlighted. Decorative unless labelled. */
export function BarSpark({ values, className, label }: { values: readonly number[]; className?: string; label?: string }) {
  const max = Math.max(...values)
  return (
    <div className={cx('flex h-full items-end gap-[5px]', className)} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {values.map((v, i) => (
        <span key={i} className={cx('flex-1 rounded-[4px] transition-[height] duration-700 ease-[var(--ease-brand)]', i === values.length - 1 ? 'bg-flame' : 'bg-flame-tint')} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  )
}
