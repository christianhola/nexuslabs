import { Check } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox, TextField } from '../components/Field'
import { Notice } from '../components/Notice'
import { SegmentedControl } from '../components/SegmentedControl'
import { plans, signupPage as s } from '../content'
import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { Link, useLocation } from '../lib/router'
import { useStored } from '../lib/storage'
import type { Errors, SignupInput } from '../lib/validate'
import { validateSignup } from '../lib/validate'

type Account = { name: string; email: string; store: string; plan: string; id: string; created: string }

function Onboarding({ account, onReset }: { account: Account; onReset: () => void }) {
  const [done, setDone] = useStored<number[]>('onboarding', [])
  const pct = Math.round((done.length / s.success.steps.length) * 100)
  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <Badge tone="mint" dot className="justify-self-start">
          Trial active · 14 days
        </Badge>
        <h1 className="font-display text-[40px] font-medium leading-[1.08] tracking-[-0.025em] text-white">{s.success.title}</h1>
        <p className="text-[16px] text-muted">
          {account.store} on {plans.find((p) => p.id === account.plan)?.name}. {s.success.body}
        </p>
      </div>
      <Card className="grid gap-5 p-6">
        <div className="flex items-center justify-between text-[14px]">
          <span className="font-semibold text-white">Setup</span>
          <span className="tabular-nums text-muted">{pct}% done</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]" role="progressbar" aria-label="Setup progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-cobalt-text transition-[width] duration-500 ease-brand" style={{ width: `${pct}%` }} />
        </div>
        <ul className="grid gap-3">
          {s.success.steps.map((step, i) => (
            <li key={step}>
              <Checkbox label={<span className={cx(done.includes(i) && 'text-faint line-through')}>{step}</span>} checked={done.includes(i)} onChange={(v) => setDone((d) => (v ? [...d, i] : d.filter((x) => x !== i)))} />
            </li>
          ))}
        </ul>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button href="/demo" arrow size="lg">
          Preview your first texts
        </Button>
        <Button variant="ghost" size="lg" onClick={onReset}>
          Sign out of this device
        </Button>
      </div>
    </div>
  )
}

export function Signup() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const [account, setAccount] = useStored<Account | null>('account', null)
  const [, setDone] = useStored<number[]>('onboarding', [])
  const [v, setV] = useState<SignupInput>({
    name: '',
    email: '',
    store: params.get('store') ?? '',
    plan: plans.some((p) => p.id === params.get('plan')) ? params.get('plan')! : 'growth',
    terms: false,
  })
  const [errors, setErrors] = useState<Errors<SignupInput>>({})
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string>()

  if (account)
    return (
      <AuthShell>
        <Onboarding
          account={account}
          onReset={() => {
            setAccount(null)
            setDone([])
          }}
        />
      </AuthShell>
    )

  const set = <K extends keyof SignupInput>(k: K, val: SignupInput[K]) => {
    setV((x) => ({ ...x, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateSignup(v)
    setErrors(errs)
    setFormError(undefined)
    if (Object.keys(errs).length) {
      document.getElementById(`signup-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setLoading(true)
    const r = await postJson<{ workspace: { id: string; store: string; plan: string } }>('/api/signup', v)
    setLoading(false)
    if (!r.ok) {
      setErrors((r.errors ?? {}) as Errors<SignupInput>)
      return setFormError(r.error)
    }
    setAccount({ name: v.name.trim(), email: v.email.trim(), store: r.data.workspace.store, plan: r.data.workspace.plan, id: r.data.workspace.id, created: new Date().toISOString() })
    window.scrollTo({ top: 0 })
  }

  return (
    <AuthShell>
      <div className="grid max-w-[520px] gap-8">
        <div className="grid gap-3">
          <h1 className="font-display text-[40px] font-medium leading-[1.08] tracking-[-0.025em] text-white">{s.title}</h1>
          <p className="text-[16px] text-muted">{s.body}</p>
        </div>
        <form onSubmit={submit} noValidate className="grid gap-5">
          {formError ? <Notice tone="error">{formError}</Notice> : null}
          <div className="grid gap-2">
            <p id="plan-label" className="text-[14px] font-medium text-soft">
              Plan
            </p>
            <SegmentedControl label="Plan" value={v.plan as 'launch'} onChange={(x) => set('plan', x)} options={plans.map((p) => ({ value: p.id as 'launch', label: p.name }))} className="justify-self-start" />
          </div>
          <TextField id="signup-name" label="Full name" autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} error={errors.name} />
          <TextField id="signup-email" label="Work email" type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} error={errors.email} />
          <TextField id="signup-store" label="Store URL" inputMode="url" placeholder="yourbrand.com" value={v.store} onChange={(e) => set('store', e.target.value)} error={errors.store} hint="We use it to draft your first campaign." />
          <span id="signup-terms" tabIndex={-1} />
          <Checkbox
            label={
              <>
                I agree to the terms and the{' '}
                <Link href="/faq" className="text-cobalt-text underline underline-offset-2 hover:text-white">
                  messaging policy
                </Link>
                .
              </>
            }
            checked={v.terms}
            onChange={(x) => set('terms', x)}
            error={errors.terms}
          />
          <Button type="submit" size="lg" arrow loading={loading}>
            {loading ? 'Creating workspace…' : 'Create workspace'}
          </Button>
          <ul className="grid gap-2 text-[13px] text-faint">
            {['No card needed for 14 days', 'Keep your current SMS tool during the trial'].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <Check aria-hidden className="size-3.5 text-mint-text" /> {x}
              </li>
            ))}
          </ul>
        </form>
        <p className="text-[14px] text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-cobalt-text hover:text-white">
            Log in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}
