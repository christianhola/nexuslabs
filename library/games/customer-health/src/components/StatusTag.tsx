import type { Status } from '../lib/metrics'
import { cx } from '../lib/cx'

const tone: Record<Status, string> = {
  'At risk': 'text-risk',
  Watch: 'text-fg',
  Healthy: 'text-muted',
}
const dot: Record<Status, string> = {
  'At risk': 'bg-risk',
  Watch: 'bg-mid',
  Healthy: 'bg-high',
}

/** Dot + caps label for an account's status. */
export function StatusTag({ status, className }: { status: Status; className?: string }) {
  return (
    <span className={cx('caps inline-flex items-center gap-2 text-[10px] tracking-[0.2em] whitespace-nowrap', tone[status], className)}>
      <span aria-hidden="true" className={cx('size-1.5 rounded-full', dot[status])} />
      {status}
    </span>
  )
}
