import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cx } from '../lib/cx'
import { TextField } from './Field'
import type { TextFieldProps } from './Field'

/** Password input with show/hide and an optional strength meter. */
export const PasswordField = forwardRef<HTMLInputElement, Omit<TextFieldProps, 'type' | 'suffix'> & { meter?: boolean }>(function PasswordField({ meter, value, ...rest }, ref) {
  const [show, setShow] = useState(false)
  const v = String(value ?? '')
  const score = [v.length >= 10, /\d/.test(v) && /[a-z]/i.test(v), /[A-Z]/.test(v) && /[a-z]/.test(v), /[^\w\s]/.test(v) || v.length >= 16].filter(Boolean).length
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
  return (
    <div>
      <TextField
        ref={ref}
        type={show ? 'text' : 'password'}
        value={value}
        {...rest}
        suffix={
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
            className="grid size-10 place-items-center rounded-control-sm text-faint hover:bg-mist hover:text-ink"
          >
            {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        }
      />
      {meter && v.length > 0 && (
        <div className="mt-2 flex items-center gap-3">
          <div className="flex flex-1 gap-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cx('h-1 flex-1 rounded-full transition-colors', i < score ? (score < 2 ? 'bg-danger' : score < 3 ? 'bg-[#d9a234]' : 'bg-teal') : 'bg-mist-3')} />
            ))}
          </div>
          <span className="w-16 text-right text-[12.5px] text-muted" aria-live="polite">
            {labels[score]}
          </span>
        </div>
      )}
    </div>
  )
})
