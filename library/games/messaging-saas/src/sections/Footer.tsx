import { useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { TextField } from '../components/Field'
import { Wordmark } from '../components/Logo'
import { blogPage, footer } from '../content'
import { postJson } from '../lib/api'
import { Link } from '../lib/router'
import { useStored } from '../lib/storage'
import { validateEmail } from '../lib/validate'

/** Newsletter capture, shared by the footer and the blog. Remembers a successful sign-up. */
export function Newsletter({ id = 'newsletter' }: { id?: string }) {
  const [subscribed, setSubscribed] = useStored<string | null>('newsletter', null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    setError(err)
    if (err) return
    setLoading(true)
    const r = await postJson('/api/subscribe', { email })
    setLoading(false)
    if (!r.ok) return setError(r.errors?.email ?? r.error)
    setSubscribed(email.trim())
  }
  if (subscribed)
    return (
      <p role="status" className="rounded-[12px] border border-mint/30 bg-mint/10 p-4 text-[14px] text-soft">
        {blogPage.newsletter.success} <span className="text-faint">({subscribed})</span>
      </p>
    )
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <TextField id={id} label="Email address" hideLabel type="email" autoComplete="email" placeholder="you@brand.com" value={email} onChange={(e) => setEmail(e.target.value)} error={error} className="flex-1" />
      <Button type="submit" loading={loading} size="lg" className="h-12">
        {blogPage.newsletter.cta}
      </Button>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-[#060812] pb-10 pt-20">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1.6fr]">
          <div className="grid content-start gap-6">
            <Wordmark />
            <p className="max-w-sm text-[15px] leading-[1.6] text-muted">{footer.blurb}</p>
            <div className="max-w-md">
              <p className="mb-3 text-[14px] font-semibold text-white">{blogPage.newsletter.title}</p>
              <Newsletter id="footer-newsletter" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footer.columns.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-faint">{c.title}</p>
                <ul className="mt-5 grid gap-1">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-10 min-w-10 items-center text-[15px] text-soft hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-[13px] text-faint sm:flex-row sm:justify-between">
          <p>{footer.legal}</p>
          <p>Reply STOP to opt out. Reply HELP for help.</p>
        </div>
      </Container>
    </footer>
  )
}
