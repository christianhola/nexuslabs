import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/*
  Design-system primitives. Controls share one height (44px, 36px small), the
  2px control radius and the orange focus ring, so a Button and an Input line
  up in a row. States use the `is-hover:` / `is-active:` / `is-focus:`
  variants from styles.css so /styleguide can pin them.
*/

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'md' | 'sm'

export function buttonClass({ variant = 'primary', size = 'md', className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cx(
    'relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium tracking-[-0.005em] no-underline',
    size === 'md' ? 'h-11 px-5 text-lead' : 'h-10 px-3.5 text-[14px] sm:h-9',
    'transition-[background-color,border-color,box-shadow,transform,color] duration-150 ease-out is-active:scale-[0.97]',
    'outline-none is-focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:cursor-not-allowed aria-disabled:opacity-55',
    variant === 'primary' && 'bg-accent-fill text-white shadow-control is-hover:bg-accent-hover is-active:bg-accent-press',
    variant === 'secondary' && 'border border-line bg-white text-ink is-hover:border-line-strong is-hover:bg-stage is-active:bg-sunken',
    variant === 'ghost' && (size === 'md' ? 'px-3' : 'px-2') + ' text-muted is-hover:bg-sunken is-hover:text-ink is-active:bg-line-soft is-active:text-ink',
    className,
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, icon, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(buttonClass({ variant, size, className }), loading && 'disabled:cursor-wait disabled:opacity-100')}
    >
      <span className={cx('inline-flex items-center gap-2 transition-opacity duration-150', loading && 'opacity-0')}>
        {icon}
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner />
        </span>
      )}
    </button>
  )
})

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconEnd?: ReactNode
}

/** A link that looks like a Button. In-app paths navigate without a reload. */
export function ButtonLink({ variant = 'primary', size = 'md', icon, iconEnd, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link {...rest} className={buttonClass({ variant, size, className })}>
      {icon}
      {children}
      {iconEnd}
    </Link>
  )
}

/** Inline text link in the accent ink colour. */
export function TextLink({ className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      {...rest}
      className={cx(
        'rounded-[1px] font-medium text-accent-ink underline decoration-accent/40 underline-offset-[3px] outline-none transition-colors duration-150 is-hover:decoration-accent-ink is-focus:shadow-focus',
        className,
      )}
    />
  )
}

export function Spinner({ className, label }: { className?: string; label?: string }) {
  return (
    <svg className={cx('size-[18px] animate-spin', className)} viewBox="0 0 24 24" fill="none" aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
  /** `subtle` is the grey read-only look (share links, codes). */
  tone?: 'default' | 'subtle'
  inputSize?: 'md' | 'sm'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, tone = 'default', inputSize = 'md', className, ...rest }, ref) {
  return (
    <input
      ref={ref}
      {...rest}
      aria-invalid={invalid || undefined}
      className={cx(
        'w-full min-w-0 rounded-control border text-ink shadow-control outline-none',
        inputSize === 'md' ? 'h-11 px-[17px] text-lead' : 'h-10 px-3 text-[14px] sm:h-9',
        tone === 'default' ? 'bg-white' : 'bg-stage px-3.5 text-[14px] text-body',
        'placeholder:text-faint transition-[border-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:bg-stage disabled:text-muted',
        invalid
          ? 'border-danger is-focus:shadow-focus-danger focus:shadow-focus-danger'
          : 'border-line is-hover:border-line-strong is-focus:border-accent is-focus:shadow-focus focus:border-accent focus:shadow-focus',
        className,
      )}
    />
  )
})

export function Label({ className, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...rest} className={cx('block text-[15px] font-medium tracking-[0.005em] text-ink', className)} />
}

/** Error or hint text under a field. */
export function FieldMessage({ tone = 'hint', className, ...rest }: HTMLAttributes<HTMLParagraphElement> & { tone?: 'hint' | 'error' }) {
  return <p {...rest} className={cx('text-small', tone === 'error' ? 'text-danger' : 'text-muted', className)} />
}

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'danger'

/** Small rounded chip for status and metadata. */
export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-micro font-medium',
        tone === 'neutral' && 'bg-sunken text-muted',
        tone === 'accent' && 'bg-accent-soft text-accent-ink',
        tone === 'success' && 'bg-success-soft text-success-ink',
        tone === 'danger' && 'bg-danger-soft text-danger-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}

/** Pulsing green dot for live counts. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cx('relative inline-flex size-1.5 shrink-0', className)} aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-success opacity-60 motion-safe:animate-ping" />
      <span className="relative size-1.5 rounded-full bg-success" />
    </span>
  )
}

type CardProps = HTMLAttributes<HTMLDivElement> & { tone?: 'white' | 'stage'; padding?: 'md' | 'lg' | 'none'; interactive?: boolean }

/** White panel with a hairline border and the soft card shadow. */
export function Card({ tone = 'white', padding = 'md', interactive, className, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={cx(
        'rounded-card border border-line-soft',
        tone === 'white' ? 'bg-white shadow-card' : 'bg-stage',
        padding === 'md' && 'p-5 sm:p-6',
        padding === 'lg' && 'p-6 sm:p-8',
        interactive && 'transition-[transform,box-shadow] duration-300 ease-out-expo is-hover:-translate-y-0.5 is-hover:shadow-raised',
        className,
      )}
    />
  )
}

/** Grey shimmer block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx('block animate-pulse rounded-control bg-sunken', className)} />
}

/** Short orange line over a section title. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('text-[14px] font-semibold tracking-[-0.005em] text-accent-ink', className)}>{children}</p>
}

/** Eyebrow + title + lead paragraph, the head of every section. */
export function SectionHeading({
  eyebrow,
  title,
  body,
  id,
  align = 'left',
  className,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  id?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cx('max-w-[620px]', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-2 text-[28px] font-bold leading-[1.15] tracking-[-0.035em] text-ink sm:text-title">
        {title}
      </h2>
      {body && <p className="mt-4 text-lead text-body">{body}</p>}
    </div>
  )
}

/** Big number with a label: ranks, counts. */
export function Stat({
  label,
  value,
  suffix,
  tone = 'ink',
  size = 'md',
  className,
}: {
  label: ReactNode
  value: ReactNode
  suffix?: ReactNode
  tone?: 'ink' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="mt-1.5 flex items-end gap-2">
        <span
          className={cx(
            'font-bold leading-[0.95] tracking-[-0.04em] tabular-nums',
            size === 'sm' && 'text-[30px]',
            size === 'md' && 'text-[44px]',
            size === 'lg' && 'text-[56px] sm:text-[64px]',
            tone === 'accent' ? 'text-accent-strong' : 'text-ink',
          )}
        >
          {value}
        </span>
        {suffix && <span className="pb-[3px] text-[14px] text-muted">{suffix}</span>}
      </p>
    </div>
  )
}

/** Initials in a circle. */
export function Avatar({ initials, size = 'md', tone = 'accent', className }: { initials: string; size?: 'sm' | 'md' | 'lg'; tone?: 'accent' | 'neutral' | 'ink'; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-[-0.01em]',
        size === 'sm' && 'size-7 text-[11px]',
        size === 'md' && 'size-10 text-[14px]',
        size === 'lg' && 'size-14 text-[18px]',
        tone === 'accent' && 'bg-accent-soft text-accent-ink',
        tone === 'neutral' && 'bg-sunken text-muted',
        tone === 'ink' && 'bg-ink text-white',
        className,
      )}
    >
      {initials}
    </span>
  )
}

/** Overlapping avatars, e.g. "people already waiting". */
export function AvatarStack({ people, className }: { people: string[]; className?: string }) {
  const tones = ['accent', 'neutral', 'ink'] as const
  return (
    <span className={cx('flex', className)} aria-hidden="true">
      {people.map((p, i) => (
        <Avatar key={p + i} initials={p} size="sm" tone={tones[i % tones.length]} className={cx('ring-2 ring-white', i > 0 && '-ml-1.5')} />
      ))}
    </span>
  )
}

type CalloutTone = 'info' | 'error' | 'success'

/** Boxed message: empty states, errors, notices. */
export function Callout({
  tone = 'info',
  title,
  children,
  icon,
  action,
  className,
}: {
  tone?: CalloutTone
  title: ReactNode
  children?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cx(
        'flex gap-3 rounded-card border p-4 text-left',
        tone === 'info' && 'border-line-soft bg-stage',
        tone === 'error' && 'border-danger/25 bg-danger-soft',
        tone === 'success' && 'border-success/25 bg-success-soft',
        className,
      )}
    >
      {icon && (
        <span className={cx('mt-0.5 shrink-0', tone === 'error' ? 'text-danger' : tone === 'success' ? 'text-success-ink' : 'text-muted')}>{icon}</span>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{title}</p>
        {children && <div className="mt-1 text-small text-body">{children}</div>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

/** Page-width wrapper with the reference's 75px desktop gutter (lines up with the hero). */
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={cx('mx-auto w-full max-w-[1440px] px-6 sm:px-12 lg:px-[75px]', className)} />
}
