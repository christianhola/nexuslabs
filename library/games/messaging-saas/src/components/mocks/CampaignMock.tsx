import { TrendingUp } from 'lucide-react'
import { useState } from 'react'

import { campaigns as seed, revenueSeries } from '../../content'
import { cx } from '../../lib/cx'
import { Badge } from '../Badge'
import { SegmentedControl } from '../SegmentedControl'
import { Switch } from '../Switch'
import { AppWindow } from './AppWindow'
import { LineChart } from './LineChart'

type Range = keyof typeof revenueSeries

/** The campaigns dashboard: lift chart by range and a list of campaigns you can pause. */
export function CampaignMock({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [range, setRange] = useState<Range>('30d')
  const [list, setList] = useState(seed)
  const s = revenueSeries[range]
  const total = s.relay.reduce((a, b) => a + b, 0)
  const base = s.base.reduce((a, b) => a + b, 0)
  const lift = Math.round(((total - base) / base) * 100)

  return (
    <AppWindow
      title="Campaigns · Relaytext"
      className={className}
      actions={
        <SegmentedControl
          size="sm"
          label="Date range"
          value={range}
          onChange={setRange}
          options={[
            { value: '7d', label: '7d' },
            { value: '30d', label: '30d' },
            { value: '90d', label: '90d' },
          ]}
        />
      }
    >
      <div className="grid gap-5 p-5">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <p className="text-[12px] font-medium text-faint">Revenue from SMS · {s.label}</p>
            <p className="font-display text-[34px] font-semibold tracking-[-0.02em] text-white tabular-nums">${total.toLocaleString('en-US')}k</p>
          </div>
          <Badge tone="mint" className="mb-2">
            <TrendingUp aria-hidden className="size-3.5" /> +{lift}% vs holdout
          </Badge>
          <div className="mb-2 ml-auto flex items-center gap-4 text-[12px] text-muted">
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-0.5 w-4 rounded bg-cobalt-text" /> Relaytext
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="h-0 w-4 border-t-2 border-dashed border-faint" /> Conventional SMS
            </span>
          </div>
        </div>
        <LineChart relay={s.relay} base={s.base} height={compact ? 170 : 210} label={`Revenue per day, ${s.label.toLowerCase()}`} />
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Campaign list">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <caption className="sr-only">Campaigns</caption>
            <thead className="text-[11px] uppercase tracking-[0.1em] text-faint">
              <tr className="border-b border-line">
                <th scope="col" className="py-2 font-semibold">Campaign</th>
                <th scope="col" className="py-2 font-semibold">Sent</th>
                <th scope="col" className="py-2 font-semibold">Revenue</th>
                <th scope="col" className="py-2 font-semibold">Lift</th>
                <th scope="col" className="py-2 text-right font-semibold">Live</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, compact ? 3 : 4).map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0">
                  <td className="py-2.5">
                    <span className="block font-semibold text-white">{c.name}</span>
                    <span className="block text-[12px] text-faint">{c.audience}</span>
                  </td>
                  <td className="py-2.5 tabular-nums text-soft">{c.sent}</td>
                  <td className="py-2.5 tabular-nums text-soft">{c.revenue}</td>
                  <td className="py-2.5 tabular-nums font-semibold text-mint-text">+{c.lift}%</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-2">
                      <span className={cx('text-[12px]', c.live ? 'text-mint-text' : 'text-faint')}>{c.live ? 'Live' : 'Paused'}</span>
                      <Switch label={`${c.name} live`} checked={c.live} onChange={(v) => setList((l) => l.map((x) => (x.id === c.id ? { ...x, live: v } : x)))} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppWindow>
  )
}
