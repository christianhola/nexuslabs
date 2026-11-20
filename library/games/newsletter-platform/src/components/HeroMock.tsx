import { motion } from 'motion/react'
import { ArrowDown, FilePlus2 } from 'lucide-react'

import { heroMock, images } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { useReducedMotion } from '../lib/useReducedMotion'
import { AreaChart } from './AreaChart'
import { CountUp } from './CountUp'
import { ScaledFrame } from './ScaledFrame'
import { StatTile } from './StatTile'

/*
  The hero collage: three product panels (templates, monetization,
  analytics) layered over a violet glow. It is drawn at 640x420 and scaled
  to fit. Every panel links to the screen it previews.
*/
const panel = 'absolute rounded-[10px] border border-[#2c2937] bg-[#100e17]/95 shadow-[0_30px_70px_-20px_rgb(0_0_0/0.9)] backdrop-blur'

export function HeroMock({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const m = heroMock
  const enter = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] as const } })
  return (
    <ScaledFrame width={640} height={420} inertBelow={0.85} className={cx('relative w-full', className)}>
      <div className="relative size-full [mask-image:linear-gradient(90deg,#000_80%,transparent_100%)]">
        <div className="pointer-events-none absolute left-[40px] top-[-60px] h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgb(88_52_160/0.38),rgb(60_30_110/0.16)_55%,transparent)]" aria-hidden />

        {/* Monetization */}
        <motion.div {...enter(0.25)} className={cx(panel, 'left-0 top-[134px] h-[256px] w-[260px]')}>
          <div className="flex h-[44px] items-center border-b border-[#2c2937] px-[17px] text-[14px] font-medium text-ink">{m.monetization.title}</div>
          <div className="px-[17px] pt-[14px]">
            <p className="text-[10px] text-faint">{m.monetization.label}</p>
            <p className="mt-1 text-[29px] font-medium tracking-[-0.02em] text-white">
              <CountUp value={m.monetization.value} format={(n) => `$${Math.round(n).toLocaleString('en-US')}`} />
            </p>
            <dl className="mt-[14px] text-[10px]">
              <div className="flex justify-between border-b border-[#2c2937] pb-[8px]">
                <dt className="text-body">{m.monetization.payoutLabel}</dt>
                <dd className="text-muted">{m.monetization.payoutDate}</dd>
              </div>
              <div className="flex justify-between pt-[8px]">
                <dt className="text-body">{m.monetization.adsLabel}</dt>
                <dd className="text-muted">{m.monetization.ads}</dd>
              </div>
            </dl>
            <Link href="/monetize#payout" className="mt-[18px] flex h-[32px] w-[168px] items-center justify-center gap-2 rounded-[5px] border border-[#36323f] text-[10.5px] text-body transition-colors hover:border-[#5b5568] hover:text-white">
              <ArrowDown className="size-3" aria-hidden />
              {m.monetization.action}
            </Link>
          </div>
        </motion.div>

        {/* Templates */}
        <motion.div {...enter(0.1)} className={cx(panel, 'left-[134px] top-0 h-[318px] w-[560px]')}>
          <Link href="/templates" className="flex h-[48px] items-center border-b border-[#2c2937] px-[17px] text-[15px] font-medium text-ink hover:text-white focus-visible:outline-offset-[-2px]">
            {m.templates.title}
          </Link>
          <div className="flex gap-[10px] px-[17px] pt-[17px]">
            <Link href="/editor" className="group relative flex h-[225px] w-[152px] flex-col items-center justify-center rounded-[4px] border border-[#b5379a] bg-[#16121d] text-center transition-colors hover:bg-[#1d1726]">
              <FilePlus2 className="size-3.5 text-muted" aria-hidden />
              <span className="mt-2 text-[8.5px] text-body">{m.templates.newLabel}</span>
              <span className="mt-1 w-[70px] text-[7px] leading-snug text-faint">{m.templates.newBody}</span>
              <motion.span
                className="absolute right-[18px] top-[64px] flex items-start gap-0.5"
                animate={reduce ? undefined : { x: [0, -6, 4, 0], y: [0, 4, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden
              >
                <svg viewBox="0 0 12 12" className="size-3.5 -rotate-12 fill-white">
                  <path d="M1 1l10 4-4 1.5L5.5 11z" />
                </svg>
                <span className="round mt-2 rounded-full bg-[#f6bfe9] px-2 py-0.5 text-[9px] font-semibold text-[#3b0c31]">{m.templates.cursor}</span>
              </motion.span>
            </Link>
            {(['aurora', 'indigo'] as const).map((k) => (
              <Link key={k} href="/templates" className="relative h-[225px] w-[152px] overflow-hidden rounded-[4px] border border-[#2c2937] bg-[#1a1622] p-[8px]" aria-label="Browse templates">
                <img src={images[k]} alt="" className="h-[88px] w-full rounded-[2px] object-cover transition-transform duration-500 hover:scale-105" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div {...enter(0.4)} className={cx(panel, 'left-[254px] top-[158px] h-[246px] w-[440px] overflow-hidden')}>
          <Link href="/analytics" className="flex h-[42px] items-center px-[17px] text-[15px] font-medium text-ink hover:text-white focus-visible:outline-offset-[-2px]">
            {m.analytics.title}
          </Link>
          <div className="grid grid-cols-2 gap-[9px] px-[17px]">
            <StatTile size="sm" label={m.analytics.recipients.label} value={<CountUp value={m.analytics.recipients.value} />} rows={m.analytics.recipients.rows as [string, string][]} />
            <StatTile size="sm" label={m.analytics.open.label} value={<CountUp value={m.analytics.open.value} format={(n) => `${n.toFixed(2)}%`} />} rows={m.analytics.open.rows as [string, string][]} />
          </div>
          <AreaChart mini series={m.analytics.series} height={74} className="absolute inset-x-0 bottom-0" />
        </motion.div>
      </div>
    </ScaledFrame>
  )
}
