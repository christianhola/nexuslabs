import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'

import { Input } from './Field'

/** Password field with a show/hide toggle button inside the well. */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>>(function PasswordInput(props, ref) {
  const [show, setShow] = useState(false)
  return (
    <Input
      ref={ref}
      type={show ? 'text' : 'password'}
      {...props}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="grid size-10 place-items-center rounded-[8px] text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          {show ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
        </button>
      }
    />
  )
})
