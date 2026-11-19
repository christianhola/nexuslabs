import { Check, Minus } from 'lucide-react'
import { useState } from 'react'

import { Accordion } from '../components/Accordion'
import { ButtonLink } from '../components/Button'
import { Checkbox, ChoiceChips } from '../components/Field'
import { Label } from '../components/Label'
import { PackageCard } from '../components/PackageCard'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { ADDONS, COMPARE, PACKAGES, SERVICES_PAGE, type PackageId } from '../content'
import { cx } from '../lib/cx'
import { money } from '../lib/format'

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto size-4 text-olive" strokeWidth={2.25} aria-label="Included" />
  if (v === false) return <Minus className="mx-auto size-4 text-line-strong" strokeWidth={2} aria-label="Not included" />
  return <span className="text-[14px] text-ink-2">{v}</span>
}

function Compare() {
  return (
    <section aria-labelledby="compare-title" className="container-page pb-24">
      <div className="border-t border-ink pt-5">
        <Label number="02">{COMPARE.title}</Label>
      </div>
      <h2 id="compare-title" className="sr-only">
        {COMPARE.title}
      </h2>
      <div className="mt-8 overflow-x-auto" tabIndex={0} role="region" aria-label="Package comparison table">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className="w-[34%] py-3 text-[13px] font-medium text-muted">
                Included
              </th>
              {PACKAGES.map((p) => (
                <th key={p.id} scope="col" className="py-3 text-center text-[15px] font-medium tracking-[-0.02em]">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE.rows.map((row) => (
              <tr key={row.label} className="border-b border-line">
                <th scope="row" className="py-3.5 text-[15px] font-normal">
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className="py-3.5 text-center">
                    <Cell v={v} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Estimator() {
  const [pkg, setPkg] = useState<PackageId>('room')
  const [rooms, setRooms] = useState(2)
  const [addons, setAddons] = useState<string[]>([])
  const p = PACKAGES.find((x) => x.id === pkg)!
  const perRoom = pkg === 'room'
  const base = perRoom ? p.price * rooms : pkg === 'home' ? Math.max(p.price, rooms * 2600) : p.price
  const extras = ADDONS.filter((a) => addons.includes(a.id)).reduce((sum, a) => sum + a.price * (pkg === 'consult' ? 1 : rooms), 0)
  const total = base + extras

  return (
    <section aria-labelledby="estimate-title" className="bg-card py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Label number="03">{SERVICES_PAGE.estimatorTitle}</Label>
          <h2 id="estimate-title" className="font-display mt-5 text-[clamp(2.5rem,4.6vw,4.5rem)] text-balance">
            {SERVICES_PAGE.estimatorTitle}
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-snug text-ink-2">{SERVICES_PAGE.estimatorBody}</p>
        </div>
        <div className="flex flex-col gap-8 md:col-span-7">
          <ChoiceChips
            label="Package"
            name="est-package"
            options={PACKAGES.map((x) => ({ value: x.id, label: x.name }))}
            value={pkg}
            onChange={(v) => setPkg(v as PackageId)}
          />
          <div className={cx(pkg === 'consult' && 'opacity-40')}>
            <label htmlFor="est-rooms" className="flex items-baseline justify-between text-[14px] font-medium text-ink-2">
              Rooms
              <output htmlFor="est-rooms" className="text-[28px] font-medium tracking-[-0.04em] text-ink tabular-nums">
                {pkg === 'consult' ? 'Up to 3' : rooms}
              </output>
            </label>
            <input
              id="est-rooms"
              type="range"
              min={1}
              max={12}
              value={rooms}
              disabled={pkg === 'consult'}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="mt-2 h-10 w-full cursor-pointer accent-ink disabled:cursor-not-allowed"
            />
          </div>
          <fieldset>
            <legend className="mb-3 text-[14px] font-medium text-ink-2">Extras</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ADDONS.map((a) => (
                <Checkbox
                  key={a.id}
                  label={`${a.name}, ${money(a.price)}${pkg === 'consult' ? '' : ' per room'}`}
                  description={a.note}
                  checked={addons.includes(a.id)}
                  onChange={() => setAddons((s) => (s.includes(a.id) ? s.filter((x) => x !== a.id) : [...s, a.id]))}
                />
              ))}
            </div>
          </fieldset>
          <div className="flex flex-col gap-5 border-t border-ink pt-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[14px] text-muted">Estimated design fee</p>
              <p className="text-[clamp(3rem,6vw,5rem)] leading-none font-medium tracking-[-0.055em] tabular-nums" aria-live="polite">
                {money(total)}
              </p>
            </div>
            <ButtonLink to={`/book?package=${pkg}`} icon size="lg">
              Book {p.name.toLowerCase()}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Services() {
  return (
    <>
      <PageHeader label={SERVICES_PAGE.label} title={SERVICES_PAGE.title} intro={SERVICES_PAGE.intro} />
      <section aria-label="Packages" className="container-page pb-24">
        <div className="border-t border-ink pt-5">
          <Label number="01">Packages</Label>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <PackageCard pkg={p} featured={p.id === 'room'} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>
      <Compare />
      <Estimator />
      <section aria-labelledby="faq-title" className="container-page grid gap-10 py-24 md:grid-cols-12">
        <div className="md:col-span-4">
          <Label number="04">{SERVICES_PAGE.faqTitle}</Label>
          <h2 id="faq-title" className="font-display mt-5 text-[clamp(2.5rem,4.6vw,4.5rem)]">
            {SERVICES_PAGE.faqTitle}
          </h2>
        </div>
        <Accordion items={SERVICES_PAGE.faq} className="md:col-span-7 md:col-start-6" />
      </section>
    </>
  )
}
