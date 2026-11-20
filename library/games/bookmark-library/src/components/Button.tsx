import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'lime' | 'dark' | 'soft' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

/*
  The one button. `data-force="hover|focus|pressed"` pins a state for the
  style guide; the same selectors style the real interaction.
*/
const VARIANTS: Record<ButtonVariant, string> = {
  lime: 'bg-lime text-ink shadow-lime hover:bg-lime-hover data-[force=hover]:bg-lime-hover active:bg-lime-press data-[force=pressed]:bg-lime-press',
  dark: 'bg-ink text-paper hover:bg-ink-2 data-[force=hover]:bg-ink-2 active:bg-black data-[force=pressed]:bg-black',
  soft: 'bg-chip text-ink hover:bg-chip-2 data-[force=hover]:bg-chip-2 active:bg-line-2 data-[force=pressed]:bg-line-2',
  outline: 'bg-panel text-ink shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:bg-white data-[force=hover]:bg-white active:bg-chip data-[force=pressed]:bg-chip',
  ghost: 'text-ink hover:bg-chip data-[force=hover]:bg-chip active:bg-chip-2 data-[force=pressed]:bg-chip-2',
  danger: 'bg-danger text-white hover:bg-[#9a1d13] data-[force=hover]:bg-[#9a1d13] active:bg-[#7f170f] data-[force=pressed]:bg-[#7f170f]',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 gap-1.5 rounded-sm px-3 text-[14px] sm:h-9',
  md: 'h-11 gap-2 rounded-md px-4.5 text-[15px]',
  lg: 'h-[52px] gap-2 rounded-lg px-6 text-[17px]',
}

export function buttonClass(variant: ButtonVariant = 'soft', size: ButtonSize = 'md', extra?: string) {
  return cx(
    'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium tracking-[-0.01em] transition-[background-color,box-shadow,transform,color] duration-(--duration-fast) ease-out-soft',
    'active:translate-y-px data-[force=pressed]:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45',
    'data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink',
    VARIANTS[variant],
    SIZES[size],
    extra,
  )
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; icon?: ReactNode; iconEnd?: ReactNode; force?: 'hover' | 'focus' | 'pressed' }

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Common

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, loading, icon, iconEnd, force, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} data-force={force} disabled={disabled || loading} aria-busy={loading || undefined} className={buttonClass(variant, size, className)} {...rest}>
      {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : icon}
      {children}
      {iconEnd}
    </button>
  )
})

export function ButtonLink({ href, variant, size, icon, iconEnd, force, className, children, ...rest }: Common & { href: string; className?: string; children: ReactNode; 'aria-label'?: string; target?: string; rel?: string }) {
  return (
    <Link href={href} data-force={force} className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
      {iconEnd}
    </Link>
  )
}

export const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { label: string; variant?: ButtonVariant; size?: 'sm' | 'md'; force?: 'hover' | 'focus' | 'pressed' }>(function IconButton(
  { label, variant = 'ghost', size = 'md', force, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} aria-label={label} title={label} data-force={force} className={buttonClass(variant, size, cx(size === 'sm' ? 'w-10 px-0! sm:w-9' : 'w-11 px-0!', className))} {...rest}>
      {children}
    </button>
  )
})
