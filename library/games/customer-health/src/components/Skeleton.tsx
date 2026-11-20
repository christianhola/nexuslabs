import { cx } from '../lib/cx'

/** Loading placeholder bar with a slow shimmer (static under reduced motion). */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx('block animate-shimmer rounded-[3px] bg-fg/[0.07]', className)} />
}
