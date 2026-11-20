import { ArrowRight, LoaderCircle } from 'lucide-react'
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'mint' | 'soft' | 'dark' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type Force = 'hover' | 'focus' | 'pressed'

/*
  Buttons. `mint` is the one primary action per view, `soft` is the grey
  bordered button from the nav ("Book a demo"), `dark` a strong secondary,
  `outline` sits on tinted bands and `ghost` is for toolbars. Pass `href` to
  render a link. `force` pins a state for the style guide; `loading` keeps
  the width and shows a spinner.
*/
const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-button)] font-medium tracking-[-0.01em] transition-[background-color,box-shadow,color,transform,border-color] duration-150 ease-[var(--ease-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98] data-[force=pressed]:scale-[0.98] data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  mint: 'bg-mint text-ink shadow-[var(--shadow-button)] ring-1 ring-inset ring-black/[0.06] hover:bg-mint-hover data-[force=hover]:bg-mint-hover active:bg-mint-press data-[force=pressed]:bg-mint-press',
  soft: 'border border-line bg-mist text-ink shadow-[var(--shadow-button)] hover:border-line-strong hover:bg-mist-2 data-[force=hover]:border-line-strong data-[force=hover]:bg-mist-2 active:bg-[#e6e6e3] data-[force=pressed]:bg-[#e6e6e3]',
  dark: 'bg-night text-white hover:bg-night-hover data-[force=hover]:bg-night-hover active:bg-black data-[force=pressed]:bg-black',
  outline: 'border border-line-strong bg-card text-ink hover:bg-mist data-[force=hover]:bg-mist active:bg-mist-2 data-[force=pressed]:bg-mist-2',
  ghost: 'text-body hover:bg-ink/[0.05] data-[force=hover]:bg-ink/[0.05] active:bg-ink/[0.09] data-[force=pressed]:bg-ink/[0.09]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-[14px] sm:h-9',
  md: 'h-11 px-[18px] text-[15px]',
  lg: 'h-[52px] px-6 text-[16px]',
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
type AsLink = Common & { href: string; onClick?: () => void; target?: string; rel?: string; 'aria-label'?: string; 'aria-current'?: 'page' }

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, AsButton | AsLink>(function Button(props, ref) {
  const { variant = 'mint', size = 'md', arrow, loading, force, icon, className, children, ...rest } = props
  const cls = cx(base, variants[variant], sizes[size], className)
  const inner = (
    <>
      <span className={cx('inline-flex items-center gap-2', loading && 'opacity-0')}>
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
    <button ref={ref as Ref<HTMLButtonElement>} type={btn.type ?? 'button'} className={cls} data-force={force} aria-busy={loading || undefined} {...btn} disabled={btn.disabled || loading}>
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
  tone = 'plain',
  ...rest
}: { label: string; children: ReactNode; active?: boolean; force?: Force; tone?: 'plain' | 'soft' | 'dark' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      data-force={force}
      className={cx(
        'grid size-10 shrink-0 place-items-center rounded-[var(--radius-button)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink disabled:opacity-40 [&_svg]:size-[18px]',
        tone === 'plain' && 'text-body hover:bg-ink/[0.06] data-[force=hover]:bg-ink/[0.06] active:bg-ink/[0.1] data-[force=pressed]:bg-ink/[0.1] aria-pressed:bg-ink/[0.08]',
        tone === 'soft' && 'border border-line bg-mist text-ink hover:bg-mist-2 data-[force=hover]:bg-mist-2 aria-pressed:bg-mint-soft aria-pressed:border-mint',
        tone === 'dark' && 'bg-night text-white hover:bg-night-hover data-[force=hover]:bg-night-hover',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
