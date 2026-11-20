import { AlignLeft, Monitor, Smartphone } from 'lucide-react'
import { useState } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { IssuePreview } from '../components/IssuePreview'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { defaultIssue, sections } from '../content'

export function NewsletterSection() {
  const s = sections.newsletter
  const [mode, setMode] = useState<'desktop' | 'mobile' | 'text'>('desktop')
  return (
    <section id="newsletter" className="py-16 lg:py-20">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} body={s.body} />
          <Button href={s.cta.href} size="lg" arrow className="self-start lg:self-end">
            {s.cta.label}
          </Button>
        </div>
        <Reveal className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="relative overflow-hidden rounded-[var(--radius-card-lg)] border border-line bg-[radial-gradient(120%_80%_at_50%_0%,rgb(88_52_160/0.28),transparent_60%),var(--color-panel)] p-4 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px] text-muted">Preview of issue 48</p>
              <Segmented
                label="Preview mode"
                size="sm"
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'desktop', label: 'Desktop', icon: <Monitor /> },
                  { value: 'mobile', label: 'Phone', icon: <Smartphone /> },
                  { value: 'text', label: 'Plain text', icon: <AlignLeft /> },
                ]}
              />
            </div>
            <div className="max-h-[560px] overflow-hidden [mask-image:linear-gradient(#000_80%,transparent)]">
              <IssuePreview issue={defaultIssue} mode={mode} />
            </div>
          </div>
          <ul className="flex flex-col gap-4">
            {s.points.map((p, i) => (
              <li key={p.title} className="rounded-[var(--radius-card)] border border-line bg-panel p-6">
                <p className="font-display text-[15px] font-bold text-pink-text">0{i + 1}</p>
                <h3 className="mt-2 text-[19px] font-semibold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  )
}
