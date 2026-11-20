import { Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { ChoiceGroup, Notice, SuccessMark } from '../components/Controls'
import { Field, Input, Textarea } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { brand, contact } from '../content'
import { useLocation } from '../lib/router'
import { postJson } from '../lib/store'
import { TOPICS, hasErrors, validateContact } from '../lib/validate'
import type { ContactInput } from '../lib/validate'

const empty: ContactInput = { name: '', email: '', topic: '', message: '' }

export function Contact() {
  const { search } = useLocation()
  const [v, setV] = useState<ContactInput>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverError, setServerError] = useState<string>()

  // ?topic=investors preselects the topic.
  useEffect(() => {
    const t = new URLSearchParams(search).get('topic')
    if (t && TOPICS.includes(t as (typeof TOPICS)[number])) setV((x) => ({ ...x, topic: t }))
  }, [search])

  const set = (k: keyof ContactInput, val: string) => {
    setV((x) => ({ ...x, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateContact(v)
    setErrors(errs)
    if (hasErrors(errs)) {
      const first = Object.keys(errs)[0]
      document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] textarea`)?.focus()
      return
    }
    setStatus('sending')
    const res = await postJson('/api/contact', v)
    if (res.ok) {
      setStatus('sent')
      setV(empty)
    } else {
      setStatus('error')
      setServerError(res.error)
      if (res.errors) setErrors(res.errors)
    }
  }

  return (
    <>
      <PageHeader eyebrow={contact.eyebrow} title={contact.title} body={contact.body} />
      <section aria-label="Contact form and offices" className="pb-24">
        <Container size="xl" className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="p-6 sm:p-9">
            {status === 'sent' ? (
              <div className="flex flex-col items-start gap-4" role="status">
                <SuccessMark />
                <h2 className="text-[26px] font-medium tracking-[-0.02em]">Message sent</h2>
                <p className="text-[16px] text-muted">Thanks. The right person will reply within two working days.</p>
                <Button variant="secondary" onClick={() => setStatus('idle')}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-label="Contact Tidewell">
                {status === 'error' && serverError ? <Notice tone="error" title="We couldn’t send that">{serverError}</Notice> : null}
                <div data-field="topic">
                  <ChoiceGroup legend="Topic" columns={4} options={contact.topics.map((t) => ({ id: t.id, label: t.label }))} value={v.topic} onChange={(t) => set('topic', t)} error={errors.topic} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div data-field="name">
                    <Field label="Full name" error={errors.name}>
                      {(p) => <Input {...p} autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} />}
                    </Field>
                  </div>
                  <div data-field="email">
                    <Field label="Email" error={errors.email}>
                      {(p) => <Input {...p} type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} />}
                    </Field>
                  </div>
                </div>
                <div data-field="message">
                  <Field label="Message" hint={`${v.message.trim().length} of at least 20 characters`} error={errors.message}>
                    {(p) => <Textarea {...p} value={v.message} onChange={(e) => set('message', e.target.value)} />}
                  </Field>
                </div>
                <Button type="submit" size="lg" loading={status === 'sending'} className="self-start">
                  {status === 'sending' ? 'Sending' : 'Send message'}
                </Button>
              </form>
            )}
          </Card>
          <div className="flex flex-col gap-4">
            {contact.offices.map((o, i) => (
              <Card key={o.city} tone={i === 0 ? 'ocean' : 'steel'} className="p-7">
                <h2 className="text-[20px] font-medium tracking-[-0.02em]">{o.city}</h2>
                <address className="mt-2 text-[15px] not-italic leading-relaxed text-white/80">
                  {o.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </Card>
            ))}
            <Card className="flex flex-col gap-1 p-7">
              <h2 className="text-[15px] font-medium text-muted">Press</h2>
              <a href={`mailto:${brand.pressEmail}`} className="inline-flex min-h-10 items-center gap-2 self-start rounded-[8px] text-[17px] text-white underline-offset-4 hover:underline">
                <Mail className="size-4" aria-hidden />
                {brand.pressEmail}
              </a>
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}
