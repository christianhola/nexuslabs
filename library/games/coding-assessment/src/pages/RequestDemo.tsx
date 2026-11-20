import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check, CircleCheck } from 'lucide-react'

import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Input, Select, Textarea } from '../components/Field'
import { Notice } from '../components/Misc'
import { DEMO_REQUEST } from '../content'
import { ApiError, post } from '../lib/api'
import { validateDemoRequest } from '../shared/validate'
import type { Errors } from '../shared/validate'

export function RequestDemo() {
  const [form, setForm] = useState({ name: '', email: '', company: '', size: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [formError, setFormError] = useState('')
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateDemoRequest(form)
    setErrors(v.ok ? {} : v.errors)
    if (!v.ok) return
    setState('loading')
    setFormError('')
    try {
      await post('/api/demo-request', form)
      setState('done')
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields)
        setFormError(Object.keys(err.fields).length ? '' : err.message)
      }
      setState('idle')
    }
  }

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_70%_at_30%_0%,#0c302c,transparent_75%)]" />
      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_480px] lg:py-24">
        <div>
          <p className="text-[14px] font-medium text-brand-text">Request demo</p>
          <h1 className="mt-3 text-balance text-[38px] leading-[1.05] font-normal tracking-[-0.03em] text-stage sm:text-[54px]">{DEMO_REQUEST.title}</h1>
          <p className="mt-4 max-w-[520px] text-[17px] leading-relaxed text-muted">{DEMO_REQUEST.sub}</p>
          <ul className="mt-8 grid gap-3">
            {DEMO_REQUEST.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[16px]">
                <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand-text" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <Card className="p-6 sm:p-8">
          {state === 'done' ? (
            <div role="status" className="grid justify-items-start gap-3 py-6">
              <CircleCheck aria-hidden className="size-10 text-brand-text" />
              <h2 className="text-[24px] font-normal">{DEMO_REQUEST.done.title}</h2>
              <p className="text-[15.5px] text-muted">{DEMO_REQUEST.done.body}</p>
              <ButtonLink href="/demo" variant="secondary" className="mt-3">
                Try the sample challenge meanwhile
              </ButtonLink>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5">
              <Input label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
              <Input label="Work email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
              <Input label="Company" autoComplete="organization" value={form.company} onChange={set('company')} error={errors.company} />
              <Select label="Engineering team size" value={form.size} onChange={set('size')} error={errors.size}>
                <option value="">Choose one</option>
                {DEMO_REQUEST.sizes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              <Textarea label="Roles you are hiring for" optional value={form.message} onChange={set('message')} error={errors.message} placeholder="Two backend engineers, one data engineer" />
              {formError && <Notice tone="error">{formError}</Notice>}
              <Button type="submit" size="lg" loading={state === 'loading'} className="w-full">
                Request demo
              </Button>
            </form>
          )}
        </Card>
      </Container>
    </section>
  )
}
