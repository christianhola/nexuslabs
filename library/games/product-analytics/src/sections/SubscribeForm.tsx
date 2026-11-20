import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Input } from '../components/Field'
import { postJson } from '../lib/api'
import { useStored } from '../lib/storage'
import { validateEmail } from '../lib/validate'

/*
  Email capture that posts to /api/subscribe. Remembers the address in
  localStorage so the confirmation survives a reload.
*/
export function SubscribeForm({ source, label, cta = 'Subscribe' }: { source: string; label: string; cta?: string }) {
  const [saved, setSaved] = useStored<string | null>(`subscribed:${source}`, null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const id = `sub-${source}`

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateEmail(email)
    if (v) return setError(v)
    setBusy(true)
    setError(undefined)
    const res = await postJson<{ ok: true }>('/api/subscribe', { email, source })
    setBusy(false)
    if (!res.ok) return setError(res.error)
    setSaved(email.trim())
  }

  if (saved)
    return (
      <p className="rounded-[var(--radius-control)] bg-lime-soft px-4 py-3 text-[14px] text-ink" role="status">
        You’re on the list as <span className="font-semibold">{saved}</span>.{' '}
        <button type="button" className="rounded font-semibold text-leaf underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-leaf" onClick={() => setSaved(null)}>
          Use another email
        </button>
      </p>
    )

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={id} className="font-display text-[13.5px] font-semibold text-ink">
        {label}
      </label>
      <div className="mt-2 flex gap-2">
        <Input id={id} type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className="!h-11" />
        <Button type="submit" variant="dark" loading={busy} className="!h-11 shrink-0">
          {cta}
        </Button>
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[13px] font-medium text-bad">
          {error}
        </p>
      ) : null}
    </form>
  )
}
