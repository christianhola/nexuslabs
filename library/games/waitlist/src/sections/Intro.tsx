import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { WaitlistForm } from '../components/WaitlistForm'
import { hero } from '../content'
import { ease } from '../lib/motion'

function Rise({ i, children, className, id, tabIndex }: { i: number; children: ReactNode; className?: string; id?: string; tabIndex?: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      id={id}
      tabIndex={tabIndex}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay: 0.05 + i * 0.08 }}
    >
      {children}
    </motion.div>
  )
}

/** Left half: headline, copy and the waitlist form. */
export function Intro() {
  return (
    <div className="flex items-center bg-page px-6 pb-12 pt-16 sm:px-12 lg:min-h-dvh lg:px-[75px] lg:pb-[70px] lg:pt-0">
      <motion.div layout="position" transition={{ duration: 0.5, ease }} className="w-full max-w-[440px] lg:max-w-[430px]">
        <h1 className="text-[40px] font-bold leading-[1.25] tracking-[-0.05em] sm:text-display">
          <Rise i={0}>
            <span className="block text-accent-strong">{hero.eyebrow}</span>
          </Rise>
          <Rise i={1}>
            <span className="block text-ink">{hero.title}</span>
          </Rise>
        </h1>
        <Rise i={2}>
          <p className="mt-[22px] text-[16px] leading-[1.5] tracking-[-0.003em] text-body sm:text-lead">{hero.body}</p>
        </Rise>
        <Rise i={3}>
          <p className="mt-[18px] text-small tracking-[0.005em] text-muted">{hero.note}</p>
        </Rise>
        <Rise i={4} className="mt-[30px] scroll-mt-24 rounded-control outline-none" id="join" tabIndex={-1}>
          <WaitlistForm />
        </Rise>
      </motion.div>
    </div>
  )
}
