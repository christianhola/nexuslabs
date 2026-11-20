import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '../components/Button'
import { Coin } from '../components/Coin'
import { notFound } from '../content'
import { useLocation } from '../lib/router'

const ease = [0.22, 1, 0.36, 1] as const

export function NotFound() {
  const { path } = useLocation()
  return (
    <section className="relative overflow-hidden pt-[140px] pb-24 sm:pt-[180px]">
      <div aria-hidden className="dots pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center px-4 text-center">
        <div className="relative flex items-center justify-center font-display text-[120px] font-semibold leading-none tracking-[-0.06em] sm:text-[200px]" aria-hidden>
          <motion.span initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease }}>
            4
          </motion.span>
          <motion.div initial={{ opacity: 0, y: 60, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, delay: 0.15, ease }} className="mx-1 sm:mx-3">
            <div className="animate-float">
              <Coin size={110} thickness={24} segments={60} pose="rotateX(4deg) rotateY(-40deg) rotateZ(-8deg)" className="sm:hidden" />
              <Coin size={180} thickness={40} segments={80} pose="rotateX(4deg) rotateY(-40deg) rotateZ(-8deg)" className="max-sm:hidden" />
            </div>
          </motion.div>
          <motion.span initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }}>
            4
          </motion.span>
        </div>
        <h1 className="mt-8 font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.038em] text-balance sm:text-[48px]">
          <span className="sr-only">{notFound.code}: </span>
          {notFound.title}
        </h1>
        <p className="mt-4 max-w-[480px] text-[17px] leading-relaxed text-muted">{notFound.body}</p>
        <p className="mt-3 max-w-full truncate rounded-[8px] bg-white/[0.05] px-2.5 py-1 font-mono text-[13px] text-muted">{path}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">
            <ArrowLeft className="size-[18px] transition-transform group-hover/button:-translate-x-1" aria-hidden />
            Back to home
          </Button>
          {notFound.links.slice(1).map((l) => (
            <Button key={l.href} href={l.href} variant="outline" size="lg">
              {l.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
