import { Check, ChevronDown } from 'lucide-react'
import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

/*
  Form fields. <Field> owns the label, hint and error and wires their ids
  into the control through a render prop, so every control gets
  aria-describedby and aria-invalid for free.
*/
export type Ctl = { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }

export function Field({ label, hint, error, optional, children, className }: { label: string; hint?: ReactNode; error?: string; optional?: boolean; children: (ctl: Ctl) => ReactNode; className?: string }) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-err` : undefined
  const describedBy = [errId, hintId].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="flex items-baseline justify-between text-[14px] font-medium text-ink">
        {label}
        {optional ? <span className="text-[13px] font-normal text-faint">Optional</span> : null}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error ? (
        <p id={errId} className="text-[13px] font-medium text-bad">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[13px] text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export const control =
  'w-full rounded-[var(--radius-control)] border border-line-strong bg-card px-3.5 text-[15px] text-ink placeholder:text-faint transition-[border-color,box-shadow] duration-150 hover:border-[#b9b9b4] focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45 data-[force=hover]:border-[#b9b9b4] data-[force=focus]:border-ink data-[force=focus]:ring-4 data-[force=focus]:ring-mint/45 aria-invalid:border-bad aria-invalid:focus:ring-bad/15 disabled:cursor-not-allowed disabled:bg-mist disabled:text-faint'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { force?: Force }>(function Input({ className, force, ...rest }, ref) {
  return <input ref={ref} data-force={force} className={cx(control, 'h-12', className)} {...rest} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cx(control, 'min-h-[112px] resize-y py-3 leading-relaxed', className)} {...rest} />
})

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cx(control, 'h-12 appearance-none pr-10', className)} {...rest}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>
  )
}

export function Checkbox({ label, checked, onChange, disabled, description }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; description?: string }) {
  const id = useId()
  return (
    <div className={cx('flex items-start gap-3 py-2 pl-2.5', disabled && 'opacity-50')}>
      <span className="relative -m-2.5 grid size-10 shrink-0 place-items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 size-10 cursor-pointer appearance-none rounded-[10px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink"
        />
        <span className="pointer-events-none grid size-5 place-items-center rounded-[6px] border-[1.5px] border-line-strong bg-card text-transparent transition-colors peer-checked:border-ink peer-checked:bg-mint peer-checked:text-ink" aria-hidden>
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      </span>
      <label htmlFor={id} className="pt-0.5 text-[15px] leading-snug text-body">
        {label}
        {description ? <span className="mt-0.5 block text-[13px] text-faint">{description}</span> : null}
      </label>
    </div>
  )
}
