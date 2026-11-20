import { forwardRef, useId, type InputHTMLAttributes } from 'react'

import { cx } from '../lib/cx'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
  error?: string
  hideLabel?: boolean
}

/** Labelled text input with hint and error states. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, className, id, ...rest },
  ref,
) {
  const auto = useId()
  const inputId = id ?? auto
  const msgId = `${inputId}-msg`
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className={cx('text-[13px] font-medium text-ink-2', hideLabel && 'sr-only')}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? msgId : undefined}
        className={cx(
          'h-10 rounded-[var(--radius-control)] bg-surface px-3 text-[14px] text-ink outline-none ring-1 ring-inset transition-shadow duration-150 placeholder:text-faint',
          error ? 'ring-danger focus:ring-2' : 'ring-line-strong hover:ring-black/25 focus:ring-2 focus:ring-select',
          'disabled:bg-surface-2 disabled:text-faint',
        )}
        {...rest}
      />
      {(error || hint) && (
        <p id={msgId} className={cx('text-[12.5px]', error ? 'text-danger' : 'text-muted')}>
          {error ?? hint}
        </p>
      )}
    </div>
  )
})
