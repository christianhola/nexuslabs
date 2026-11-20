import { ArrowRight, Loader2 } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

export type ButtonVariant = 'primary' | 'outline' | 'white' | 'subtle' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ForceState = 'hover' | 'focus' | 'pressed'

const base =
  'group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2.5 whitespace-nowrap font-medium tracking-[-0.01em] transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-brand active:scale-[0.97] data-[force=pressed]:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-cobalt text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] hover:bg-cobalt-hover hover:shadow-glow data-[force=hover]:bg-cobalt-hover data-[force=hover]:shadow-glow',
  outline:
    'border border-white/85 text-white hover:bg-white hover:text-bg data-[force=hover]:bg-white data-[force=hover]:text-bg',
  white: 'bg-white text-bg hover:bg-[#e6ebf7] data-[force=hover]:bg-[#e6ebf7]',
  subtle: 'border border-line bg-white/[0.05] text-white hover:bg-white/[0.1] data-[force=hover]:bg-white/[0.1]',
  ghost: 'text-soft hover:text-white hover:bg-white/[0.06] data-[force=hover]:bg-white/[0.06] data-[force=hover]:text-white',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 rounded-control px-4 text-[14px]',
  md: 'h-11 rounded-control px-5 text-[15px]',
  lg: 'h-[52px] rounded-control px-6 text-[16px]',
}

type Common = {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  /** Shows the circled arrow from the reference's "Get started" button. */
  arrow?: boolean
  force?: ForceState
  className?: string
  children: ReactNode
}

export type ButtonProps =
  | (Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href'>)
  | (Common & { href?: undefined } & ComponentPropsWithoutRef<'button'>)

const discTones = {
  cobalt: 'bg-white text-cobalt',
  dark: 'bg-white text-bg group-hover/button:bg-bg group-hover/button:text-white group-data-[force=hover]/button:bg-bg group-data-[force=hover]/button:text-white',
  inverted: 'bg-bg text-white',
}

/** A circled arrow that nudges right on hover. */
export function ArrowDisc({ tone = 'cobalt' }: { tone?: keyof typeof discTones }) {
  return (
    <span
      aria-hidden
      className={cx(
        'grid size-[22px] place-items-center rounded-full transition-[transform,background-color,color] duration-200 ease-brand group-hover/button:translate-x-0.5',
        discTones[tone],
      )}
    >
      <ArrowRight className="size-3.5" strokeWidth={2.6} />
    </span>
  )
}

/**
 * The one button. `href` renders a router `<Link>`; `loading` swaps in a
 * spinner and disables it; `force` pins a state for the style guide.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', loading = false, arrow = false, force, className, children, ...rest } = props
  const classes = cx(base, variants[variant], sizes[size], className)
  const disc = arrow && !loading ? <ArrowDisc tone={variant === 'white' ? 'inverted' : variant === 'primary' ? 'cobalt' : 'dark'} /> : null
  const inner = (
    <>
      {loading ? <Loader2 className="size-[18px] animate-spin" aria-hidden /> : null}
      {children}
      {disc}
    </>
  )
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...a } = rest as ComponentPropsWithoutRef<'a'> & { href: string }
    return (
      <Link href={href} className={classes} data-force={force} {...a}>
        {inner}
      </Link>
    )
  }
  const b = rest as ComponentPropsWithoutRef<'button'>
  return (
    <button
      type="button"
      className={classes}
      data-force={force}
      {...b}
      disabled={b.disabled || loading}
      aria-busy={loading || undefined}
    >
      {inner}
    </button>
  )
}
