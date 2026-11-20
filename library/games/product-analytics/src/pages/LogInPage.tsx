import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { Field, Input, PasswordInput } from '../components/Field'
import { Notice } from '../components/Notice'
import { getAccount, hash, signIn, signOut } from '../lib/account'
import { Link } from '../lib/router'
import { useStored } from '../lib/storage'
import { validateEmail } from '../lib/validate'

/* Demo log in against the account saved by /signup in this browser. */
export function LogInPage() {
  const [session] = useStored<string | null>('session', null)
  const account = getAccount()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [forgot, setForgot] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = { email: validateEmail(email), password: password ? undefined : 'Enter your password.' }
    setErrors(errs)
    if (errs.email || errs.password) return
    setBusy(true)
    await new Promise((r) => setTimeout(r, 500))
    const a = getAccount()
    if (!a || a.email !== email.trim().toLowerCase()) {
      setBusy(false)
      return setFormError('No account uses that email in this browser. Sign up first; it takes a minute.')
    }
    if ((await hash(password)) !== a.passwordHash) {
      setBusy(false)
      return setFormError('That password doesn’t match. Check caps lock, or reset it below.')
    }
    setFormError(undefined)
    setBusy(false)
    signIn(a.email)
  }

  if (session && account && account.email === session)
    return (
      <AuthShell title="You’re signed in" lede="This is a demo session stored in your browser." quote="Everything you need to keep the customers you win.">
        <div className="flex items-center gap-4 rounded-[16px] bg-wash p-4">
          <Avatar name={account.name} size={48} />
          <div className="min-w-0">
            <p className="font-display text-[16px] font-semibold text-ink">{account.name}</p>
            <p className="truncate text-[14px] text-muted">
              {account.email}, {account.company} on {account.plan}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button href="/docs/quickstart" arrow>
            Continue setup
          </Button>
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </AuthShell>
    )

  return (
    <AuthShell title="Welcome back" lede="Log in to your Pulseboard workspace." quote="“We caught a broken invite flow a week before renewals.”">
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        {formError ? <Notice tone="bad">{formError}</Notice> : null}
        <Field label="Work email" error={errors.email}>
          {(c) => <Input {...c} name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
        </Field>
        <Field label="Password" error={errors.password}>
          {(c) => <PasswordInput {...c} name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
        </Field>
        <div className="-mt-2 flex justify-end">
          <button type="button" onClick={() => setForgot((f) => !f)} aria-expanded={forgot} className="min-h-10 rounded px-1 text-[14px] font-semibold text-leaf underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-leaf">
            Forgot password?
          </button>
        </div>
        {forgot ? (
          <Notice title="Resetting a demo password">
            This template keeps accounts in your browser, so there is no email to send. Sign up again with the same email to set a new password.
          </Notice>
        ) : null}
        <Button type="submit" size="lg" loading={busy} className="w-full">
          Log in
        </Button>
        <p className="text-center text-[14px] text-muted">
          New to Pulseboard?{' '}
          <Link href="/signup" className="rounded font-semibold text-leaf underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-leaf">
            Start for free
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
