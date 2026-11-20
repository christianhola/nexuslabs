import { useState } from 'react'
import type { FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox, Input } from '../components/Field'
import { Logo } from '../components/Logo'
import { Notice } from '../components/Misc'
import { useToast } from '../components/Toast'
import { SIGNUP } from '../content'
import { ApiError, post } from '../lib/api'
import { Link, navigate } from '../lib/router'
import { writeStore } from '../lib/storage'
import { validateSignup } from '../shared/validate'
import type { Errors } from '../shared/validate'

/** Workspace sign-up. The Worker validates; the demo keeps the user in localStorage. */
export function Signup() {
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' })
  const [terms, setTerms] = useState(false)
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const toast = useToast()
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateSignup({ ...form, terms })
    setErrors(v.ok ? {} : v.errors)
    if (!v.ok) return
    setBusy(true)
    setFormError('')
    try {
      const r = await post<{ user: { id: string; name: string; email: string; company: string } }>('/api/signup', { ...form, terms })
      writeStore('user', r.user)
      toast(SIGNUP.done)
      navigate('/assessments')
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields)
        setFormError(Object.keys(err.fields).length ? '' : err.message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative isolate grid min-h-screen place-items-center px-4 py-12">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,#0f3a35,#050b0d_75%)]" />
      <main id="main" className="w-full max-w-[440px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card className="p-6 sm:p-8">
          <h1 className="text-[26px] font-normal tracking-[-0.02em]">{SIGNUP.title}</h1>
          <p className="mt-1.5 text-[15px] text-muted">{SIGNUP.sub}</p>
          <form onSubmit={submit} noValidate className="mt-6 grid gap-4">
            <Input label="Your name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
            <Input label="Work email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
            <Input label="Company" autoComplete="organization" value={form.company} onChange={set('company')} error={errors.company} />
            <div className="relative">
              <Input label="Password" type={show ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} hint="At least 10 characters, letters and numbers." className="pr-12" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show} className="absolute top-[30px] right-1 grid size-10 place-items-center rounded-[10px] text-muted hover:text-fg">
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <Checkbox label="I accept the terms of service and the data processing agreement." checked={terms} onChange={setTerms} error={errors.terms} />
            {formError && <Notice tone="error">{formError}</Notice>}
            <Button type="submit" size="lg" loading={busy} className="w-full">
              Create workspace
            </Button>
          </form>
        </Card>
        <p className="mt-6 text-center text-[14.5px] text-muted">
          Want a walkthrough first?{' '}
          <Link href="/request-demo" className="inline-flex min-h-10 items-center rounded text-brand-text underline-offset-4 hover:underline">
            Request a demo
          </Link>
        </p>
      </main>
    </div>
  )
}
