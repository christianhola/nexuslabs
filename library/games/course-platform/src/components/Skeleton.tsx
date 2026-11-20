import { cx } from '../lib/cx'

export function Skeleton({ className }: { className?: string }) {
  return <span className={cx('skeleton block rounded-[8px]', className)} aria-hidden />
}
