import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { AuthShell } from '../components/AuthShell'
import { Button } from '../components/Button'
import { Checkbox, Field, Input } from '../components/Field'
import { Notice } from '../components/Notice'
import { PasswordInput } from '../components/PasswordInput'
import { auth } from '../content'
import { Link } from '../lib/router'
import { validateEmail } from '../lib/validate'

// UI only: nothing leaves the browser. Swap `fakeSubmit` for your auth API.
const fakeSubmit = () => new Promise((r) => setTimeout(r, 900))

export function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [tried, setTried] = useState(false)
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [forgot, setForgot] = useState<'idle' | 'sent' | 'need-email'>('idle')
  const form = useRef<HTMLFormElement>(null)
  const alive = useRef(true)
  useEffect(() => {
    alive.current = true
    return () => void (alive.current = false)
  }, [])

  const errors = {
    email: validateEmail(email),
    password: password ? undefined : 'Enter your password.',
  }
  const show = (k: keyof typeof errors) => (tried ? errors[k] : undefined)
  const l = auth.login

  async function submit(e: FormEvent) {
    e.preventDefault()
    setTried(true)
    setForgot('idle')
    if (Object.values(errors).some(Boolean)) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setState('loading')
    await fakeSubmit()
    if (!alive.current) return
    setState(password === l.wrongPassword ? 'error' : 'done')
  }

  return (
    <AuthShell
      title={l.title}
      body={l.body}
      footer={
        <>
          {l.switch.text}{' '}
          <Link href={l.switch.href} className="inline-flex min-h-[40px] items-center font-medium text-violet-text underline-offset-4 hover:underline">
            {l.switch.label}
          </Link>
        </>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
            <Notice tone="success" title={l.success.title}>
              {l.success.body}
            </Notice>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setState('idle')
                setPassword('')
                setTried(false)
              }}
            >
              Log out
            </Button>
          </motion.div>
        ) : (
          <motion.form key="form" ref={form} onSubmit={submit} noValidate exit={{ opacity: 0 }} className="flex flex-col gap-5" aria-label="Log in">
            {state === 'error' ? <Notice tone="error">{l.error}</Notice> : null}
            {forgot === 'sent' ? <Notice tone="info">{l.forgotSent.replace('{email}', email.trim())}</Notice> : null}
            <Field label="Email" error={show('email') ?? (forgot === 'need-email' ? 'Enter your email first, then press “Forgot password?”.' : undefined)}>
              {(p) => (
                <Input
                  {...p}
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (forgot === 'need-email') setForgot('idle')
                  }}
                />
              )}
            </Field>
            <Field
              label="Password"
              error={show('password')}
              labelAction={
                <button
                  type="button"
                  onClick={() => setForgot(validateEmail(email) ? 'need-email' : 'sent')}
                  className="-my-2 min-h-[40px] text-[13px] font-medium text-violet-text underline-offset-4 hover:underline"
                >
                  {l.forgot}
                </button>
              }
            >
              {(p) => (
                <PasswordInput
                  {...p}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (state === 'error') setState('idle')
                  }}
                />
              )}
            </Field>
            <Checkbox checked={remember} onChange={setRemember}>
              {l.remember}
            </Checkbox>
            <Button type="submit" size="lg" loading={state === 'loading'} className="mt-1 w-full">
              {l.submit}
              {state !== 'loading' && <ArrowRight className="size-[18px] transition-transform group-hover/button:translate-x-1" aria-hidden />}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  )
}
