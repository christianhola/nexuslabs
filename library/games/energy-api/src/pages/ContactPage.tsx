import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CircleCheck } from 'lucide-react'

import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Chip } from '../components/Chip'
import { Container } from '../components/Container'
import { Input, Select, Textarea } from '../components/Field'
import { Media } from '../components/Media'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { RadioCard } from '../components/RadioCard'
import { brand, categories, contact } from '../content'
import { useLocation } from '../lib/router'
import { keys, useStore } from '../lib/store'
import { validateContact } from '../shared/validate'
import type { ContactErrors, ContactInput } from '../shared/validate'

const empty: ContactInput = { firstName: '', lastName: '', email: '', company: '', role: '', volume: '', devices: [], message: '' }

type Phase = { kind: 'idle' } | { kind: 'sending' } | { kind: 'error'; message: string } | { kind: 'sent'; id: string; name: string }

export function ContactPage() {
  const { search } = useLocation()
  // The draft survives a reload until it is sent.
  const [draft, setDraft, clearDraft] = useStore<ContactInput>(keys.contactDraft, empty)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const form = useRef<HTMLFormElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)

  // `?device=ev` (from the directory) preselects a device type.
  useEffect(() => {
    const d = new URLSearchParams(search).get('device')
    if (d && categories.some((c) => c.id === d) && !draft.devices.includes(d)) setDraft((v) => ({ ...v, devices: [...v.devices, d] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    if (phase.kind === 'sent') heading.current?.focus()
  }, [phase.kind])

  const set = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    setDraft((d) => ({ ...d, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }
  const toggleDevice = (id: string) => set('devices', draft.devices.includes(id) ? draft.devices.filter((d) => d !== id) : [...draft.devices, id])

  const submit = async () => {
    const found = validateContact(draft, contact.roles)
    setErrors(found)
    if (Object.keys(found).length) {
      setPhase({ kind: 'idle' })
      // Focus the first invalid field.
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] input, [data-invalid="true"] button')?.focus())
      return
    }
    setPhase({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(draft) })
      const body = (await res.json().catch(() => ({}))) as { id?: string; error?: string; errors?: ContactErrors }
      if (res.status === 201 && body.id) {
        setPhase({ kind: 'sent', id: body.id, name: draft.firstName.trim() })
        clearDraft()
        setErrors({})
        return
      }
      if (body.errors) setErrors(body.errors)
      setPhase({ kind: 'error', message: body.error ?? 'Something went wrong. Please try again.' })
    } catch {
      setPhase({ kind: 'error', message: `We could not reach our servers. Check your connection, or email ${brand.salesEmail}.` })
    }
  }

  return (
    <>
      <PageHeader eyebrow="Contact sales" title={contact.title} body={contact.body} />
      <Container className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
          {phase.kind === 'sent' ? (
            <Card className="p-8 sm:p-12">
              <CircleCheck className="size-10 text-leaf" aria-hidden />
              <h2 ref={heading} tabIndex={-1} className="mt-5 text-[32px] font-medium leading-tight tracking-[-0.035em] outline-none">
                Thanks, {phase.name}. We are on it.
              </h2>
              <p className="mt-3 max-w-[520px] text-[16px] leading-[1.6] text-muted">
                A solutions engineer will reply within one business day. Your reference is <span className="font-mono text-[14px] text-ink">{phase.id}</span>. In the meantime, the sandbox is open.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/docs" icon={<ArrowRight className="size-4" aria-hidden />}>
                  Open the quickstart
                </ButtonLink>
                <Button variant="outline" onClick={() => setPhase({ kind: 'idle' })}>
                  Send another request
                </Button>
              </div>
            </Card>
          ) : (
            <form
              ref={form}
              noValidate
              aria-label="Contact sales"
              onSubmit={(e) => {
                e.preventDefault()
                void submit()
              }}
              className="space-y-6"
            >
              {phase.kind === 'error' && <Notice tone="error" title="Your request was not sent">{phase.message}</Notice>}
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="First name" autoComplete="given-name" value={draft.firstName} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} />
                <Input label="Last name" autoComplete="family-name" value={draft.lastName} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} />
                <Input label="Work email" type="email" autoComplete="email" value={draft.email} onChange={(e) => set('email', e.target.value)} error={errors.email} hint="We reply from a person, not a sequence." />
                <Input label="Company" autoComplete="organization" value={draft.company} onChange={(e) => set('company', e.target.value)} error={errors.company} />
              </div>
              <Select label="What describes you best?" placeholder="Choose one" options={contact.roles} value={draft.role} onChange={(e) => set('role', e.target.value)} error={errors.role} />

              <fieldset data-invalid={errors.volume ? 'true' : undefined} aria-describedby={errors.volume ? 'volume-error' : undefined}>
                <legend className="mb-2 text-[14px] font-medium">How many devices do you expect in a year?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {contact.volumes.map((v) => (
                    <RadioCard key={v.id} name="volume" value={v.id} checked={draft.volume === v.id} onChange={(x) => set('volume', x)} title={v.label} hint={v.hint} />
                  ))}
                </div>
                {errors.volume && (
                  <p id="volume-error" className="mt-1.5 text-[13px] text-danger">
                    {errors.volume}
                  </p>
                )}
              </fieldset>

              <fieldset data-invalid={errors.devices ? 'true' : undefined} aria-describedby={errors.devices ? 'devices-error' : undefined}>
                <legend className="mb-2 text-[14px] font-medium">Which devices?</legend>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <Chip key={c.id} check pressed={draft.devices.includes(c.id)} onClick={() => toggleDevice(c.id)}>
                      {c.label}
                    </Chip>
                  ))}
                </div>
                {errors.devices && (
                  <p id="devices-error" className="mt-1.5 text-[13px] text-danger">
                    {errors.devices}
                  </p>
                )}
              </fieldset>

              <Textarea label="What are you building?" optional value={draft.message} onChange={(e) => set('message', e.target.value)} error={errors.message} hint={`${draft.message.length} / 2,000`} maxLength={2400} />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button type="submit" size="lg" loading={phase.kind === 'sending'}>
                  {phase.kind === 'sending' ? 'Sending' : 'Send request'}
                </Button>
                <p className="text-[13.5px] text-muted">Your draft is saved in this browser until you send it.</p>
              </div>
            </form>
          )}

          <aside className="space-y-4" aria-label="What happens next">
            <Media name="neighbourhood" className="aspect-[4/3] rounded-card" />
            <Card className="divide-y divide-line">
              {contact.promises.map((p) => (
                <div key={p.title} className="p-5">
                  <p className="text-[15.5px] font-medium">{p.title}</p>
                  <p className="text-[14px] text-muted">{p.body}</p>
                </div>
              ))}
            </Card>
            <p className="px-1 text-[14px] text-muted">
              Prefer email? Write to{' '}
              <a href={`mailto:${brand.salesEmail}`} className="font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                {brand.salesEmail}
              </a>
              .
            </p>
          </aside>
        </div>
      </Container>
    </>
  )
}
