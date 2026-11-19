import { useId, useState } from 'react'

import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { validateSubscribe } from '../shared/validation'
import { Button } from './Button'

type Status = 'idle' | 'loading' | 'done' | 'error'

/** Email capture posting to /api/subscribe; validates first, then trusts the Worker. */
export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const uid = useId()
  const inputId = `${uid}-email`
  const msgId = `${uid}-msg`

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validateSubscribe({ email })
    if (errs.email) {
      setStatus('error')
      setError(errs.email)
      return
    }
    setStatus('loading')
    const res = await postJson('/api/subscribe', { email })
    if (res.ok) {
      setStatus('done')
      setEmail('')
    } else {
      setStatus('error')
      setError(res.fieldErrors?.email ?? res.error)
    }
  }

  if (status === 'done')
    return (
      <p role="status" className={cx('text-[15px] text-snow', className)}>
        Thank you. The next notes arrive at the turn of the season.
      </p>
    )

  return (
    <form onSubmit={submit} noValidate className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          aria-invalid={status === 'error' || undefined}
          aria-describedby={status === 'error' ? msgId : undefined}
          className="round h-12 min-w-0 flex-1 rounded-full border border-night-line bg-night-2 px-5 text-[16px] text-snow placeholder:text-snow-muted focus:border-snow focus:outline-none aria-[invalid=true]:border-[#ff9b8a]"
        />
        <Button type="submit" variant="light" loading={status === 'loading'}>
          Subscribe
        </Button>
      </div>
      {status === 'error' && (
        <p id={msgId} role="alert" className="pl-5 text-[13px] text-[#ffb4a6]">
          {error}
        </p>
      )}
    </form>
  )
}
