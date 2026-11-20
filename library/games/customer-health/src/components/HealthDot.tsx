import { healthFill } from '../lib/healthColor'
import { cx } from '../lib/cx'

/** A circle filled from the health scale (orange at risk, grey when healthy). */
export function HealthDot({ score, size = 10, className }: { score: number; size?: number; className?: string }) {
  return <span aria-hidden="true" className={cx('inline-block shrink-0 rounded-full', className)} style={{ width: size, height: size, background: healthFill(score) }} />
}
