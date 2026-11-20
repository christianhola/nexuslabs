import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { cta, images } from '../content'

/* Closing call to action over the painted meadow path. */
export function Cta() {
  return (
    <section aria-labelledby="cta-h" className="pb-20">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[28px] px-6 pb-56 pt-16 text-center sm:px-12 sm:pb-72 sm:pt-20">
            <img src={images.meadowPath} alt="" className="absolute inset-0 -z-10 size-full object-cover object-[center_70%]" loading="lazy" decoding="async" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(250_246_236/0.82),rgb(250_246_236/0.5)_40%,transparent_70%)]" />
            <h2 id="cta-h" className="mx-auto max-w-[620px] text-balance font-display text-[34px] font-bold leading-[1.04] tracking-[-0.045em] text-ink sm:text-[50px]">
              {cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[480px] text-balance text-[16px] leading-relaxed text-[#262b25]">{cta.lede}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-2.5">
              <Button href={cta.primary.href} arrow>
                {cta.primary.label}
              </Button>
              <Button href={cta.secondary.href} variant="dark">
                {cta.secondary.label}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
