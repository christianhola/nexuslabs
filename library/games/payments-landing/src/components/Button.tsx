import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost' | 'light' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
/** Pins a visual state for the style guide. */
export type ForceState = 'hover' | 'focus' | 'pressed'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px data-[force=pressed]:translate-y-px'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-teal-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14)] hover:bg-teal-deep data-[force=hover]:bg-teal-deep data-[force=pressed]:bg-teal-deep',
  dark: 'bg-navy text-white hover:bg-navy-2 data-[force=hover]:bg-navy-2 data-[force=pressed]:bg-navy-3',
  outline:
    'border border-line-strong bg-white text-ink hover:border-ink/40 hover:bg-mist-2 data-[force=hover]:border-ink/40 data-[force=hover]:bg-mist-2 data-[force=pressed]:bg-mist',
  ghost: 'text-ink hover:bg-ink/[0.05] data-[force=hover]:bg-ink/[0.05] data-[force=pressed]:bg-ink/[0.08]',
  light: 'bg-white text-navy hover:bg-teal-50 data-[force=hover]:bg-teal-50 data-[force=pressed]:bg-teal-100',
  danger: 'bg-danger text-white hover:bg-[#962722] data-[force=hover]:bg-[#962722]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 rounded-control-sm px-4 text-[14px]',
  md: 'h-11 rounded-control px-5 text-[15px]',
  lg: 'h-13 rounded-control px-6 text-[16px]',
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

export function buttonClass({ variant = 'primary', size = 'md', block, className }: Pick<Common, 'variant' | 'size' | 'block' | 'className'>) {
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
      <span>{children}</span>
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
