import { ArrowRight, Link2 } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Tag } from '../components/Chip'
import { SectionHeading } from '../components/SectionHeading'
import { Thumb } from '../components/Thumb'
import { SAVING, STATS } from '../content'

export function Saving() {
  return (
    <section id="saving" aria-labelledby="saving-title" className="scroll-mt-6 border-t border-line bg-panel py-[120px]">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <SectionHeading id="saving-title" eyebrow={SAVING.eyebrow} title={SAVING.title} lead={SAVING.lead} />
        <div className="mt-16 grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <figure aria-label="A save, as Keepsake files it" className="rounded-[22px] bg-canvas p-3 sm:p-4">
            <div className="overflow-hidden rounded-[18px] bg-paper shadow-pop ring-1 ring-line">
              <Thumb item={{ image: 'ceramics', swatch: 'sage' }} className="aspect-[16/8] w-full" />
              <div className="flex flex-col gap-4 p-6">
                <p className="flex items-center gap-2 text-[14px] text-muted">
                  <Link2 aria-hidden className="size-4" /> ceramics.example/sage-glaze-stoneware
                </p>
                <p className="text-[22px] leading-[1.2] font-semibold tracking-[-0.03em]">Sage glaze stoneware</p>
                <blockquote className="border-l-2 border-lime pl-4 text-[16px] leading-[1.55] text-ink-2">“Exactly the product photography for the ceramics pitch.”</blockquote>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag>photography</Tag>
                  <Tag>ceramics</Tag>
                  <span className="ml-auto text-[13px] text-subtle">Filed in New pitch</span>
                </div>
              </div>
            </div>
          </figure>
          <div>
            <ol className="flex flex-col divide-y divide-line">
              {SAVING.steps.map((s) => (
                <li key={s.n} className="flex gap-6 py-6 first:pt-0">
                  <span className="pt-1 text-[14px] font-semibold text-leaf tabular-nums">{s.n}</span>
                  <span>
                    <span className="block text-[22px] font-semibold tracking-[-0.03em]">{s.title}</span>
                    <span className="mt-1.5 block text-[16px] leading-[1.6] text-muted">{s.body}</span>
                  </span>
                </li>
              ))}
            </ol>
            <ButtonLink href="/app?save=1" variant="dark" size="lg" className="mt-4" iconEnd={<ArrowRight aria-hidden className="size-4.5" />}>
              Try saving one
            </ButtonLink>
          </div>
        </div>
        <dl className="mt-24 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 bg-panel px-7 py-8">
              <dt className="text-[15px] text-muted">{s.label}</dt>
              <dd className="order-first text-[44px] leading-none font-bold tracking-[-0.05em]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
