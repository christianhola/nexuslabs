import { cx } from '../lib/cx'

/** Small tracked caps label after an account name: "ENTERPRISE". */
export function SegmentTag({ children, className }: { children: string; className?: string }) {
  return <span className={cx('caps text-[10.5px] tracking-[0.2em] whitespace-nowrap text-muted', className)}>{children}</span>
}
