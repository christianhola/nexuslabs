import { ButtonLink, TextLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { CheckList, Chip, Slider } from '../components/Controls'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/Typography'
import { applications, photos } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/store'
import { Mission } from '../sections/Mission'

const photoFor = {
  shipping: { src: photos.seaCargo, alt: 'A container ship under way on the open ocean at dusk' },
  defense: { src: photos.seaFrigate, alt: 'A naval frigate at sea at dusk' },
  offshore: { src: photos.seaOffshore, alt: 'An offshore research platform among polar sea ice' },
} as const
const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 })

export function Applications() {
  const calc = applications.calculator
  const [vesselId, setVesselId] = useStored('calc-vessel', calc.vessels[1].id)
  const [miles, setMiles] = useStored('calc-miles', 11000)
  const vessel = calc.vessels.find((v) => v.id === vesselId) ?? calc.vessels[0]
  const days = miles / (calc.knots * 24)
  const fuel = days * vessel.tonnesPerDay
  const cost = fuel * calc.fuelUsdPerTonne
  const co2 = fuel * calc.co2PerTonne

  return (
    <>
      <PageHeader
        eyebrow={applications.eyebrow}
        title={applications.title}
        body={applications.body}
        aside={
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute inset-x-[10%] inset-y-[20%] -z-10 rounded-full bg-plasma/25 blur-[70px]" aria-hidden />
            <img src={photos.shipCargo} alt="Render of a container ship with a Tidewell unit glowing in its engine room" width={1100} height={384} className="w-full animate-float" />
          </div>
        }
      />

      <section aria-label="Markets" className="py-16 sm:py-24">
        <Container size="xl" className="flex flex-col gap-6">
          {applications.segments.map((s, i) => (
            <Reveal key={s.id}>
              <Card id={s.id} tone={i === 1 ? 'steel' : 'plain'} as="article" className="grid scroll-mt-24 items-center gap-8 p-7 sm:p-10 lg:grid-cols-2 lg:p-14">
                <div className={cx('flex flex-col items-start gap-4', i % 2 === 1 && 'lg:order-2')}>
                  <h2 className="display text-[34px] sm:text-[44px]">{s.title}</h2>
                  <p className="max-w-[520px] text-pretty text-[17px] leading-[1.55] text-muted">{s.body}</p>
                  <CheckList items={s.points} className="mt-2" />
                  <TextLink href={`/early-access?segment=${s.id}`} className="mt-2">
                    Get early access
                  </TextLink>
                </div>
                <div className="relative aspect-[3/2] overflow-hidden rounded-[24px] bg-[#0a1228]">
                  <img src={photoFor[s.id].src} alt={photoFor[s.id].alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </Card>
            </Reveal>
          ))}
        </Container>
      </section>

      <section id="calculator" aria-labelledby="calc-title" className="scroll-mt-20 py-16 sm:py-24">
        <Container size="xl">
          <Reveal>
            <SectionHeading id="calc-title" title={calc.title} body={calc.body} size="md" />
          </Reveal>
          <Card className="mt-12 grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
            <div className="flex flex-col gap-8">
              <fieldset>
                <legend className="mb-3 text-[14px] text-muted">Vessel</legend>
                <div className="flex flex-wrap gap-2">
                  {calc.vessels.map((v) => (
                    <Chip key={v.id} selected={v.id === vessel.id} onClick={() => setVesselId(v.id)}>
                      {v.label}
                    </Chip>
                  ))}
                </div>
              </fieldset>
              <Slider label="Route length" value={miles} min={500} max={20000} step={250} onChange={setMiles} format={(n) => `${nf.format(n)} nm`} />
              <p className="text-[13px] leading-relaxed text-faint">
                At {calc.knots} knots, {nf.format(vessel.tonnesPerDay)} t of fuel a day, ${calc.fuelUsdPerTonne} a tonne and {calc.co2PerTonne} t of CO₂ per tonne burned. Illustrative figures.
              </p>
            </div>
            <div className="flex flex-col gap-3">
            <dl className="grid grid-cols-2 gap-3" aria-live="polite">
              {[
                { label: 'Days at sea', value: days.toFixed(1) },
                { label: 'Fuel burned', value: `${nf.format(fuel)} t` },
                { label: 'Fuel cost', value: usd.format(cost) },
                { label: 'CO₂ emitted', value: `${nf.format(co2)} t` },
              ].map((r, i) => (
                <div key={r.label} className={cx('depth relative flex flex-col justify-between gap-6 rounded-[22px] p-5', i === 3 ? 'bg-[linear-gradient(160deg,#c24a12,#6e1f05)]' : 'bg-surface-2')}>
                  <dt className={cx('text-[14px]', i === 3 ? 'text-white/85' : 'text-muted')}>{r.label}</dt>
                  <dd className="text-[30px] font-medium tabular-nums tracking-[-0.03em] sm:text-[36px]">{r.value}</dd>
                </div>
              ))}
            </dl>
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-plasma/10 p-5">
                <p className="text-[15px] text-soft">With a Tidewell unit: 0 t fuel, 0 t CO₂.</p>
                <ButtonLink href="/early-access" size="sm">
                  Reserve a slot
                </ButtonLink>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      <Mission />
    </>
  )
}
