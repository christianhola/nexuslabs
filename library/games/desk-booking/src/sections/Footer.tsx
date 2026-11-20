import { useState, type FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '../components/Button'
import { Input } from '../components/Field'
import { Logo } from '../components/Logo'
import { footer } from '../content'
import { Link } from '../lib/router'

export function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    // Check the shape here first; the Worker validates again.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setError(body.error ?? 'Something went wrong. Try again.')
        setStatus('error')
        return
      }
      setStatus('done')
    } catch {
      setError('You look offline. Try again in a moment.')
      setStatus('error')
    }
  }

  return (
    <footer className="border-t border-line px-4 pt-14 pb-10 sm:px-9">
      <div className="mx-auto grid max-w-[1120px] gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.6fr]">
        <div>
          <Logo size={18} />
          <p className="mt-3 max-w-[240px] text-sm text-muted">{footer.blurb}</p>
        </div>
        {footer.columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="text-sm font-semibold text-fg">{c.title}</h2>
            <ul className="mt-2 grid">
              {c.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('/') ? (
                    <Link href={l.href} className="inline-flex h-10 items-center text-sm text-muted hover:text-fg">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="inline-flex h-10 items-center text-sm text-muted hover:text-fg">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div>
          <h2 className="text-sm font-semibold text-fg">{footer.newsletter.title}</h2>
          <p className="mt-1 text-sm text-muted">Demo form. Addresses are not saved and no email is sent.</p>
          {status === 'done' ? (
            <p role="status" className="mt-4 flex items-center gap-2 text-sm font-medium text-[#0b6b53] animate-fade-in">
              <CheckCircle2 aria-hidden className="size-4" /> Demo complete. No subscription was saved.
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="mt-4">
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  placeholder={footer.newsletter.placeholder}
                  value={email}
                  aria-invalid={status === 'error' || undefined}
                  aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
                  onChange={(e) => (setEmail(e.target.value), status === 'error' && setStatus('idle'))}
                />
                <Button type="submit" loading={status === 'loading'}>
                  {footer.newsletter.button}
                </Button>
              </div>
              {status === 'error' && (
                <p id="newsletter-error" role="alert" className="mt-2 text-xs text-danger">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-[1120px] border-t border-line-soft pt-6 text-xs text-muted">{footer.legal}</p>
    </footer>
  )
}
