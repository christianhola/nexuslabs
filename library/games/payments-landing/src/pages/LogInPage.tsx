import { useState } from 'react'
import type { FormEvent } from 'react'
import { LogOut } from 'lucide-react'

import { AuthShell } from '../components/AuthShell'
import { Button, ButtonLink } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { TextField } from '../components/Field'
import { Notice } from '../components/Notice'
import { PasswordField } from '../components/PasswordField'
import { login } from '../content'
import { api } from '../lib/api'
import { Link, navigate } from '../lib/router'
import { keys, useStore } from '../lib/store'
import { validateEmail } from '../shared/validate'

export function LogInPage() {
  const [session, setSession, clearSession] = useStore<{ email: string } | null>(keys.session, null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetError, setResetError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}
    const em = validateEmail(email)
    if (em) errs.email = em
    if (!password) errs.password = 'Enter your password.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(errs.email ? 'li-email' : 'li-password')?.focus()
      return
    }
    setLoading(true)
    const res = await api<{ email: string }>('/api/login', { body: { email, password } })
    setLoading(false)
    if (res.ok) {
      setSession({ email: res.data.email })
      navigate('/send')
    } else setErrors(res.data.errors ?? { password: res.data.message ?? 'Something went wrong.' })
  }

  function sendReset(e: FormEvent) {
    e.preventDefault()
    const err = validateEmail(resetEmail)
    setResetError(err)
    if (!err) setResetSent(true)
  }

  if (session) {
    return (
      <AuthShell title="You’re signed in" body={`Signed in on this device as ${session.email}.`}>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/send">Go to transfers</ButtonLink>
          <Button variant="outline" iconLeft={<LogOut className="size-4" aria-hidden />} onClick={clearSession}>
            Log out
          </Button>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell title={login.title} body={login.body}>
      <form noValidate onSubmit={submit} className="grid gap-5">
        <TextField id="li-email" type="email" label="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordField id="li-password" label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="-mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setForgot(true)
              setResetSent(false)
              setResetEmail(email)
            }}
            className="min-h-10 text-[14px] font-medium text-teal-ink underline-offset-4 hover:underline"
          >
            {login.forgot}
          </button>
        </div>
        <Button type="submit" size="lg" loading={loading} block>
          Log in
        </Button>
        <Notice tone="info" live={false}>
          {login.demoNote}
        </Notice>
      </form>
      <p className="mt-10 text-[14px] text-muted">
        New to Ledgerly?{' '}
        <Link href="/signup" className="font-medium text-teal-ink underline-offset-4 hover:underline">
          Open an account
        </Link>
      </p>
      <Dialog open={forgot} onClose={() => setForgot(false)} title="Reset your password" description="We’ll email you a link to choose a new one.">
        {resetSent ? (
          <>
            <Notice tone="success">
              {login.resetSent} {resetEmail}.
            </Notice>
            <Button className="mt-6" block variant="outline" onClick={() => setForgot(false)}>
              Done
            </Button>
          </>
        ) : (
          <form noValidate onSubmit={sendReset} className="grid gap-5">
            <TextField label="Email" type="email" autoComplete="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} error={resetError} />
            <Button type="submit" block>
              Send reset link
            </Button>
          </form>
        )}
      </Dialog>
    </AuthShell>
  )
}
