import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Container } from './Container'
import { Eyebrow } from './Eyebrow'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * The top of every inner page: eyebrow, an h1 that rises in word by word,
 * a lede and optional actions, over a faint violet bloom and dot grid.
 */
export function PageHeader({
  eyebrow,
  title,
  body,
  children,
  align = 'center',
  className,
}: {
  eyebrow: string
  title: string
  body?: ReactNode
  children?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  const words = title.split(' ')
  return (
    <header className={cx('relative overflow-hidden pt-[136px] pb-14 sm:pt-[170px] sm:pb-20', className)}>
      <div aria-hidden className="dots pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40px] h-[420px] w-[820px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_61_246/0.18),transparent)] blur-2xl round"
      />
      <Container className={cx('relative flex flex-col gap-6', align === 'center' ? 'items-center text-center' : 'items-start')}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
        <h1 className="max-w-[900px] font-display text-[42px] font-semibold leading-[1.04] tracking-[-0.038em] text-balance sm:text-[60px] lg:text-[72px]">
          {words.map((w, i) => (
            <span key={i}>
              <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.1 + i * 0.06, ease }}
                >
                  {w}
                </motion.span>
              </span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>
        {body ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="max-w-[620px] text-[17px] leading-relaxed text-muted text-pretty sm:text-[19px]"
          >
            {body}
          </motion.p>
        ) : null}
        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {children}
          </motion.div>
        ) : null}
      </Container>
    </header>
  )
}
