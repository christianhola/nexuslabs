import { RotateCcw } from 'lucide-react'
import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { AGENT_TERMINAL } from '@/content'
import { cn } from '@/lib/cn'

/** A tiny pixel kestrel: the invented agent's mascot. */
function Mascot() {
  // 8×5 pixel grid, 1 = ember, 2 = dark eye.
  const px = ['01111110', '11211211', '11111111', '01111110', '10100101']
  return (
    <svg viewBox="0 0 8 5" width="56" height="35" shapeRendering="crispEdges" aria-hidden>
      {px.flatMap((row, y) => [...row].map((c, x) => (c === '0' ? null : <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={c === '2' ? '#121110' : '#d9544f'} />)))}
    </svg>
  )
}

/**
 * The agent terminal from the hero: an invented coding agent acting on
 * recordings. Lines reveal one by one when it scrolls into view; reduced
 * motion shows everything at once. `replay` restarts it.
 */
export function Terminal({ className, dim, chrome = true }: { className?: string; dim?: boolean; chrome?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const reduce = useReducedMotion()
  const total = AGENT_TERMINAL.lines.length + 1
  const [shown, setShown] = useState(0)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setShown(total)
      return
    }
    setShown(0)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setShown(i)
      if (i >= total) window.clearInterval(id)
    }, 650)
    return () => window.clearInterval(id)
  }, [inView, reduce, total, run])

  const t = AGENT_TERMINAL
  return (
    <div ref={ref} className={cn('relative overflow-hidden rounded-[14px] bg-[#121110] font-mono text-[14px] leading-[19px] ring-1 ring-line', className)}>
      {chrome && (
        <div className="flex h-[52px] items-center gap-[10px] px-[18px]">
          <span className="size-[13px] rounded-full bg-[#e5484d]/80" />
          <span className="size-[13px] rounded-full bg-[#e1a23a]/80" />
          <span className="size-[13px] rounded-full bg-[#3fae5a]/80" />
          <button type="button" onClick={() => setRun((r) => r + 1)} className="ml-auto inline-flex size-10 items-center justify-center rounded-full text-faint hover:bg-surface-2 hover:text-fg" aria-label="Replay the agent run">
            <RotateCcw className="size-4" />
          </button>
        </div>
      )}
      <div className={cn('px-[18px] pb-6', dim && '[&_.text-muted]:text-[#9a948a]')} aria-live="polite">
        <div className="mt-[30px] flex gap-[28px]">
          <Mascot />
          <div>
            <p>
              <b className="font-semibold text-fg">{t.app}</b> <span className="text-faint">{t.version}</span>
            </p>
            <p className="text-faint">{t.model}</p>
            <p className="text-faint">{t.cwd}</p>
          </div>
        </div>
        <p className="mt-[23px] -mx-1 rounded-[4px] bg-white/[0.05] px-1 text-muted">
          <span className="text-faint">&gt; </span>
          {t.prompt}
        </p>
        <div className="mt-[18px] space-y-[18px]">
          {t.lines.slice(0, Math.max(0, shown - 1)).map((l, i) => (
            <p key={i} className={cn(l.kind === 'tool' && 'text-faint', l.kind === 'say' && 'text-muted', l.kind === 'item' && '-mt-[14px] pl-[2ch] text-muted')}>
              {l.kind === 'tool' && <span className="mr-[1ch] text-ok">●</span>}
              {l.kind === 'item' && <span className="text-faint">- </span>}
              {l.text}
            </p>
          ))}
          {shown < total && <span className="inline-block h-[17px] w-[9px] animate-caret bg-muted align-middle" aria-hidden />}
        </div>
      </div>
    </div>
  )
}
