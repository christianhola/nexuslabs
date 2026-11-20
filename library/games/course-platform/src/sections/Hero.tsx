import { motion } from 'motion/react'
import { ChevronRight, Star } from 'lucide-react'

import { AvatarStack } from '../components/Avatar'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { HERO_MOCK, HeroMock } from '../components/HeroMock'
import { ScaledFrame } from '../components/ScaledFrame'
import { hero, people } from '../content'
import { Link } from '../lib/router'

const up = (delay: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const } })

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <Container className="grid grid-cols-1 items-center gap-14 pb-16 pt-8 lg:grid-cols-[1fr_540px] lg:gap-10 lg:pb-20 lg:pt-[106px]">
        <div className="max-w-[560px]">
          <motion.div {...up(0)}>
            <Link
              href={hero.badge.href}
              className="inline-flex h-10 items-center gap-3 rounded-full border border-line bg-card py-1 pl-1 pr-3.5 text-[14px] text-ink shadow-[0_4px_16px_-8px_rgb(18_18_20/0.16)] transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-flame-strong round"
            >
              <span className="round inline-flex h-8 items-center rounded-full bg-flame-soft px-3 text-[13.5px] text-flame-ink">{hero.badge.tag}</span>
              {hero.badge.text}
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </motion.div>
          <motion.h1 {...up(0.06)} id="hero-title" className="mt-10 font-display text-[46px] leading-[1.08] tracking-[-0.03em] text-ink sm:text-[58px] lg:text-[62px]">
            <span className="block font-light">{hero.titleLight}</span>
            <span className="block font-medium">{hero.titleStrong}</span>
          </motion.h1>
          <motion.p {...up(0.12)} className="mt-7 max-w-[490px] text-[17px] leading-[1.6] text-muted">
            {hero.lead}
          </motion.p>
          <motion.div {...up(0.18)} className="mt-9 flex flex-wrap gap-3.5">
            <Button href={hero.primary.href} size="lg" arrow className="px-5">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} size="lg" variant="outline" className="px-5">
              {hero.secondary.label}
            </Button>
          </motion.div>
          <motion.p {...up(0.24)} className="mt-6 flex items-center gap-2 text-[14px] text-ink">
            <span>{hero.rating.value}</span>
            <Star className="size-4 fill-[#f5a524] text-[#f5a524]" aria-hidden />
            <span className="sr-only">out of 5 stars,</span>
            <span className="mr-1.5">{hero.rating.reviews}</span>
            <AvatarStack people={people.slice(0, 3)} size={26} label="Some of our creators" />
          </motion.p>
        </div>
        <div className="mx-auto w-full max-w-[540px]">
          <ScaledFrame width={HERO_MOCK.width} height={HERO_MOCK.height} label="Coursekit product preview" interactiveFrom={500}>
            <HeroMock />
          </ScaledFrame>
        </div>
      </Container>
    </section>
  )
}
