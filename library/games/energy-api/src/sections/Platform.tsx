import { ArrowUpRight } from 'lucide-react'

import { Container } from '../components/Container'
import { LogoMark } from '../components/Logo'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { categories, makers, platform } from '../content'
import { categoryIcon } from '../lib/icons'
import { Link } from '../lib/router'

const left = categories.slice(0, 3)
const right = categories.slice(3)

/** Devices on both sides feed one hub: the data-flow picture of the platform. */
function HubDiagram() {
  const ys = [60, 160, 260]
  return (
    <div className="relative rounded-card bg-mint-2 p-6 sm:p-8" aria-hidden>
      <svg viewBox="0 0 560 320" className="w-full">
        {ys.map((y) => (
          <g key={y}>
            <path d={`M130 ${y} C 210 ${y}, 220 160, 250 160`} fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" />
            <path d={`M130 ${y} C 210 ${y}, 220 160, 250 160`} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-flow" />
            <path d={`M430 ${y} C 350 ${y}, 340 160, 310 160`} fill="none" stroke="var(--color-line-strong)" strokeWidth="1.5" />
            <path d={`M430 ${y} C 350 ${y}, 340 160, 310 160`} fill="none" stroke="var(--color-ink)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-flow" />
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 p-6 sm:p-8">
        <div className="relative h-full">
          {[left, right].map((side, s) =>
            side.map((c, i) => {
              const Icon = categoryIcon[c.id]
              return (
                <div
                  key={c.id}
                  className="absolute flex h-11 w-[23%] -translate-y-1/2 items-center justify-center gap-2 sm:justify-start rounded-pill bg-paper px-3 text-[13px] font-medium shadow-card"
                  style={{ top: `${(ys[i] / 320) * 100}%`, [s ? 'right' : 'left']: 0 }}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden truncate sm:inline">{c.short}</span>
                </div>
              )
            }),
          )}
          <div className="absolute left-1/2 top-1/2 grid size-[18%] min-w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-card-sm bg-ink text-volt shadow-float">
            <LogoMark className="size-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Platform() {
  return (
    <section id="platform" aria-labelledby="platform-title" className="py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading id="platform-title" eyebrow={platform.eyebrow} title={platform.title} body={platform.body} />
          </Reveal>
          <Reveal delay={0.1}>
            <HubDiagram />
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const Icon = categoryIcon[c.id]
            const n = makers.filter((m) => m.category === c.id && m.status !== 'soon').length
            return (
              <li key={c.id}>
                <Reveal delay={i * 0.04} className="h-full">
                  <Link
                    href={`/devices?category=${c.id}`}
                    className="group flex h-full flex-col rounded-card bg-paper p-6 shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_var(--color-line-strong),var(--shadow-card)]"
                  >
                    <div className="flex items-start justify-between">
                      <span className="grid size-11 place-items-center rounded-control-sm bg-mint-2">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <ArrowUpRight className="size-5 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
                    </div>
                    <h3 className="mt-6 text-[19px] font-medium tracking-[-0.02em]">{c.label}</h3>
                    <p className="mt-1.5 text-[15px] leading-6 text-muted">{c.blurb}</p>
                    <p className="mt-5 text-[13.5px] font-medium text-leaf">{n} brands live</p>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
