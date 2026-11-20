import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

import { cx } from '../lib/cx'
import type { ForceState } from './Button'

export const controlClass =
  'w-full rounded-control bg-paper px-4 text-[15px] text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] outline-none transition-shadow duration-150 placeholder:text-faint hover:shadow-[inset_0_0_0_1px_var(--color-faint)] focus-visible:shadow-[inset_0_0_0_2px_var(--color-ink)] focus-visible:outline-none data-[force=hover]:shadow-[inset_0_0_0_1px_var(--color-faint)] data-[force=focus]:shadow-[inset_0_0_0_2px_var(--color-ink)] data-[force=focus]:outline-none disabled:cursor-not-allowed disabled:bg-mint-2 disabled:text-faint aria-[invalid=true]:shadow-[inset_0_0_0_2px_var(--color-danger)]'

type FieldShell = { label: ReactNode; hint?: ReactNode; error?: string; optional?: boolean; className?: string; force?: ForceState }

function Shell({ id, label, hint, error, optional, className, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-3 text-[14px] font-medium text-ink">
        <span>{label}</span>
        {optional && <span className="text-[13px] font-normal text-muted">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const describedBy = (id: string, error?: string, hint?: ReactNode) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined)

export const Input = forwardRef<HTMLInputElement, FieldShell & InputHTMLAttributes<HTMLInputElement>>(function Input(
  { label, hint, error, optional, className, force, id: given, ...rest },
  ref,
) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input ref={ref} id={id} data-force={force} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} className={cx(controlClass, 'h-12')} {...rest} />
    </Shell>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { label, hint, error, optional, className, force, id: given, ...rest },
  ref,
) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea ref={ref} id={id} data-force={force} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} className={cx(controlClass, 'min-h-[120px] resize-y py-3 leading-6')} {...rest} />
    </Shell>
  )
})

export const Select = forwardRef<HTMLSelectElement, FieldShell & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[]; placeholder?: string }>(function Select(
  { label, hint, error, optional, className, force, id: given, options, placeholder, ...rest },
  ref,
) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <div className="relative">
        <select ref={ref} id={id} data-force={force} aria-invalid={error ? true : undefined} aria-describedby={describedBy(id, error, hint)} className={cx(controlClass, 'h-12 appearance-none pr-10')} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>
    </Shell>
  )
})
