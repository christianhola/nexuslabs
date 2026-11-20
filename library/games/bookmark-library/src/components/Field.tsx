import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

import { cx } from '../lib/cx'

const control =
  'w-full rounded-md bg-white px-3.5 text-[15px] text-ink placeholder:text-subtle shadow-[inset_0_0_0_1px_var(--color-line-2)] transition-shadow duration-(--duration-fast) outline-none hover:shadow-[inset_0_0_0_1px_var(--color-faint)] focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-ink)] focus-visible:outline-none data-[force=focus]:shadow-[inset_0_0_0_1.5px_var(--color-ink)] data-[force=hover]:shadow-[inset_0_0_0_1px_var(--color-faint)] aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-danger)] disabled:bg-chip disabled:text-subtle'

type FieldProps = { label: string; hint?: string; error?: string; children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode; className?: string; optional?: boolean; id?: string }

/** Label, control, hint and error, wired with ids for screen readers. */
export function Field({ label, hint, error, children, className, optional, id: given }: FieldProps) {
  const auto = useId()
  const id = given ?? auto
  const hintId = `${id}-hint`
  const errId = `${id}-err`
  const describedBy = [hint && hintId, error && errId].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] font-medium text-ink-2">
        {label}
        {optional && <span className="font-normal text-subtle"> (optional)</span>}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && !error && (
        <p id={hintId} className="text-[13px] text-subtle">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

type Force = { force?: 'hover' | 'focus' }

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Force>(function Input({ className, force, ...rest }, ref) {
  return <input ref={ref} data-force={force} className={cx(control, 'h-11', className)} {...rest} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & Force>(function Textarea({ className, force, ...rest }, ref) {
  return <textarea ref={ref} data-force={force} className={cx(control, 'min-h-[88px] resize-y py-2.5 leading-[1.45]', className)} {...rest} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & Force>(function Select({ className, force, children, ...rest }, ref) {
  return (
    <span className="relative block">
      <select ref={ref} data-force={force} className={cx(control, 'h-11 appearance-none pr-10', className)} {...rest}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-subtle" />
    </span>
  )
})
