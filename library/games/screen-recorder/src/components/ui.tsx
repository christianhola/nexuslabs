import { motion } from 'motion/react'
import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, useId } from 'react'

import { cn } from '@/lib/cn'

/* Small design-system primitives that don't need a file each. */

/** Filter pill from the library header ("Latest", "Active"). `pressed` marks the current one. */
export function Chip({ pressed, icon, children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean; icon?: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'inline-flex h-8 min-w-10 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors duration-150 pointer-coarse:h-10 pointer-coarse:px-3.5 disabled:opacity-40',
        pressed ? 'bg-raised text-fg ring-1 ring-inset ring-line-strong' : 'text-muted ring-1 ring-inset ring-line hover:bg-surface-2 hover:text-fg active:bg-raised',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}

/** Count badge. `tone="ok"` is the green activity count. */
export function Badge({ tone = 'plain', children, className }: { tone?: 'plain' | 'ok' | 'ember' | 'outline'; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-medium tabular-nums',
        tone === 'plain' && 'text-faint',
        tone === 'ok' && 'bg-ok-bg text-ok',
        tone === 'ember' && 'bg-ember/15 text-ember-text',
        tone === 'outline' && 'text-muted ring-1 ring-inset ring-line-strong',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('text-[13px] font-medium tracking-[0.02em] text-ember-text', className)}>{children}</p>
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[6px] bg-surface-2 px-1 font-mono text-[11px] text-muted ring-1 ring-inset ring-line-strong">{children}</kbd>
}

export function Avatar({ initials, image, size = 28, className, label }: { initials: string; image?: string; size?: number; className?: string; label?: string }) {
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-raised font-medium text-muted ring-1 ring-line-strong', className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {image ? <img src={image} alt="" className="size-full object-cover" /> : initials}
    </span>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skel', className)} aria-hidden />
}

export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: string; body: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-[18px] px-6 py-16 text-center ring-1 ring-line ring-inset', className)}>
      {icon && <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-surface-2 text-muted ring-1 ring-line-strong">{icon}</div>}
      <p className="text-[15px] font-medium">{title}</p>
      <p className="mt-1 max-w-[34ch] text-sm text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

type FieldProps = { label: string; hint?: string; error?: string | null; hideLabel?: boolean; className?: string }

const fieldBase =
  'w-full rounded-[12px] bg-surface-2 px-3.5 text-[15px] text-fg placeholder:text-faint ring-1 ring-inset ring-line-strong transition-shadow duration-150 ' +
  'hover:ring-[rgb(255_244_228/0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream disabled:opacity-50 aria-invalid:ring-ember/70'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(function Input({ label, hint, error, hideLabel, className, id, ...rest }, ref) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <div className={className}>
      <label htmlFor={fid} className={cn('mb-1.5 block text-[13px] font-medium text-muted', hideLabel && 'sr-only')}>
        {label}
      </label>
      <input ref={ref} id={fid} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${fid}-msg` : undefined} className={cn(fieldBase, 'h-11')} {...rest} />
      {(error || hint) && (
        <p id={`${fid}-msg`} className={cn('mt-1.5 text-[13px]', error ? 'text-ember-text' : 'text-faint')} role={error ? 'alert' : undefined}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(function TextArea({ label, hint, error, hideLabel, className, id, ...rest }, ref) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <div className={className}>
      <label htmlFor={fid} className={cn('mb-1.5 block text-[13px] font-medium text-muted', hideLabel && 'sr-only')}>
        {label}
      </label>
      <textarea ref={ref} id={fid} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${fid}-msg` : undefined} className={cn(fieldBase, 'min-h-24 resize-y py-2.5')} {...rest} />
      {(error || hint) && (
        <p id={`${fid}-msg`} className={cn('mt-1.5 text-[13px]', error ? 'text-ember-text' : 'text-faint')} role={error ? 'alert' : undefined}>
          {error || hint}
        </p>
      )}
    </div>
  )
})

/** Native select dressed as a field. Options are strings or { value, label }. */
export function Select({ label, value, onChange, options, icon, className, showLabel }: { label: string; value: string; onChange: (v: string) => void; options: ReadonlyArray<string | { value: string; label: string }>; icon?: ReactNode; className?: string; showLabel?: boolean }) {
  const id = useId()
  return (
    <div className={className}>
      <label htmlFor={id} className={showLabel ? 'mb-1.5 block text-[13px] font-medium text-muted' : 'sr-only'}>
        {label}
      </label>
      <div className="relative">
        {icon && <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">{icon}</span>}
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cn(fieldBase, 'h-12 appearance-none pr-10', icon ? 'pl-11' : '')}>
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o
            return (
              <option key={opt.value} value={opt.value} className="bg-surface">
                {opt.label}
              </option>
            )
          })}
        </select>
        <svg className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

/** Rounded search box with a leading icon and an optional shortcut hint. */
export const SearchField = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { label: string; shortcut?: string; size?: 'md' | 'lg'; className?: string }>(function SearchField({ label, shortcut, size = 'md', className, id, ...rest }, ref) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <div className={cn('relative', className)}>
      <svg className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <label htmlFor={fid} className="sr-only">
        {label}
      </label>
      <input
        ref={ref}
        id={fid}
        type="search"
        className={cn(
          'w-full rounded-full bg-surface-2 pl-10 ring-1 ring-line ring-inset placeholder:text-faint focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden',
          size === 'lg' ? 'h-11 pr-4 text-[15px]' : 'h-10 pr-10 text-sm',
        )}
        {...rest}
      />
      {shortcut && <kbd className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 font-mono text-[11px] text-faint">{shortcut}</kbd>}
    </div>
  )
})

/** Round on/off switch. */
export function Switch({ checked, onChange, label, disabled, className, ...rest }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean; className?: string; 'data-force'?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn('hit relative inline-flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 disabled:opacity-40', checked ? 'bg-cream' : 'bg-raised ring-1 ring-inset ring-line-strong hover:bg-[#2a2725]', className)}
      {...rest}
    >
      <motion.span className={cn('block size-5 rounded-full', checked ? 'bg-ink' : 'bg-muted')} animate={{ x: checked ? 16 : 0 }} transition={{ type: 'spring', stiffness: 700, damping: 40 }} />
    </button>
  )
}

/** Pill tab group (monthly / annual, team tabs). Arrow keys move between options. */
export function Segmented<T extends string>({ value, onChange, options, label, className }: { value: T; onChange: (v: T) => void; options: Array<{ id: T; label: ReactNode }>; label: string; className?: string }) {
  const layout = useId()
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex rounded-full bg-surface-2 p-1 ring-1 ring-inset ring-line', className)}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
        e.preventDefault()
        const i = options.findIndex((o) => o.id === value)
        const next = options[(i + (e.key === 'ArrowRight' ? 1 : options.length - 1)) % options.length]
        onChange(next.id)
        const group = e.currentTarget
        requestAnimationFrame(() => (group.querySelector('[aria-checked="true"]') as HTMLElement | null)?.focus())
      }}
    >
      {options.map((o) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.id)}
            className={cn('relative h-9 rounded-full px-4 text-sm font-medium transition-colors duration-150 pointer-coarse:h-10', on ? 'text-ink' : 'text-muted hover:text-fg')}
          >
            {on && <motion.span layoutId={layout} className="absolute inset-0 rounded-full bg-cream" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
