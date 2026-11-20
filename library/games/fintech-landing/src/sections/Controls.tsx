import { AnimatePresence, motion } from 'motion/react'
import { Lock, Snowflake, Unlock } from 'lucide-react'
import { useState } from 'react'

import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { CreditCard } from '../components/CreditCard'
import type { CardTheme } from '../components/CreditCard'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Slider } from '../components/Slider'
import { Toggle } from '../components/Toggle'
import { controls, hero } from '../content'
import { cx } from '../lib/cx'

const swatch: Record<CardTheme, string> = {
  graphite: 'linear-gradient(135deg,#4a4a4c,#161617)',
  violet: 'linear-gradient(135deg,#7d61ff,#2a1590)',
  pearl: 'linear-gradient(135deg,#ffffff,#c8cbd6)',
}

const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

export function Controls() {
  const [theme, setTheme] = useState<CardTheme>('graphite')
  const [frozen, setFrozen] = useState(false)
  const [limit, setLimit] = useState(controls.limit.initial)
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(controls.toggles.map((t) => [t.id, t.on])),
  )
  const spent = 3284.32
  const pct = Math.min(100, (spent / limit) * 100)

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="dots pointer-events-none absolute inset-0" />
      <Container className="relative">
        <SectionHeading eyebrow={controls.eyebrow} title={controls.title} body={controls.body} />

        <div className="mt-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
          {/* card preview */}
          <Reveal className="flex flex-col items-center gap-8">
            <div className="relative flex w-full max-w-[450px] justify-center">
              <div className="shrink-0 origin-top max-[500px]:scale-[0.76] max-[500px]:-mb-[70px] max-[400px]:scale-[0.7] max-[400px]:-mb-[88px]">
                <CreditCard data={hero.card} theme={theme} frozen={frozen} tilt />
              </div>
            </div>
            <Card radius="card-sm" padding="none" className="w-full max-w-[450px] p-2">
              {controls.recent.map((r, i) => {
                const declined = frozen && r.amount < 0 && i === 0
                return (
                  <div key={r.merchant} className="flex items-center gap-3 rounded-[14px] px-3 py-2.5">
                    <span className="grid size-9 place-items-center rounded-[10px] bg-white/[0.06] text-[13px] font-semibold">
                      {r.merchant[0]}
                    </span>
                    <div className="leading-tight">
                      <div className="text-[14px] font-medium">{r.merchant}</div>
                      <div className="text-[12px] text-faint">{declined ? 'Declined: card frozen' : r.category}</div>
                    </div>
                    <span
                      className={cx(
                        'ml-auto text-[14px] tabular transition-colors',
                        declined ? 'text-faint line-through' : r.amount > 0 ? 'text-[#4ade80]' : 'text-white',
                      )}
                    >
                      {r.amount > 0 ? '+' : '−'}
                      {money(Math.abs(r.amount))}
                    </span>
                  </div>
                )
              })}
            </Card>
          </Reveal>

          {/* control panel */}
          <Reveal delay={0.1}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] text-faint">Studio Seven · Virtual</div>
                  <div className="mt-1 font-display text-[22px] font-semibold tracking-[-0.03em]">Card settings</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFrozen((f) => !f)}
                  aria-pressed={frozen}
                  className={cx(
                    'inline-flex h-10 items-center gap-2 rounded-[12px] px-4 text-[14px] font-medium transition-colors active:scale-[0.97]',
                    frozen ? 'bg-[#bfe3ff] text-[#0b2a44]' : 'bg-white/[0.06] text-white hover:bg-white/[0.1]',
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={frozen ? 'u' : 'f'}
                      initial={{ opacity: 0, rotate: -60 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 60 }}
                      transition={{ duration: 0.18 }}
                    >
                      {frozen ? <Unlock className="size-4" /> : <Snowflake className="size-4" />}
                    </motion.span>
                  </AnimatePresence>
                  {frozen ? 'Unfreeze' : 'Freeze card'}
                </button>
              </div>

              <div className="mt-7">
                <Slider
                  label="Monthly limit"
                  min={controls.limit.min}
                  max={controls.limit.max}
                  step={controls.limit.step}
                  value={limit}
                  onChange={setLimit}
                  format={(n) => <CountUp value={n} from={n} prefix="$" duration={0.4} className="text-[22px]" />}
                />
                <div className="mt-4 rounded-[14px] bg-white/[0.04] p-3.5">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-muted">Spent this month</span>
                    <span className="tabular">
                      {money(spent)} <span className="text-faint">/ {money(limit)}</span>
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                    <motion.div
                      className={cx('h-full rounded-full', pct > 80 ? 'bg-coin' : 'bg-violet')}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col divide-y divide-white/[0.06]">
                {controls.toggles.map((t) => (
                  <div key={t.id} className={cx('flex items-center gap-4 py-3.5 transition-opacity', frozen && 'opacity-40')}>
                    <div className="leading-tight">
                      <div className="text-[15px] font-medium">{t.label}</div>
                      <div className="mt-0.5 text-[13px] text-faint">{t.hint}</div>
                    </div>
                    <Toggle
                      className="ml-auto"
                      label={t.label}
                      checked={!frozen && toggles[t.id]}
                      disabled={frozen}
                      onChange={(v) => setToggles((s) => ({ ...s, [t.id]: v }))}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-[14px] text-muted">Card design</span>
                <div className="flex gap-2" role="radiogroup" aria-label="Card design">
                  {controls.themes.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      role="radio"
                      aria-checked={theme === th.id}
                      aria-label={th.label}
                      onClick={() => setTheme(th.id)}
                      className={cx(
                        'relative size-10 sm:size-8 rounded-full ring-2 ring-offset-2 ring-offset-surface transition-[box-shadow,transform] before:absolute before:-inset-1 before:content-[""] hover:scale-110 round',
                        theme === th.id ? 'ring-violet-text' : 'ring-transparent',
                      )}
                      style={{ background: swatch[th.id] }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-5 flex items-center gap-2 text-[12px] text-faint">
                <Lock className="size-3.5" aria-hidden /> Changes apply instantly to every terminal.
              </p>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
