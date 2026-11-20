import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { BatteryCharging, Car, Fan } from 'lucide-react'

import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Notice } from '../components/Notice'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Slider } from '../components/Slider'
import { scheduler } from '../content'
import { plan } from '../lib/schedule'
import type { Goal } from '../lib/schedule'

type DeviceId = (typeof scheduler.devices)[number]['id']
const icons: Record<string, typeof Car> = { ev: Car, heatpump: Fan, battery: BatteryCharging }
const hourLabel = (h: number) => `${String(h % 24).padStart(2, '0')}:00`

export function Scheduler() {
  const [deviceId, setDeviceId] = useState<DeviceId>('ev')
  const device = scheduler.devices.find((d) => d.id === deviceId)!
  const [needs, setNeeds] = useState<Record<string, number>>(() => Object.fromEntries(scheduler.devices.map((d) => [d.id, d.need])))
  const [ready, setReady] = useState<Record<string, number>>(() => Object.fromEntries(scheduler.devices.map((d) => [d.id, d.readyBy])))
  const [goal, setGoal] = useState<Goal>('price')
  const need = needs[deviceId]
  const readyBy = ready[deviceId]

  const result = useMemo(
    () => plan({ kw: device.kw, need, readyBy, goal, startHour: scheduler.startHour, prices: scheduler.prices, carbon: scheduler.carbon }),
    [device.kw, need, readyBy, goal],
  )
  const series = goal === 'price' ? scheduler.prices : scheduler.carbon
  const max = Math.max(...series)
  const fmt = (eur: number) => `€${eur.toFixed(2)}`

  return (
    <section aria-labelledby="scheduler-title" className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 [&>*]:min-w-0">
          <Reveal>
            <SectionHeading id="scheduler-title" eyebrow={scheduler.eyebrow} title={scheduler.title} body={scheduler.body} />
            <div className="mt-8 space-y-6">
              <Segmented
                label="Device"
                value={deviceId}
                onChange={setDeviceId}
                options={scheduler.devices.map((d) => {
                  const Icon = icons[d.id]
                  return { value: d.id, label: (<><Icon className="size-4" aria-hidden />{d.label}</>) }
                })}
                className="max-w-full flex-wrap"
              />
              <Slider
                label={device.unit}
                value={need}
                min={2}
                max={device.needMax}
                onChange={(v) => setNeeds((n) => ({ ...n, [deviceId]: v }))}
                display={`${need} kWh`}
                valueText={`${need} kilowatt hours`}
              />
              <Slider
                label="Ready by"
                value={(readyBy - scheduler.startHour + 24) % 24 || 24}
                min={3}
                max={24}
                onChange={(v) => setReady((r) => ({ ...r, [deviceId]: (scheduler.startHour + v) % 24 }))}
                display={hourLabel(readyBy)}
                valueText={hourLabel(readyBy)}
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[15px] font-medium">Tonight’s plan</p>
                  <p className="text-[13.5px] text-muted">
                    {goal === 'price' ? 'Day-ahead price, cents per kWh' : 'Grid carbon, g CO₂ per kWh'}
                  </p>
                </div>
                <Segmented
                  label="Optimise for"
                  size="sm"
                  value={goal}
                  onChange={setGoal}
                  options={[
                    { value: 'price', label: 'Lowest price' },
                    { value: 'carbon', label: 'Lowest carbon' },
                  ]}
                />
              </div>

              <div
                role="img"
                aria-label={`Charging in ${result.hours.length} hours: ${result.hours.map((h) => hourLabel(scheduler.startHour + h)).join(', ')}. Ready by ${hourLabel(readyBy)}.`}
                className="mt-6"
              >
                <div className="relative flex h-[200px] items-end gap-[3px] sm:gap-1">
                  {series.map((v, i) => {
                    const fill = result.fill[i] ?? 0
                    const inWindow = i < result.window
                    return (
                      <div key={i} className="relative flex h-full flex-1 items-end">
                        <div
                          className="relative w-full overflow-hidden rounded-t-[5px] bg-mint-3 transition-[height] duration-500"
                          style={{ height: `${(v / max) * 100}%`, opacity: inWindow ? 1 : 0.4 }}
                        >
                          <motion.div
                            className="absolute inset-x-0 bottom-0 bg-ink"
                            initial={false}
                            animate={{ height: `${fill * 100}%` }}
                            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    )
                  })}
                  <div
                    className="pointer-events-none absolute inset-y-0 w-px border-l border-dashed border-ink/50"
                    style={{ left: `${(result.window / 24) * 100}%` }}
                    aria-hidden
                  >
                    <span className="absolute -top-1 left-1.5 whitespace-nowrap rounded-pill bg-ink px-2 py-0.5 text-[11.5px] font-medium text-mint">
                      Ready {hourLabel(readyBy)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-[12px] text-muted tabular" aria-hidden>
                  {[0, 6, 12, 18].map((i) => (
                    <span key={i}>{hourLabel(scheduler.startHour + i)}</span>
                  ))}
                  <span>{hourLabel(scheduler.startHour + 23)}</span>
                </div>
              </div>

              {result.short > 0 && (
                <Notice tone="error" className="mt-5" title="Not enough time to finish">
                  Even charging every hour before {hourLabel(readyBy)}, {result.short.toFixed(1)} kWh would be missing. Move the ready time later.
                </Notice>
              )}

              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-control bg-line sm:grid-cols-4">
                {[
                  { k: 'Smart schedule', v: fmt(result.smartCost) },
                  { k: 'Charge now', v: fmt(result.nowCost) },
                  { k: 'Saved', v: `${result.saving}%`, hi: true },
                  { k: 'CO₂ avoided', v: `${result.co2Saved.toFixed(1)} kg` },
                ].map((s) => (
                  <div key={s.k} className="bg-paper p-4">
                    <dt className="text-[13px] text-muted">{s.k}</dt>
                    <dd className={`mt-1 text-[22px] font-medium tracking-[-0.03em] tabular ${s.hi ? 'text-leaf' : ''}`}>{s.v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
