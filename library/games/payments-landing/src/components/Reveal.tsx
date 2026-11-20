import { motion } from 'motion/react'
import type { ReactNode } from 'react'

/** Fades content up the first time it scrolls into view. Use as="li" inside lists. */
export function Reveal({ children, delay = 0, className, y = 18, as = 'div' }: { children: ReactNode; delay?: number; className?: string; y?: number; as?: 'div' | 'li' }) {
  const M = as === 'li' ? motion.li : motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}
