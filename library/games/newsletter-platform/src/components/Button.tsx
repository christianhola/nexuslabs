import { ArrowRight, LoaderCircle } from 'lucide-react'
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'white' | 'primary' | 'outline' | 'ghost' | 'pink'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type Force = 'hover' | 'focus' | 'pressed'

/*
  `white` is the nav's one call to action, `primary` (ink blue) the main
  action in a page, `outline` the secondary, `pink` for monetisation moments
  and `ghost` for toolbars. Pass `href` to render a link. `force` pins a
  state for the style guide; `loading` keeps the width and shows a spinner.
*/
const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] font-semibold tracking-[-0.005em] transition-[background-color,box-shadow,color,transform,border-color] duration-200 ease-[var(--ease-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink active:scale-[0.98] data-[force=pressed]:scale-[0.98] data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-pink disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  white: 'bg-white text-night hover:bg-[#ece9f3] data-[force=hover]:bg-[#ece9f3] active:bg-[#dcd8e6] data-[force=pressed]:bg-[#dcd8e6]',
  primary: 'bg-ink-blue text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] hover:bg-ink-blue-hover data-[force=hover]:bg-ink-blue-hover active:bg-ink-blue-press data-[force=pressed]:bg-ink-blue-press',
  outline: 'border border-line-strong bg-night/40 text-ink hover:border-[#4d4858] hover:bg-panel-2 data-[force=hover]:border-[#4d4858] data-[force=hover]:bg-panel-2 active:bg-panel-3 data-[force=pressed]:bg-panel-3',
  pink: 'bg-pink-fill text-white hover:bg-[#b8288f] data-[force=hover]:bg-[#b8288f] active:bg-[#ad2388] data-[force=pressed]:bg-[#ad2388]',
  ghost: 'text-body hover:bg-white/[0.06] hover:text-ink data-[force=hover]:bg-white/[0.06] active:bg-white/[0.1] data-[force=pressed]:bg-white/[0.1]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-[14px] sm:h-9',
  md: 'h-11 px-4.5 text-[15px]',
  lg: 'h-14 px-6 text-[18px]',
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
      <span className={cx('inline-flex items-center gap-2.5', loading && 'opacity-0')}>
        {icon}
        {children}
        {arrow ? <ArrowRight className="size-[1.05em] transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden /> : null}
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
      <Link ref={ref as Ref<HTMLAnchorElement>} href={href} className={cls} data-force={force} {...linkRest}>
        {inner}
      </Link>
    )
  }
  const btn = rest as Omit<AsButton, keyof Common>
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={btn.type ?? 'button'}
      className={cls}
      data-force={force}
      aria-busy={loading || undefined}
      {...btn}
      disabled={btn.disabled || loading}
    >
      {inner}
    </button>
  )
})

/* Square icon-only button for toolbars and cards. Always pass a label. */
export function IconButton({
  label,
  children,
  className,
  active,
  force,
  ...rest
}: { label: string; children: ReactNode; active?: boolean; force?: Force } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      data-force={force}
      className={cx(
        'grid size-10 shrink-0 place-items-center rounded-[var(--radius-control)] text-muted transition-colors duration-150 hover:bg-white/[0.07] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink active:bg-white/[0.11] disabled:pointer-events-none disabled:opacity-35 aria-pressed:bg-white/[0.09] aria-pressed:text-ink data-[force=hover]:bg-white/[0.07] data-[force=hover]:text-ink data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-pink data-[force=pressed]:bg-white/[0.11] sm:size-9 [&_svg]:size-[18px]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
