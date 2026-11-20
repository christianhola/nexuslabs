import { Check } from 'lucide-react'
import type { ReactNode } from 'react'

import { images } from '../content'

/* Two-column layout for sign up and log in: the form, and the meadow with a short promise. */
export function AuthShell({ title, lede, children, perks, quote }: { title: string; lede: string; children: ReactNode; perks?: readonly string[]; quote?: string }) {
  return (
    <section className="bg-[linear-gradient(180deg,#c6dcec,var(--color-paper)_420px)] px-5 pb-20 pt-28 sm:px-8 sm:pt-32" aria-labelledby="auth-h">
      <div className="mx-auto grid max-w-[1140px] gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div className="rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-raised sm:p-10">
          <h1 id="auth-h" className="font-display text-[34px] font-bold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[40px]">
            {title}
          </h1>
          <p className="mt-2 text-[15.5px] leading-relaxed text-muted">{lede}</p>
          <div className="mt-8">{children}</div>
        </div>
        <div className="relative isolate hidden min-h-[560px] overflow-hidden rounded-[var(--radius-card)] p-10 lg:flex lg:flex-col lg:justify-end">
          <img src={images.meadowPath} alt="" className="absolute inset-0 -z-10 size-full object-cover" loading="lazy" decoding="async" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(18_21_17/0.78),rgb(18_21_17/0.2)_60%,transparent)]" />
          {quote ? <p className="max-w-[420px] font-display text-[24px] font-semibold leading-snug tracking-[-0.02em] text-white">{quote}</p> : null}
          {perks ? (
            <ul className="mt-6 flex flex-col gap-2.5">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-[15px] text-white">
                  <span className="round grid size-5 place-items-center rounded-full bg-lime text-ink">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
