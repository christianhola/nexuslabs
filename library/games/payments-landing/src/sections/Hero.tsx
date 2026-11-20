import { motion } from 'motion/react'

import { Container } from '../components/Container'
import { EmailCapture } from '../components/EmailCapture'
import { PartnerLogos } from '../components/PartnerLogos'
import { PayWidget } from '../components/PayWidget'
import { Shapes } from '../components/Shapes'
import { hero } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-mist pb-[180px] pt-[140px] sm:pt-[164px]">
      <Shapes />
      <Container className="relative grid items-start gap-16 lg:grid-cols-[1fr_auto] lg:gap-10">
        <div>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-[38px] font-medium leading-[1.14] tracking-[-0.025em] text-ink sm:text-[58px] xl:text-[66px]"
          >
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="mt-7 max-w-[450px] text-[16.5px] leading-[1.65] text-muted"
          >
            {hero.body}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.18, ease }}>
            <EmailCapture className="mt-9" placeholder={hero.emailPlaceholder} cta={hero.cta} success={hero.success} />
            <PartnerLogos className="mt-10" names={hero.partners} label={hero.partnersLabel} />
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="mx-auto w-full max-w-[372px] pt-10 lg:mr-[110px] lg:pt-[34px]"
        >
          <PayWidget />
        </motion.div>
      </Container>
    </section>
  )
}
