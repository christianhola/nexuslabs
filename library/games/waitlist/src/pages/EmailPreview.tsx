import { Check, Code2, Monitor, Smartphone } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'

import { PageShell } from '../components/Layout'
import { SegmentedControl } from '../components/SegmentedControl'
import { Badge, Button, Card, Container } from '../components/ui'
import { brand, emailPreview, launch } from '../content'
import { confirmationEmailHtml } from '../email/confirmation'
import { loadSaved, shareUrl, statusPath } from '../lib/api'
import { ease } from '../lib/motion'
import { BOOST } from '../worker/rank'
import { useTitle } from '../lib/router'

type View = 'desktop' | 'mobile'

/** Sample data, or this browser's own spot if it has joined. */
function useSample() {
  return useMemo(() => {
    const saved = loadSaved()
    const code = saved?.code ?? 'demo2k7'
    return {
      position: saved?.position ?? 128,
      count: saved?.count ?? 2140,
      shareUrl: shareUrl(code),
      statusUrl: `${window.location.origin}${statusPath(code)}`,
      sample: !saved,
    }
  }, [])
}

export function EmailPreviewPage() {
  useTitle('Email preview')
  const [view, setView] = useState<View>('desktop')
  const [copied, setCopied] = useState(false)
  const sample = useSample()

  const html = useMemo(
    () =>
      confirmationEmailHtml({
        brand: brand.name,
        subject: emailPreview.subject,
        preheader: emailPreview.preheader,
        position: sample.position,
        count: sample.count,
        shareUrl: sample.shareUrl,
        statusUrl: sample.statusUrl,
        boost: BOOST,
        launchDate: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date(launch.at)),
      }),
    [sample],
  )

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <PageShell>
      <Container className="py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <div className="flex items-center gap-2">
              <h1 className="text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-title">{emailPreview.title}</h1>
              <Badge>Preview only</Badge>
            </div>
            <p className="mt-2 text-lead text-muted">{emailPreview.lead}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              label="Preview width"
              value={view}
              onChange={setView}
              options={[
                { value: 'desktop', label: 'Desktop', icon: <Monitor className="size-4" aria-hidden="true" /> },
                { value: 'mobile', label: 'Mobile', icon: <Smartphone className="size-4" aria-hidden="true" /> },
              ]}
            />
            <Button variant="secondary" size="sm" onClick={copyHtml} icon={copied ? <Check className="size-4" aria-hidden="true" /> : <Code2 className="size-4" aria-hidden="true" />}>
              {copied ? 'Copied' : 'Copy HTML'}
            </Button>
            <span className="sr-only" role="status" aria-live="polite">
              {copied ? 'HTML copied to clipboard' : ''}
            </span>
          </div>
        </div>

        <Card padding="none" className="mt-8 overflow-hidden">
          <dl className="grid gap-x-6 gap-y-1 border-b border-line-soft px-6 py-4 text-[14px] sm:grid-cols-[80px_1fr]">
            <dt className="text-muted">From</dt>
            <dd className="text-ink">{brand.name} &lt;hello@example.com&gt;</dd>
            <dt className="text-muted">Subject</dt>
            <dd className="font-medium text-ink">{emailPreview.subject}</dd>
            <dt className="text-muted">Preheader</dt>
            <dd className="text-body">{emailPreview.preheader}</dd>
          </dl>
          <div className="bg-sunken p-4 sm:p-8">
            <motion.div className="mx-auto overflow-hidden rounded-card bg-stage shadow-card" animate={{ maxWidth: view === 'desktop' ? 720 : 375 }} transition={{ duration: 0.45, ease }}>
              <iframe title="Confirmation email preview" srcDoc={html} sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" className="block h-[860px] w-full border-0 bg-stage" />
            </motion.div>
          </div>
        </Card>
        {sample.sample && <p className="mt-3 text-small text-muted">Showing sample data. Join the waitlist in this browser to preview it with your own spot.</p>}
      </Container>
    </PageShell>
  )
}
