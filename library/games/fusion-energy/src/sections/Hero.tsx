import { motion } from 'motion/react'

import { ButtonLink } from '../components/Button'
import { Badge } from '../components/Controls'
import { Container } from '../components/Container'
import { hero, photos } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Black sky lifting to deep sea blue at the horizon */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#000_0%,#000_45%,#071233_78%,#17306a_100%)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent" aria-hidden />
      <Container size="xl" className="grid min-h-[min(100svh,920px)] items-center gap-10 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:pb-10 lg:pt-24">
        <div className="flex flex-col items-start gap-7">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <Badge tone="plasma" pulse>
              {hero.eyebrow}
            </Badge>
          </motion.div>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease }}
            className="display text-balance text-[46px] sm:text-[64px] lg:text-[76px]"
          >
            {hero.title.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.16, ease }}
            className="max-w-[520px] text-pretty text-[18px] leading-[1.55] text-muted"
          >
            {hero.body}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.24, ease }}
            className="flex flex-wrap items-center gap-3"
          >
            <ButtonLink href={hero.primary.href} size="lg">
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink href={hero.secondary.href} size="lg" variant="secondary">
              {hero.secondary.label}
            </ButtonLink>
          </motion.div>
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-4 grid w-full max-w-[560px] grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            {hero.stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <dt className="order-2 text-[13px] leading-snug text-muted">{s.label}</dt>
                <dd className="order-1 text-[28px] font-medium tracking-[-0.03em] sm:text-[34px]">
                  {s.value}
                  <span className="ml-1 text-[16px] text-soft sm:text-[18px]">{s.unit}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.1, ease }}
          className="relative mx-auto w-full max-w-[600px]"
        >
          <div className="absolute inset-[8%] -z-10 rounded-full bg-plasma/25 blur-[90px]" aria-hidden />
          <img src={photos.reactor} alt="Render of the Tidewell reactor module, plasma glowing blue inside the vessel" width={900} height={972} fetchPriority="high" className="mx-auto w-[78%] animate-float drop-shadow-[0_40px_60px_rgb(0_0_0/0.6)]" />
        </motion.div>
      </Container>
    </section>
  )
}
