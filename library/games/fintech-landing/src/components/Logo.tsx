import { cx } from '../lib/cx'
import { Link } from '../lib/router'

// The pixel-block mark: a big block, a small one, and a grey pixel between.
export function LogoMark({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const main = tone === 'light' ? '#ffffff' : '#ffffff'
  return (
    <svg viewBox="0 0 20 24" className={cx('h-6 w-5', className)} aria-hidden>
      <rect x="0" y="14" width="8" height="10" fill={main} />
      <rect x="9" y="0" width="11" height="12" fill={main} />
      <rect x="6" y="9" width="4" height="4" fill={tone === 'light' ? '#8f8f96' : 'rgb(255 255 255 / 0.6)'} />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cx('group inline-flex min-h-[44px] items-center gap-[10px]', className)} aria-label="Revio home">
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
      <span className="font-display text-[27px] font-semibold leading-none tracking-[-0.04em]">Revio</span>
    </Link>
  )
}
