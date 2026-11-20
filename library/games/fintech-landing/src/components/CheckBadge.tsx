import { cx } from '../lib/cx'

// The scalloped "verified" badge used for proof points.
export function CheckBadge({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx('size-[15px] shrink-0', className)} aria-hidden>
      <defs>
        <linearGradient id="cb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2a8f4" />
          <stop offset="1" stopColor="#b47cf0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#cb)"
        d="M12 1.5l2.4 1.8 3-.2 1 2.8 2.5 1.6-.7 2.9 1.3 2.7-2 2.2.1 3-2.9.7-1.6 2.5-2.8-1L12 22.5l-2.4-1.8-3 .2-1-2.8L3.1 16.5l.7-2.9-1.3-2.7 2-2.2-.1-3 2.9-.7L8.9 2.5l2.8 1z"
      />
      <path d="M8 12.3l2.6 2.6L16.2 9.3" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
