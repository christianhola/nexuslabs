import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

import { AppMock } from '../components/AppMock'
import { Button } from '../components/Button'
import { ScaledFrame } from '../components/ScaledFrame'
import { hero, images, logos } from '../content'
import { useReducedMotion } from '../lib/useReducedMotion'

/*
  The hero from the reference: headline over a painted sky, and the live
  product mock standing in the meadow with the near hills in front of it.
  The scene is one illustration drawn twice: the full image behind the mock
  and a cut-out of its foreground hills (same pixels, transparent sky) on
  top, both sized and placed identically so they line up at any width.
  CSS variables keep the hill line ~31% down the mock:
    --mock-w   mock width          --scene-w  illustration width
    --ridge    where the hills cut the mock, from its top edge
*/
const RIDGE_AT = 612 / 1536 // ridge height in the illustration, as a fraction of its width

export function Hero() {
  const section = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] })
  const sink = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90])

  return (
    <section
      ref={section}
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-sky [container-type:inline-size]"
      style={{
        ['--mock-w' as string]: 'min(842px, 100cqw - 40px)',
        ['--scene-w' as string]: 'max(100cqw, 1100px)',
        ['--ridge' as string]: 'max(var(--mock-w) * 0.31, 150px)',
      }}
    >
      {/* Copy */}
      <div className="relative z-10 mx-auto flex max-w-[1140px] flex-col items-center px-5 pt-[112px] text-center sm:px-8 sm:pt-[118px]">
        <motion.h1
          id="hero-title"
          className="text-balance font-display text-[40px] font-bold leading-[1.02] tracking-[-0.04em] text-ink sm:text-[48px] sm:leading-[0.99] sm:tracking-[-0.036em] lg:text-[56px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.title.map((l, i) => (
            <span key={l} className="sm:block">
              {i ? ' ' : null}
              {l}
            </span>
          ))}
        </motion.h1>
        <motion.p
          className="mt-4 max-w-[480px] text-[15px] leading-[1.5] text-[#1d221c] sm:text-[14.5px]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {hero.lede}
        </motion.p>
        <motion.div className="mt-6 flex flex-wrap justify-center gap-2.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}>
          <Button href={hero.primary.href} size="sm" arrow className="sm:px-3.5">
            {hero.primary.label}
          </Button>
          <Button href={hero.secondary.href} size="sm" variant="dark">
            {hero.secondary.label}
          </Button>
        </motion.div>
      </div>

      {/* Stage: the mock, the meadow around it and the logo row */}
      <div className="relative mt-12" style={{ height: 'calc(var(--ridge) + 262px)' }}>
        <img
          src={images.hero}
          alt=""
          className="pointer-events-none absolute left-1/2 z-0 max-w-none -translate-x-1/2 select-none"
          style={{ width: 'var(--scene-w)', top: `calc(var(--ridge) - var(--scene-w) * ${RIDGE_AT})` }}
          fetchPriority="high"
          decoding="async"
        />
        {/* Soften the painted sky toward the reference's pale haze */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 z-0"
          style={{ top: `calc(var(--ridge) - var(--scene-w) * ${RIDGE_AT} - 2px)`, height: `calc(var(--scene-w) * ${RIDGE_AT})`, background: 'linear-gradient(to bottom, #b8d5ec, rgb(214 230 240 / 0.5) 22%, rgb(240 238 228 / 0.16) 75%, transparent)' }}
        />

        <motion.div className="relative z-10 mx-auto" style={{ width: 'var(--mock-w)', y: sink }}>
          <motion.div
            className="rounded-[14px] shadow-mock ring-1 ring-black/5"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <ScaledFrame width={1200} height={720} label="Live demo of the Pulseboard workspace">
              <AppMock />
            </ScaledFrame>
          </motion.div>
        </motion.div>

        <img
          src={images.heroFront}
          alt=""
          className="pointer-events-none absolute left-1/2 z-20 max-w-none -translate-x-1/2 select-none"
          style={{ width: 'var(--scene-w)', top: `calc(var(--ridge) - var(--scene-w) * ${RIDGE_AT})` }}
          decoding="async"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[260px] bg-[linear-gradient(to_top,rgb(26_48_10/0.55),rgb(26_48_10/0.18)_55%,transparent)]" />

        {/* Logos on the grass */}
        <div className="absolute inset-x-0 bottom-0 z-30 px-5 pb-10 text-center sm:pb-12">
          <p className="text-[13px] font-medium text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.35)]">{hero.logosLabel}</p>
          <ul className="mx-auto mt-4 flex max-w-[820px] flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-3 text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.25)]" aria-label="Customers">
            {logos.map((l) => (
              <li key={l.name} className={logoClass[l.style]}>
                {l.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const logoClass: Record<(typeof logos)[number]['style'], string> = {
  'italic-serif': "font-['Georgia',serif] text-[24px] font-bold italic tracking-[-0.03em]",
  light: 'font-sans text-[25px] font-normal tracking-[-0.04em]',
  heavy: 'font-display text-[25px] font-extrabold tracking-[-0.06em]',
  regular: 'font-display text-[24px] font-medium tracking-[-0.02em]',
  bold: 'font-sans text-[24px] font-semibold tracking-[-0.035em]',
}
