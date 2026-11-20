import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Snowflake } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

import { cx } from '../lib/cx'

export type CardTheme = 'graphite' | 'violet' | 'pearl'

const themes: Record<CardTheme, { bg: string; fg: string; sub: string; label: string; chip: string }> = {
  graphite: {
    bg: [
      'radial-gradient(60% 55% at 22% 48%, rgb(150 150 150 / 0.55), transparent 70%)',
      'radial-gradient(40% 60% at 70% 6%, rgb(0 0 0 / 0.75), transparent 70%)',
      'radial-gradient(70% 80% at 100% 100%, rgb(70 70 72 / 0.5), transparent 70%)',
      'linear-gradient(160deg, #2a2a2b 0%, #1b1b1c 45%, #232324 100%)',
    ].join(','),
    fg: '#ffffff',
    sub: '#d2d2d4',
    label: '#8d8d92',
    chip: '#d6d6d8',
  },
  violet: {
    bg: [
      'radial-gradient(60% 55% at 22% 48%, rgb(196 170 255 / 0.55), transparent 70%)',
      'radial-gradient(40% 60% at 72% 6%, rgb(25 8 80 / 0.7), transparent 70%)',
      'linear-gradient(160deg, #6b4cff 0%, #3a1fc2 55%, #2a1590 100%)',
    ].join(','),
    fg: '#ffffff',
    sub: '#e6deff',
    label: '#b9a8ff',
    chip: '#efe9ff',
  },
  pearl: {
    bg: [
      'radial-gradient(60% 55% at 22% 48%, rgb(255 255 255 / 0.9), transparent 70%)',
      'radial-gradient(40% 60% at 72% 6%, rgb(180 180 196 / 0.6), transparent 70%)',
      'linear-gradient(160deg, #eceef3 0%, #d7d9e2 55%, #c8cbd6 100%)',
    ].join(','),
    fg: '#111117',
    sub: '#3b3b46',
    label: '#7d7d8a',
    chip: '#4a4a55',
  },
}

export type CardData = { holder: string; number: string; validFrom: string; validThru: string }

/*
  The glossy payment card. 450×293 at full size; pass `scale` style via the
  parent to shrink it. With `tilt`, it leans toward the pointer anywhere on
  the page and a light sheen follows. `frozen` frosts it over.
*/
export function CreditCard({
  data,
  theme = 'graphite',
  tilt = false,
  frozen = false,
  className,
  style,
}: {
  data: CardData
  theme?: CardTheme
  tilt?: boolean
  frozen?: boolean
  className?: string
  style?: CSSProperties
}) {
  const t = themes[theme]
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 140, damping: 18 })
  const sy = useSpring(py, { stiffness: 140, damping: 18 })
  const rotateY = useTransform(sx, [-1, 1], [-11, 11])
  const rotateX = useTransform(sy, [-1, 1], [9, -9])
  const glareX = useTransform(sx, [-1, 1], [10, 90])
  const glareY = useTransform(sy, [-1, 1], [0, 100])
  const glare = useMotionTemplate`radial-gradient(45% 60% at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.16), transparent 70%)`

  useEffect(() => {
    if (!tilt) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const b = el.getBoundingClientRect()
      const nx = (e.clientX - (b.left + b.width / 2)) / (b.width * 1.2)
      const ny = (e.clientY - (b.top + b.height / 2)) / (b.height * 1.6)
      px.set(Math.max(-1, Math.min(1, nx)))
      py.set(Math.max(-1, Math.min(1, ny)))
    }
    const onLeave = () => {
      px.set(0)
      py.set(0)
    }
    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [tilt, px, py])

  return (
    <div className={cx('[perspective:1200px]', className)} style={style}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, background: t.bg, color: t.fg }}
        className="relative h-[293px] w-[450px] overflow-hidden rounded-[26px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.06)] transition-[background] duration-500"
      >
        {/* pointer glare */}
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} />
        {/* passing light sheen */}
        <div className="pointer-events-none absolute inset-y-[-20%] left-0 w-[30%] animate-sheen bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        {/* the faint diagonal fold, bottom right */}
        <div
          className="pointer-events-none absolute bottom-[-10px] left-[66%] h-[150px] w-px rotate-[28deg] bg-gradient-to-t from-transparent via-white/25 to-transparent"
          aria-hidden
        />
        <div className="relative flex h-full flex-col px-[33px] pt-[31px] pb-[32px]">
          <div className="flex items-start justify-between">
            <Chip color={t.chip} />
            <span className="font-display text-[20px] font-semibold tracking-[-0.03em] leading-none mt-1.5">Revio</span>
          </div>
          <div className="mt-auto">
            <div className="text-[18px] tracking-[-0.02em]" style={{ color: t.sub }}>
              {data.holder}
            </div>
            <div className="mt-[4px] text-[20px] tracking-[-0.01em] tabular">{data.number}</div>
          </div>
          <div className="mt-[44px] flex gap-[46px] text-[13px] leading-tight">
            <div>
              <div className="uppercase" style={{ color: t.label }}>
                Valid from
              </div>
              <div className="mt-[5px] text-[14px] tabular" style={{ color: t.sub }}>
                {data.validFrom}
              </div>
            </div>
            <div>
              <div className="uppercase" style={{ color: t.label }}>
                Valid thru
              </div>
              <div className="mt-[5px] text-[14px] tabular" style={{ color: t.sub }}>
                {data.validThru}
              </div>
            </div>
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: frozen ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,rgb(200_230_255/0.32),rgb(170_200_255/0.12))] backdrop-blur-[6px]"
        >
          <motion.div
            initial={false}
            animate={{ scale: frozen ? 1 : 0.6, rotate: frozen ? 0 : -90 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-[14px] font-medium text-white round"
          >
            <Snowflake className="size-4" /> Frozen
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function Chip({ color }: { color: string }) {
  return (
    <svg width="38" height="29" viewBox="0 0 38 29" fill="none" stroke={color} strokeWidth="1.8" aria-hidden>
      <rect x="1" y="1" width="36" height="27" rx="6" />
      <path d="M14 1v27M24 1v27M1 10h13M1 19h13M24 10h13M24 19h13M14 14.5h10" />
    </svg>
  )
}
