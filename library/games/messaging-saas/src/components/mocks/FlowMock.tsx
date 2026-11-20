import { Clock, GitBranch, MessageSquareText, Play, ShoppingCart, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { flowNodes } from '../../content'
import type { FlowNode } from '../../content'
import { cx } from '../../lib/cx'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { AppWindow } from './AppWindow'

const icon: Record<FlowNode['kind'], typeof Zap> = { trigger: Zap, wait: Clock, message: MessageSquareText, branch: GitBranch, action: ShoppingCart }
const tint: Record<FlowNode['kind'], string> = {
  trigger: 'bg-saffron text-bg',
  wait: 'bg-white/[0.1] text-white',
  message: 'bg-cobalt text-white',
  branch: 'bg-cherry text-white',
  action: 'bg-[#18704b] text-white',
}

/** The flow builder: select a step to see its settings; "Test run" walks a shopper through it. */
export function FlowMock({ className }: { className?: string }) {
  const [selected, setSelected] = useState(flowNodes[2].id)
  const [running, setRunning] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const timer = useRef<number>(0)
  const reduce = useReducedMotion()
  const node = flowNodes.find((n) => n.id === selected)!

  useEffect(() => () => clearTimeout(timer.current), [])

  const run = () => {
    setDone(false)
    const step = (i: number) => {
      setRunning(i)
      if (i >= flowNodes.length) {
        setRunning(null)
        setDone(true)
        return
      }
      timer.current = window.setTimeout(() => step(i + 1), reduce ? 60 : 650)
    }
    step(0)
  }

  return (
    <AppWindow
      title="Flows · Abandoned cart"
      className={className}
      actions={
        <Button size="sm" variant="subtle" onClick={run} disabled={running !== null} className="h-8 text-[13px]">
          <Play aria-hidden className="size-3.5" /> {running !== null ? 'Running…' : 'Test run'}
        </Button>
      }
    >
      <div className="grid min-h-[460px] md:grid-cols-[1fr_240px]">
        <ol className="relative grid content-start gap-0 p-5" aria-label="Flow steps">
          {flowNodes.map((n, i) => {
            const Icon = icon[n.kind]
            const active = running === i
            const passed = running !== null ? i < running : done
            return (
              <li key={n.id} className="relative">
                {i > 0 ? <span aria-hidden className={cx('mx-auto block h-6 w-px transition-colors duration-300', passed || active ? 'bg-cobalt-text' : 'bg-line-strong')} /> : null}
                <button
                  type="button"
                  onClick={() => setSelected(n.id)}
                  aria-pressed={selected === n.id}
                  className={cx(
                    'mx-auto flex w-full max-w-[380px] items-center gap-3 rounded-[12px] border bg-panel p-3 text-left transition-[border-color,box-shadow,transform] duration-300',
                    selected === n.id ? 'border-cobalt-text shadow-[0_0_0_3px_rgb(47_102_232/0.25)]' : 'border-line hover:border-line-strong',
                    active && 'scale-[1.03] border-cobalt-text shadow-glow',
                  )}
                >
                  <span className={cx('grid size-9 shrink-0 place-items-center rounded-[9px]', tint[n.kind])}>
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="grid min-w-0">
                    <span className="text-[13px] font-semibold text-white">{n.title}</span>
                    <span className="truncate text-[12px] text-muted">{n.detail}</span>
                  </span>
                  {passed ? <span className="ml-auto text-[11px] font-semibold text-mint-text">✓</span> : null}
                </button>
              </li>
            )
          })}
          <li aria-live="polite" className="mt-4 text-center text-[12px] text-faint">
            {done ? 'Test shopper checked out: $48.00 on saved card.' : running !== null ? `Step ${Math.min(running + 1, flowNodes.length)} of ${flowNodes.length}` : 'Select a step to edit it.'}
          </li>
        </ol>
        <aside aria-label="Step settings" className="border-t border-line p-5 md:border-l md:border-t-0">
          <Badge tone="cobalt" className="capitalize">{node.kind}</Badge>
          <p className="mt-3 font-display text-[17px] font-semibold text-white">{node.title}</p>
          <dl className="mt-4 grid gap-3">
            {node.settings.map((s) => (
              <div key={s.label} className="rounded-[10px] border border-line bg-white/[0.03] p-3">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-faint">{s.label}</dt>
                <dd className="mt-1 text-[13px] text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </AppWindow>
  )
}
