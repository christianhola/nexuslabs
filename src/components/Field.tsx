import { Check, ChevronDown } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cx } from '../lib/cx'

type Shared = { label: string; hint?: string; error?: string; optional?: boolean; className?: string; 'data-force'?: string }

const CONTROL =
  'w-full rounded-[var(--radius-sm)] border border-line-strong bg-card px-3.5 h-12 text-[16px] text-ink placeholder:text-muted transition-[border-color,box-shadow] duration-[var(--duration-fast)] hover:border-ink-2 data-[force=hover]:border-ink-2 focus:border-ink focus:outline-none focus:shadow-[0_0_0_1px_var(--color-ink)] data-[force=focus]:border-ink data-[force=focus]:shadow-[0_0_0_1px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[0_0_0_1px_var(--color-danger)]'

function Message({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error)
    return (
      <p id={`${id}-msg`} className="text-[13px] font-medium text-danger">
        {error}
      </p>
    )
  if (hint)
    return (
      <p id={`${id}-msg`} className="text-[13px] text-muted">
        {hint}
      </p>
    )
  return null
}

function Frame({ id, label, hint, error, optional, className, children }: Shared & { id: string; children: ReactNode }) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] font-medium text-ink-2">
        {label}
        {optional && <span className="ml-1.5 font-normal text-muted">optional</span>}
      </label>
      {children}
      <Message id={id} error={error} hint={hint} />
    </div>
  )
}

export function TextField({ label, hint, error, optional, className, id, ...rest }: Shared & InputHTMLAttributes<HTMLInputElement>) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <Frame {...{ id: fid, label, hint, error, optional, className }}>
      <input id={fid} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${fid}-msg` : undefined} className={CONTROL} {...rest} />
    </Frame>
  )
}

export function TextArea({ label, hint, error, optional, className, id, ...rest }: Shared & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <Frame {...{ id: fid, label, hint, error, optional, className }}>
      <textarea
        id={fid}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${fid}-msg` : undefined}
        className={cx(CONTROL, 'h-auto resize-y py-3')}
        {...rest}
      />
    </Frame>
  )
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  className,
  id,
  options,
  placeholder,
  ...rest
}: Shared & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly (string | { value: string; label: string })[]; placeholder?: string }) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <Frame {...{ id: fid, label, hint, error, optional, className }}>
      <div className="relative">
        <select
          id={fid}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${fid}-msg` : undefined}
          className={cx(CONTROL, 'appearance-none pr-10')}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options
            .map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
            .map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" strokeWidth={1.75} aria-hidden />
      </div>
    </Frame>
  )
}

const CHIP =
  'round inline-flex min-h-10 cursor-pointer select-none items-center gap-1.5 rounded-full border border-line-strong bg-card px-4 text-[14px] font-medium text-ink-2 transition-colors duration-[var(--duration-fast)] hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink peer-disabled:cursor-not-allowed peer-disabled:opacity-40 data-[force=hover]:border-ink data-[force=focus]:outline-2 data-[force=focus]:outline-offset-3 data-[force=focus]:outline-ink'

/** Pill choices: a radio group (single) or a checkbox group (multiple). */
export function ChoiceChips({
  label,
  options,
  value,
  onChange,
  error,
  name,
  multiple,
  className,
  hideLabel,
}: {
  label: string
  options: readonly (string | { value: string; label: string })[]
  value: string | string[]
  onChange: (v: string) => void
  error?: string
  name: string
  multiple?: boolean
  className?: string
  hideLabel?: boolean
}) {
  const id = useId()
  const selected = (v: string) => (Array.isArray(value) ? value.includes(v) : value === v)
  return (
    <fieldset className={cx('flex flex-col gap-2.5', className)} aria-describedby={error ? `${id}-msg` : undefined} aria-invalid={error ? true : undefined}>
      <legend className={cx('mb-2.5 text-[14px] font-medium text-ink-2', hideLabel && 'sr-only')}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options
          .map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
          .map((o) => (
            <label key={o.value} className="relative">
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={name}
                value={o.value}
                checked={selected(o.value)}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span className={CHIP}>
                {multiple && selected(o.value) && <Check className="-ml-1 size-3.5" strokeWidth={2.25} aria-hidden />}
                {o.label}
              </span>
            </label>
          ))}
      </div>
      {error && (
        <p id={`${id}-msg`} className="text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

/** A static chip for the style guide (shows a pinned state). */
export function ChipPreview({ children, checked, disabled, force }: { children: ReactNode; checked?: boolean; disabled?: boolean; force?: string }) {
  return (
    <label className="relative">
      <input type="checkbox" className="peer sr-only" checked={!!checked} disabled={disabled} readOnly tabIndex={-1} aria-hidden />
      <span className={CHIP} data-force={force}>
        {children}
      </span>
    </label>
  )
}

export function Checkbox({ label, description, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string; 'data-force'?: string }) {
  const id = useId()
  return (
    <label htmlFor={rest.id ?? id} className={cx('group flex min-h-10 cursor-pointer items-start gap-3', rest.disabled && 'cursor-not-allowed opacity-50', className)}>
      <input id={rest.id ?? id} type="checkbox" className="peer sr-only" {...rest} />
      <span
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-[var(--radius-xs)] border border-line-strong bg-card text-transparent transition-colors group-hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
        aria-hidden
      >
        <Check className="size-3.5" strokeWidth={2.5} />
      </span>
      <span className="flex flex-col">
        <span className="text-[15px] font-medium text-ink">{label}</span>
        {description && <span className="text-[13px] text-muted">{description}</span>}
      </span>
    </label>
  )
}
