import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'

import { deviceLabel } from '../content'
import { Laptop, Phone } from '../components/Devices'
import { Wallpaper } from '../components/Wallpaper'
import { palettes } from '../components/wallpaper-palettes'
import { ease } from '../lib/motion'

const CYCLE_MS = 9000
const u = (n: number) => `calc(var(--u) * ${n})`

/** Right half: the grey stage with a laptop bleeding off the edge and a phone in front. */
export function Showcase() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  // Slowly walk the wallpaper through the times of day.
  useEffect(() => {
    if (reduce) return
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % palettes.length), CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [reduce])

  // Pointer parallax: the phone (nearer) moves more than the laptop.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 })
  const laptopX = useTransform(sx, (v) => v * -8)
  const laptopY = useTransform(sy, (v) => v * -6)
  const phoneX = useTransform(sx, (v) => v * 16)
  const phoneY = useTransform(sy, (v) => v * 10)
  const phoneRotate = useTransform(sx, (v) => v * 1.2)

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== 'mouse') return
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    px.set(((event.clientX - box.left) / box.width - 0.5) * 2)
    py.set(((event.clientY - box.top) / box.height - 0.5) * 2)
  }
  function onLeave() {
    px.set(0)
    py.set(0)
  }

  const palette = palettes[index]

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative overflow-hidden bg-stage [container-type:inline-size] max-lg:aspect-[864/760] lg:min-h-dvh"
    >
      <div
        className="stage absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{ height: u(710) }}
      >
        <motion.div
          className="absolute"
          style={{ left: u(201), top: u(42) }}
          initial={reduce ? false : { opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
        >
          <motion.div style={{ x: laptopX, y: laptopY }}>
            <Laptop label={deviceLabel}>
              <Wallpaper palette={palette} />
            </Laptop>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: u(69), top: u(256) }}
          initial={reduce ? false : { opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.4 }}
        >
          <motion.div style={{ x: phoneX, y: phoneY, rotate: phoneRotate }}>
            <Phone>
              <Wallpaper palette={palette} variant="phone" />
            </Phone>
          </motion.div>
        </motion.div>
      </div>

      <span className="sr-only" aria-live="off">
        Wallpaper: {palette.name}
      </span>
    </div>
  )
}
