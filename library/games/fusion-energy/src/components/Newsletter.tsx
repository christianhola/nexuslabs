import { useState } from 'react'
import type { FormEvent } from 'react'

import { postJson, useStored } from '../lib/store'
import { validateEmail } from '../lib/validate'
import { Button } from './Button'
import { Notice } from './Controls'
import { Field, Input } from './Field'

/*
  Email capture for build updates. Posts to /api/subscribe; once subscribed,
  the address is remembered in localStorage and the form becomes a receipt.
*/
export function Newsletter({ label = 'Get build updates', compact = false }: { label?: string; compact?: boolean }) {
  const [subscribed, setSubscribed, clear] = useStored<string | null>('newsletter', null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    setError(err)
    if (err) return
    setBusy(true)
    const res = await postJson('/api/subscribe', { email })
    setBusy(false)
    if (res.ok) setSubscribed(email.trim())
    else setError(res.errors?.email ?? res.error)
  }

  if (subscribed) {
    return (
      <Notice tone="success" title="You’re subscribed">
        Updates will go to {subscribed}.{' '}
        <button type="button" onClick={clear} className="font-medium text-white underline underline-offset-2 hover:no-underline">
          Use another address
        </button>
      </Notice>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <Field label={label} error={error} hint={compact ? undefined : 'One email a month. Unsubscribe any time.'}>
        {(p) => (
          <div className="flex gap-2">
            <Input
              {...p}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError(undefined)
              }}
              className="!h-11"
            />
            <Button type="submit" loading={busy} className="shrink-0">
              Subscribe
            </Button>
          </div>
        )}
      </Field>
    </form>
  )
}
