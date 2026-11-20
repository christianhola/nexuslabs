import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Field, Input, Select, Textarea } from '../components/Field'
import { LogoMark } from '../components/Logo'
import { Notice } from '../components/Notice'
import { demoCopy, hero, loginCopy, signupCopy } from '../content'
import { api, ApiError } from '../lib/api'
import { Link, useLocation } from '../lib/router'
import type { Errors } from '../lib/validate'
import { validateDemo, validateEmail, validateSignup } from '../lib/validate'

/* Shared shell for sign up, log in and the demo request. */
function Shell({ title, body, children, aside }: { title: string; body: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <Container className="grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_480px] xl:gap-20">
      <div className="lg:pt-6">
        <h1 className="display text-[44px] uppercase text-white sm:text-[60px] lg:text-[50px] xl:text-[60px]">{title}</h1>
        <p className="mt-5 max-w-[520px] text-[18px] leading-relaxed text-body">{body}</p>
        {aside}
      </div>
      <div className="rounded-[var(--radius-card-lg)] border border-line bg-panel p-6 shadow-[var(--shadow-card)] sm:p-8">{children}</div>
    </Container>
  )
}

function useForm<T extends Record<string, string>>(initial: T, validate: (v: T) => Errors, url: string) {
  const [v, setV] = useState(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState<T | null>(null)
  const set = (k: keyof T) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }))
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(v)
    setErrors(errs)
    setFormError(null)
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus()
      return
    }
    setBusy(true)
    try {
      await api(url, { body: v })
      setDone(v)
    } catch (err) {
      const ae = err as ApiError
      setErrors(ae.errors ?? {})
      setFormError(ae.message)
    } finally {
      setBusy(false)
    }
  }
  return { v, set, errors, busy, formError, done, submit, reset: () => setDone(null) }
}

const ok = (title: string, body: string, again: () => void) => (
  <div className="flex flex-col items-start" role="status">
    <CheckCircle2 className="size-10 text-ok" aria-hidden />
    <h2 className="mt-4 text-[22px] font-semibold text-ink">{title}</h2>
    <p className="mt-2 text-[16px] text-body">{body}</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <Button href="/editor">Open the editor</Button>
      <Button variant="ghost" onClick={again}>
        Use a different email
      </Button>
    </div>
  </div>
)

export function SignUpPage() {
  const { search } = useLocation()
  const plan = new URLSearchParams(search).get('plan')
  const f = useForm({ name: '', email: '', publication: '' }, validateSignup, '/api/signup')
  return (
    <Shell
      title={signupCopy.title}
      body={signupCopy.body}
      aside={
        <ul className="mt-10 flex flex-col gap-3 text-[16px] text-body">
          {['Import your list in minutes', 'Ad network from your first issue', '0% cut of paid subscriptions'].map((x) => (
            <li key={x} className="flex items-center gap-3">
              <span className="grid size-7 place-items-center rounded-[6px] bg-pink/15 text-pink-text">
                <LogoMark className="size-4" />
              </span>
              {x}
            </li>
          ))}
        </ul>
      }
    >
      {f.done ? (
        ok('Check your inbox', signupCopy.done(f.done.email.trim()), f.reset)
      ) : (
        <form onSubmit={f.submit} noValidate className="flex flex-col gap-5">
          {plan ? <p className="text-[14px] text-muted">Plan: <span className="font-semibold capitalize text-ink">{plan}</span>, free for 14 days</p> : null}
          {f.formError ? <Notice tone="bad" title={f.formError} /> : null}
          <Field label="Your name" error={f.errors.name}>
            {(x) => <Input id={x.id} name="name" aria-describedby={x.describedBy} invalid={x.invalid} autoComplete="name" value={f.v.name} onChange={f.set('name')} />}
          </Field>
          <Field label="Email" error={f.errors.email}>
            {(x) => <Input id={x.id} name="email" type="email" aria-describedby={x.describedBy} invalid={x.invalid} autoComplete="email" value={f.v.email} onChange={f.set('email')} placeholder="you@example.com" />}
          </Field>
          <Field label="Publication name" hint="You can change it any time." error={f.errors.publication}>
            {(x) => <Input id={x.id} name="publication" aria-describedby={x.describedBy} invalid={x.invalid} value={f.v.publication} onChange={f.set('publication')} placeholder="The Quiet Hour" />}
          </Field>
          <Button type="submit" size="lg" loading={f.busy} className="w-full">
            {hero.primary.label}
          </Button>
          <p className="text-center text-[14px] text-muted">
            Already writing with us?{' '}
            <Link href="/login" className="font-medium text-pink-text underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      )}
    </Shell>
  )
}

export function LogInPage() {
  const f = useForm({ email: '' }, (v): Errors => {
    const e = validateEmail(v.email)
    return e ? { email: e } : {}
  }, '/api/login')
  return (
    <Shell title={loginCopy.title} body={loginCopy.body}>
      {f.done ? (
        ok('Link sent', loginCopy.done(f.done.email.trim()), f.reset)
      ) : (
        <form onSubmit={f.submit} noValidate className="flex flex-col gap-5">
          {f.formError ? <Notice tone="bad" title={f.formError} /> : null}
          <Field label="Email" error={f.errors.email}>
            {(x) => <Input id={x.id} name="email" type="email" aria-describedby={x.describedBy} invalid={x.invalid} autoComplete="email" value={f.v.email} onChange={f.set('email')} placeholder="you@example.com" />}
          </Field>
          <Button type="submit" size="lg" loading={f.busy} className="w-full">
            Email me a sign-in link
          </Button>
          <p className="text-center text-[14px] text-muted">
            New to Inkwell?{' '}
            <Link href="/signup" className="font-medium text-pink-text underline-offset-4 hover:underline">
              Sign up for free
            </Link>
          </p>
        </form>
      )}
    </Shell>
  )
}

export function DemoPage() {
  const f = useForm({ name: '', email: '', publication: '', size: '', message: '' }, validateDemo, '/api/demo')
  return (
    <Shell title={demoCopy.title} body={demoCopy.body}>
      {f.done ? (
        <div role="status">
          <CheckCircle2 className="size-10 text-ok" aria-hidden />
          <h2 className="mt-4 text-[22px] font-semibold text-ink">Thanks, {f.done.name.trim().split(' ')[0]}</h2>
          <p className="mt-2 text-[16px] text-body">We’ll write to {f.done.email.trim()} within one working day to find a time.</p>
          <Button href="/" variant="outline" className="mt-6">
            Back to home
          </Button>
        </div>
      ) : (
        <form onSubmit={f.submit} noValidate className="flex flex-col gap-5">
          {f.formError ? <Notice tone="bad" title={f.formError} /> : null}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Name" error={f.errors.name}>
              {(x) => <Input id={x.id} name="name" aria-describedby={x.describedBy} invalid={x.invalid} autoComplete="name" value={f.v.name} onChange={f.set('name')} />}
            </Field>
            <Field label="Work email" error={f.errors.email}>
              {(x) => <Input id={x.id} name="email" type="email" aria-describedby={x.describedBy} invalid={x.invalid} autoComplete="email" value={f.v.email} onChange={f.set('email')} />}
            </Field>
          </div>
          <Field label="Publication or company" error={f.errors.publication}>
            {(x) => <Input id={x.id} name="publication" aria-describedby={x.describedBy} invalid={x.invalid} autoComplete="organization" value={f.v.publication} onChange={f.set('publication')} />}
          </Field>
          <Field label="List size" error={f.errors.size}>
            {(x) => (
              <Select id={x.id} name="size" aria-describedby={x.describedBy} invalid={x.invalid} value={f.v.size} onChange={f.set('size')}>
                <option value="">Choose one</option>
                {demoCopy.sizes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Anything we should know?" optional error={f.errors.message}>
            {(x) => <Textarea id={x.id} name="message" aria-describedby={x.describedBy} invalid={x.invalid} value={f.v.message} onChange={f.set('message')} />}
          </Field>
          <Button type="submit" size="lg" loading={f.busy} className="w-full">
            Request a demo
          </Button>
        </form>
      )}
    </Shell>
  )
}
