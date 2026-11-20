import { cx } from '../lib/cx'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('skeleton rounded-control-sm', className)} aria-hidden />
}
