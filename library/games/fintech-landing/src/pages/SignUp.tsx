import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Checkbox, Field, Input } from '../components/Field'
import { Notice } from '../components/Notice'
import { PasswordInput } from '../components/PasswordInput'
import { PasswordStrength, scorePassword } from '../components/PasswordStrength'
import { auth, pricing } from '../content'
import { Link, useLocation } from '../lib/router'
import { validateEmail } from '../lib/validate'

// UI only: nothing leaves the browser. Swap `fakeSubmit` for your auth API.
const fakeSubmit = () => new Promise((r) => setTimeout(r, 900))

export function SignUp() {
  const { search } = useLocation()
  const plan = pricing.plans.find((p) => p.id === new URLSearchParams(search).get('plan'))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [tried, setTried] = useState(false)
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const form = useRef<HTMLFormElement>(null)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => void (alive.current = false)
  }, [])

  const strength = scorePassword(password)
  const errors = {
    name: name.trim().length < 2 ? 'Enter your full name.' : undefined,
    email: validateEmail(email),
    password: password.length < 8 ? 'Use at least 8 characters.' : strength.score < 2 ? 'Choose a stronger password (aim for Good or Strong).' : undefined,
    terms: terms ? undefined : 'Accept the terms to continue.',
  }
  const show = (k: keyof typeof errors) => (tried ? errors[k] : undefined)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTried(true)
    if (Object.values(errors).some(Boolean)) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setState('loading')
    await fakeSubmit()
    if (alive.current) setState('done')
  }

  const s = auth.signup
  return (
    <AuthShell
      title={s.title}
      body={s.body}
      footer={
        <>
          {s.switch.text}{' '}
          <Link href={s.switch.href} className="inline-flex min-h-[40px] items-center font-medium text-violet-text underline-offset-4 hover:underline">
            {s.switch.label}
          </Link>
        </>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
            <Notice tone="success" title={s.success.title}>
              {s.success.body.replace('{email}', email.trim())}
            </Notice>
            <Button href="/" variant="outline" size="lg">
              Back to home
            </Button>
          </motion.div>
        ) : (
          <motion.form key="form" ref={form} onSubmit={submit} noValidate exit={{ opacity: 0 }} className="flex flex-col gap-5" aria-label="Sign up">
            {plan ? (
              <div className="flex items-center gap-2 text-[14px] text-muted">
                <Badge tone="violet">{plan.name} plan</Badge> selected ·{' '}
                <Link href="/pricing" className="text-soft underline-offset-4 hover:underline">
                  change
                </Link>
              </div>
            ) : null}
            <Field label="Full name" error={show('name')}>
              {(p) => <Input {...p} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />}
            </Field>
            <Field label="Work email" error={show('email')}>
              {(p) => <Input {...p} type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />}
            </Field>
            <Field label="Password" error={show('password')}>
              {(p) => <PasswordInput {...p} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />}
            </Field>
            <PasswordStrength password={password} className="-mt-1" />
            <Checkbox checked={terms} onChange={setTerms} error={show('terms')}>
              {s.terms}
            </Checkbox>
            <Button type="submit" size="lg" loading={state === 'loading'} className="mt-1 w-full">
              {s.submit}
              {state !== 'loading' && <ArrowRight className="size-[18px] transition-transform group-hover/button:translate-x-1" aria-hidden />}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  )
}
