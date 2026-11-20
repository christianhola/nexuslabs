import { MailCheck } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Button } from '../components/Button'
import { TextField } from '../components/Field'
import { Notice } from '../components/Notice'
import { loginPage as l } from '../content'
import { postJson } from '../lib/api'
import { Link } from '../lib/router'
import { readStore } from '../lib/storage'
import { validateEmail } from '../lib/validate'

export function Login() {
  const [email, setEmail] = useState(() => readStore<{ email?: string } | null>('account', null)?.email ?? '')
  const [error, setError] = useState<string>()
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    setError(err)
    if (err) return
    setStatus('sending')
    const r = await postJson('/api/login', { email })
    if (!r.ok) {
      setStatus('idle')
      return setError(r.errors?.email ?? r.error)
    }
    setStatus('sent')
  }
  return (
    <AuthShell>
      <div className="grid max-w-[460px] gap-8">
        <div className="grid gap-3">
          <h1 className="font-display text-[40px] font-medium leading-[1.08] tracking-[-0.025em] text-white">{l.title}</h1>
          <p className="text-[16px] text-muted">{l.body}</p>
        </div>
        {status === 'sent' ? (
          <div className="grid gap-5">
            <Notice tone="success" title={l.success.title}>
              {l.success.body} <span className="font-semibold text-white">{email.trim()}</span>.
            </Notice>
            <div className="flex items-center gap-3 text-[14px] text-muted">
              <MailCheck aria-hidden className="size-4" /> Wrong address?
              <button type="button" onClick={() => setStatus('idle')} className="min-h-10 font-semibold text-cobalt-text hover:text-white">
                Use another email
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-5">
            <TextField id="login-email" label="Work email" type="email" autoComplete="email" placeholder="you@brand.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
            <Button type="submit" size="lg" loading={status === 'sending'}>
              {status === 'sending' ? 'Sending link…' : 'Email me a sign-in link'}
            </Button>
          </form>
        )}
        <p className="text-[14px] text-muted">
          New to Relaytext?{' '}
          <Link href="/signup" className="font-semibold text-cobalt-text hover:text-white">
            Start a free trial
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
