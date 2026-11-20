import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

const control =
  'w-full rounded-control bg-[#081012] px-3.5 text-[15px] text-fg placeholder:text-faint ring-1 ring-inset ring-line-strong transition-shadow hover:ring-white/25 focus:outline-none focus:ring-2 focus:ring-brand/80 data-[force=hover]:ring-white/25 data-[force=focus]:ring-2 data-[force=focus]:ring-brand/80 data-[force=focus]:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-danger/80'

type FieldShell = { label: string; error?: string; hint?: ReactNode; force?: Force; optional?: boolean }

function Shell({ id, label, error, hint, optional, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between text-[14px] font-medium text-fg">
        {label}
        {optional && <span className="text-[13px] font-normal text-faint">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ label, error, hint, force, optional, className, id: given, ...rest }: InputHTMLAttributes<HTMLInputElement> & FieldShell) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional}>
      <input id={id} data-force={force} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} className={cx(control, 'h-11', className)} {...rest} />
    </Shell>
  )
}

export function Textarea({ label, error, hint, force, optional, className, id: given, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldShell) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional}>
      <textarea id={id} data-force={force} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} className={cx(control, 'min-h-28 py-3 leading-relaxed', className)} {...rest} />
    </Shell>
  )
}

export function Select({ label, error, hint, force, optional, className, id: given, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & FieldShell) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} error={error} hint={hint} optional={optional}>
      <div className="relative">
        <select id={id} data-force={force} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className={cx(control, 'h-11 appearance-none pr-10', className)} {...rest}>
          {children}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" />
      </div>
    </Shell>
  )
}

/** A bare select for toolbars and filters (label is visually hidden). */
export function MiniSelect({ label, className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className={cx('relative inline-flex', className)}>
      <span className="sr-only">{label}</span>
      <select className="h-10 w-full appearance-none rounded-[10px] bg-surface-2 pr-9 pl-3 text-[14px] text-fg ring-1 ring-inset ring-line-strong hover:ring-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/80" {...rest}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </label>
  )
}

export function Checkbox({ label, error, checked, onChange, force, disabled, id: given }: { label: ReactNode; error?: string; checked: boolean; onChange: (v: boolean) => void; force?: Force; disabled?: boolean; id?: string }) {
  const auto = useId()
  const id = given ?? auto
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={cx('group inline-flex min-h-10 cursor-pointer items-start gap-3 py-1 text-[14px] leading-snug text-muted', disabled && 'cursor-not-allowed opacity-50')}>
        <input id={id} type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} />
        <span
          aria-hidden
          data-force={force}
          className={cx(
            'mt-px grid size-5 shrink-0 place-items-center rounded-[6px] ring-1 ring-inset transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-text group-hover:ring-white/30 data-[force=hover]:ring-white/30',
            checked ? 'bg-brand ring-brand text-on-brand' : error ? 'ring-danger/80' : 'ring-line-strong',
          )}
        >
          {checked && <Check className="size-3.5" strokeWidth={3} />}
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-err`} role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/** On/off switch. */
export function Switch({ label, checked, onChange, force, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; force?: Force; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      data-force={force}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-10 items-center gap-3 rounded-lg text-[14.5px] text-fg disabled:opacity-45"
    >
      <span className={cx('round relative h-6 w-10 rounded-full transition-colors', checked ? 'bg-brand' : 'bg-white/14 group-hover:bg-white/20 group-data-[force=hover]:bg-white/20')}>
        <span className={cx('round absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', checked && 'translate-x-4')} />
      </span>
      {label}
    </button>
  )
}
