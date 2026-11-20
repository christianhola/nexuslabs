import { cx } from '../lib/cx'

/* A shimmering placeholder block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('skeleton rounded-[8px]', className)} aria-hidden />
}
