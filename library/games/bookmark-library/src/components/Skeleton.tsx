import { cx } from '../lib/cx'

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cx('skeleton block rounded-sm', className)} />
}
