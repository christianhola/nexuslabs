import { ArrowLeftRight, Check, RotateCcw } from 'lucide-react'

import { seedTasks, shifts } from '../content'
import { cx } from '../lib/cx'
import { completion, useSwaps, useTasks } from '../lib/stores'
import { Badge } from './Badge'
import { Button } from './Button'

/* The opening checklist with a live completion rate. Saved in this browser. */
export function TaskList({ compact }: { compact?: boolean }) {
  const [tasks, setTasks] = useTasks()
  const pct = Math.round(completion(tasks) * 100)
  return (
    <div className={cx(compact ? 'px-3' : 'rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6')}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">Store opening</p>
          <p className="text-[13px] text-faint">Berlin Mitte · due 08:30</p>
        </div>
        <p className="font-display text-[28px] font-semibold tracking-[-0.03em] text-ink tabular-nums" aria-live="polite">
          {pct}%
        </p>
      </div>
      <div className="round mt-3 h-2 overflow-hidden rounded-full bg-mist-2" role="progressbar" aria-label="Checklist progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="round h-full rounded-full border border-ink bg-mint transition-[width] duration-500 ease-[var(--ease-brand)]" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 space-y-1.5">
        {tasks.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={t.done}
              onClick={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
              className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2.5 text-left hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink"
            >
              <span className={cx('grid size-[22px] shrink-0 place-items-center rounded-[6px] border-[1.5px] transition-colors', t.done ? 'border-ink bg-mint' : 'border-line-strong')}>
                <Check className={cx('size-3.5', t.done ? 'opacity-100' : 'opacity-0')} strokeWidth={3} aria-hidden />
              </span>
              <span className={cx('text-[14.5px] transition-colors', t.done ? 'text-faint line-through decoration-faint' : 'text-ink')}>{t.title}</span>
            </button>
          </li>
        ))}
      </ul>
      {pct === 100 ? (
        <p role="status" className="mt-3 rounded-[10px] bg-mint-soft px-3 py-2 text-[13.5px] font-medium text-leaf">
          All done. Your area manager has been told.
        </p>
      ) : null}
      {!compact ? (
        <Button size="sm" variant="ghost" className="mt-3" icon={<RotateCcw className="size-4" aria-hidden />} onClick={() => setTasks(seedTasks)}>
          Reset checklist
        </Button>
      ) : null}
    </div>
  )
}

/* Upcoming shifts with one-tap swap requests. */
export function ShiftList() {
  const [swaps, setSwaps] = useSwaps()
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
      <p className="font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">Your next shifts</p>
      <p className="text-[13px] text-faint">Synced from Deputy</p>
      <ul className="mt-4 divide-y divide-line">
        {shifts.map((s) => {
          const asked = swaps.includes(s.id)
          return (
            <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
              <span className="grid w-14 shrink-0 place-items-center rounded-[10px] border-[1.5px] border-ink py-1.5 text-center">
                <span className="text-[11px] font-medium text-muted">{s.day.split(' ')[0]}</span>
                <span className="font-display text-[18px] font-semibold leading-none text-ink">{s.day.split(' ')[1]}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-ink tabular-nums">{s.time}</span>
                <span className="block text-[13px] text-muted">{s.site}</span>
              </span>
              {!s.swappable ? (
                <Badge>Locked</Badge>
              ) : asked ? (
                <span className="flex items-center gap-2">
                  <Badge tone="warn">Swap requested</Badge>
                  <Button size="sm" variant="ghost" onClick={() => setSwaps((x) => x.filter((i) => i !== s.id))} aria-label={`Cancel swap for ${s.day}`}>
                    Cancel
                  </Button>
                </span>
              ) : (
                <Button size="sm" variant="soft" icon={<ArrowLeftRight className="size-4" aria-hidden />} onClick={() => setSwaps((x) => [...x, s.id])} aria-label={`Request a swap for ${s.day}`}>
                  Swap
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
