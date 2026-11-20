import { Loader2 } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'primary' | 'dark' | 'ghost' | 'light' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'group/button relative inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap font-medium transition-[background-color,color,transform,box-shadow] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-violet text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_10px_30px_-12px_rgb(91_61_246/0.9)] hover:bg-violet-hover hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_14px_40px_-10px_rgb(107_80_255/0.9)]',
  dark: 'bg-[#1a1a1b] text-white hover:bg-[#252527]',
  ghost: 'text-[#8b8b90] hover:text-white',
  light: 'bg-white text-ink hover:bg-[#ececf1]',
  outline: 'depth bg-white/[0.03] text-white hover:bg-white/[0.07]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 rounded-[10px] px-4 text-[14px]',
  md: 'h-[52px] rounded-control px-6 text-[17px]',
  lg: 'h-[52px] rounded-button px-6 text-[17px]',
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; className?: string; children: ReactNode }
export type ButtonProps =
  | (Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>)
  | (Common & { href?: undefined } & ComponentPropsWithoutRef<'button'>)

/**
 * The one button. `href` renders a router `<Link>` (internal paths route
 * without a reload); `loading` swaps in a spinner and disables it.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', loading = false, className, children, ...rest } = props
  const classes = cx(base, variants[variant], sizes[size], variant === 'ghost' && 'px-2', className)
  const inner = (
    <>
      {loading ? <Loader2 className="size-[18px] animate-spin" aria-hidden /> : null}
      {children}
    </>
  )
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...a } = rest as ComponentPropsWithoutRef<'a'> & { href: string }
    return (
      <Link href={href} className={classes} {...a}>
        {inner}
      </Link>
    )
  }
  const b = rest as ComponentPropsWithoutRef<'button'>
  return (
    <button type="button" className={classes} {...b} disabled={b.disabled || loading} aria-busy={loading || undefined}>
      {inner}
    </button>
  )
}
