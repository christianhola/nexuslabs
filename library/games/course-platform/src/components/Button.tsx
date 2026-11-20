import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'primary' | 'outline' | 'dark' | 'soft' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type Force = 'hover' | 'focus' | 'pressed'

/*
  Buttons with the reference's soft-square shape. `primary` (flame with a
  warm glow) is the one main action per view, `outline` the secondary,
  `dark` for dense app chrome, `soft` for tinted tertiary actions, `ghost`
  for toolbars. Pass `href` to render a link. `force` pins a state for the
  style guide; `loading` keeps the width and shows a spinner.
*/
const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] font-display font-medium tracking-[-0.005em] transition-[background-color,box-shadow,color,transform,border-color] duration-200 ease-[var(--ease-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-strong active:scale-[0.98] data-[force=pressed]:scale-[0.98] data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-flame-strong disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-flame-strong text-white shadow-glow hover:bg-flame-hover data-[force=hover]:bg-flame-hover active:bg-flame-press data-[force=pressed]:bg-flame-press',
  outline:
    'border border-line-strong bg-card text-ink shadow-[0_1px_2px_rgb(18_18_20/0.05)] hover:border-[#b9b9c1] hover:bg-wash data-[force=hover]:border-[#b9b9c1] data-[force=hover]:bg-wash active:bg-wash-2 data-[force=pressed]:bg-wash-2',
  dark: 'bg-night text-on-dark hover:bg-night-hover data-[force=hover]:bg-night-hover active:bg-black data-[force=pressed]:bg-black',
  soft: 'bg-flame-soft text-flame-ink hover:bg-flame-tint data-[force=hover]:bg-flame-tint active:bg-flame-tint data-[force=pressed]:bg-flame-tint',
  ghost: 'text-body hover:bg-ink/[0.05] data-[force=hover]:bg-ink/[0.05] active:bg-ink/[0.09] data-[force=pressed]:bg-ink/[0.09]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-[14px] sm:h-9',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-[15.5px] sm:h-[46px]',
}

type Common = {
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  loading?: boolean
  force?: Force
  icon?: ReactNode
  className?: string
  children: ReactNode
}

type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & { href?: undefined }
type AsLink = Common & { href: string; onClick?: () => void; target?: string; 'aria-label'?: string }

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, AsButton | AsLink>(function Button(props, ref) {
  const { variant = 'primary', size = 'md', arrow, loading, force, icon, className, children, ...rest } = props
  const cls = cx(base, variants[variant], sizes[size], className)
  const inner = (
    <>
      <span className={cx('inline-flex items-center gap-2', loading && 'opacity-0')}>
        {icon}
        {children}
        {arrow ? <ArrowUpRight className="size-[1.05em] transition-transform duration-200 group-hover/btn:-translate-y-px group-hover/btn:translate-x-px" aria-hidden /> : null}
      </span>
      {loading ? (
        <span className="absolute inset-0 grid place-items-center">
          <LoaderCircle className="size-[1.15em] animate-spin" aria-hidden />
        </span>
      ) : null}
    </>
  )
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as AsLink
    return (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cls} data-force={force} {...linkRest}>
        {inner}
      </Link>
    )
  }
  const btn = rest as Omit<AsButton, keyof Common>
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={btn.type ?? 'button'}
      className={cls}
      data-force={force}
      aria-busy={loading || undefined}
      disabled={btn.disabled || loading}
      {...btn}
    >
      {inner}
    </button>
  )
})

/* Square icon-only button for toolbars and rows. Always pass a label. */
export function IconButton({
  label,
  children,
  className,
  active,
  force,
  size = 'md',
  ...rest
}: { label: string; children: ReactNode; active?: boolean; force?: Force; size?: 'sm' | 'md' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      data-force={force}
      className={cx(
        'grid shrink-0 place-items-center rounded-[9px] text-muted transition-colors duration-150 hover:bg-ink/[0.06] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-flame-strong data-[force=hover]:bg-ink/[0.06] data-[force=focus]:outline-2 data-[force=focus]:outline-flame-strong active:bg-ink/[0.1] data-[force=pressed]:bg-ink/[0.1] aria-pressed:bg-flame-soft aria-pressed:text-flame-ink disabled:opacity-40',
        size === 'md' ? 'size-10 [&_svg]:size-[18px]' : 'size-10 sm:size-8 [&_svg]:size-4',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
