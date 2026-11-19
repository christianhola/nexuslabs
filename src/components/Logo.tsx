import { Link } from 'react-router'

import { BRAND } from '../content'
import { cx } from '../lib/cx'

export function Logo({ tone = 'dark', className, onClick }: { tone?: 'dark' | 'light'; className?: string; onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${BRAND.name}, home`}
      className={cx('inline-flex min-h-10 items-center text-[22px] font-semibold tracking-[-0.07em]', tone === 'light' ? 'on-dark text-snow' : 'text-ink', className)}
    >
      {BRAND.wordmark}
    </Link>
  )
}
