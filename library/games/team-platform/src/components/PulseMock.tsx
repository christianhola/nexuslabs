import { pulse } from '../content'
import { cx } from '../lib/cx'
import { usePulseVote } from '../lib/stores'
import { Button } from './Button'

/* This week's pulse question. Your answer is saved and joins the results. */
export function PulseMock({ compact }: { compact?: boolean }) {
  const [vote, setVote] = usePulseVote()
  const total = pulse.options.reduce((s, o) => s + o.votes, 0) + (vote ? 1 : 0)
  return (
    <div className={cx(compact ? 'px-3' : 'rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-[var(--shadow-card)] sm:p-6')}>
      <p className="text-[13px] font-medium text-faint">Pulse · closes Friday</p>
      <p id="pulse-q" className="mt-1 font-display text-[19px] font-semibold leading-snug tracking-[-0.02em] text-ink">
        {pulse.question}
      </p>
      {!vote ? (
        <div role="group" aria-labelledby="pulse-q" className="mt-4 grid grid-cols-2 gap-2">
          {pulse.options.map((o) => (
            <button key={o.id} type="button" onClick={() => setVote(o.id)} className="h-12 rounded-[12px] border-[1.5px] border-line-strong bg-card text-[15px] font-medium text-ink transition-colors hover:border-ink hover:bg-mint-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4" aria-live="polite">
          <ul className="space-y-2.5">
            {pulse.options.map((o) => {
              const n = o.votes + (vote === o.id ? 1 : 0)
              const pct = Math.round((n / total) * 100)
              return (
                <li key={o.id}>
                  <div className="flex justify-between text-[14px]">
                    <span className={cx('text-ink', vote === o.id && 'font-semibold')}>
                      {o.label}
                      {vote === o.id ? ' (you)' : ''}
                    </span>
                    <span className="tabular-nums text-muted">{pct}%</span>
                  </div>
                  <div className="round mt-1 h-2.5 overflow-hidden rounded-full bg-mist-2">
                    <div className={cx('round h-full rounded-full transition-[width] duration-700 ease-[var(--ease-brand)]', vote === o.id ? 'border border-ink bg-mint' : 'bg-ink/80')} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[13px] text-faint tabular-nums">{total.toLocaleString('en-US')} answers</p>
            <Button size="sm" variant="ghost" onClick={() => setVote(null)}>
              Change answer
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
