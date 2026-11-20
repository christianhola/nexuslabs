import { cx } from '../lib/cx'

/** The tight "Inspo" wordmark. `hero` is the landing size; `sm` sits in the app chrome. */
export function Wordmark({ size = 'sm', className, as: Tag = 'span' }: { size?: 'sm' | 'md' | 'hero'; className?: string; as?: 'span' | 'h1' }) {
  return (
    <Tag
      className={cx(
        'font-sans font-medium text-ink',
        size === 'hero' && 'text-[clamp(72px,22vw,var(--text-wordmark))] leading-none tracking-[-0.055em]',
        size === 'md' && 'text-[34px] leading-none tracking-[-0.05em]',
        size === 'sm' && 'text-[19px] leading-none tracking-[-0.04em]',
        className,
      )}
    >
      Inspo
    </Tag>
  )
}
