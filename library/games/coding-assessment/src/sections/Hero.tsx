import { FingerprintBadge, SparkBadge, StageLights } from '../components/HeroGlyphs'
import { ButtonLink } from '../components/Button'
import { Photo } from '../components/Photo'
import { HERO, IMAGES } from '../content'

/*
  The stage: a two-line headline over faint ruled guides, the human and AI
  glyphs inline, and the conductor photograph rising out of the dark below.
*/
export function Hero() {
  return (
    <section className="relative isolate -mt-[76px] overflow-hidden pt-[76px]" aria-labelledby="hero-title">
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,#0f3a35_0%,#08201f_38%,#050b0d_75%)]" />
      <div aria-hidden className="absolute inset-x-0 top-[46%] bottom-0 -z-10 sm:top-[49%]">
        <Photo image={IMAGES.hero} eager className="h-full w-full object-cover object-[50%_40%] brightness-[0.82] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_26%,#000_100%)]" />
        <StageLights className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgb(5_11_13/0.7),transparent_70%)]" />
      </div>
      <div aria-hidden className="noise absolute inset-0 -z-10" />

      <div className="mx-auto flex min-h-[760px] max-w-[1440px] flex-col items-center px-4 pt-12 pb-[300px] text-center sm:min-h-[824px] sm:pt-[52px] sm:pb-[360px]">
        <h1 id="hero-title" className="relative text-[40px] leading-[1.02] font-normal tracking-[-0.035em] sm:text-[60px] lg:text-[76px]">
          <span aria-hidden className="pointer-events-none absolute top-[0.92em] left-1/2 h-px w-[118%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/14 to-transparent" />
          <span aria-hidden className="pointer-events-none absolute top-[2.02em] left-1/2 h-px w-[96%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent" />
          <span className="text-stage block animate-rise">{HERO.lineOne}</span>
          <span className="mt-1 flex animate-rise items-center justify-center gap-[0.18em] [animation-delay:120ms] sm:mt-2">
            <span className="text-stage">{HERO.lead}</span>
            <FingerprintBadge className="size-[1.18em]" />
            <span className="font-script text-[1.24em] leading-none font-medium tracking-normal text-white">{HERO.human}</span>
            <span className="ml-[0.08em] text-[#dfe7e4]">+</span>
            <SparkBadge className="size-[0.98em]" />
            <span className="text-stage">{HERO.ai}</span>
          </span>
        </h1>
        <p className="mt-5 max-w-[470px] animate-rise text-[16px] leading-[1.55] text-[#a7b6b3] [animation-delay:220ms] sm:text-[18px]">{HERO.sub}</p>
        <ButtonLink href={HERO.cta.href} variant="dark" size="lg" className="mt-8 animate-rise [animation-delay:320ms]">
          {HERO.cta.label}
        </ButtonLink>
      </div>
    </section>
  )
}
