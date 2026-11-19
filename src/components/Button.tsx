import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { cx } from '../lib/cx'

export type Variant = 'solid' | 'outline' | 'light' | 'outline-light' | 'ghost'
export type Size = 'sm' | 'md' | 'lg'

const BASE =
  'group/btn round relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-medium tracking-[-0.015em] transition-[background-color,color,border-color,transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-soft)] active:scale-[0.97] data-[force=pressed]:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40'

const VARIANTS: Record<Variant, string> = {
  solid: 'bg-ink text-paper hover:bg-ink-2 data-[force=hover]:bg-ink-2 data-[force=pressed]:bg-black',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper data-[force=hover]:border-ink data-[force=hover]:bg-ink data-[force=hover]:text-paper',
  light: 'on-dark bg-snow text-ink hover:bg-paper-2 data-[force=hover]:bg-paper-2',
  'outline-light': 'on-dark border border-snow/40 text-snow hover:border-snow hover:bg-snow hover:text-ink data-[force=hover]:bg-snow data-[force=hover]:text-ink',
  ghost: 'text-ink hover:bg-paper-2 data-[force=hover]:bg-paper-2',
}

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-4 text-[14px]',
  md: 'h-12 px-6',
  lg: 'h-14 px-7 text-[16px]',
}

const forceFocus = (dark: boolean) =>
  cx('data-[force=focus]:outline-2 data-[force=focus]:outline-offset-3', dark ? 'data-[force=focus]:outline-snow' : 'data-[force=focus]:outline-ink')

export function buttonClass(variant: Variant = 'solid', size: Size = 'md', className?: string) {
  return cx(BASE, VARIANTS[variant], SIZES[size], forceFocus(variant === 'light' || variant === 'outline-light'), className)
}

const Arrow = () => (
  <ArrowUpRight
    className="size-4 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-soft)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
    strokeWidth={1.75}
    aria-hidden
  />
)

type Common = { variant?: Variant; size?: Size; icon?: boolean; 'data-force'?: string }

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & Common & { loading?: boolean }>(function Button(
  { variant, size, icon, loading, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={buttonClass(variant, size, className)} {...rest}>
      <span className={cx('inline-flex items-center gap-2', loading && 'opacity-0')}>
        {children}
        {icon && <Arrow />}
      </span>
      {loading && <LoaderCircle className="absolute size-4 animate-spin" aria-hidden />}
    </button>
  )
})

export function ButtonLink({ variant, size, icon, className, children, ...rest }: LinkProps & Common & { children: ReactNode }) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {children}
      {icon && <Arrow />}
    </Link>
  )
}

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { tone?: 'dark' | 'light' | 'glass'; size?: 'sm' | 'md'; 'data-force'?: string }
>(function IconButton({ tone = 'dark', size = 'md', className, type = 'button', ...rest }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'round inline-flex shrink-0 items-center justify-center rounded-full transition-[background-color,color,border-color,transform] duration-[var(--duration-base)] active:scale-95 disabled:pointer-events-none disabled:opacity-40',
        size === 'md' ? 'size-11' : 'size-10',
        tone === 'dark' && 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper data-[force=hover]:bg-ink data-[force=hover]:text-paper',
        tone === 'light' && 'on-dark border border-snow/35 text-snow hover:border-snow hover:bg-snow hover:text-ink data-[force=hover]:bg-snow data-[force=hover]:text-ink',
        tone === 'glass' && 'bg-snow/85 text-ink shadow-[var(--shadow-card)] backdrop-blur hover:bg-snow data-[force=hover]:bg-snow',
        forceFocus(tone === 'light'),
        className,
      )}
      {...rest}
    />
  )
})

/** The quiet text link with an arrow used under sections ("All rooms"). */
export function ArrowLink({ to, children, className, tone = 'dark', 'data-force': force }: { to: string; children: ReactNode; className?: string; tone?: 'dark' | 'light'; 'data-force'?: string }) {
  return (
    <Link
      to={to}
      data-force={force}
      className={cx(
        'group/btn inline-flex min-h-10 items-center gap-1.5 text-[15px] font-medium',
        tone === 'light' ? 'on-dark text-snow' : 'text-ink',
        force === 'focus' && 'outline-2 outline-offset-3 outline-ink',
        className,
      )}
    >
      <span className="link-underline" data-force={force === 'hover' ? 'hover' : undefined}>
        {children}
      </span>
      <Arrow />
    </Link>
  )
}
