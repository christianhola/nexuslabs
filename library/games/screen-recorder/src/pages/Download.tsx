import { Check, Download as DownloadIcon, Globe, Laptop, Monitor, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/Button'
import { Container } from '@/components/Frame'
import { Modal } from '@/components/Modal'
import { Kbd } from '@/components/ui'
import { BRAND, DOWNLOAD, IMAGES, type Platform } from '@/content'
import { MarketingPage } from './Shell'

const ICON = { mac: Laptop, windows: Monitor, chrome: Globe, ios: Smartphone }

function detect(): Platform['id'] {
  const ua = navigator.userAgent
  if (/iPhone|iPad/.test(ua)) return 'ios'
  if (/Windows/.test(ua)) return 'windows'
  if (/Mac/.test(ua)) return 'mac'
  return 'chrome'
}

export function Download() {
  const [os] = useState(detect)
  const [picked, setPicked] = useState<Platform | null>(null)
  const [progress, setProgress] = useState(0)
  const primary = DOWNLOAD.platforms.find((p) => p.id === os)!
  const others = DOWNLOAD.platforms.filter((p) => p.id !== os)

  useEffect(() => {
    if (!picked) return
    setProgress(0)
    const id = window.setInterval(() => setProgress((p) => (p >= 100 ? 100 : p + 12.5)), 160)
    return () => window.clearInterval(id)
  }, [picked])

  const PrimaryIcon = ICON[primary.id]
  return (
    <MarketingPage eyebrow="Download" title={DOWNLOAD.title} sub={DOWNLOAD.sub}>
      <Container className="pb-24">
        <section className="grid overflow-hidden rounded-[24px] bg-surface ring-1 ring-line lg:grid-cols-[1fr_1.1fr]" aria-label={`Download for ${primary.name}`}>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-2 ring-1 ring-line-strong">
              <PrimaryIcon className="size-5" />
            </span>
            <h2 className="mt-6 font-display text-[32px] font-medium tracking-[-0.035em]">{BRANDED(primary)}</h2>
            <p className="mt-2 text-[15px] text-muted">
              {primary.detail} · {primary.size} · {primary.requirement}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" icon={<DownloadIcon className="size-5" />} onClick={() => setPicked(primary)}>
                Download for {primary.name}
              </Button>
              <span className="text-[13px] text-faint">Detected from your browser</span>
            </div>
            <p className="mt-8 flex items-center gap-2 text-[13px] text-muted">
              Start recording any time with <Kbd>⌥</Kbd> <Kbd>⇧</Kbd> <Kbd>R</Kbd>
            </p>
          </div>
          <img src={IMAGES.desk} alt="A laptop on a desk at night with the recorder open" className="h-full min-h-[280px] w-full object-cover" loading="lazy" />
        </section>

        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {others.map((p) => {
            const Icon = ICON[p.id]
            return (
              <li key={p.id} className="flex flex-col rounded-[20px] bg-surface p-6 ring-1 ring-line">
                <Icon className="size-5 text-muted" />
                <h2 className="mt-4 text-[17px] font-medium">{p.name}</h2>
                <p className="mt-1 flex-1 text-[14px] text-muted">
                  {p.detail}
                  <br />
                  <span className="text-faint">{p.requirement}</span>
                </p>
                <Button variant="secondary" className="mt-5 self-start" icon={<DownloadIcon className="size-4" />} onClick={() => setPicked(p)}>
                  Get it · {p.size}
                </Button>
              </li>
            )
          })}
        </ul>

        <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="changelog">
          <div>
            <h2 id="changelog" className="font-display text-[30px] font-medium tracking-[-0.035em]">
              What’s new
            </h2>
            <p className="mt-3 max-w-[40ch] text-[15px] text-muted">{DOWNLOAD.notes[0]}</p>
          </div>
          <ol className="space-y-3">
            {DOWNLOAD.changelog.map((c) => (
              <li key={c.version} className="flex gap-5 rounded-[16px] bg-surface p-5 ring-1 ring-line">
                <span className="w-16 shrink-0">
                  <span className="block font-mono text-[14px] text-fg">{c.version}</span>
                  <span className="text-[12px] text-faint">{c.date}</span>
                </span>
                <p className="text-[15px] text-muted">{c.notes}</p>
              </li>
            ))}
          </ol>
        </section>
      </Container>

      <Modal open={!!picked} onClose={() => setPicked(null)} title={picked ? `${picked.name} download` : 'Download'} width={440}>
        {picked && (
          <div className="p-6">
            {progress < 100 ? (
              <div aria-live="polite">
                <p className="text-[15px]">Preparing {picked.name} build…</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Preparing download" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-cream transition-[width] duration-150" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-[13px] text-faint">{Math.round(progress)}%</p>
              </div>
            ) : (
              <div>
                <p className="flex items-center gap-2 text-[15px] font-medium">
                  <span className="flex size-6 items-center justify-center rounded-full bg-ok-bg text-ok">
                    <Check className="size-3.5" />
                  </span>
                  Ready (demo)
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">This template has no real installer. Point this button at your own {picked.name} build. Then:</p>
                <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-[14px] text-fg/90">
                  <li>Open the downloaded file.</li>
                  <li>Allow screen and camera access when asked.</li>
                  <li>Sign in and record your first clip.</li>
                </ol>
                <div className="mt-6 flex justify-end">
                  <Button variant="primary" onClick={() => setPicked(null)} data-autofocus>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </MarketingPage>
  )
}

const BRANDED = (p: Platform) => `${BRAND.name} for ${p.name}`
