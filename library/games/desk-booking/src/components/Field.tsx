import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '../lib/cn'

const control =
  'h-10 w-full rounded-sm bg-surface px-3 text-[14px] text-fg ring-1 ring-inset ring-line transition-shadow duration-150 placeholder:text-faint hover:ring-[#d0d4db] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:bg-canvas disabled:text-faint aria-[invalid=true]:ring-danger'

/** Label + control + hint/error. Pass the control as a render prop to get ids wired. */
export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  className?: string
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
}) {
  const id = useId()
  const note = error || hint ? `${id}-note` : undefined
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-semibold text-body">
        {label}
      </label>
      {children({ id, 'aria-describedby': note, 'aria-invalid': error ? true : undefined })}
      {(error || hint) && (
        <p id={note} role={error ? 'alert' : undefined} className={cn('text-xs', error ? 'text-danger' : 'text-muted')}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} className={cn(control, className)} {...rest} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <span className={cn('relative block', className)}>
      <select ref={ref} className={cn(control, 'appearance-none pr-9')} {...rest}>
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </span>
  )
})
