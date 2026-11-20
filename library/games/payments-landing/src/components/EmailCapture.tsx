import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

import { api } from '../lib/api'
import { cx } from '../lib/cx'
import { validateEmail } from '../shared/validate'
import { Button } from './Button'

/*
  The hero's joined email field and button. Validates on the page, posts to
  /api/subscribe, and shows loading, error and success states in place.
*/
export function EmailCapture({
  placeholder,
  cta,
  success,
  label = 'Business email',
  tone = 'light',
  force,
  className,
}: {
  placeholder: string
  cta: string
  success: string
  label?: string
  tone?: 'light' | 'navy'
  force?: 'loading' | 'error' | 'success'
  className?: string
}) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)
  const shown = force ?? state
  const shownError = force === 'error' ? 'Enter a valid email address, like name@company.com.' : error

  async function submit(e: FormEvent) {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) {
      setError(err)
      setState('error')
      return
    }
    setState('loading')
    setError(null)
    const res = await api('/api/subscribe', { body: { email } })
    if (res.ok) setState('success')
    else {
      setError(res.data.errors?.email ?? res.data.message ?? 'Something went wrong. Try again.')
      setState('error')
    }
  }

  if (shown === 'success') {
    return (
      <p role="status" className={cx('flex max-w-[460px] items-start gap-3 rounded-control-sm border border-teal-100 bg-white p-4 text-[15px] leading-6 text-ink-2', className)}>
        <span className="round mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-teal-ink text-white">
          <Check className="size-3.5" aria-hidden />
        </span>
        {success}
      </p>
    )
  }

  return (
    <form onSubmit={submit} noValidate className={cx('max-w-[460px]', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div
        className={cx(
          'flex items-center gap-2 rounded-[14px] border bg-white p-1.5 pl-4 transition-[border-color,box-shadow]',
          'focus-within:border-teal focus-within:shadow-focus',
          shown === 'error' ? 'border-danger' : tone === 'navy' ? 'border-transparent' : 'border-line',
        )}
      >
        <input
          id={id}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          aria-invalid={shown === 'error' || undefined}
          aria-describedby={shown === 'error' ? `${id}-error` : undefined}
          className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-faint"
        />
        <Button type="submit" loading={shown === 'loading'} icon={<ArrowUpRight className="size-4" aria-hidden />} className="shrink-0">
          {cta}
        </Button>
      </div>
      {shown === 'error' && shownError && (
        <p id={`${id}-error`} className={cx('mt-2 text-[13px]', tone === 'navy' ? 'text-[#ffb4ad]' : 'text-danger')}>
          {shownError}
        </p>
      )}
    </form>
  )
}
