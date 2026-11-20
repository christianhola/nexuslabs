import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { BadgeCheck, ChevronRight } from 'lucide-react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { SelectField, TextArea, TextField } from '../components/Field'
import { Icon } from '../components/Icon'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { contactTopics, security } from '../content'
import { api } from '../lib/api'
import { cx } from '../lib/cx'
import { useLocation } from '../lib/router'
import { validateContact } from '../shared/validate'
import type { ContactField, ContactInput, Errors } from '../shared/validate'

export function SecurityPage() {
  return (
    <>
      <PageHeader eyebrow="Trust center" title={security.title} body={security.body} />
      <section className="py-16 sm:py-24">
        <Container>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {security.pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.05} className="h-full rounded-card border border-line bg-white p-7">
                  <Icon name={p.icon} className="size-8 text-navy" />
                  <h2 className="mt-6 text-[18px] font-medium tracking-[-0.02em] text-ink">{p.title}</h2>
                  <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="flow-title" className="bg-navy py-16 sm:py-24">
        <Container>
          <SectionHeading id="flow-title" tone="on-navy" eyebrow="Card data flow" title="Card numbers never reach your servers" />
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {security.flow.map((step, i) => (
              <li key={step} className="relative">
                <div className="flex h-full items-center gap-3 rounded-card-sm bg-navy-2 p-5 ring-1 ring-navy-line">
                  <span className="round grid size-9 shrink-0 place-items-center rounded-full bg-teal text-[14px] font-semibold text-white">{i + 1}</span>
                  <span className="text-[15px] font-medium text-white">{step}</span>
                </div>
                {i < security.flow.length - 1 && (
                  <span aria-hidden className="absolute -right-3.5 top-1/2 z-10 hidden -translate-y-1/2 text-teal-100 md:block">
                    <ChevronRight className="size-5" />
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div aria-hidden className="relative mt-6 hidden h-1 overflow-hidden rounded-full bg-navy-2 md:block">
            <span className="absolute inset-y-0 left-0 w-24 animate-[flow_3.2s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-teal to-transparent" />
          </div>
        </Container>
      </section>

      <section aria-labelledby="certs-title" className="py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading id="certs-title" eyebrow="Compliance" title="Audited by independent assessors" />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {security.certs.map((c) => (
                <li key={c.name} className="flex items-start gap-3 rounded-card-sm bg-mist-2 p-5">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-teal-ink" aria-hidden />
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{c.name}</span>
                    <span className="block text-[13.5px] text-muted">{c.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <StatusCard />
        </Container>
      </section>

      <RequestForm />
    </>
  )
}

function StatusCard() {
  // 30 days of deterministic demo uptime per service.
  const days = useMemo(
    () =>
      security.status.services.map((s, si) =>
        Array.from({ length: 30 }, (_, d) => {
          const v = (si * 31 + d * 17) % 41
          return s.uptime === 100 ? 'ok' : v === 7 ? 'minor' : v === 23 && s.uptime < 99.97 ? 'major' : 'ok'
        }),
      ),
    [],
  )
  return (
    <Card tone="outline" className="self-start">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-[20px] font-medium tracking-[-0.02em] text-ink">{security.status.title}</h2>
        <span className="inline-flex items-center gap-2 text-[13.5px] font-medium text-success">
          <span className="round relative size-2.5 animate-pulse-ring rounded-full bg-success" aria-hidden />
          All systems normal
        </span>
      </div>
      <p className="mt-1 text-[13.5px] text-muted">{security.status.note}</p>
      <ul className="mt-6 space-y-5">
        {security.status.services.map((s, si) => (
          <li key={s.name}>
            <div className="flex justify-between text-[14px]">
              <span className="font-medium text-ink">{s.name}</span>
              <span className="tabular text-muted">{s.uptime.toFixed(2)}%</span>
            </div>
            <div className="mt-2 flex gap-[3px]" role="img" aria-label={`${s.name}: ${s.uptime}% uptime, ${days[si].filter((d) => d !== 'ok').length} days with incidents`}>
              {days[si].map((d, i) => (
                <span key={i} className={cx('h-7 flex-1 rounded-[3px]', d === 'ok' ? 'bg-teal' : d === 'minor' ? 'bg-[#d9a234]' : 'bg-danger')} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function RequestForm() {
  const { search } = useLocation()
  const preset = new URLSearchParams(search).get('topic')
  const [form, setForm] = useState<ContactInput>({
    name: '',
    email: '',
    company: '',
    topic: preset && contactTopics.includes(preset) ? preset : contactTopics[0],
    message: '',
  })
  const [errors, setErrors] = useState<Errors<ContactField>>({})
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [ref, setRef] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const bind = (k: ContactField) => ({
    id: `req-${k}`,
    value: form[k],
    error: errors[k],
    onChange: (e: { target: { value: string } }) => {
      setForm((f) => ({ ...f, [k]: e.target.value }))
      if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
    },
  })

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateContact(form, contactTopics)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`req-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setState('loading')
    setMessage(null)
    const res = await api<{ ref: string }>('/api/contact', { body: form })
    if (res.ok) {
      setRef(res.data.ref)
      setState('done')
    } else {
      if (res.data.errors) setErrors(res.data.errors as Errors<ContactField>)
      setMessage(res.data.message ?? 'We couldn’t send that. Try again.')
      setState('error')
    }
  }

  return (
    <section id="request" aria-labelledby="request-title" className="scroll-mt-24 bg-mist-2 py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading id="request-title" eyebrow="Documents" title={security.request.title} body={security.request.body} />
        <Card>
          {state === 'done' ? (
            <Notice tone="success" title="Request received">
              {security.request.success} <span className="font-mono">{ref}</span>.
            </Notice>
          ) : (
            <form noValidate onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              <TextField {...bind('name')} label="Name" autoComplete="name" />
              <TextField {...bind('email')} type="email" label="Work email" autoComplete="email" />
              <TextField {...bind('company')} label="Company" autoComplete="organization" />
              <SelectField {...bind('topic')} label="What you need" options={contactTopics} />
              <TextArea {...bind('message')} className="sm:col-span-2" label="Anything we should know" placeholder="For example, your vendor review deadline." />
              {message && state === 'error' && (
                <Notice tone="danger" className="sm:col-span-2">
                  {message}
                </Notice>
              )}
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" loading={state === 'loading'}>
                  {security.request.submit}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </Container>
    </section>
  )
}
