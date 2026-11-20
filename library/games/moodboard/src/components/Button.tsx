import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-[#2a2a2a] active:bg-black shadow-[0_1px_2px_rgb(0_0_0/0.2)]',
  secondary: 'bg-surface text-ink ring-1 ring-inset ring-line-strong hover:bg-surface-2 active:bg-surface-3',
  ghost: 'bg-transparent text-ink hover:bg-black/[0.05] active:bg-black/[0.09]',
  danger: 'bg-danger text-white hover:bg-[#c02633] active:bg-[#a81f2b]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 sm:h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-[14px] gap-2',
  lg: 'h-11 px-[22px] text-[15px] gap-2',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
}

/** Button styling for things that must be links (an <a> that looks like a Button). */
export function buttonClasses({ variant = 'primary', size = 'md', className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cx(
    'inline-flex select-none items-center justify-center whitespace-nowrap rounded-[var(--radius-control)] font-medium tracking-[-0.005em]',
    'transition-[background-color,transform,box-shadow,opacity] duration-150 ease-out active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-45',
    variants[variant],
    sizes[size],
    className,
  )
}

/** The one button. Primary is the black "Get Started" pill-square from the landing card. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, icon, iconRight, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, className })}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 13 : 15} /> : icon}
      {children}
      {iconRight}
    </button>
  )
})
