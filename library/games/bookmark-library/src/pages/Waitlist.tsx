import { useState } from 'react'
import { ArrowRight, Check, Copy } from 'lucide-react'

import { Button, ButtonLink } from '../components/Button'
import { EmailCapture } from '../components/EmailCapture'
import { Eyebrow } from '../components/SectionHeading'
import { WAITLIST } from '../content'
import { readSignup } from '../lib/waitlist'

/** Waitlist confirmation. Reads the signup from localStorage (never from the URL). */
export function Waitlist() {
  const [signup] = useState(readSignup)
  const [copied, setCopied] = useState(false)
  if (!signup)
    return (
      <section aria-labelledby="wl-title" className="mx-auto flex max-w-[640px] flex-col items-center px-5 pt-[72px] pb-32 text-center">
        <Eyebrow>Waitlist</Eyebrow>
        <h1 id="wl-title" className="mt-6 text-[clamp(40px,5vw,64px)] leading-[1] font-bold tracking-[-0.05em]">
          Not on the list yet
        </h1>
        <p className="mt-5 text-[18px] text-muted">Leave your email and we will save you a spot.</p>
        <div className="mt-10 flex w-full justify-center">
          <EmailCapture autoFocus />
        </div>
      </section>
    )
  const link = `${window.location.origin}/?ref=${signup.referral}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <section aria-labelledby="wl-title" className="mx-auto flex max-w-[720px] flex-col items-center px-5 pt-[72px] pb-32 text-center">
      <span className="grid size-16 animate-pop place-items-center rounded-2xl bg-lime shadow-lime">
        <Check aria-hidden className="size-8" strokeWidth={3} />
      </span>
      <h1 id="wl-title" className="mt-8 text-[clamp(40px,5.4vw,72px)] leading-[0.98] font-bold tracking-[-0.05em]">
        {WAITLIST.title}
      </h1>
      <p className="mt-6 max-w-[46ch] text-[18px] leading-[1.6] text-muted">{WAITLIST.lead}</p>
      <div className="mt-10 grid w-full grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-panel p-6 text-left ring-1 ring-line">
          <p className="text-[14px] text-muted">Your place in line</p>
          <p className="mt-1 text-[48px] leading-none font-bold tracking-[-0.05em] tabular-nums">#{signup.position.toLocaleString('en-GB')}</p>
          <p className="mt-3 truncate text-[14px] text-subtle">Confirmation sent to {signup.email}</p>
        </div>
        <div className="flex flex-col rounded-xl bg-panel p-6 text-left ring-1 ring-line">
          <p className="text-[14px] text-muted">Skip ahead: each friend who joins moves you up 50 places</p>
          <p className="mt-3 truncate rounded-sm bg-chip px-3 py-2.5 text-[14px] text-ink-2">{link.replace(/^https?:\/\//, '')}</p>
          <Button variant="dark" size="sm" className="mt-3 h-10" icon={copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />} onClick={copy}>
            {copied ? 'Copied' : 'Copy invite link'}
          </Button>
        </div>
      </div>
      <ol className="mt-12 flex w-full flex-col gap-3 text-left">
        {WAITLIST.steps.map((s, i) => (
          <li key={s} className="flex items-center gap-4 rounded-lg bg-paper px-5 py-4 ring-1 ring-line">
            <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-chip text-[14px] font-semibold">{i + 1}</span>
            <span className="text-[16px] text-ink-2">{s}</span>
          </li>
        ))}
      </ol>
      <ButtonLink href="/app" variant="lime" size="lg" className="mt-10" iconEnd={<ArrowRight aria-hidden className="size-4.5" />}>
        Open the library
      </ButtonLink>
    </section>
  )
}
