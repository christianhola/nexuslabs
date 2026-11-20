import { motion } from 'motion/react'
import { Thermometer } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { DotColumns } from '../components/DotColumns'
import { Media } from '../components/Media'
import { hero } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative -mt-[58px] pt-[58px]">
      <DotColumns />
      <Container className="relative">
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="pt-[88px] text-[44px] font-medium leading-[1.02] tracking-[-0.042em] sm:pt-[110px] sm:text-[60px] lg:pt-[118px] lg:text-[68px] lg:leading-[1.01]"
        >
          {hero.title[0]}
          <br className="hidden sm:block" /> {hero.title[1]}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease }}
          className="mt-10 flex flex-wrap gap-3 sm:mt-[50px]"
        >
          <ButtonLink href={hero.primary.href} size="sm">
            {hero.primary.label}
          </ButtonLink>
          <ButtonLink href={hero.secondary.href} size="sm" variant="outline">
            {hero.secondary.label}
          </ButtonLink>
        </motion.div>
      </Container>
      <Container wide className="relative mt-16 sm:mt-[81px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="relative">
          <Media name="hero" priority position="50% 30%" className="h-[clamp(380px,52vw,780px)] rounded-[12px]" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-auto">
            <div className="flex items-center gap-3 rounded-card-sm bg-paper/90 p-3 pr-5 shadow-float backdrop-blur-md sm:w-[420px]">
              <span className="grid size-11 shrink-0 place-items-center rounded-control-sm bg-volt text-ink">
                <Thermometer className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[13px] text-muted">
                  <span className="round size-1.5 animate-pulse-dot rounded-full bg-volt-2" aria-hidden />
                  {hero.chip.device}
                </p>
                <p className="text-[14.5px] font-medium leading-5 sm:truncate">{hero.chip.action}</p>
              </div>
              <p className="ml-auto shrink-0 text-[14px] font-medium tabular">{hero.chip.value}</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
