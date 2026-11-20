import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Briefcase, Building2, Check, HeartHandshake, User, Users } from 'lucide-react'

import { AuthShell } from '../components/AuthShell'
import { Badge } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { SelectField, TextField } from '../components/Field'
import { Notice } from '../components/Notice'
import { PasswordField } from '../components/PasswordField'
import { RadioCard } from '../components/RadioCard'
import { Stepper } from '../components/Stepper'
import { plans, signup } from '../content'
import { api } from '../lib/api'
import { Link, useLocation } from '../lib/router'
import { keys, useStore } from '../lib/store'
import { validateSignup } from '../shared/validate'
import type { Errors, SignupField, SignupInput } from '../shared/validate'

type Draft = Omit<SignupInput, 'password'> & { step: number; done?: boolean }
const empty: Draft = { step: 0, businessType: '', country: '', volume: '', company: '', name: '', email: '' }
const icons = [User, Building2, Users, HeartHandshake]

export function SignUpPage() {
  const { search } = useLocation()
  const planId = new URLSearchParams(search).get('plan')
  const plan = plans.find((p) => p.id === planId)
  const [draft, setDraft, clearDraft] = useStore<Draft>(keys.signupDraft, empty)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors<SignupField>>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const update = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }))
  const step = draft.done ? 2 : Math.min(draft.step, 1)

  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
  }, [step])

  const all = { ...draft, password }
  const businessKeys: SignupField[] = ['businessType', 'country', 'volume', 'company']

  function next(e: FormEvent) {
    e.preventDefault()
    const errs = validateSignup(all, signup)
    const mine = Object.fromEntries(Object.entries(errs).filter(([k]) => businessKeys.includes(k as SignupField)))
    setErrors(mine)
    if (Object.keys(mine).length) {
      document.getElementById(`su-${Object.keys(mine)[0]}`)?.focus()
      return
    }
    update({ step: 1 })
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs = validateSignup(all, signup)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0] as SignupField
      if (businessKeys.includes(first)) update({ step: 0 })
      else document.getElementById(`su-${first}`)?.focus()
      return
    }
    setLoading(true)
    setMessage(null)
    const res = await api('/api/signup', { body: all })
    setLoading(false)
    if (res.ok) {
      update({ done: true })
      setPassword('')
    } else {
      if (res.data.errors) setErrors(res.data.errors as Errors<SignupField>)
      setMessage(res.data.message ?? 'We couldn’t open your account. Check the fields and try again.')
    }
  }

  const bind = (k: Exclude<SignupField, 'password'>) => ({
    id: `su-${k}`,
    value: draft[k],
    error: errors[k],
    onChange: (e: { target: { value: string } }) => {
      update({ [k]: e.target.value })
      if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
    },
  })

  return (
    <AuthShell title={signup.title} body={signup.body}>
      {plan && (
        <p className="-mt-4 mb-6 flex items-center gap-2 text-[14px] text-muted">
          Plan <Badge tone="teal">{plan.name}</Badge>
        </p>
      )}
      <Stepper steps={signup.steps} current={step} />
      <div className="mt-8">
        {step === 0 && (
          <form noValidate onSubmit={next} className="grid gap-5">
            <h2 ref={heading} tabIndex={-1} className="text-[18px] font-medium text-ink outline-none">
              About your business
            </h2>
            <fieldset aria-describedby={errors.businessType ? 'su-type-err' : undefined}>
              <legend className="mb-2 text-[14px] font-medium text-ink-2">Business type</legend>
              <div className="grid grid-cols-2 gap-2.5" id="su-businessType" tabIndex={-1}>
                {signup.types.map((t, i) => {
                  const I = icons[i] ?? Briefcase
                  return (
                    <RadioCard key={t} name="su-type" value={t} checked={draft.businessType === t} onChange={(v) => { update({ businessType: v }); setErrors((x) => ({ ...x, businessType: undefined })) }} label={t} icon={<I className="size-4" aria-hidden />} size="sm" />
                  )
                })}
              </div>
              {errors.businessType && (
                <p id="su-type-err" className="mt-1.5 text-[13px] text-danger">
                  {errors.businessType}
                </p>
              )}
            </fieldset>
            <TextField {...bind('company')} label="Legal company name" autoComplete="organization" />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField {...bind('country')} label="Registered in" placeholder="Choose a country" options={signup.countries} />
              <SelectField {...bind('volume')} label="Monthly volume" placeholder="Choose a range" options={signup.volumes} />
            </div>
            <Button type="submit" size="lg" icon={<ArrowRight className="size-4" aria-hidden />} className="mt-2 justify-self-start">
              Continue
            </Button>
          </form>
        )}
        {step === 1 && (
          <form noValidate onSubmit={submit} className="grid gap-5">
            <h2 ref={heading} tabIndex={-1} className="text-[18px] font-medium text-ink outline-none">
              About you
            </h2>
            <TextField {...bind('name')} label="Full name" autoComplete="name" />
            <TextField {...bind('email')} type="email" label="Work email" autoComplete="email" />
            <PasswordField
              id="su-password"
              label="Password"
              autoComplete="new-password"
              meter
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((x) => ({ ...x, password: undefined }))
              }}
              error={errors.password}
              hint="10 characters or more, with a number."
            />
            {message && <Notice tone="danger">{message}</Notice>}
            <div className="mt-2 flex flex-wrap justify-between gap-3">
              <Button variant="ghost" iconLeft={<ArrowLeft className="size-4" aria-hidden />} onClick={() => update({ step: 0 })}>
                Back
              </Button>
              <Button type="submit" size="lg" loading={loading}>
                Open account
              </Button>
            </div>
          </form>
        )}
        {step === 2 && (
          <div>
            <span className="round grid size-12 animate-pulse-ring place-items-center rounded-full bg-teal-ink text-white">
              <Check className="size-6" aria-hidden />
            </span>
            <h2 ref={heading} tabIndex={-1} className="mt-5 text-[24px] font-medium tracking-[-0.03em] text-ink outline-none">
              {signup.success}
            </h2>
            <p className="mt-2 text-[15px] text-muted" role="status">
              {signup.successBody} {draft.email}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/send">Send your first transfer</ButtonLink>
              <Button variant="outline" onClick={() => { clearDraft(); setErrors({}) }}>
                Start over
              </Button>
            </div>
          </div>
        )}
      </div>
      {step < 2 && (
        <p className="mt-10 text-[14px] text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-teal-ink underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      )}
    </AuthShell>
  )
}
