import { useId, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Logo } from '../components/Logo'
import { brand, footer } from '../content'
import { postJson } from '../lib/api'
import { Link } from '../lib/router'
import { validateEmail } from '../lib/validate'

function Newsletter() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'ok' } | { kind: 'error'; msg: string }>({ kind: 'idle' })
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) return setState({ kind: 'error', msg: err })
    setState({ kind: 'busy' })
    const res = await postJson('/api/subscribe', { email })
    setState(res.ok ? { kind: 'ok' } : { kind: 'error', msg: res.errors?.email ?? res.error })
  }
  if (state.kind === 'ok')
    return (
      <p role="status" className="rounded-[12px] border border-mint bg-mint-soft px-4 py-3 text-[14.5px] text-ink">
        You are on the list. The next letter arrives on the first Tuesday of the month.
      </p>
    )
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor={id} className="sr-only">
        Email for the newsletter
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state.kind === 'error') setState({ kind: 'idle' })
          }}
          aria-invalid={state.kind === 'error' || undefined}
          aria-describedby={state.kind === 'error' ? `${id}-e` : undefined}
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-line-strong bg-card px-3.5 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45 aria-invalid:border-bad"
        />
        <Button type="submit" variant="dark" loading={state.kind === 'busy'}>
          Subscribe
        </Button>
      </div>
      {state.kind === 'error' ? (
        <p id={`${id}-e`} role="alert" className="mt-2 text-[13.5px] font-medium text-bad">
          {state.msg}
        </p>
      ) : null}
    </form>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-backdrop pb-36 pt-16 sm:pb-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-muted">{footer.blurb}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-[14px] font-semibold text-ink">{col.title}</h2>
                <ul className="mt-3 space-y-1">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-block py-2.5 text-[15px] text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-ink">{footer.newsletter.title}</h2>
            <p className="mb-3 mt-1.5 text-[14.5px] text-muted">{footer.newsletter.body}</p>
            <Newsletter />
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-[13.5px] text-faint sm:flex-row sm:justify-between">
          <p>{footer.legal}</p>
          <p>{brand.domain}</p>
        </div>
      </Container>
    </footer>
  )
}
