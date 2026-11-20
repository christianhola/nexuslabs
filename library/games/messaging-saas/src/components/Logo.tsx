import { brand } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/** The wordmark: a white speech-bubble chip with cobalt type, tail at the bottom right. */
export function Wordmark({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cx(
        'relative inline-flex w-fit items-center justify-self-start rounded-[7px] bg-white font-display font-bold tracking-[-0.02em] text-cobalt',
        size === 'md' ? 'h-10 px-3 text-[19px]' : 'h-8 px-2.5 text-[16px]',
        className,
      )}
    >
      {brand.name}
      <svg aria-hidden viewBox="0 0 14 9" className={cx('absolute fill-white', size === 'md' ? '-bottom-[7px] right-[18px] h-2 w-3.5' : '-bottom-[6px] right-3 h-1.5 w-3')}>
        <path d="M0 0h14L6.5 9z" />
      </svg>
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${brand.name} home`} className={cx('inline-flex rounded-[8px]', className)}>
      <Wordmark />
    </Link>
  )
}
