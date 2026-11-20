import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { WindowFrame } from '../components/WindowFrame'
import { hero } from '../content'
import { AppShell } from '../app/AppShell'
import { Dashboard } from '../app/Dashboard'
import { createStore, StoreProvider } from '../lib/store'
import { duration, ease } from '../lib/motion'

const MOCK_W = 1018
const MOCK_H = 600

/**
  The framed app window in the hero. It renders the real AppShell and
  Dashboard against an in-memory demo store, scaled to fit, and is inert (a
  picture you can't tab into). It tilts up into place as you scroll.
*/
export function HeroMock() {
  const [store] = useState(() => createStore({ persist: false }))
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'start 0.66'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 22, 0])
  const scaleIn = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.9, 1])
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 60, 0])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / MOCK_W)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrap} className="relative mx-auto w-full max-w-[1018px] [perspective:1600px]" style={{ height: MOCK_H * scale }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.reveal, delay: 0.35, ease }}
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: MOCK_W, scale }}
      >
        <motion.div style={{ rotateX, scale: scaleIn, y, transformOrigin: '50% 0%' }}>
          <WindowFrame title={hero.mockTitle} className="w-[1018px]">
            <div inert aria-hidden style={{ height: MOCK_H - 48 }} className="overflow-hidden">
              <StoreProvider store={store}>
                <AppShell path="/app" embedded>
                  <Stagger>
                    <Dashboard embedded />
                  </Stagger>
                </AppShell>
              </StoreProvider>
            </div>
          </WindowFrame>
        </motion.div>
      </motion.div>
    </div>
  )
}

/** Fades the dashboard's blocks in one after another once the mock is in view. */
function Stagger({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="[&>div>*]:animate-fade-in [&>div>*:nth-child(2)]:[animation-delay:.55s] [&>div>*:nth-child(3)]:[animation-delay:.65s] [&>div>*:nth-child(4)]:[animation-delay:.75s] [&>div>*:nth-child(5)]:[animation-delay:.85s] [&>div>*:nth-child(1)]:[animation-delay:.5s]"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.slow, delay: 0.45 }}
    >
      {children}
    </motion.div>
  )
}
