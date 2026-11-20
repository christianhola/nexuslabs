import { cx } from '../lib/cx'

/** A small ring spinner that inherits the text colour. */
export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx('inline-block shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent', className)}
      style={{ width: size, height: size }}
    />
  )
}
