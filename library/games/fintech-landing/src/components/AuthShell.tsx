import { motion } from 'motion/react'
import { FlaskConical } from 'lucide-react'
import type { ReactNode } from 'react'

import { auth, hero } from '../content'
import { Avatar } from './Avatar'
import { BalanceCard } from './BalanceCard'
import { Badge } from './Badge'
import { Card } from './Card'
import { CreditCard } from './CreditCard'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Two-column frame for the sign-up and log-in screens: the form card on the
 * left with a "Demo" flag, the product art and a customer quote on the right
 * (hidden below lg).
 */
export function AuthShell({ title, body, children, footer }: { title: string; body: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="relative overflow-hidden pt-[112px] pb-20 sm:pt-[150px]">
      <div aria-hidden className="dots pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid w-full max-w-[1240px] items-center gap-12 px-4 sm:px-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:px-[45px]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <Card padding="lg" className="mx-auto w-full max-w-[520px]">
            <Badge tone="info" icon={<FlaskConical className="size-3.5" aria-hidden />}>
              Demo
            </Badge>
            <h1 className="mt-5 font-display text-[34px] font-semibold leading-[1.08] tracking-[-0.038em] sm:text-[40px]">{title}</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-muted">{body}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 border-t border-white/[0.06] pt-6 text-center text-[14px] text-muted">{footer}</div>
          </Card>
          <p className="mx-auto mt-4 max-w-[520px] text-center text-[13px] text-muted">{auth.demoNote}</p>
        </motion.div>

        <div className="relative hidden h-[600px] lg:block" aria-hidden>
          <div className="absolute left-1/2 top-1/2 h-[480px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(91_61_246/0.25),transparent)] blur-2xl round" />
          <motion.div
            className="absolute left-[4%] top-[40px] origin-top-left scale-[0.9]"
            initial={{ opacity: 0, x: 40, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: -6 }}
            transition={{ duration: 1.1, delay: 0.2, ease }}
          >
            <CreditCard data={hero.card} theme="violet" tilt />
          </motion.div>
          <motion.div
            className="absolute right-[2%] top-[250px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.35, ease }}
          >
            <div className="animate-float">
              <BalanceCard {...hero.account} />
            </div>
          </motion.div>
          <motion.figure
            className="depth absolute bottom-0 left-[6%] max-w-[380px] rounded-card-sm bg-surface/90 p-5 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
          >
            <blockquote className="text-[15px] leading-relaxed text-soft">“{auth.panel.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Avatar name={auth.panel.name} size={36} />
              <span className="text-[13px] leading-tight">
                <span className="block font-medium text-white">{auth.panel.name}</span>
                <span className="text-muted">{auth.panel.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </div>
  )
}
