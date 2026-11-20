import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Button } from '../components/Button'
import { Field, Input, PasswordInput } from '../components/Field'
import { Notice } from '../components/Notice'
import { PasswordStrength } from '../components/PasswordStrength'
import { signup } from '../content'
import { getAccount, hash, saveAccount, signIn } from '../lib/account'
import type { Account } from '../lib/account'
import { postJson } from '../lib/api'
import { Link } from '../lib/router'
import { validateSignup } from '../lib/validate'
import type { Errors, SignupInput } from '../lib/validate'

export function SignUpPage() {
  const plan = new URLSearchParams(window.location.search).get('plan') === 'growth' ? 'Growth trial' : 'Free'
  const [v, setV] = useState<SignupInput>({ name: '', email: '', password: '', company: '' })
  const [errors, setErrors] = useState<Errors<SignupInput>>({})
  const [formError, setFormError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [created, setCreated] = useState<Account | null>(null)
  const existing = getAccount()

  const set = (k: keyof SignupInput) => (e: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validateSignup(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setFormError(undefined)
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }
    setBusy(true)
    const res = await postJson<{ ok: true; workspace: string }>('/api/signup', v)
    if (!res.ok) {
      setBusy(false)
      setErrors((res.errors ?? {}) as Errors<SignupInput>)
      setFormError(res.error)
      return
    }
    const account: Account = { name: v.name.trim(), email: v.email.trim().toLowerCase(), company: v.company.trim(), passwordHash: await hash(v.password), createdAt: new Date().toISOString(), plan }
    saveAccount(account)
    signIn(account.email)
    setBusy(false)
    setCreated(account)
  }

  if (created)
    return (
      <AuthShell title="Your workspace is ready" lede={`${created.company} is set up on the ${created.plan} plan.`} quote="Most teams see their first funnel within the hour.">
        <div className="flex flex-col gap-5" role="status">
          <Notice tone="ok" title={`Welcome, ${created.name.split(' ')[0]}`}>
            We saved your demo account in this browser. Next, add the SDK and send your first event.
          </Notice>
          <ol className="flex flex-col gap-3 text-[15px] text-body">
            {['Install the SDK in your app', 'Identify users and accounts', 'Build your first funnel'].map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-[14px] bg-wash px-4 py-3">
                <span className="round grid size-7 place-items-center rounded-full bg-lime font-display text-[13px] font-bold text-ink">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2.5">
            <Button href="/docs/quickstart" arrow>
              Open the quickstart
            </Button>
            <Button href="/login" variant="outline">
              Go to your account
            </Button>
          </div>
        </div>
      </AuthShell>
    )

  return (
    <AuthShell title={signup.title} lede={signup.lede} perks={signup.perks} quote="The quickest way to find out why customers leave.">
      {existing ? (
        <Notice className="mb-6" title="You already have a demo account here">
          Signed up as {existing.email}.{' '}
          <Link href="/login" className="font-semibold text-leaf underline underline-offset-2">
            Log in instead
          </Link>
          , or sign up again to replace it.
        </Notice>
      ) : null}
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        {formError ? <Notice tone="bad">{formError}</Notice> : null}
        <Field label="Full name" error={errors.name}>
          {(c) => <Input {...c} name="name" autoComplete="name" value={v.name} onChange={set('name')} />}
        </Field>
        <Field label="Work email" error={errors.email}>
          {(c) => <Input {...c} name="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} />}
        </Field>
        <Field label="Workspace name" error={errors.company} hint="Usually your company or product.">
          {(c) => <Input {...c} name="company" autoComplete="organization" value={v.company} onChange={set('company')} />}
        </Field>
        <Field label="Password" error={errors.password}>
          {(c) => (
            <div className="flex flex-col gap-2">
              <PasswordInput {...c} name="password" autoComplete="new-password" value={v.password} onChange={set('password')} />
              <PasswordStrength value={v.password} />
            </div>
          )}
        </Field>
        <Button type="submit" size="lg" loading={busy} arrow className="w-full">
          Create workspace
        </Button>
        <p className="text-center text-[14px] text-muted">
          Already have an account?{' '}
          <Link href="/login" className="rounded font-semibold text-leaf underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-leaf">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
