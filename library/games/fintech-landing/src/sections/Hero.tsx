import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'

import { BalanceCard } from '../components/BalanceCard'
import { Button } from '../components/Button'
import { CheckBadge } from '../components/CheckBadge'
import { Coin } from '../components/Coin'
import { CreditCard } from '../components/CreditCard'
import { hero } from '../content'

const ease = [0.22, 1, 0.36, 1] as const

/*
  The product composition is laid out on a fixed-size stage (the reference's
  own pixel positions) and scaled to fit the viewport, so it keeps its exact
  overlap at every width. Phones get a taller, narrower stage.
*/
const stages = {
  wide: {
    w: 1030,
    h: 431,
    card: { left: 0, top: 0 },
    coin: { left: 300, top: 128, size: 440 },
    balance: { left: 680, top: 15 },
  },
  narrow: {
    w: 560,
    h: 640,
    card: { left: 0, top: 0 },
    coin: { left: 150, top: 230, size: 400 },
    balance: { left: 210, top: 360 },
  },
}

function useStage() {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<{ kind: keyof typeof stages; scale: number }>({ kind: 'wide', scale: 1 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const kind = w < 760 ? 'narrow' : 'wide'
      setState({ kind, scale: Math.min(1, w / stages[kind].w) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, ...state }
}

export function Hero() {
  const { ref, kind, scale } = useStage()
  const s = stages[kind]

  return (
    <section id="top" className="relative overflow-hidden pt-[150px] lg:pt-[183px]">
      {/* soft violet bloom behind the composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[560px] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_61_246/0.16),transparent)] blur-2xl round"
      />

      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-4 text-center">
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          className="flex flex-col items-center gap-x-[26px] gap-y-2 text-[15px] tracking-[-0.01em] text-[#c9c9cc] sm:flex-row sm:text-[17.5px]"
        >
          {hero.proof.map((p, i) => (
            <motion.li
              key={i}
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
              className="flex items-center gap-[10px]"
            >
              <CheckBadge />
              <span>
                {p.text}
                {p.strong ? <span className="text-white">{p.strong}</span> : null}
                {p.after}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <h1 className="mt-[34px] font-display text-[48px] font-semibold leading-[1.04] tracking-[-0.038em] sm:text-[64px] lg:mt-[44px] lg:text-[78px]">
          {hero.title.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease }}
              >
                {word}
                {i < hero.title.split(' ').length - 1 ? ' ' : ''}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease }}
          className="mt-[36px] flex flex-wrap items-center justify-center gap-x-[38px] gap-y-3 lg:mt-[40px]"
        >
          <Button href={hero.primary.href} size="lg" className="!px-[24px]">
            {hero.primary.label}
            <ArrowRight className="size-[19px] transition-transform duration-300 group-hover/button:translate-x-1" strokeWidth={2.2} />
          </Button>
          <Button href={hero.secondary.href} variant="ghost" size="lg">
            {hero.secondary.label}
          </Button>
        </motion.div>
      </div>

      {/* product composition */}
      <div className="relative mx-auto mt-[48px] w-full max-w-[1030px] px-4 lg:mt-[53px] lg:px-0">
        <div ref={ref} style={{ height: s.h * scale }} className="relative">
          <div className="absolute left-1/2 top-0" style={{ width: s.w, height: s.h, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}>
            <motion.div
              className="absolute"
              style={{ left: s.coin.left, top: s.coin.top }}
              initial={{ opacity: 0, y: 120, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.3, delay: 0.55, ease }}
            >
              <div className="animate-float">
                <Coin size={s.coin.size} thickness={92} pose="rotateX(4deg) rotateY(-50deg) rotateZ(-10deg)" />
              </div>
              {/* warm glow off the rim */}
              <div className="pointer-events-none absolute right-[-40px] bottom-[10%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,rgb(255_90_54/0.28),transparent)] blur-xl round" />
            </motion.div>

            <motion.div
              className="absolute z-10"
              style={{ left: s.card.left, top: s.card.top }}
              initial={{ opacity: 0, x: -60, y: 40, rotate: -4 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 1.1, delay: 0.7, ease }}
            >
              <CreditCard data={hero.card} tilt />
            </motion.div>

            <motion.div
              className="absolute z-10"
              style={{ left: s.balance.left, top: s.balance.top }}
              initial={{ opacity: 0, x: 60, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.1, delay: 0.85, ease }}
            >
              <div className="animate-float [animation-delay:-3s]">
                <BalanceCard {...hero.account} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute right-[79px] bottom-[37px] z-20 hidden rounded-[3px] border border-white/10 bg-[#1c1c1e] px-[8px] py-[3px] text-[15px] font-medium tracking-[0.005em] text-white lg:block"
      >
        {hero.badge}
      </motion.div>
    </section>
  )
}
