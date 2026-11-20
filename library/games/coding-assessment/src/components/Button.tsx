import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type Force = 'hover' | 'focus' | 'pressed'

/*
  `primary` is the mint Sign up button, `dark` the near-black hero call to
  action with a lit edge, `secondary` the grey Request demo button. `data-force`
  pins a state for the style guide.
*/
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-[#3ae69a] data-[force=hover]:bg-[#3ae69a] active:bg-brand-deep active:text-white data-[force=pressed]:bg-brand-deep data-[force=pressed]:text-white',
  dark: 'bg-[#020405] text-fg shadow-cta hover:bg-[#08100f] hover:shadow-[0_0_0_1px_rgb(69_232_160/0.5),0_18px_50px_-10px_rgb(31_220_138/0.5)] data-[force=hover]:shadow-[0_0_0_1px_rgb(69_232_160/0.5),0_18px_50px_-10px_rgb(31_220_138/0.5)] active:bg-black data-[force=pressed]:bg-black',
  secondary: 'bg-[#263235] text-fg hover:bg-[#2f3d40] data-[force=hover]:bg-[#2f3d40] active:bg-[#1d2729] data-[force=pressed]:bg-[#1d2729]',
  ghost: 'text-muted hover:bg-white/6 hover:text-fg data-[force=hover]:bg-white/6 data-[force=hover]:text-fg active:bg-white/10 data-[force=pressed]:bg-white/10',
  danger: 'bg-danger-fill text-white hover:bg-[#b02f36] data-[force=hover]:bg-[#b02f36] active:bg-[#9c2a30] data-[force=pressed]:bg-[#9c2a30]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 sm:h-9 gap-1.5 px-3.5 text-[13.5px] rounded-[10px]',
  md: 'h-10 gap-2 px-4 text-[14.5px] rounded-control',
  lg: 'h-13 gap-2.5 px-6 text-[17px] rounded-control-lg',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cx(
    'relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium transition-[background-color,box-shadow,color,transform] duration-200 active:scale-[0.98] data-[force=pressed]:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45',
    variants[variant],
    sizes[size],
    className,
  )
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; force?: Force; icon?: ReactNode; iconRight?: ReactNode }

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Common

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant, size, loading, force, icon, iconRight, className, children, disabled, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} data-force={force} disabled={disabled || loading} aria-busy={loading || undefined} className={buttonClass(variant, size, className)} {...rest}>
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  )
})

export function ButtonLink({ href, variant, size, force, icon, iconRight, className, children, ...rest }: Common & { href: string; className?: string; children: ReactNode; target?: string; rel?: string; 'aria-label'?: string; onClick?: () => void }) {
  return (
    <Link href={href} data-force={force} className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}

export function IconButton({ label, size = 'md', className, children, force, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; size?: 'sm' | 'md'; force?: Force }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      data-force={force}
      className={cx(
        'inline-grid shrink-0 place-items-center rounded-[10px] text-muted transition-colors hover:bg-white/8 hover:text-fg data-[force=hover]:bg-white/8 data-[force=hover]:text-fg active:bg-white/12 data-[force=pressed]:bg-white/12 disabled:opacity-40 disabled:pointer-events-none',
        size === 'sm' ? 'size-10 sm:size-8' : 'size-10',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
