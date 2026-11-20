import { ChevronRight, LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/*
  Buttons are pills. `primary` is solid white (the one action per view),
  `secondary` is frosted glass, `ghost` is bare text. Pass `href` for a link
  that looks like a button. `data-force="hover|focus|pressed"` pins a state
  for the style guide.
*/

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ForceState = 'hover' | 'focus' | 'pressed'

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-plasma-text data-[force=focus]:outline-2 data-[force=focus]:outline-offset-3 data-[force=focus]:outline-plasma-text active:scale-[0.97] data-[force=pressed]:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-white text-black hover:bg-ice data-[force=hover]:bg-ice data-[force=pressed]:bg-sky active:bg-sky',
  secondary:
    'bg-white/[0.08] text-white ring-1 ring-inset ring-white/15 backdrop-blur-md hover:bg-white/[0.14] data-[force=hover]:bg-white/[0.14] active:bg-white/[0.18] data-[force=pressed]:bg-white/[0.18]',
  ghost: 'text-soft hover:bg-white/[0.07] hover:text-white data-[force=hover]:bg-white/[0.07] data-[force=hover]:text-white active:bg-white/[0.1] data-[force=pressed]:bg-white/[0.1]',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[14px]',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-[52px] px-7 text-[16px]',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cx(base, variants[variant], sizes[size], className)
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; force?: ForceState; children: ReactNode; className?: string }

export function Button({
  variant,
  size,
  loading,
  force,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-force={force}
      {...rest}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  )
}

export function ButtonLink({ variant, size, force, children, className, href, ...rest }: Common & { href: string; 'aria-label'?: string }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} data-force={force} {...rest}>
      {children}
    </Link>
  )
}

/** The reference's quiet call to action: text and a small chevron. */
export function TextLink({
  href,
  children,
  className,
  force,
  tone = 'white',
}: {
  href: string
  children: ReactNode
  className?: string
  force?: ForceState
  tone?: 'white' | 'muted'
}) {
  return (
    <Link
      href={href}
      data-force={force}
      className={cx(
        'group inline-flex min-h-10 items-center gap-1.5 rounded-[8px] text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-plasma-text',
        tone === 'white' ? 'text-white hover:text-ice data-[force=hover]:text-ice' : 'text-muted hover:text-white data-[force=hover]:text-white',
        className,
      )}
    >
      {children}
      <ChevronRight
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-data-[force=hover]:translate-x-0.5"
        strokeWidth={2.25}
        aria-hidden
      />
    </Link>
  )
}

/** A square icon-only button (menu, close). Always pass an aria-label. */
export function IconButton({
  children,
  className,
  force,
  ...rest
}: { children: ReactNode; className?: string; force?: ForceState; 'aria-label': string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      data-force={force}
      className={cx(
        'grid size-11 shrink-0 place-items-center rounded-[14px] bg-white/[0.07] text-white transition-colors hover:bg-white/[0.12] active:scale-95 data-[force=hover]:bg-white/[0.12] data-[force=focus]:outline-2 data-[force=focus]:outline-offset-3 data-[force=focus]:outline-plasma-text data-[force=pressed]:scale-95',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
