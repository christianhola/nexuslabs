import { useInView } from 'motion/react'
import { useRef, type CSSProperties, type ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  Small animated product mocks for the features preview. Pure CSS loops
  (keyframes `mock-*` in styles.css) that only run while on screen, and hold
  a finished frame under prefers-reduced-motion. All decorative: the card
  around each one carries the real text.
*/

export type MockKind = 'board' | 'docs' | 'chat' | 'dashboard'

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` })

/** A tiny app window: title bar with three dots, content below. */
export function MockFrame({ children, className, playing }: { children: ReactNode; className?: string; playing?: boolean }) {
  return (
    <div
      aria-hidden="true"
      data-playing={playing ? 'true' : 'false'}
      className={cx('mock relative overflow-hidden rounded-card border border-line-soft bg-white shadow-card', className)}
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-line-soft bg-stage px-3">
        <span className="size-[7px] rounded-full bg-line" />
        <span className="size-[7px] rounded-full bg-line" />
        <span className="size-[7px] rounded-full bg-line" />
      </div>
      <div className="relative h-[168px] p-3.5">{children}</div>
    </div>
  )
}

function Bar({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span className={cx('block h-[6px] rounded-full bg-line-soft', className)} style={style} />
}

function BoardMock() {
  const columns = ['To do', 'Doing', 'Done']
  return (
    <div className="relative grid h-full grid-cols-3 gap-2">
      {columns.map((name, c) => (
        <div key={name} className="rounded-[4px] bg-stage p-1.5">
          <p className="mb-1.5 px-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">{name}</p>
          {/* The top slot of each column is where the moving card lands. */}
          <div className="mb-1.5 h-[30px]" />
          {Array.from({ length: c === 2 ? 1 : 2 }).map((_, i) => (
            <div key={i} className="mb-1.5 rounded-[3px] border border-line-soft bg-white p-1.5">
              <Bar className="w-4/5" />
              <Bar className="mt-1 w-1/2 bg-sunken" />
            </div>
          ))}
        </div>
      ))}
      {/* The card that moves across. Same width as a column. */}
      <div className="absolute left-0 top-[25px] w-[calc((100%-16px)/3)] px-1.5">
        <div data-anim className="mock-hop relative rounded-[3px] border border-accent/40 bg-white p-1.5 shadow-card">
          <span className="block h-[6px] w-4/5 rounded-full bg-accent/70" />
          <span className="mt-1 flex items-center justify-between">
            <span className="block h-[6px] w-1/2 rounded-full bg-accent-soft" />
            <span data-anim className="mock-check grid size-3 place-items-center rounded-full bg-success text-white">
              <svg viewBox="0 0 12 12" className="size-2" fill="none">
                <path d="M2.5 6.2l2.2 2.2L9.5 3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

function DocsMock() {
  const lines = ['w-[92%]', 'w-[86%]', 'w-[95%]', 'w-[60%]']
  return (
    <div className="flex h-full gap-3">
      <div className="hidden w-[26%] shrink-0 flex-col gap-1.5 border-r border-line-soft pr-2.5 min-[420px]:flex">
        <Bar className="w-3/4 bg-accent/60" />
        <Bar className="w-full" />
        <Bar className="w-2/3" />
        <Bar className="w-5/6" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block h-[10px] w-1/2 rounded-full bg-ink/80" />
        <div className="mt-3 space-y-2">
          {lines.map((w, i) => (
            <span key={i} data-anim className={cx('mock-write block h-[6px] rounded-full bg-line', w)} style={delay(i * 0.35)} />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5 rounded-[3px] border border-line-soft bg-stage p-1.5">
          <span className="size-3 rounded-[2px] bg-accent/70" />
          <span data-anim className="mock-write block h-[6px] w-[45%] rounded-full bg-line" style={delay(1.6)} />
          <span data-anim className="mock-caret -ml-1 block h-[10px] w-px bg-ink" />
        </div>
      </div>
    </div>
  )
}

function ChatMock() {
  return (
    <div className="flex h-full flex-col justify-end gap-2">
      <div data-anim className="mock-bubble flex items-end gap-1.5" style={delay(0)}>
        <span className="size-4 shrink-0 rounded-full bg-sunken" />
        <span className="rounded-[8px] rounded-bl-[2px] bg-stage px-2 py-1.5">
          <Bar className="w-24" />
          <Bar className="mt-1 w-16" />
        </span>
      </div>
      <div data-anim className="mock-bubble flex items-end justify-end gap-1.5" style={delay(0.7)}>
        <span className="rounded-[8px] rounded-br-[2px] bg-accent px-2 py-1.5">
          <span className="block h-[6px] w-20 rounded-full bg-white/80" />
        </span>
      </div>
      <div data-anim className="mock-bubble flex items-end gap-1.5" style={delay(1.4)}>
        <span className="size-4 shrink-0 rounded-full bg-accent-soft" />
        <span className="rounded-[8px] rounded-bl-[2px] bg-stage px-2 py-1.5">
          <Bar className="w-28" />
        </span>
      </div>
      <div className="flex items-center gap-1 pl-[22px]">
        {[0, 0.15, 0.3].map((d) => (
          <span key={d} data-anim className="mock-typing size-1.5 rounded-full bg-muted" style={delay(d)} />
        ))}
      </div>
    </div>
  )
}

function DashboardMock() {
  const bars = [42, 64, 50, 78, 58, 88, 70]
  return (
    <div className="flex h-full flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2">
        {['bg-accent', 'bg-success', 'bg-ink/70'].map((tone) => (
          <div key={tone} className="rounded-[3px] border border-line-soft p-1.5">
            <span className={cx('block h-1.5 w-1/3 rounded-full', tone)} />
            <span className="mt-1.5 block h-[9px] w-2/3 rounded-full bg-ink/80" />
          </div>
        ))}
      </div>
      <div className="relative flex flex-1 items-end gap-1.5 rounded-[3px] border border-line-soft px-2 pb-1.5 pt-3">
        {bars.map((h, i) => (
          <span key={i} data-anim className="mock-bar flex-1 rounded-t-[2px] bg-accent-soft" style={{ height: `${h}%`, ...delay(i * 0.08) }} />
        ))}
        <svg className="pointer-events-none absolute inset-x-2 bottom-1.5 top-3 h-[calc(100%-18px)] w-[calc(100%-16px)]" viewBox="0 0 100 50" preserveAspectRatio="none" fill="none">
          <path
            data-anim
            className="mock-draw"
            pathLength={1}
            d="M0 38 L16 28 L33 33 L50 18 L66 24 L83 8 L100 14"
            stroke="var(--color-accent)"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

const mocks: Record<MockKind, () => ReactNode> = {
  board: BoardMock,
  docs: DocsMock,
  chat: ChatMock,
  dashboard: DashboardMock,
}

/** One animated mock; plays while at least a third of it is visible. */
export function FeatureMock({ kind, className, forcePlaying }: { kind: MockKind; className?: string; forcePlaying?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.33 })
  const Mock = mocks[kind]
  return (
    <div ref={ref} className={className}>
      <MockFrame playing={forcePlaying ?? inView}>
        <Mock />
      </MockFrame>
    </div>
  )
}
