import { useState } from 'react'
import type { FormEvent } from 'react'

import { FOOTER } from '../content'
import { post } from '../lib/api'
import type { ApiError } from '../lib/api'
import { validateSubscribe } from '../shared/validate'
import { Button } from './Button'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [error, setError] = useState('')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateSubscribe({ email })
    if (!v.ok) return setError(v.errors.email!)
    setError('')
    setState('loading')
    try {
      await post('/api/subscribe', { email })
      setState('done')
    } catch (err) {
      setError((err as ApiError).fields?.email ?? (err as Error).message)
      setState('idle')
    }
  }
  if (state === 'done')
    return (
      <p role="status" className="text-[14.5px] text-brand-text">
        {FOOTER.newsletter.done}
      </p>
    )
  return (
    <form onSubmit={submit} noValidate className="grid gap-1.5">
      <div className="flex gap-2">
        <label htmlFor="nl-email" className="sr-only">
          Newsletter email
        </label>
        <input
          id="nl-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={FOOTER.newsletter.placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'nl-err' : undefined}
          className="h-10 min-w-0 flex-1 rounded-control bg-[#081012] px-3.5 text-[14.5px] ring-1 ring-inset ring-line-strong placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-brand/80 aria-invalid:ring-danger/80"
        />
        <Button type="submit" variant="secondary" loading={state === 'loading'}>
          {FOOTER.newsletter.button}
        </Button>
      </div>
      {error && (
        <p id="nl-err" role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      )}
    </form>
  )
}
