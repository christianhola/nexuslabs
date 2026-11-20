import { Check, Gift, Mic } from 'lucide-react'

import { AreaChart, BarList } from '../components/AreaChart'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardHeader } from '../components/Card'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { adOffers, heroMock, images, sections } from '../content'

export function Grow() {
  const s = sections.grow
  const steps = [
    { n: 1, reward: 'Sticker pack', done: true },
    { n: 5, reward: 'Bonus essay', done: true },
    { n: 15, reward: 'Signed print', done: false },
    { n: 50, reward: 'Call with the author', done: false },
  ]
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={s.eyebrow} title={s.title} body={s.body} size="md" />
          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {s.stats.map((st) => (
              <div key={st.label} className="border-t border-line-strong pt-4">
                <dt className="sr-only">{st.label}</dt>
                <dd className="font-display text-[40px] font-black tracking-[-0.04em] text-white">{st.value}</dd>
                <dd className="mt-1 text-[14px] text-muted">{st.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Reveal>
          <Card>
            <CardHeader title="Referral rewards" action={<Badge tone="ok" dot>Live</Badge>} />
            <div className="p-5">
              <p className="text-[14px] text-muted">Share your link and unlock rewards</p>
              <p className="mt-2 rounded-[8px] border border-line-strong bg-night-2 px-3 py-2.5 font-mono text-[13px] text-body">inkwell.press/r/quiet-hour?ref=ada</p>
              <ol className="mt-5 flex flex-col gap-2">
                {steps.map((st) => (
                  <li key={st.n} className="flex items-center gap-3 rounded-[8px] bg-panel-2 px-3 py-2.5">
                    <span className={st.done ? 'round grid size-7 place-items-center rounded-full bg-pink-strong text-white' : 'round grid size-7 place-items-center rounded-full border border-line-strong text-muted'}>{st.done ? <Check className="size-4" aria-hidden /> : <Gift className="size-3.5" aria-hidden />}</span>
                    <span className="flex-1 text-[15px] text-ink">{st.reward}</span>
                    <span className="text-[13px] text-muted">{st.n} referrals</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-panel-3" role="progressbar" aria-label="Progress to next reward" aria-valuenow={9} aria-valuemin={0} aria-valuemax={15}>
                <div className="h-full w-[60%] rounded-full bg-[linear-gradient(90deg,#8b5cf6,#f06acd)]" />
              </div>
              <p className="mt-2 text-[13px] text-muted">9 of 15 referrals to the signed print</p>
            </div>
          </Card>
        </Reveal>
      </Container>
    </section>
  )
}

export function Podcast() {
  const s = sections.podcast
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-card-lg)] border border-line">
          <img src={images.studio} alt="A studio microphone lit in magenta" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_8_17/0.96)_0%,rgb(10_8_17/0.82)_45%,rgb(10_8_17/0.1)_100%)]" aria-hidden />
          <div className="relative max-w-[620px] px-6 py-14 sm:px-12 sm:py-20">
            <SectionHeading eyebrow={s.eyebrow} title={s.title} body={s.body} size="md" />
            <div className="mt-8 flex items-center gap-4 rounded-[12px] border border-line-strong bg-night/70 p-3 backdrop-blur sm:max-w-[420px]">
              <span className="grid size-11 shrink-0 place-items-center rounded-[8px] bg-pink-strong text-white">
                <Mic className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-ink">Ep. 112: building in public</p>
                <div className="mt-2 h-1 rounded-full bg-panel-3">
                  <div className="h-full w-[38%] rounded-full bg-white" />
                </div>
              </div>
              <span className="text-[13px] tabular-nums text-muted">18:45</span>
            </div>
            <Button href={s.cta.href} variant="white" arrow className="mt-8">
              {s.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function EarnAndMeasure() {
  const e = sections.earn
  const a = sections.analytics
  const days = heroMock.analytics.series.map((_, i) => `Nov ${i + 1}`)
  return (
    <section className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal className="flex flex-col">
          <SectionHeading eyebrow={e.eyebrow} title={e.title} body={e.body} size="md" />
          <Card className="mt-10 flex-1">
            <CardHeader title="Ad network offers" action={<Badge tone="pink">{adOffers.length} new</Badge>} />
            <ul className="divide-y divide-line">
              {adOffers.slice(0, 3).map((o) => (
                <li key={o.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-[8px] text-[13px] font-bold text-white" style={{ background: `hsl(${o.hue} 55% 42%)` }} aria-hidden>
                    {o.sponsor[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-medium text-ink">{o.sponsor}</span>
                    <span className="block text-[13px] text-muted">{o.placement} placement</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[15px] font-semibold tabular-nums text-white">${o.est.toLocaleString('en-US')}</span>
                    <span className="block text-[12px] text-muted">${o.cpm} CPM</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-4">
              <Button href={e.cta.href} variant="outline" arrow className="w-full">
                {e.cta.label}
              </Button>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col">
          <SectionHeading eyebrow={a.eyebrow} title={a.title} body={a.body} size="md" />
          <Card className="mt-10 flex-1">
            <CardHeader title="Subscribers this month" action={<Badge tone="ok">+12.4%</Badge>} />
            <div className="p-5">
              <AreaChart series={heroMock.analytics.series.map((v) => v * 210 + 330000)} labels={days} format={(n) => Math.round(n).toLocaleString('en-US')} height={170} label="Subscribers" />
              <div className="mt-5">
                <BarList rows={[{ label: 'Referrals', value: 4120 }, { label: 'Recommendations', value: 3380 }, { label: 'Direct', value: 1910 }]} format={(n) => n.toLocaleString('en-US')} />
              </div>
            </div>
            <div className="border-t border-line p-4">
              <Button href={a.cta.href} variant="outline" arrow className="w-full">
                {a.cta.label}
              </Button>
            </div>
          </Card>
        </Reveal>
      </Container>
    </section>
  )
}
