import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CheckCircle2, Mail, MapPin, MessageCircle } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Field, Input, Select, Textarea } from '../components/Field'
import { IconChip } from '../components/IconChip'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { contact } from '../content'
import { Link, useLocation } from '../lib/router'
import type { ContactErrors, ContactInput } from '../lib/validate'
import { TOPICS, validateContact } from '../lib/validate'

const icons = { mail: Mail, message: MessageCircle, map: MapPin }

type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'done'; ref: string; name: string; email: string }

export function ContactPage() {
  const { search } = useLocation()
  const preset = new URLSearchParams(search).get('topic') ?? ''
  const [values, setValues] = useState<ContactInput>({
    name: '',
    email: '',
    company: '',
    topic: (TOPICS as readonly string[]).includes(preset) ? preset : '',
    message: '',
  })
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({})
  const [serverErrors, setServerErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const formRef = useRef<HTMLFormElement>(null)

  const clientErrors = validateContact(values)
  const errorFor = (k: keyof ContactInput) => (touched[k] ? clientErrors[k] : undefined) ?? serverErrors[k]

  const set = (k: keyof ContactInput) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }))
    setServerErrors((s) => ({ ...s, [k]: undefined }))
  }
  const blur = (k: keyof ContactInput) => () => setTouched((t) => ({ ...t, [k]: true }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTouched({ name: true, email: true, company: true, topic: true, message: true })
    if (Object.keys(clientErrors).length) {
      // Move focus to the first invalid field so keyboard users land on it.
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      requestAnimationFrame(() => (formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ?? first)?.focus())
      return
    }
    setStatus({ kind: 'loading' })
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string; errors?: ContactErrors }
      if (!res.ok) {
        setServerErrors(data.errors ?? {})
        setStatus({ kind: 'error', message: data.error ?? 'Something went wrong. Try again.' })
        return
      }
      setStatus({ kind: 'done', ref: data.ref ?? '', name: values.name.trim().split(' ')[0], email: values.email.trim() })
    } catch {
      setStatus({ kind: 'error', message: 'Could not reach the server. Check your connection and try again.' })
    }
  }

  function reset() {
    setValues({ name: '', email: '', company: '', topic: '', message: '' })
    setTouched({})
    setServerErrors({})
    setStatus({ kind: 'idle' })
  }

  const f = contact.form
  const msgLen = values.message.trim().length

  return (
    <>
      <PageHeader eyebrow={contact.eyebrow} title={contact.title} body={contact.body} />
      <Section className="!pt-0">
        <div className="mx-auto grid max-w-[1120px] gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Reveal>
            <Card padding="lg" className="scroll-mt-28" as="div">
              <div id="form" className="scroll-mt-32" />
              <AnimatePresence mode="wait" initial={false}>
                {status.kind === 'done' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-10 text-center"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.1 }}
                      className="grid size-16 place-items-center rounded-full bg-up/15 text-[#4ade80] round"
                    >
                      <CheckCircle2 className="size-8" aria-hidden />
                    </motion.span>
                    <h2 className="mt-6 font-display text-[30px] font-semibold tracking-[-0.035em]">{f.success.title}</h2>
                    <p className="mt-3 max-w-[420px] text-[16px] leading-relaxed text-muted">
                      {f.success.body.replace('{name}', status.name).replace('{email}', status.email).replace('{ref}', status.ref)}
                    </p>
                    <Button variant="outline" size="sm" className="mt-8" onClick={reset}>
                      {f.again}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    onSubmit={submit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5"
                    aria-label="Contact form"
                  >
                    <p className="text-[13px] text-muted">Demo form. Messages are not saved or sent.</p>
                    {status.kind === 'error' ? <Notice tone="error" title={status.message} /> : null}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={f.name} error={errorFor('name')}>
                        {(p) => <Input {...p} autoComplete="name" value={values.name} onChange={(e) => set('name')(e.target.value)} onBlur={blur('name')} />}
                      </Field>
                      <Field label={f.email} error={errorFor('email')}>
                        {(p) => (
                          <Input {...p} type="email" autoComplete="email" inputMode="email" value={values.email} onChange={(e) => set('email')(e.target.value)} onBlur={blur('email')} />
                        )}
                      </Field>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={f.company} optional error={errorFor('company')}>
                        {(p) => <Input {...p} autoComplete="organization" value={values.company} onChange={(e) => set('company')(e.target.value)} onBlur={blur('company')} />}
                      </Field>
                      <Field label={f.topic} error={errorFor('topic')}>
                        {(p) => (
                          <Select {...p} value={values.topic} onChange={(e) => set('topic')(e.target.value)} onBlur={blur('topic')}>
                            <option value="" disabled>
                              {f.topicPlaceholder}
                            </option>
                            {contact.topics.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>
                    </div>
                    <Field
                      label={f.message}
                      hint={f.messageHint}
                      error={errorFor('message')}
                      labelAction={
                        <span className={msgLen >= 20 ? 'text-[12px] text-[#4ade80] tabular' : 'text-[12px] text-muted tabular'} aria-hidden>
                          {msgLen} / 2000
                        </span>
                      }
                    >
                      {(p) => <Textarea {...p} rows={6} value={values.message} onChange={(e) => set('message')(e.target.value)} onBlur={blur('message')} />}
                    </Field>
                    <div className="flex flex-col-reverse items-stretch gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[13px] text-muted">{f.footnote}</p>
                      <Button type="submit" size="lg" loading={status.kind === 'loading'}>
                        {f.submit}
                        {status.kind !== 'loading' && <ArrowRight className="size-[18px] transition-transform group-hover/button:translate-x-1" aria-hidden />}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </Reveal>

          <div className="flex flex-col gap-4">
            {contact.channels.map((c, i) => {
              const Icon = icons[c.icon as keyof typeof icons]
              return (
                <Reveal key={c.title} delay={0.06 * (i + 1)}>
                  <Link href={c.href} className="depth group relative flex items-center gap-4 rounded-card-sm bg-surface p-5 transition-colors hover:bg-surface-2">
                    <IconChip tone={i === 0 ? 'violet' : 'neutral'}>
                      <Icon />
                    </IconChip>
                    <div className="min-w-0 leading-tight">
                      <div className="text-[15px] font-medium">{c.title}</div>
                      <div className="mt-1 truncate text-[14px] text-muted">{c.body}</div>
                    </div>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-white" aria-hidden />
                  </Link>
                </Reveal>
              )
            })}
            <Reveal delay={0.25}>
              <Card variant="featured" radius="card-sm" padding="sm" className="p-5">
                <div className="text-[13px] text-muted">{contact.stat.label}</div>
                <div className="mt-1 font-display text-[34px] font-semibold tracking-[-0.04em]">{contact.stat.value}</div>
                <div className="mt-1 text-[13px] text-muted">{contact.stat.note}</div>
              </Card>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  )
}
