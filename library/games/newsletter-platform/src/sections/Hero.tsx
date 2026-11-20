import { motion } from 'motion/react'

import { AvatarStack, Stars } from '../components/Avatar'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { HeroMock } from '../components/HeroMock'
import { LogoMark } from '../components/Logo'
import { hero, testimonials } from '../content'
import { useReducedMotion } from '../lib/useReducedMotion'

export function Hero() {
  const reduce = useReducedMotion()
  const line = (i: number) => (reduce ? {} : { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] as const } })
  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-[64px] lg:pt-[108px]">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-6">
        <div>
          <h1 className="display text-[44px] uppercase text-white sm:text-[60px] lg:text-[62px] lg:leading-[66px]">
            {hero.lines.map((l, i) => (
              <motion.span key={l} {...line(i)} className="block">
                {l}
              </motion.span>
            ))}
            <motion.span {...line(3)} className="text-gradient-pink block">
              {hero.accent}
            </motion.span>
          </h1>
          <p className="mt-8 max-w-[540px] text-[19px] leading-[1.6] text-ink sm:text-[21px]">{hero.body}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[16px] text-ink">
            <Stars />
            <AvatarStack people={testimonials.map((t) => ({ initials: t.initials, hue: t.hue }))} />
            <span>
              <strong className="font-semibold">{hero.rating.score}</strong> from <strong className="font-semibold">{hero.rating.count}</strong> {hero.rating.label}
            </span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={hero.primary.href} size="lg" className="!pl-2" icon={<span className="grid size-10 place-items-center rounded-[5px] bg-white"><LogoMark className="size-6 [&_path:first-child]:fill-[#3038d6]" /></span>}>
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} size="lg" variant="outline">
              {hero.secondary.label}
            </Button>
          </div>
          <p className="mt-5 text-[15px] text-muted">{hero.note}</p>
        </div>
        <HeroMock className="ml-auto max-w-[640px] lg:-mr-[14px] lg:-mt-6" />
      </Container>
    </section>
  )
}
