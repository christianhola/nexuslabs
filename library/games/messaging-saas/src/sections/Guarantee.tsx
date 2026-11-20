import { ShieldCheck } from 'lucide-react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { guarantee, images } from '../content'

/** The closing call to action: the 20% guarantee over the machine render. */
export function Guarantee() {
  return (
    <section aria-labelledby="g-title" className="py-20 sm:py-28">
      <Container>
        <div className="grain relative isolate overflow-hidden rounded-panel border border-white/10 bg-night px-6 py-14 sm:px-14 sm:py-20">
          <img src={images.machine} alt="" loading="lazy" className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover object-right opacity-40 lg:w-[62%] lg:opacity-90" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0c1230_35%,rgb(12_18_48/0.4)_70%,transparent)]" />
          <div className="grid max-w-[620px] gap-6">
            <p className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-saffron">
              <ShieldCheck aria-hidden className="size-4" /> {guarantee.eyebrow}
            </p>
            <h2 id="g-title" className="font-display text-[36px] font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-[52px]">
              {guarantee.title}
            </h2>
            <p className="text-[17px] leading-[1.6] text-soft">{guarantee.body}</p>
            <ul className="grid gap-2 text-[15px] text-soft">
              {guarantee.points.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-saffron" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button href="/signup" size="lg" arrow>
                Get started
              </Button>
              <Button href="/contact" size="lg" variant="outline">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
