import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { Photo } from '../components/Photo'
import { CTA, IMAGES } from '../content'

export function Cta() {
  return (
    <section className="pb-24">
      <Container>
        <div className="depth relative isolate overflow-hidden rounded-[28px] px-6 py-20 text-center sm:px-12">
          <Photo image={IMAGES.arcs} className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(5_11_13/0.55),rgb(5_11_13/0.9))]" />
          <h2 className="mx-auto max-w-[680px] text-balance text-[34px] leading-[1.08] font-normal tracking-[-0.025em] text-stage sm:text-[52px]">{CTA.title}</h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[17px] text-[#b4c2bf]">{CTA.sub}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink href={CTA.primary.href} size="lg">
              {CTA.primary.label}
            </ButtonLink>
            <ButtonLink href={CTA.secondary.href} variant="dark" size="lg">
              {CTA.secondary.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
