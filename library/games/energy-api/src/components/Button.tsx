import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Spinner } from './Spinner'

export type ButtonVariant = 'dark' | 'outline' | 'ghost' | 'volt' | 'light' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
/** Pins a visual state for the style guide. */
export type ForceState = 'hover' | 'focus' | 'pressed'

const base =
  'round relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill font-medium tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.98] data-[force=pressed]:scale-[0.98]'

const variants: Record<ButtonVariant, string> = {
  dark: 'bg-ink text-mint hover:bg-ink-2 data-[force=hover]:bg-ink-2 data-[force=pressed]:bg-black',
  outline:
    'bg-paper text-ink shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-paper-2 data-[force=hover]:bg-paper-2 data-[force=hover]:shadow-[inset_0_0_0_1px_var(--color-line-strong)] data-[force=pressed]:bg-mint-2',
  ghost: 'text-ink hover:bg-ink/[0.06] data-[force=hover]:bg-ink/[0.06] data-[force=pressed]:bg-ink/[0.1]',
  volt: 'bg-volt text-ink hover:bg-volt-2 data-[force=hover]:bg-volt-2 data-[force=pressed]:bg-volt-2',
  light: 'bg-on-forest text-forest hover:bg-white data-[force=hover]:bg-white data-[force=pressed]:bg-mint-2',
  danger: 'bg-danger text-white hover:bg-[#93251c] data-[force=hover]:bg-[#93251c]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[14px] sm:h-[34px] sm:px-[15px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-[16px]',
}

type Common = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  force?: ForceState
  icon?: ReactNode
  iconLeft?: ReactNode
  block?: boolean
  children?: ReactNode
  className?: string
}

export type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement>

export function buttonClass({ variant = 'dark', size = 'md', block, className }: Pick<Common, 'variant' | 'size' | 'block' | 'className'>) {
  return cx(base, variants[variant], sizes[size], block && 'w-full', className)
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, force, icon, iconLeft, block, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-force={force}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass({ variant, size, block, className })}
      {...rest}
    >
      {loading ? <Spinner className="size-4" /> : iconLeft}
      {children != null && <span>{children}</span>}
      {!loading && icon}
    </button>
  )
})

export type ButtonLinkProps = Common & { href: string; target?: string; rel?: string; 'aria-label'?: string; onClick?: () => void }

export function ButtonLink({ variant, size, block, className, icon, iconLeft, children, force, href, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} data-force={force} className={buttonClass({ variant, size, block, className })} {...rest}>
      {iconLeft}
      <span>{children}</span>
      {icon}
    </Link>
  )
}
