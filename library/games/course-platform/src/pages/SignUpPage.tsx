import { Check } from 'lucide-react'

import { Avatar, Stars } from '../components/Avatar'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox, Field, Input } from '../components/Field'
import { Container } from '../components/Container'
import { Notice } from '../components/Notice'
import { Segmented } from '../components/Segmented'
import { creatorKinds, people, plans, testimonials } from '../content'
import { navigate } from '../lib/router'
import { useStored } from '../lib/storage'
import { useForm } from '../lib/useForm'
import { validateSignup } from '../lib/validate'

/*
  Start free. Posts to /api/signup, then keeps the workspace in this browser
  (coursekit:workspace) and opens the builder. Replace with real auth (for
  example Sign in with Freebuff) before you take sign-ups.
*/
type Workspace = { name: string; email: string; school: string; slug: string; plan: string }

export function SignUpPage() {
  const planParam = new URLSearchParams(window.location.search).get('plan')
  const plan = plans.find((p) => p.id === planParam) ?? plans[1]
  const [workspace, setWorkspace] = useStored<Workspace | null>('workspace', null)
  const f = useForm<{ name: string; email: string; school: string; kind: string; terms: boolean }, { slug: string }>({
    initial: { name: '', email: '', school: '', kind: 'creator', terms: false },
    url: '/api/signup',
    validate: validateSignup,
    onSuccess: (d, v) => setWorkspace({ name: v.name.trim(), email: v.email.trim(), school: v.school.trim(), slug: d.slug, plan: plan.id }),
  })
  const quote = testimonials[3]
  const who = people[quote.person]

  return (
    <section className="bg-canvas pb-24 pt-10 lg:pt-14">
      <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
        <Card pad="lg" className="order-2 lg:order-1">
          {workspace && f.status !== 'submitting' ? (
            <div className="flex flex-col gap-5">
              <Notice tone="ok" title={`Welcome, ${workspace.name.split(' ')[0]}`}>
                {workspace.school} is ready at <span className="font-mono">{workspace.slug}.coursekit.app</span> on the {plans.find((p) => p.id === workspace.plan)?.name ?? 'Pro'} plan.
              </Notice>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate('/builder')} arrow>
                  Open the builder
                </Button>
                <Button variant="outline" href="/storefront">
                  Design your storefront
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setWorkspace(null)
                    f.reset()
                  }}
                >
                  Start over
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-display text-[30px] font-medium tracking-[-0.025em] text-ink">Start your school</h1>
              <p className="mt-1 text-[15px] text-muted">
                {plan.id === 'starter' ? 'Free forever, no card needed.' : `14 days of ${plan.name} free, no card needed.`}
              </p>
              <form ref={f.form} onSubmit={f.submit} noValidate className="mt-7 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="font-display text-[14px] font-medium text-ink">I am</span>
                  <Segmented label="I am" tone="white" size="sm" value={f.values.kind} onChange={(v) => f.set('kind', v)} options={creatorKinds} className="w-fit max-w-full flex-wrap" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={f.errors.name}>
                    {(ctl) => <Input {...ctl} autoComplete="name" value={f.values.name} onChange={(e) => f.set('name', e.target.value)} />}
                  </Field>
                  <Field label="Email" error={f.errors.email}>
                    {(ctl) => <Input {...ctl} type="email" autoComplete="email" value={f.values.email} onChange={(e) => f.set('email', e.target.value)} />}
                  </Field>
                </div>
                <Field label="School or brand name" error={f.errors.school} hint={f.values.school.trim() ? `Your address: ${f.values.school.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.coursekit.app` : 'This becomes your storefront address.'}>
                  {(ctl) => <Input {...ctl} autoComplete="organization" value={f.values.school} onChange={(e) => f.set('school', e.target.value)} />}
                </Field>
                <div>
                  <Checkbox checked={f.values.terms} onChange={(v) => f.set('terms', v)} label="I agree to the terms of service and privacy policy" />
                  {f.errors.terms ? (
                    <p className="text-[13px] font-medium text-bad" role="alert">
                      {f.errors.terms}
                    </p>
                  ) : null}
                </div>
                {f.status === 'error' && f.message ? <Notice tone="bad">{f.message}</Notice> : null}
                <Button type="submit" size="lg" loading={f.status === 'submitting'} className="mt-1">
                  Create my school
                </Button>
              </form>
            </>
          )}
        </Card>
        <div className="order-1 lg:order-2 lg:pt-6">
          <p className="text-[14px] text-flame-ink">{plan.name} plan</p>
          <ul className="mt-4 flex flex-col gap-3">
            {plan.features.map((x) => (
              <li key={x} className="flex items-start gap-2.5 text-[15.5px] text-body">
                <span className="round mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-flame-strong text-white">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {x}
              </li>
            ))}
          </ul>
          <figure className="mt-10 rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-card">
            <Stars />
            <blockquote className="mt-3 text-[16px] leading-relaxed text-ink">“{quote.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Avatar src={who.src} name={who.name} size={40} ring={false} />
              <span className="text-[14px]">
                <span className="block font-medium text-ink">{who.name}</span>
                <span className="block text-muted">{who.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  )
}
