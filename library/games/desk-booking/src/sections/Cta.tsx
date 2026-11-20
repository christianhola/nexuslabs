import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { cta } from '../content'

export function Cta() {
  return (
    <section className="px-4 pb-24 sm:px-9">
      <Reveal className="relative mx-auto max-w-[1120px] overflow-hidden rounded-xl bg-navy px-6 py-16 text-center sm:px-12">
        <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.18]" preserveAspectRatio="none" viewBox="0 0 400 200">
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 12 }, (_, c) => (
              <rect key={`${r}-${c}`} x={c * 34 + 4} y={r * 34 + 6} width="26" height="18" rx="3" fill={(r * 7 + c * 3) % 5 === 0 ? '#f24e1e' : '#3a4363'} />
            )),
          )}
        </svg>
        <div className="relative">
          <h2 className="text-[30px] leading-[38px] font-bold tracking-[-0.035em] text-white sm:text-h2 sm:leading-[48px] text-balance">{cta.title}</h2>
          <p className="mt-3 text-[17px] text-[#c4c9d6]">{cta.sub}</p>
          <ButtonLink href="/app" size="lg" className="mt-8" iconRight={<ArrowRight className="size-[18px]" aria-hidden />}>
            {cta.button}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
