import { ArrowRight } from 'lucide-react'

import { Button } from '../components/Button'
import { Field, Input } from '../components/Field'
import { useForm } from '../lib/useForm'
import { validateEmail } from '../lib/validate'

/* Newsletter sign-up, posting to /api/subscribe. */
export function SubscribeForm() {
  const f = useForm({ initial: { email: '' }, url: '/api/subscribe', validate: (v) => ({ email: validateEmail(v.email) }) })
  if (f.status === 'success')
    return (
      <p role="status" className="rounded-[12px] bg-flame-soft px-4 py-3 text-[14.5px] text-flame-ink">
        You are on the list. The next issue lands on Tuesday.
      </p>
    )
  return (
    <form ref={f.form} onSubmit={f.submit} noValidate className="flex flex-col gap-2">
      <Field label="Email address" error={f.errors.email}>
        {(ctl) => (
          <div className="flex gap-2">
            <Input {...ctl} type="email" autoComplete="email" placeholder="you@school.com" value={f.values.email} onChange={(e) => f.set('email', e.target.value)} />
            <Button type="submit" variant="dark" loading={f.status === 'submitting'} className="h-11 shrink-0" aria-label="Subscribe">
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        )}
      </Field>
      {f.status === 'error' && f.message && !f.errors.email ? <p className="text-[13px] text-bad" role="alert">{f.message}</p> : null}
    </form>
  )
}
