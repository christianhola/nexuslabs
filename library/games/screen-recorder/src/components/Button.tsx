import { type AnchorHTMLAttributes, type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { Link } from '@/lib/router'
import { Spinner } from './Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'record' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  // The reference's cream pill ("Get started free", "Sign up").
  primary: 'bg-cream text-ink hover:bg-[#fffaf0] active:bg-[#e6e0d3] shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)]',
  // The dark outlined pill ("Talk to us").
  secondary: 'bg-surface-2/70 text-fg ring-1 ring-inset ring-line-strong hover:bg-raised hover:ring-[rgb(255_244_228/0.22)] active:bg-surface',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2 active:bg-raised',
  record: 'bg-record text-white hover:bg-[#c23338] active:bg-[#ad2d32]',
  danger: 'text-ember-text ring-1 ring-inset ring-ember/40 hover:bg-ember/10 active:bg-ember/15',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5 pointer-coarse:h-10',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-[19px] text-[17px] gap-2.5',
}

const BASE =
  'group/btn relative inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap select-none ' +
  'transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] ' +
  'disabled:opacity-45 disabled:active:scale-100'

/** The class string for a button look, for links and other elements that should match. */
export const buttonClass = (variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', className?: string) => cn(BASE, VARIANTS[variant], SIZES[size], className)

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; iconRight?: ReactNode }

/** A router link that looks like a Button. */
export function ButtonLink({ to, variant, size, className, children, icon, iconRight, ...rest }: LinkProps) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconRight && <span className="transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5">{iconRight}</span>}
    </Link>
  )
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'secondary', size = 'md', loading, icon, iconRight, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={buttonClass(variant, size, className)} {...rest}>
      {loading ? <Spinner className="size-4" /> : icon}
      {children}
      {iconRight && !loading && <span className="transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5">{iconRight}</span>}
    </button>
  )
})

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { label: string; size?: 'sm' | 'md'; children: ReactNode }

/** Round icon-only button. `label` is its accessible name and tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ label, size = 'md', className, children, type = 'button', ...rest }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg active:bg-raised disabled:opacity-40',
        size === 'sm' ? 'size-8 pointer-coarse:size-10' : 'size-10',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
