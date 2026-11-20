import { CalendarCheck, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Field, Input, Select, Textarea } from '../components/Field'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { contact } from '../content'
import { postJson } from '../lib/api'
import { validateContact } from '../lib/validate'
import type { ContactInput, Errors } from '../lib/validate'

const empty: ContactInput = { name: '', email: '', company: '', size: '', topic: 'demo', message: '' }

export function ContactPage() {
  const preset = new URLSearchParams(window.location.search).get('topic')
  const [v, setV] = useState<ContactInput>({ ...empty, topic: contact.topics.some((t) => t.value === preset) ? preset! : 'demo' })
  const [errors, setErrors] = useState<Errors<ContactInput>>({})
  const [formError, setFormError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ ref: string } | null>(null)

  const set = (k: keyof ContactInput) => (e: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validateContact(v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setFormError('Check the highlighted fields.')
      const first = Object.keys(errs)[0]
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setFormError(undefined)
    setBusy(true)
    const res = await postJson<{ ok: true; ref: string }>('/api/contact', v)
    setBusy(false)
    if (!res.ok) {
      setErrors((res.errors ?? {}) as Errors<ContactInput>)
      setFormError(res.error)
      return
    }
    setDone({ ref: res.data.ref })
  }

  return (
    <>
      <PageHeader eyebrow="Talk to us" title={contact.title} lede={contact.lede} />
      <Container className="pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <Card pad="lg">
            {done ? (
              <div className="flex flex-col items-start gap-4" role="status">
                <CircleCheck className="size-10 text-ok" aria-hidden />
                <h2 className="font-display text-[28px] font-bold tracking-[-0.04em] text-ink">Thanks, {v.name.split(' ')[0]}. We’ll be in touch.</h2>
                <p className="text-[15.5px] leading-relaxed text-body">
                  A product specialist will reply to <span className="font-semibold text-ink">{v.email}</span> within one working day. Your reference is <span className="font-mono font-medium text-ink">{done.ref}</span>.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Button href="/docs/quickstart" arrow>
                    Read the quickstart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDone(null)
                      setV(empty)
                    }}
                  >
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
                {formError ? (
                  <Notice tone="bad" className="sm:col-span-2">
                    {formError}
                  </Notice>
                ) : null}
                <Field label="Full name" error={errors.name}>
                  {(c) => <Input {...c} name="name" autoComplete="name" value={v.name} onChange={set('name')} />}
                </Field>
                <Field label="Work email" error={errors.email}>
                  {(c) => <Input {...c} name="email" type="email" autoComplete="email" value={v.email} onChange={set('email')} />}
                </Field>
                <Field label="Company" error={errors.company}>
                  {(c) => <Input {...c} name="company" autoComplete="organization" value={v.company} onChange={set('company')} />}
                </Field>
                <Field label="Team size" error={errors.size}>
                  {(c) => (
                    <Select {...c} name="size" value={v.size} onChange={set('size')}>
                      <option value="">Choose one</option>
                      {contact.sizes.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="What would you like to talk about?" error={errors.topic} className="sm:col-span-2">
                  {(c) => (
                    <Select {...c} name="topic" value={v.topic} onChange={set('topic')}>
                      {contact.topics.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
                <Field label="Message" error={errors.message} hint="What you track today, and what you wish you knew." className="sm:col-span-2">
                  {(c) => <Textarea {...c} name="message" value={v.message} onChange={set('message')} />}
                </Field>
                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <Button type="submit" size="lg" loading={busy} arrow>
                    Send message
                  </Button>
                  <p className="text-[13.5px] text-faint">We never share your details.</p>
                </div>
              </form>
            )}
          </Card>
          <aside aria-labelledby="expect-h" className="flex flex-col gap-4">
            <h2 id="expect-h" className="flex items-center gap-2 font-display text-[18px] font-bold tracking-[-0.02em] text-ink">
              <CalendarCheck className="size-5 text-leaf" aria-hidden /> What to expect
            </h2>
            {contact.expect.map((x) => (
              <Card key={x.title} tone="wash" pad="sm" className="px-5">
                <p className="font-display text-[15.5px] font-semibold text-ink">{x.title}</p>
                <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{x.body}</p>
              </Card>
            ))}
          </aside>
        </div>
      </Container>
    </>
  )
}
