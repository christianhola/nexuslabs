import { useId, useState } from 'react'
import type { FormEvent } from 'react'

import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { navigate } from '../lib/router'
import { write } from '../lib/storage'
import { validateEmail } from '../lib/validate'
import { Button } from './Button'

/*
  The hero's email field: a bordered pill with a speech-bubble notch and the
  mint button inside. Validates here and in the Worker (/api/leads), keeps
  the address as the demo form's draft, then opens /demo.
*/
export function EmailCapture({ placeholder, cta, source, className, notch = true, onDark, initialError }: { placeholder: string; cta: string; source: string; className?: string; notch?: boolean; onDark?: boolean; initialError?: string }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>(initialError)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    setError(err)
    if (err) return
    setBusy(true)
    const res = await postJson<{ ok: true }>('/api/leads', { email, source })
    setBusy(false)
    if (!res.ok) {
      setError(res.errors?.email ?? res.error)
      return
    }
    write('demo-draft', { email: email.trim() })
    navigate('/demo')
  }

  return (
    <form onSubmit={submit} noValidate className={cx('w-full max-w-[446px]', className)}>
      <div className={cx('relative flex items-center gap-1 rounded-[12px] border bg-card p-[5px] shadow-[0_1px_2px_rgb(15_15_15/0.04)] transition-[border-color,box-shadow] focus-within:border-ink focus-within:ring-4 focus-within:ring-mint/40', error ? 'border-bad' : 'border-[#dedede]')}>
        {notch ? <span className={cx('absolute -top-[7px] left-[36px] size-3 rotate-45 border-l border-t bg-card', error ? 'border-bad' : 'border-[#dedede]')} aria-hidden /> : null}
        <label htmlFor={id} className="sr-only">
          Work email
        </label>
        <input
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(undefined)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent pl-3 text-[15px] text-ink placeholder:text-faint focus:outline-none"
        />
        <Button type="submit" loading={busy} className="h-11 shrink-0 px-[18px] text-[15.5px]">
          {cta}
        </Button>
      </div>
      {error ? (
        <p id={`${id}-err`} role="alert" className={cx('mt-2 text-[13.5px] font-medium', onDark ? 'text-[#ffb4a9]' : 'text-bad')}>
          {error}
        </p>
      ) : null}
    </form>
  )
}
