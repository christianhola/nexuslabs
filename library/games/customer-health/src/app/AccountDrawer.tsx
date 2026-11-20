import { useEffect, useState } from 'react'

import { ArrowUpRight, Check, Copy, PhoneCall } from 'lucide-react'

import { Link } from '../components/Link'
import { Overlay } from '../components/Overlay'
import { Pill, pillClass } from '../components/Pill'
import { SegmentTag } from '../components/SegmentTag'
import { Sparkline } from '../components/Sparkline'
import { Stat } from '../components/Stat'
import { useToast } from '../components/Toast'
import type { Account } from '../data'
import { cx } from '../lib/cx'
import { money, percent, shortDate, signed } from '../lib/format'
import { healthFill } from '../lib/healthColor'
import { current, daysUntil, drawdown, isStale, runwayWeeks, series, signals, wow } from '../lib/metrics'
import { useStore } from '../lib/store'

type AccountDrawerProps = {
  account: Account | null
  onClose: () => void
}

export function summaryText(a: Account, threshold: number, range: Parameters<typeof signals>[2]) {
  return [
    `${a.name} (${a.segment}) — health ${current(a)} (${signed(wow(a))} WoW, ${signed(drawdown(a))} from peak)`,
    `ARR ${money(a.arr)} · seats ${percent(a.seatUtilization)} · renews ${shortDate(a.renewal)} · owner ${a.owner}`,
    ...signals(a, threshold, range).map((s) => `- ${s.text}`),
  ].join('\n')
}

export function useAccountActions() {
  const { logTouch, undoTouch, settings, range } = useStore()
  const toast = useToast()
  return {
    logTouch: (a: Account) => {
      const previous = a.lastTouchDays
      logTouch(a.id)
      toast.show({ tone: 'success', title: 'Touch logged', body: `${a.name} · last touch is now today`, action: { label: 'Undo', run: () => undoTouch(a.id, previous) } })
    },
    copySummary: async (a: Account) => {
      try {
        await navigator.clipboard.writeText(summaryText(a, settings.threshold, range))
        toast.show({ tone: 'success', title: 'Summary copied', body: `${a.name} brief is on your clipboard` })
        return true
      } catch {
        toast.show({ tone: 'error', title: 'Could not copy', body: 'The browser blocked clipboard access.' })
        return false
      }
    },
  }
}

export function AccountDrawer({ account, onClose }: AccountDrawerProps) {
  const { settings, range } = useStore()
  const threshold = settings.threshold
  const actions = useAccountActions()
  // Keep the last account while the drawer animates out.
  const [shown, setShown] = useState<Account | null>(account)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (account) setShown(account)
    setCopied(false)
  }, [account])

  const a = account ?? shown
  const runway = a ? runwayWeeks(a, threshold) : null
  const values = a ? series(a).slice(-14) : []

  return (
    <Overlay open={account !== null} onClose={onClose} label={a ? `${a.name} details` : 'Account details'} kind="drawer">
      {a && (
        <div className="flex flex-1 flex-col px-6 pt-7 pb-8 sm:px-8">
          <div className="flex items-center gap-3 pr-10">
            <SegmentTag>{a.segment}</SegmentTag>
            <span aria-hidden="true" className="text-faint">·</span>
            <span className="text-[13px] text-muted">{a.owner}</span>
          </div>
          <h2 className="mt-3 font-serif text-[30px] leading-[1.05] font-normal tracking-[-0.012em]">{a.name}</h2>

          <div className="mt-7 flex items-end justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="size-3 translate-y-[-6px] rounded-full" style={{ background: healthFill(current(a)) }} />
              <span className="tnum font-mono text-[56px] leading-none font-light">{current(a)}</span>
              <span className="font-mono text-[14px] text-muted">/100</span>
            </div>
            <div className="tnum pb-1.5 text-right font-mono text-[12.5px] leading-relaxed">
              <div className={wow(a) < 0 ? 'text-risk' : 'text-muted'}>{signed(wow(a))} week over week</div>
              <div className={drawdown(a) <= -10 ? 'text-risk' : 'text-muted'}>{signed(drawdown(a))} from 13-week peak</div>
            </div>
          </div>

          <div className="mt-6">
            <Sparkline key={a.id} values={values} width={396} height={120} domain={[0, 100]} threshold={threshold} area dotRadius={3.5} windowStart={values.length - 1 - range} className="h-auto w-full" />
            <div className="caps mt-2 flex justify-between text-[9.5px] tracking-[0.2em] text-muted">
              <span>13 wks ago</span>
              <span>{range} wks ago</span>
              <span>Now</span>
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5">
            <Stat label="ARR">{money(a.arr)}</Stat>
            <Stat label="Seats active">{percent(a.seatUtilization)}</Stat>
            <Stat label="Runway" alert={runway !== null && runway <= 4}>
              {runway === null ? (current(a) < threshold ? 'Under threshold' : '—') : `~${Math.max(1, Math.round(runway))} wks`}
            </Stat>
            <Stat label="Last touch" alert={isStale(a)}>
              {a.lastTouchDays === 0 ? 'Today' : `${a.lastTouchDays} days ago`}
            </Stat>
            <Stat label="Renewal">{shortDate(a.renewal)}</Stat>
            <Stat label="Days to renewal">{daysUntil(a.renewal)}</Stat>
          </dl>

          <h3 className="caps mt-8 text-[10px] tracking-[0.22em] text-muted">Signals</h3>
          <ul className="mt-3 space-y-2.5">
            {signals(a, threshold, range).map((s, i) => (
              <li key={s.text} className="flex animate-rise items-start gap-3 text-[14px]" style={{ animationDelay: `${120 + i * 50}ms` }}>
                <span className={cx('mt-[7px] size-1.5 shrink-0 rounded-full', s.bad ? 'bg-risk' : 'bg-high')} />
                {s.text}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap gap-3 pt-9">
            <Pill
              variant="solid"
              icon={a.lastTouchDays === 0 ? <Check strokeWidth={2} /> : <PhoneCall strokeWidth={1.75} />}
              onClick={() => actions.logTouch(a)}
              disabled={a.lastTouchDays === 0}
            >
              {a.lastTouchDays === 0 ? 'Touch logged' : 'Log touch'}
            </Pill>
            <Pill
              variant="outline"
              icon={copied ? <Check strokeWidth={2} /> : <Copy strokeWidth={1.75} />}
              onClick={async () => {
                if (await actions.copySummary(a)) {
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 1600)
                }
              }}
            >
              {copied ? 'Copied' : 'Copy summary'}
            </Pill>
            <Link to={`/accounts/${a.id}`} onClick={onClose} className={pillClass('ghost')}>
              <span className="-mr-[0.26em]">Open account</span>
              <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      )}
    </Overlay>
  )
}
