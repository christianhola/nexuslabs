import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Media } from '../components/Media'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Slider } from '../components/Slider'
import { flexCalc, useCases } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Cta } from '../sections/Cta'

export function UseCasesPage() {
  return (
    <>
      <PageHeader eyebrow="Use cases" title="One API, every side of the meter" body="Retailers, grid operators, aggregators and app builders run on the same device layer. Here is what each of them builds with it.">
        <nav aria-label="Use cases" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {useCases.map((u) => (
              <li key={u.id}>
                <Link href={`#${u.id}`} className="round inline-flex h-10 items-center rounded-pill bg-paper px-4 text-[14px] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow hover:text-ink hover:shadow-[inset_0_0_0_1px_var(--color-line-strong)]">
                  {u.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Container className="space-y-6 pb-8">
        {useCases.map((u, i) => (
          <section key={u.id} id={u.id} aria-labelledby={`${u.id}-title`} className="">
            <Reveal>
              <Card className="grid gap-2 p-2 lg:grid-cols-2">
                <Media name={u.image} className={cx('aspect-[4/3] rounded-card-sm lg:aspect-auto lg:min-h-[440px]', i % 2 === 1 && 'lg:order-2')} />
                <div className="flex flex-col p-6 sm:p-10">
                  <p className="text-[14px] font-medium text-leaf">{u.label}</p>
                  <h2 id={`${u.id}-title`} className="mt-2 text-[32px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[40px]">
                    {u.title}
                  </h2>
                  <p className="mt-4 text-[16.5px] leading-[1.6] text-muted">{u.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {u.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-[15.5px]">
                        <span className="round grid size-6 shrink-0 place-items-center rounded-full bg-volt">
                          <Check className="size-3.5" strokeWidth={3} aria-hidden />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="min-h-8 flex-1" aria-hidden />
                  <div className="flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
                    <p>
                      <span className="block text-[40px] font-medium leading-none tracking-[-0.04em]">{u.metric.value}</span>
                      <span className="mt-1.5 block text-[14px] text-muted">{u.metric.label}</span>
                    </p>
                    <ButtonLink href="/contact" variant="outline" size="sm" icon={<ArrowRight className="size-4" aria-hidden />}>
                      Talk to our team
                    </ButtonLink>
                  </div>
                </div>
              </Card>
            </Reveal>
          </section>
        ))}
      </Container>

      <FlexCalculator />
      <Cta />
    </>
  )
}

/** Log-scale slider position (0–100) to homes and back. */
const toHomes = (p: number) => Math.round(Math.exp(Math.log(flexCalc.homesMin) + (p / 100) * (Math.log(flexCalc.homesMax) - Math.log(flexCalc.homesMin))) / 100) * 100
const toPos = (h: number) => ((Math.log(h) - Math.log(flexCalc.homesMin)) / (Math.log(flexCalc.homesMax) - Math.log(flexCalc.homesMin))) * 100

function FlexCalculator() {
  const [pos, setPos] = useState(() => toPos(flexCalc.homesDefault))
  const [shares, setShares] = useState<Record<string, number>>(() => Object.fromEntries(flexCalc.devices.map((d) => [d.id, d.share])))
  const homes = Math.max(flexCalc.homesMin, toHomes(pos))
  const parts = flexCalc.devices.map((d) => ({ ...d, mw: (homes * (shares[d.id] / 100) * d.kw) / 1000 }))
  const total = parts.reduce((s, p) => s + p.mw, 0)
  const fmt = (mw: number) => (mw >= 10 ? mw.toFixed(0) : mw.toFixed(1))

  return (
    <section aria-labelledby="flex-title" className="py-20 sm:py-24">
      <Container>
        <Card tone="mint" className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1fr] lg:gap-16 [&>*]:min-w-0">
          <div>
            <h2 id="flex-title" className="text-[32px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[40px]">
              {flexCalc.title}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-muted">{flexCalc.body}</p>
            <div className="mt-8 space-y-5">
              <Slider label="Homes in your portfolio" value={pos} min={0} max={100} step={0.5} onChange={setPos} display={homes.toLocaleString('en-US')} valueText={`${homes.toLocaleString('en-US')} homes`} />
              {flexCalc.devices.map((d) => (
                <Slider
                  key={d.id}
                  label={`Homes with ${d.label.toLowerCase()}`}
                  value={shares[d.id]}
                  min={0}
                  max={100}
                  onChange={(v) => setShares((s) => ({ ...s, [d.id]: v }))}
                  display={`${shares[d.id]}%`}
                  valueText={`${shares[d.id]} percent`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col rounded-card bg-paper p-6 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-8">
            <p className="text-[14px] text-muted">Shiftable at the evening peak</p>
            <p className="mt-2 text-[64px] font-medium leading-none tracking-[-0.05em] tabular sm:text-[80px]" aria-live="polite">
              {fmt(total)}
              <span className="ml-2 text-[28px] tracking-[-0.03em] text-muted">MW</span>
            </p>
            <div className="round mt-8 flex h-3 overflow-hidden rounded-full bg-mint-3" aria-hidden>
              {parts.map((p, i) => (
                <div key={p.id} className={cx('h-full transition-[width] duration-300', ['bg-ink', 'bg-leaf', 'bg-volt-2'][i])} style={{ width: total ? `${(p.mw / total) * 100}%` : 0 }} />
              ))}
            </div>
            <dl className="mt-5 space-y-2.5">
              {parts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between text-[15px]">
                  <dt className="flex items-center gap-2.5 text-ink-2">
                    <span className={cx('round size-2.5 rounded-full', ['bg-ink', 'bg-leaf', 'bg-volt-2'][i])} aria-hidden />
                    {p.label}
                  </dt>
                  <dd className="font-medium tabular">{fmt(p.mw)} MW</dd>
                </div>
              ))}
            </dl>
            <p className="mt-auto pt-8 text-[13px] leading-5 text-muted">
              Assumes typical availability: {flexCalc.devices.map((d) => `${d.kw} kW per ${d.label.toLowerCase().replace(/s$/, '')}`).join(', ')}.
            </p>
          </div>
        </Card>
      </Container>
    </section>
  )
}
