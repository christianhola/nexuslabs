import { Check, ChevronDown } from 'lucide-react'
import { useId } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '../lib/cx'

const control =
  'w-full rounded-control border bg-[#11141f] text-[15px] text-white placeholder:text-faint transition-[border-color,box-shadow,background-color] duration-200 hover:border-line-strong focus:outline-none focus-visible:outline-none focus:border-cobalt-text focus:shadow-[0_0_0_3px_rgb(47_102_232/0.35)] data-[force=focus]:outline-none data-[force=focus]:border-cobalt-text data-[force=focus]:shadow-[0_0_0_3px_rgb(47_102_232/0.35)] data-[force=hover]:border-line-strong disabled:cursor-not-allowed disabled:opacity-50'

type FieldShell = { label: string; hint?: string; error?: string; className?: string; hideLabel?: boolean; force?: 'hover' | 'focus' }

function Shell({ id, label, hint, error, className, hideLabel, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={cx('grid gap-2', className)}>
      <label htmlFor={id} className={cx('text-[14px] font-medium text-soft', hideLabel && 'sr-only')}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-[13px] text-cherry-text" role="alert">
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

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined
}

export type TextFieldProps = FieldShell & Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'prefix'> & { prefix?: ReactNode }

export function TextField({ label, hint, error, className, hideLabel, force, prefix, id: given, ...input }: TextFieldProps) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} className={className} hideLabel={hideLabel}>
      <div className="relative">
        {prefix ? <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">{prefix}</span> : null}
        <input
          id={id}
          className={cx(control, 'h-12 px-4', prefix ? 'pl-12' : null, error ? 'border-cherry-text/70' : 'border-line')}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          data-force={force}
          {...input}
        />
      </div>
    </Shell>
  )
}

export type TextAreaProps = FieldShell & Omit<ComponentPropsWithoutRef<'textarea'>, 'className'>

export function TextArea({ label, hint, error, className, hideLabel, force, id: given, ...rest }: TextAreaProps) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} className={className} hideLabel={hideLabel}>
      <textarea
        id={id}
        rows={4}
        className={cx(control, 'min-h-28 resize-y px-4 py-3', error ? 'border-cherry-text/70' : 'border-line')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        data-force={force}
        {...rest}
      />
    </Shell>
  )
}

export type SelectFieldProps = FieldShell & Omit<ComponentPropsWithoutRef<'select'>, 'className'> & { options: { value: string; label: string }[]; placeholder?: string }

export function SelectField({ label, hint, error, className, hideLabel, force, options, placeholder, id: given, ...rest }: SelectFieldProps) {
  const auto = useId()
  const id = given ?? auto
  return (
    <Shell id={id} label={label} hint={hint} error={error} className={className} hideLabel={hideLabel}>
      <div className="relative">
        <select
          id={id}
          className={cx(control, 'h-12 appearance-none pl-4 pr-10', error ? 'border-cherry-text/70' : 'border-line')}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          data-force={force}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-panel">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
      </div>
    </Shell>
  )
}

export function Checkbox({
  label,
  error,
  checked,
  onChange,
  force,
  disabled,
}: {
  label: ReactNode
  error?: string
  checked: boolean
  onChange: (v: boolean) => void
  force?: 'hover' | 'focus'
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className={cx('group flex cursor-pointer items-start gap-3 text-[14px] text-soft', disabled && 'cursor-not-allowed opacity-50')}>
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span
          aria-hidden
          data-force={force}
          className={cx(
            'mt-0.5 grid size-5 shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#8fb2ff] group-hover:border-line-strong data-[force=hover]:border-line-strong',
            checked ? 'border-cobalt bg-cobalt' : error ? 'border-cherry-text/70' : 'border-line-strong bg-[#11141f]',
          )}
        >
          {checked ? <Check className="size-3.5 text-white" strokeWidth={3} /> : null}
        </span>
        <span>{label}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="pl-8 text-[13px] text-cherry-text">
          {error}
        </p>
      ) : null}
    </div>
  )
}
