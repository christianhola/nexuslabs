import { cx } from '../lib/cx'

/** Keepsake mark: a bookmark ribbon folded over a card. Replace with your own. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cx('size-8', className)}>
      <rect x="3" y="5" width="20" height="23" rx="5" fill="currentColor" opacity="0.18" />
      <path d="M10 3.5h13a5 5 0 0 1 5 5V28a1 1 0 0 1-1.6.8L19 23.4l-7.4 5.4A1 1 0 0 1 10 28V3.5Z" fill="currentColor" />
      <path d="M10 3.5h4.5V29L10 28V3.5Z" fill="var(--color-lime)" />
    </svg>
  )
}

export function Logo({ wordmark = true, className }: { wordmark?: boolean; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2 text-ink', className)}>
      <Mark />
      {wordmark && <span className="text-[19px] font-bold tracking-[-0.04em]">Keepsake</span>}
    </span>
  )
}
