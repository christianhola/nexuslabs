import { ArrowRight, LoaderCircle } from 'lucide-react'
import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'lime' | 'dark' | 'outline' | 'ghost' | 'white'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type Force = 'hover' | 'focus' | 'pressed'

/*
  Pill buttons. `lime` is the one primary action per view, `dark` the
  secondary, `outline`/`white` sit on cards and photos, `ghost` is for
  toolbars. Pass `href` to render a link. `data-force` pins a state for the
  style guide; `loading` keeps the width and shows a spinner.
*/
const base =
  'group/btn round relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,color,transform] duration-200 ease-[var(--ease-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf active:scale-[0.97] data-[force=pressed]:scale-[0.97] data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-leaf disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  lime: 'bg-lime text-ink shadow-[inset_0_-1px_0_rgb(0_0_0/0.08),0_1px_2px_rgb(59_122_26/0.25)] hover:bg-lime-hover data-[force=hover]:bg-lime-hover active:bg-lime-press data-[force=pressed]:bg-lime-press',
  dark: 'bg-night text-on-dark shadow-[0_1px_2px_rgb(0_0_0/0.2)] hover:bg-night-hover data-[force=hover]:bg-night-hover active:bg-black data-[force=pressed]:bg-black',
  outline: 'bg-card text-ink ring-1 ring-inset ring-line-strong hover:bg-wash data-[force=hover]:bg-wash active:bg-wash-2 data-[force=pressed]:bg-wash-2',
  white: 'bg-white/90 text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)] backdrop-blur hover:bg-white data-[force=hover]:bg-white active:bg-wash data-[force=pressed]:bg-wash',
  ghost: 'text-body hover:bg-ink/[0.05] data-[force=hover]:bg-ink/[0.05] active:bg-ink/[0.09] data-[force=pressed]:bg-ink/[0.09]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[13px] sm:h-8 sm:px-3.5',
  md: 'h-11 px-5 text-[14px] sm:h-10',
  lg: 'h-12 px-6 text-[15px]',
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
  const { variant = 'lime', size = 'md', arrow, loading, force, icon, className, children, ...rest } = props
  const cls = cx(base, variants[variant], sizes[size], className)
  const inner = (
    <>
      {icon}
      <span className={cx('inline-flex items-center gap-2', loading && 'opacity-0')}>
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

/* Square icon-only button for toolbars and cards. Always pass a label. */
export function IconButton({
  label,
  children,
  className,
  active,
  force,
  tone = 'plain',
  ...rest
}: { label: string; children: ReactNode; active?: boolean; force?: Force; tone?: 'plain' | 'lime' | 'dark' } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      data-force={force}
      className={cx(
        'round grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-leaf disabled:opacity-40 sm:size-9 [&_svg]:size-[18px]',
        tone === 'plain' && 'text-body hover:bg-ink/[0.06] data-[force=hover]:bg-ink/[0.06] active:bg-ink/[0.1] data-[force=pressed]:bg-ink/[0.1] aria-pressed:bg-ink/[0.08]',
        tone === 'lime' && 'bg-lime-soft text-leaf-deep hover:bg-lime data-[force=hover]:bg-lime aria-pressed:bg-lime',
        tone === 'dark' && 'bg-night text-on-dark hover:bg-night-hover data-[force=hover]:bg-night-hover aria-pressed:bg-black',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
