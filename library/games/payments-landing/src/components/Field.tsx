import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { ChevronDown, CircleAlert } from 'lucide-react'

import { cx } from '../lib/cx'

/*
  Form fields. Every field renders its own label, an optional hint and an
  error that is announced (aria-invalid + aria-describedby). `force` pins
  hover or focus for the style guide.
*/

type Shared = {
  label: ReactNode
  hint?: ReactNode
  error?: string | null
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean
  force?: 'hover' | 'focus'
  className?: string
  optional?: boolean
}

export const controlClass = (invalid?: boolean, force?: 'hover' | 'focus') =>
  cx(
    'w-full rounded-control border bg-white text-[15px] text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-150',
    'outline-none focus:border-teal focus:shadow-focus disabled:cursor-not-allowed disabled:bg-mist-2 disabled:text-faint',
    invalid ? 'border-danger focus:border-danger' : 'border-line-strong hover:border-ink/35',
    force === 'hover' && !invalid && 'border-ink/35',
    force === 'focus' && 'border-teal shadow-focus',
  )

export function FieldShell({ id, label, hint, error, hideLabel, className, optional, children }: Shared & { id: string; children: ReactNode }) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cx('text-[14px] font-medium text-ink-2', hideLabel && 'sr-only')}>
        {label}
        {optional && <span className="font-normal text-faint"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-[13px] leading-5 text-danger">
          <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[13px] leading-5 text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, error?: string | null, hint?: ReactNode) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined
}

export type TextFieldProps = Shared &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & { prefix?: ReactNode; suffix?: ReactNode; inputClassName?: string }

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, hideLabel, force, className, optional, prefix, suffix, inputClassName, id: idProp, ...rest },
  ref,
) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className} optional={optional}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-faint">{prefix}</span>}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cx(controlClass(!!error, force), 'h-12 px-3.5', !!prefix && 'pl-10', !!suffix && 'pr-12', inputClassName)}
          {...rest}
        />
        {suffix && <span className="absolute inset-y-0 right-1.5 flex items-center">{suffix}</span>}
      </div>
    </FieldShell>
  )
})

export type SelectFieldProps = Shared & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> & { placeholder?: string; options: readonly (string | { value: string; label: string })[] }

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, hint, error, hideLabel, force, className, optional, options, placeholder, id: idProp, ...rest },
  ref,
) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className} optional={optional}>
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cx(controlClass(!!error, force), 'h-12 appearance-none pl-3.5 pr-10')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => {
            const v = typeof o === 'string' ? { value: o, label: o } : o
            return (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            )
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
      </div>
    </FieldShell>
  )
})

export type TextAreaProps = Shared & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, hideLabel, force, className, optional, id: idProp, ...rest },
  ref,
) {
  const auto = useId()
  const id = idProp ?? auto
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} hideLabel={hideLabel} className={className} optional={optional}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cx(controlClass(!!error, force), 'min-h-[120px] resize-y px-3.5 py-3 leading-6')}
        {...rest}
      />
    </FieldShell>
  )
})
