import { Check, ChevronDown } from 'lucide-react'
import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

/*
  Labelled form controls. `Field` wires the label, hint and error to the
  control through ids, so screen readers read them together. Errors set
  aria-invalid and turn the ring red.
*/
export const control =
  'w-full rounded-[var(--radius-control)] border border-line-strong bg-night-2 px-3.5 text-[15px] text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-[#4d4858] focus:border-pink focus:outline-none focus:ring-3 focus:ring-pink/25 aria-invalid:border-bad aria-invalid:ring-bad/20 disabled:cursor-not-allowed disabled:opacity-50 data-[force=hover]:border-[#4d4858] data-[force=focus]:border-pink data-[force=focus]:ring-3 data-[force=focus]:ring-pink/25'

type FieldProps = { label: string; hint?: ReactNode; error?: string; children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode; className?: string; optional?: boolean }

export function Field({ label, hint, error, children, className, optional }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-err` : undefined
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] font-medium text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-faint">optional</span> : null}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && !error ? (
        <p id={hintId} className="text-[13px] text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errId} className="text-[13px] font-medium text-bad" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; force?: Force }
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, invalid, force, ...rest }, ref) {
  return <input ref={ref} aria-invalid={invalid || undefined} data-force={force} className={cx(control, 'h-11', className)} {...rest} />
})

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean; force?: Force }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, invalid, force, ...rest }, ref) {
  return <textarea ref={ref} aria-invalid={invalid || undefined} data-force={force} className={cx(control, 'min-h-[112px] py-2.5 leading-relaxed', className)} {...rest} />
})

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; force?: Force }
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, invalid, force, children, ...rest }, ref) {
  return (
    <div className="relative">
      <select ref={ref} aria-invalid={invalid || undefined} data-force={force} className={cx(control, 'h-11 appearance-none pr-10', className)} {...rest}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  )
})

export function Checkbox({ label, checked, onChange, disabled, id }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; id?: string }) {
  const auto = useId()
  const cid = id ?? auto
  return (
    <label htmlFor={cid} className={cx('inline-flex min-h-10 items-center gap-3 text-[15px] text-body', disabled && 'opacity-50')}>
      <span className="relative grid size-5 place-items-center">
        <input id={cid} type="checkbox" className="peer absolute inset-0 appearance-none rounded-[5px] border border-line-strong bg-night-2 checked:border-pink-strong checked:bg-pink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <Check className="pointer-events-none relative size-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden />
      </span>
      {label}
    </label>
  )
}
