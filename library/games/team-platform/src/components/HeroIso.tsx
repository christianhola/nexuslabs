import { Check, UserRound } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { completion, useTasks } from '../lib/stores'
import { useReducedMotion } from '../lib/useReducedMotion'

/*
  The hero drawing: a line-art phone with app cards floating around it in
  isometric projection. It is live: the to-do boxes toggle (and are saved,
  shared with the product page), the performance figure follows them, the
  chat keeps receiving messages and the calendar shows today's date.
  Drawn on a 540×540 stage that scales to fit its column.
*/
const STAGE = 540

function Plane({ plane, x, y, w, h, z, delay, className, children, bob = true }: { plane: 'left' | 'top'; x: number; y: number; w: number; h: number; z: number; delay: number; className?: string; children?: ReactNode; bob?: boolean }) {
  const style: CSSProperties = { left: x, top: y, zIndex: z, animationDelay: `${delay}s, ${delay + 0.6}s` }
  return (
    <div className={cx('absolute', bob ? 'iso-card' : 'iso-card-still')} style={style}>
      <div className={cx(plane === 'left' ? 'iso-left' : 'iso-top', 'origin-top-left')} style={{ width: w, height: h }}>
        <div className={cx('line-art relative size-full overflow-hidden rounded-[16px]', className)}>{children}</div>
      </div>
    </div>
  )
}

const bar = 'block rounded-[3px] bg-ink'
const ghost = 'block rounded-[3px] bg-mist-2'

export function HeroIso({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [tasks, setTasks] = useTasks()
  const reduce = useReducedMotion()
  const shown = tasks.slice(0, 4)
  const pct = 62.4 + completion(tasks) * 33.8
  const [bubbles, setBubbles] = useState<number[]>([0])
  const [typing, setTyping] = useState(false)
  const today = new Date()
  const dayTag = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() + ' ' + today.getDate()

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => setScale(Math.min(1.12, el.clientWidth / STAGE)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // The chat keeps receiving messages: typing dots, then a new green bubble.
  useEffect(() => {
    if (reduce) return
    let n = 1
    const id = window.setInterval(() => {
      setTyping(true)
      window.setTimeout(() => {
        setTyping(false)
        setBubbles((b) => [...b, n++].slice(-2))
      }, 1400)
    }, 5200)
    return () => window.clearInterval(id)
  }, [reduce])

  // Below ~400px wide the drawing is too small to tap; it becomes a picture
  // and the same checklist stays usable in the showcase below.
  const small = scale < 0.8
  const toggle = (id: string) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  return (
    <div ref={wrap} className={cx('relative w-full', className)} style={{ height: STAGE * scale }}>
      <figure aria-label="The Branchwork app: chat, calendar, to-do list and task performance" {...(small ? { inert: true, 'aria-hidden': true } : {})} className="absolute left-0 top-0 m-0 origin-top-left" style={{ width: STAGE, height: STAGE, transform: `scale(${scale})` }}>
        {/* Floor and branch lines */}
        <svg className="absolute inset-0 overflow-visible" width={STAGE} height={STAGE} viewBox={`0 0 ${STAGE} ${STAGE}`} aria-hidden fill="none" stroke="#0f0f0f" strokeWidth="1.3" strokeLinecap="round">
          <path d="M77 273 166 225" />
          <path d="M44 341 139 288" />
          <path d="M135 225v19" />
          <path d="M418 230v262" />
          <path d="M418 300l24-14M418 372l-20-12M418 440l26-15" />
          <path d="M453 250v268" opacity=".5" />
          <path d="M299 531 387 481" />
          <path d="M250 520c30 10 52 6 66-12" />
        </svg>

        {/* Phone */}
        <Plane plane="left" x={452} y={262} w={62} h={92} z={0} delay={0} className="rounded-[14px]" bob={false} />
        <Plane plane="left" x={241} y={8} w={250} h={370} z={1} delay={0} className="rounded-[36px]" bob={false}>
          <div className="absolute inset-[9px] rounded-[28px] border-[1.5px] border-ink" />
          <span className="absolute left-[70px] top-[36px] h-[32px] w-[108px] rounded-[16px] bg-[#d9d9d7]" />
        </Plane>

        {/* Dock */}
        <Plane plane="top" x={96} y={384} w={236} h={60} z={2} delay={0.5} className="rounded-[28px] bg-white">
          <div className="flex h-full items-center justify-around px-4">
            {['M5 12h6M8 9v6', 'M6 6h8v8H6z', 'M5 10a5 5 0 0 1 10 0v4H5z', 'M5 7h10M5 11h10M5 15h6', 'M4 14l4-4 3 3 5-6'].map((d, i) => (
              <span key={d} className={cx('round grid size-9 place-items-center rounded-full border-[1.5px] border-ink', i === 1 ? 'bg-ink' : 'bg-white')}>
                <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke={i === 1 ? '#fff' : '#0f0f0f'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d} />
                </svg>
              </span>
            ))}
          </div>
        </Plane>

        {/* Chat */}
        <Plane plane="left" x={188} y={52} w={214} h={236} z={3} delay={0.15}>
          <div className="flex h-full flex-col p-3.5">
            <p className="font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">Lisbon chat</p>
            <p className="mt-1 flex items-center justify-end gap-1 text-[12px] font-semibold text-ink">
              <UserRound className="size-3.5 fill-ink" aria-hidden />
              42
            </p>
            <div className="mt-2 border-t border-line" />
            <div className="flex flex-1 flex-col justify-end gap-2 pb-2">
              <span className="flex w-[78%] gap-1 rounded-[10px] bg-mist-2 p-2">
                <i className={cx(ghost, 'h-2 w-8 bg-[#cfcfcc]')} />
                <i className={cx(ghost, 'h-2 w-10 bg-[#cfcfcc]')} />
                <i className={cx(ghost, 'h-2 w-6 bg-[#cfcfcc]')} />
              </span>
              {bubbles.map((b) => (
                <span key={b} className="flex w-[66%] gap-1 self-end rounded-[10px] border-[1.5px] border-ink bg-mint p-2 animate-pop-in" style={{ transformOrigin: 'right center' }}>
                  <i className={cx(bar, 'h-2.5 w-9')} />
                  <i className={cx(bar, 'h-2.5', b % 2 ? 'w-5' : 'w-8')} />
                </span>
              ))}
              <span className={cx('flex w-12 items-center gap-1 rounded-[10px] bg-mist-2 px-2.5 py-2 transition-opacity', typing ? 'opacity-100' : 'opacity-0')} aria-hidden>
                {[0, 1, 2].map((i) => (
                  <i key={i} className="round block size-1.5 animate-typing rounded-full bg-ink" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </div>
            <span className="rounded-[9px] border border-line px-2.5 py-1.5 text-[10.5px] text-faint">Message…</span>
          </div>
        </Plane>

        {/* To-do list */}
        <Plane plane="left" x={190} y={292} w={196} h={166} z={4} delay={0.3}>
          <div className="p-3.5">
            <p className="font-display text-[15px] font-semibold tracking-[-0.01em] text-ink">To-do list</p>
            <ul className="mt-2 space-y-[5px]">
              {shown.map((t, i) => (
                <li key={t.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={t.done}
                    aria-label={t.title}
                    onClick={() => toggle(t.id)}
                    className={cx('grid size-[22px] shrink-0 place-items-center rounded-[6px] border-[1.5px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink', t.done ? 'border-ink bg-mint' : 'border-line-strong bg-white hover:border-ink')}
                  >
                    <Check className={cx('size-3.5 transition-opacity', t.done ? 'opacity-100' : 'opacity-0')} strokeWidth={3} aria-hidden />
                  </button>
                  <span className="flex gap-1">
                    <i className={cx(t.done ? bar : ghost, 'h-2.5 transition-colors duration-300', i % 2 ? 'w-6' : 'w-9')} />
                    <i className={cx(t.done ? bar : ghost, 'h-2.5 transition-colors duration-300', i % 2 ? 'w-10' : 'w-5')} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Plane>

        {/* Overall tasks performance */}
        <Plane plane="top" x={343} y={296} w={204} h={90} z={5} delay={0.45}>
          <div className="flex h-full items-center gap-3 px-3.5">
            <span className="flex h-12 items-end gap-[5px]" aria-hidden>
              {[30, 64, 42, 88, 55, 100, 70].map((h, i) => (
                <i key={i} className={cx('block w-[4px] rounded-[2px]', i === 5 ? 'bg-ink' : 'bg-ink/80')} style={{ height: `${Math.min(100, h * (0.6 + completion(tasks) * 0.5))}%`, transition: 'height .5s var(--ease-brand)' }} />
              ))}
            </span>
            <span className="flex flex-1 flex-col items-end gap-2 text-right">
              <span className="text-[10.5px] font-medium leading-tight text-ink">
                Overall tasks
                <br />
                performance
              </span>
              <span className="flex items-center gap-1 font-display text-[16px] font-semibold tracking-[-0.02em] text-ink tabular-nums" aria-live="polite">
                {pct.toFixed(1)}%
                <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden>
                  <path d="M5 1 9.5 9h-9z" fill="#0f0f0f" />
                </svg>
              </span>
            </span>
          </div>
        </Plane>

        {/* Calendar */}
        <Plane plane="top" x={138} y={80} w={96} h={156} z={6} delay={0.6} className="overflow-visible">
          <div className="flex h-full gap-2 p-2.5">
            <span className="flex flex-col justify-between py-1 text-[9px] font-medium leading-none text-ink">
              {['9:00', '10:00', '11:00', '12:00'].map((h) => (
                <span key={h}>{h}</span>
              ))}
            </span>
            <span className="flex flex-1 flex-col gap-2 py-1">
              <span className="h-9 rounded-[8px] border-[1.5px] border-ink bg-white" />
              <span className="h-14 rounded-[8px] border-[1.5px] border-ink bg-white" />
            </span>
          </div>
          <span className="absolute -left-[1px] bottom-[-14px] rounded-[6px] bg-ink px-2 py-1 text-[9.5px] font-semibold tracking-[0.02em] text-white">{dayTag}</span>
        </Plane>
      </figure>
    </div>
  )
}
