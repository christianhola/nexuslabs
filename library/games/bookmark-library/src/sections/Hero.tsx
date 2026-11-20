import { Sparkles } from 'lucide-react'

import { EmailCapture } from '../components/EmailCapture'
import { Eyebrow } from '../components/SectionHeading'
import { BRAND, HERO } from '../content'
import { HeroDemo } from './HeroDemo'

export function Hero() {
  const [line1, word, rest] = HERO.title
  return (
    <section aria-labelledby="hero-title" className="pt-[56px] sm:pt-[60px]">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center px-5 text-center sm:px-8">
        <div className="animate-rise">
          <Eyebrow icon={<Sparkles aria-hidden className="size-4" strokeWidth={2.2} />}>{BRAND.badge}</Eyebrow>
        </div>
        <h1 id="hero-title" className="mt-6 text-[clamp(48px,6.05vw,92px)] leading-[1.02] font-bold tracking-[-0.042em] text-ink">
          <span className="block animate-rise [animation-delay:60ms]">{line1}</span>
          <span className="block animate-rise [animation-delay:140ms]">
            <span className="relative inline-block px-[0.2em] pb-[0.06em]">
              <span aria-hidden className="absolute inset-0 animate-swipe rounded-[0.22em] bg-lime" />
              <span className="relative">{word}</span>
            </span>{' '}
            {rest}
          </span>
        </h1>
        <p className="mt-8 max-w-[30ch] animate-rise text-[17px] leading-[1.75] text-muted [animation-delay:220ms] sm:max-w-[430px] sm:text-[18px]">{HERO.lead}</p>
        <div id="join" className="mt-11 flex w-full scroll-mt-10 animate-rise justify-center [animation-delay:300ms]">
          <EmailCapture />
        </div>
      </div>
      <div className="mt-[50px] animate-rise px-3 [animation-delay:420ms] sm:px-[34px]">
        <HeroDemo />
      </div>
    </section>
  )
}
