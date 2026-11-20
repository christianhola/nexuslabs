import type { ReactNode } from 'react'

import { Container } from '../components/Container'
import { trusted } from '../content'

/*
  Fictional customer wordmarks, each drawn in its own type and colour like a
  real logo wall. Replace with your customers' logos (as SVG) when you have
  permission to show them.
*/
const marks: Record<(typeof trusted.logos)[number], { cls: string; glyph?: ReactNode }> = {
  Fernhill: { cls: 'font-display text-[25px] font-medium tracking-[-0.03em] text-[#2f6b3a]', glyph: <svg viewBox="0 0 24 24" className="size-6"><path d="M12 2c4 4 6 8 0 20C6 10 8 6 12 2z" fill="#4c9a59" /></svg> },
  northbeam: { cls: 'font-sans text-[24px] font-bold tracking-[-0.04em] text-[#1d4ed8]', glyph: <svg viewBox="0 0 24 24" className="size-6"><path d="M4 20 12 4l8 16z" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinejoin="round" /></svg> },
  'Calder Health': { cls: 'font-display text-[23px] font-semibold tracking-[-0.02em] text-[#0f766e]', glyph: <svg viewBox="0 0 24 24" className="size-6"><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="#14b8a6" /></svg> },
  kilnworks: { cls: 'font-mono text-[22px] font-medium tracking-[-0.02em] text-ink [&>span]:border-2 [&>span]:border-ink [&>span]:px-1', glyph: undefined },
  Brightpath: { cls: 'font-display text-[24px] font-medium tracking-[-0.02em] text-[#7c3aed]', glyph: <svg viewBox="0 0 24 24" className="size-6"><circle cx="12" cy="12" r="5" fill="#a78bfa" /><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4 4l3 3M17 17l3 3M20 4l-3 3M7 17l-3 3" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" /></svg> },
  'loop&co': { cls: 'font-sans text-[27px] font-extrabold tracking-[-0.05em] text-ink [&_em]:not-italic [&_em]:text-flame-ink', glyph: undefined },
}

export function TrustedBy() {
  return (
    <section aria-labelledby="trusted-title" className="pb-20 pt-4">
      <Container>
        <h2 id="trusted-title" className="text-center text-[14.5px] text-muted">
          {trusted.label}
        </h2>
        <ul className="mt-9 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:flex lg:justify-between">
          {trusted.logos.map((name) => {
            const m = marks[name]
            return (
              <li key={name} className="flex items-center justify-center gap-2 lg:justify-start">
                {m.glyph ? <span aria-hidden>{m.glyph}</span> : null}
                <span className={m.cls}>
                  {name === 'kilnworks' ? <span>kiln</span> : null}
                  {name === 'kilnworks' ? 'works' : name === 'loop&co' ? <>loop<em>&amp;</em>co</> : name}
                </span>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
