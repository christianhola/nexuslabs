import { useState } from 'react'

import { Button } from '../components/Button'
import { useConsent } from '../components/CookieBanner'
import { Container } from '../components/Container'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/SectionHeading'
import { Switch } from '../components/Switch'

export function CookiesPage() {
  const [consent, setConsent] = useConsent()
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false)
  const [marketing, setMarketing] = useState(consent?.marketing ?? false)
  const [saved, setSaved] = useState(false)
  return (
    <Container className="grid gap-12 pb-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <PageHeader eyebrow="Legal" title="Cookie policy" body="What this site stores in your browser, and why. A template: replace it with your own policy." />
        <div className="max-w-[64ch] space-y-8 text-[16.5px] leading-[1.75] text-body">
          <section>
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">Necessary</h2>
            <p className="mt-2">We keep your language, your cookie choice and the demo app's state (posts, chat messages, ticked tasks) in your browser's local storage. Nothing leaves your device and you can clear it at any time.</p>
          </section>
          <section>
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">Analytics</h2>
            <p className="mt-2">With your consent we count page views to see which pages help. We never sell this data or use it to identify you.</p>
          </section>
          <section>
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">Marketing</h2>
            <p className="mt-2">With your consent we measure which campaigns bring people to the site, so we spend less on the ones that do not.</p>
          </section>
        </div>
      </div>
      <aside className="h-fit space-y-5 rounded-[var(--radius-card)] border-[1.5px] border-ink p-6 lg:sticky lg:top-28 lg:mt-20">
        <h2 className="font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">Your choices</h2>
        <Switch label="Necessary" description="Always on: the site does not work without these" checked onChange={() => undefined} disabled />
        <Switch label="Analytics" description="Anonymous page views" checked={analytics} onChange={(x) => { setAnalytics(x); setSaved(false) }} />
        <Switch label="Marketing" description="Campaign measurement" checked={marketing} onChange={(x) => { setMarketing(x); setSaved(false) }} />
        {saved ? <Notice tone="ok">Saved. You can change this whenever you like.</Notice> : null}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setConsent({ choice: 'custom', analytics, marketing, at: new Date().toISOString() })
              setSaved(true)
            }}
          >
            Save choices
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setConsent(null)
              setSaved(false)
            }}
          >
            Ask me again
          </Button>
        </div>
        <p className="text-[13px] text-faint">{consent ? `Current choice: ${consent.choice}${consent.at ? `, ${new Date(consent.at).toLocaleDateString('en-GB')}` : ''}.` : 'You have not chosen yet.'}</p>
      </aside>
    </Container>
  )
}
