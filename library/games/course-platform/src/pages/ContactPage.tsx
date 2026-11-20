import { CalendarCheck, Clock, MessageSquare } from 'lucide-react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Field, Input, Select, Textarea } from '../components/Field'
import { Notice } from '../components/Notice'
import { SectionHeading } from '../components/SectionHeading'
import { audienceSizes, contactTopics } from '../content'
import { useForm } from '../lib/useForm'
import { validateContact } from '../lib/validate'

/* "Book a demo": posts to /api/contact. `?topic=teams` preselects a topic. */
export function ContactPage() {
  const preset = new URLSearchParams(window.location.search).get('topic') ?? ''
  const f = useForm<{ name: string; email: string; company: string; topic: string; audience: string; message: string }, { ref: string }>({
    initial: { name: '', email: '', company: '', topic: contactTopics.some((t) => t.value === preset) ? preset : 'demo', audience: '', message: '' },
    url: '/api/contact',
    validate: validateContact,
  })
  const points = [
    { icon: CalendarCheck, title: '30-minute walkthrough', body: 'We build a module of your course with you, live.' },
    { icon: MessageSquare, title: 'Migration plan', body: 'Bring your current platform; we map every learner and sale.' },
    { icon: Clock, title: 'Reply within a working day', body: 'From a person on the team, not a bot.' },
  ]
  return (
    <section className="bg-canvas pb-24 pt-10 lg:pt-16">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading as="h1" align="left" eyebrow="Contact" title="Book a demo" lead="See Coursekit with your own content, or ask us anything about plans, migration and training your team." />
          <ul className="mt-10 flex flex-col gap-5">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-flame-soft text-flame-ink">
                  <p.icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-display text-[16px] font-medium text-ink">{p.title}</span>
                  <span className="block text-[14.5px] text-muted">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Card pad="lg">
          {f.status === 'success' ? (
            <div className="flex flex-col gap-4">
              <Notice tone="ok" title="Request received">
                Thanks, {f.values.name.split(' ')[0]}. Your reference is {f.result?.ref}. We will email {f.values.email} within a working day with times.
              </Notice>
              <Button variant="outline" className="self-start" onClick={f.reset}>
                Send another
              </Button>
            </div>
          ) : (
            <form ref={f.form} onSubmit={f.submit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" error={f.errors.name}>
                {(ctl) => <Input {...ctl} autoComplete="name" value={f.values.name} onChange={(e) => f.set('name', e.target.value)} />}
              </Field>
              <Field label="Work email" error={f.errors.email}>
                {(ctl) => <Input {...ctl} type="email" autoComplete="email" value={f.values.email} onChange={(e) => f.set('email', e.target.value)} />}
              </Field>
              <Field label="School or company" optional error={f.errors.company}>
                {(ctl) => <Input {...ctl} autoComplete="organization" value={f.values.company} onChange={(e) => f.set('company', e.target.value)} />}
              </Field>
              <Field label="Audience size" error={f.errors.audience}>
                {(ctl) => (
                  <Select {...ctl} value={f.values.audience} onChange={(e) => f.set('audience', e.target.value)}>
                    <option value="">Choose one</option>
                    {audienceSizes.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="What do you want to talk about?" error={f.errors.topic} className="sm:col-span-2">
                {(ctl) => (
                  <Select {...ctl} value={f.values.topic} onChange={(e) => f.set('topic', e.target.value)}>
                    {contactTopics.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Message" error={f.errors.message} hint="At least 20 characters." className="sm:col-span-2">
                {(ctl) => <Textarea {...ctl} value={f.values.message} onChange={(e) => f.set('message', e.target.value)} placeholder="Tell us about your courses and what you want to change." />}
              </Field>
              {f.status === 'error' && f.message ? <Notice tone="bad" className="sm:col-span-2">{f.message}</Notice> : null}
              <Button type="submit" size="lg" loading={f.status === 'submitting'} className="sm:col-span-2 sm:justify-self-start">
                Request a demo
              </Button>
            </form>
          )}
        </Card>
      </Container>
    </section>
  )
}
