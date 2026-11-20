import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button, ButtonLink, TextLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { CheckList, Notice, SaveToggle, SuccessMark } from '../components/Controls'
import { Field, Input, Textarea } from '../components/Field'
import { Reveal } from '../components/Reveal'
import { jobs } from '../content'
import { Link } from '../lib/router'
import { postJson, useStored } from '../lib/store'
import { hasErrors, validateApplication } from '../lib/validate'
import type { ApplicationInput } from '../lib/validate'

type Draft = Omit<ApplicationInput, 'role'>
const empty: Draft = { name: '', email: '', link: '', note: '' }

export function Job({ slug = '' }: { slug?: string }) {
  const job = jobs.find((j) => j.slug === slug)!
  // The draft autosaves per role, so a reload or a detour keeps it.
  const [draft, setDraft, clearDraft] = useStored<Draft>(`draft:${slug}`, empty)
  const [applied, setApplied] = useStored<string[]>('applied-roles', [])
  const [saved, setSaved] = useStored<string[]>('saved-roles', [])
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationInput, string>>>({})
  const [serverError, setServerError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const done = applied.includes(slug)

  const set = (k: keyof Draft, v: string) => {
    setDraft((d) => ({ ...d, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(undefined)
    const data = { ...draft, role: slug }
    const errs = validateApplication(data, jobs.map((j) => j.slug))
    setErrors(errs)
    if (hasErrors(errs)) {
      const first = (Object.keys(errs) as string[])[0]
      document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] textarea`)?.focus()
      return
    }
    setBusy(true)
    const res = await postJson('/api/apply', data)
    setBusy(false)
    if (!res.ok) {
      setServerError(res.error)
      if (res.errors) setErrors(res.errors)
      return
    }
    setApplied((a) => (a.includes(slug) ? a : [...a, slug]))
    clearDraft()
  }

  return (
    <article className="pb-24 pt-28 sm:pt-36">
      <Container size="xl">
        <Link href="/careers" className="inline-flex min-h-10 items-center gap-2 rounded-[8px] text-[15px] text-muted transition-colors hover:text-white">
          <ArrowLeft className="size-4" aria-hidden />
          All roles
        </Link>
        <div className="mt-6 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="flex flex-wrap gap-x-4 text-[14px] font-medium text-plasma-text">
              <span>{job.team}</span>
              <span>{job.location}</span>
              <span>{job.type}</span>
            </p>
            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="display text-balance text-[40px] sm:text-[52px]">{job.title}</h1>
              <SaveToggle saved={saved.includes(slug)} onToggle={() => setSaved((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]))} label={job.title} />
            </div>
            <p className="mt-4 max-w-[560px] text-[18px] leading-[1.55] text-muted">{job.summary}</p>
            {[
              { title: 'What you’ll do', items: job.responsibilities },
              { title: 'What you bring', items: job.requirements },
            ].map((s) => (
              <section key={s.title} className="mt-10">
                <h2 className="text-[20px] font-medium tracking-[-0.02em]">{s.title}</h2>
                <CheckList items={s.items} className="mt-4" />
              </section>
            ))}
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="p-6 sm:p-8 lg:sticky lg:top-24">
              {done ? (
                <div className="flex flex-col items-start gap-4" role="status">
                  <SuccessMark />
                  <h2 className="text-[24px] font-medium tracking-[-0.02em]">Application sent</h2>
                  <p className="text-[16px] text-muted">Thanks for applying. A member of the {job.team.toLowerCase()} team reads every application and will reply within a week.</p>
                  <div className="flex flex-wrap gap-2">
                    <ButtonLink href="/careers" variant="secondary">
                      See other roles
                    </ButtonLink>
                    <Button variant="ghost" onClick={() => setApplied((a) => a.filter((x) => x !== slug))}>
                      Apply again
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="flex flex-col gap-5" aria-labelledby="apply-title">
                  <div>
                    <h2 id="apply-title" className="text-[24px] font-medium tracking-[-0.02em]">
                      Apply for this role
                    </h2>
                    <p className="mt-1 text-[14px] text-faint">Your draft saves on this device as you type.</p>
                  </div>
                  {serverError ? <Notice tone="error" title="We couldn’t send that">{serverError}</Notice> : null}
                  <div data-field="name">
                    <Field label="Full name" error={errors.name}>
                      {(p) => <Input {...p} autoComplete="name" value={draft.name} onChange={(e) => set('name', e.target.value)} />}
                    </Field>
                  </div>
                  <div data-field="email">
                    <Field label="Email" error={errors.email}>
                      {(p) => <Input {...p} type="email" autoComplete="email" value={draft.email} onChange={(e) => set('email', e.target.value)} />}
                    </Field>
                  </div>
                  <div data-field="link">
                    <Field label="CV or portfolio link" hint="LinkedIn, a PDF link or a personal site." error={errors.link}>
                      {(p) => <Input {...p} type="url" inputMode="url" placeholder="https://" value={draft.link} onChange={(e) => set('link', e.target.value)} />}
                    </Field>
                  </div>
                  <div data-field="note">
                    <Field label="Something you built" hint="A short note on hardware you’ve made work." error={errors.note}>
                      {(p) => <Textarea {...p} value={draft.note} onChange={(e) => set('note', e.target.value)} />}
                    </Field>
                  </div>
                  <Button type="submit" size="lg" loading={busy}>
                    {busy ? 'Sending' : 'Send application'}
                  </Button>
                  <TextLink href="/contact?topic=general" tone="muted" className="self-start text-[14px]">
                    Questions first? Contact us
                  </TextLink>
                </form>
              )}
            </Card>
          </Reveal>
        </div>
      </Container>
    </article>
  )
}
