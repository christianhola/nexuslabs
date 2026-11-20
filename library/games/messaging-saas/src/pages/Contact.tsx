import { Check } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Button } from '../components/Button'
import { SelectField, TextArea, TextField } from '../components/Field'
import { Notice } from '../components/Notice'
import { Eyebrow } from '../components/Section'
import { contactPage as c } from '../content'
import { postJson } from '../lib/api'
import type { ContactInput, Errors } from '../lib/validate'
import { validateContact } from '../lib/validate'

const empty: ContactInput = { name: '', email: '', company: '', volume: '', message: '' }

export function Contact() {
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState<Errors<ContactInput>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [formError, setFormError] = useState<string>()
  const set = (k: keyof ContactInput) => (e: { target: { value: string } }) => {
    setV((x) => ({ ...x, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateContact(v)
    setErrors(errs)
    setFormError(undefined)
    if (Object.keys(errs).length) {
      document.getElementById(`contact-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    const r = await postJson('/api/contact', v)
    if (!r.ok) {
      setStatus('idle')
      setErrors((r.errors ?? {}) as Errors<ContactInput>)
      return setFormError(r.error)
    }
    setStatus('sent')
  }

  return (
    <AuthShell
      aside={
        <ul className="grid gap-3">
          {c.points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-[16px] text-white">
              <span className="grid size-7 place-items-center rounded-full bg-white text-cobalt">
                <Check aria-hidden className="size-4" strokeWidth={3} />
              </span>
              {p}
            </li>
          ))}
        </ul>
      }
    >
      <div className="grid gap-4">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <h1 className="font-display text-[40px] font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-[52px]">{c.title}</h1>
        <p className="max-w-[520px] text-[17px] leading-[1.6] text-muted">{c.body}</p>
      </div>
      {status === 'sent' ? (
        <Notice tone="success" title={c.success.title} className="mt-10">
          {c.success.body}
        </Notice>
      ) : (
        <form onSubmit={submit} noValidate className="mt-10 grid gap-5">
          {formError ? <Notice tone="error">{formError}</Notice> : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="contact-name" label="Full name" autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
            <TextField id="contact-email" label="Work email" type="email" autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="contact-company" label="Brand or store" autoComplete="organization" value={v.company} onChange={set('company')} error={errors.company} />
            <SelectField id="contact-volume" label="SMS subscribers" placeholder="Choose a range" value={v.volume} onChange={set('volume')} error={errors.volume} options={c.volumes.map((x) => ({ value: x, label: x }))} />
          </div>
          <TextArea id="contact-message" label="Anything we should know? (optional)" value={v.message} onChange={set('message')} error={errors.message} hint={`${v.message.length}/1000`} />
          <Button type="submit" size="lg" arrow loading={status === 'sending'} className="justify-self-start">
            {status === 'sending' ? 'Sending…' : 'Book my demo'}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
