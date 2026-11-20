import { BarChart3, BookOpen, LayoutDashboard, Settings, Store, Users } from 'lucide-react'
import { useState } from 'react'

import { experience } from '../content'
import { cx } from '../lib/cx'
import { Mark } from './Logo'
import { BarSpark } from './BarSpark'
import { Segmented } from './Segmented'

/*
  The creator dashboard shown inside "Run your course business": a sidebar,
  a greeting, three stats and a revenue bar series. The Week | Month switch
  is live. Laid out at 620px; wrap it in <ScaledFrame> to fit.
*/
const month = { stats: ['$71,960', '2,410', '69%'], deltas: ['+18.2%', '+9.4%', '+2.1%'], spark: [40, 44, 38, 52, 49, 58, 61, 57, 66, 70, 68, 79] }

export function DashboardMock() {
  const [range, setRange] = useState<'week' | 'month'>('week')
  const d = experience.dashboard
  const nav = [
    { icon: LayoutDashboard, label: 'Home' },
    { icon: BookOpen, label: 'Courses' },
    { icon: Users, label: 'Learners' },
    { icon: Store, label: 'Storefront' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: Settings, label: 'Settings' },
  ]
  return (
    <div className="flex h-[360px] w-[620px] overflow-hidden rounded-[16px] border border-line bg-card shadow-float">
      <aside className="w-[150px] shrink-0 border-r border-line bg-wash px-3 py-4">
        <div className="flex items-center gap-2 px-1.5">
          <Mark className="size-5" />
          <span className="font-display text-[14px] font-medium text-ink">Coursekit</span>
        </div>
        <ul className="mt-5 flex flex-col gap-0.5">
          {nav.map((n, i) => (
            <li key={n.label} className={cx('flex h-8 items-center gap-2 rounded-[8px] px-2 text-[12.5px]', i === 0 ? 'bg-card font-medium text-ink shadow-[0_1px_3px_rgb(18_18_20/0.08)]' : 'text-muted')}>
              <n.icon className={cx('size-3.5', i === 0 && 'text-flame-ink')} aria-hidden />
              {n.label}
            </li>
          ))}
        </ul>
      </aside>
      <div className="min-w-0 flex-1 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-[18px] font-medium text-ink">{d.greeting}</p>
            <p className="text-[12px] text-muted">{d.sub.replace('this week', range === 'week' ? 'this week' : 'this month')}</p>
          </div>
          <Segmented size="xs" tone="white" label="Dashboard range" value={range} onChange={setRange} options={[{ value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-2.5">
          {d.stats.map((s, i) => (
            <li key={s.label} className="rounded-[12px] border border-line p-3">
              <p className="text-[11px] text-muted">{s.label}</p>
              <p className="mt-1 font-display text-[19px] font-medium tracking-[-0.02em] text-ink">{range === 'week' ? s.value : month.stats[i]}</p>
              <p className="mt-0.5 text-[11px] font-medium text-ok">{range === 'week' ? s.delta : month.deltas[i]}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 rounded-[12px] border border-line p-3">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-ink">Revenue</p>
            <p className="text-[11px] text-muted">{range === 'week' ? 'Last 12 days' : 'Last 12 weeks'}</p>
          </div>
          <div className="mt-2 h-[92px]">
            <BarSpark values={range === 'week' ? d.spark : month.spark} label={`Revenue bars for the last 12 ${range === 'week' ? 'days' : 'weeks'}, rising`} />
          </div>
        </div>
      </div>
    </div>
  )
}
