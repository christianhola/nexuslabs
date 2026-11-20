import { useCallback, useMemo, useState } from 'react'

import { AccountDrawer } from '../app/AccountDrawer'
import { CohortHeatmap } from '../app/CohortHeatmap'
import { HealthSwarm, type ViewMode } from '../app/HealthSwarm'
import { KpiStrip } from '../app/KpiStrip'
import { Watchlist } from '../app/Watchlist'
import { TextTabs } from '../components/TextTabs'
import { SEGMENTS, type Account, type Segment } from '../data'
import { kpis, watchlist } from '../lib/metrics'
import { useStore } from '../lib/store'

const MODES: ViewMode[] = ['Combined', 'By segment']

export function Overview() {
  const { accounts, settings, setThreshold, range } = useStore()
  const threshold = settings.threshold
  const [mode, setMode] = useState<ViewMode>('Combined')
  const [segment, setSegment] = useState<'All' | Segment>('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filters = useMemo<Array<'All' | Segment>>(() => ['All', ...SEGMENTS.filter((s) => !settings.excluded.includes(s))], [settings.excluded])
  const seg = filters.includes(segment) ? segment : 'All'
  const visible = useMemo(() => (seg === 'All' ? accounts : accounts.filter((a) => a.segment === seg)), [accounts, seg])
  const visibleIds = useMemo(() => new Set(visible.map((a) => a.id)), [visible])
  const k = useMemo(() => kpis(visible, threshold, range), [visible, threshold, range])
  const watch = useMemo(() => watchlist(visible, threshold), [visible, threshold])
  const selected = accounts.find((a) => a.id === selectedId) ?? null

  const select = useCallback((a: Account) => setSelectedId(a.id), [])
  const close = useCallback(() => setSelectedId(null), [])

  return (
    <>
      <h2 className="sr-only" tabIndex={-1} data-page-title>
        Overview
      </h2>
      <div className="mt-6 sm:mt-[26px]">
        <KpiStrip k={k} range={range} />
      </div>

      <div className="mt-10 flex animate-rise flex-wrap items-center gap-x-[58px] gap-y-3 [animation-delay:220ms] sm:mt-[60px]">
        <TextTabs label="Chart layout" options={MODES} value={mode} onChange={setMode} separator="·" />
        <TextTabs label="Segment" options={filters} value={seg} onChange={setSegment} className="gap-5 sm:gap-[35px]" />
      </div>

      <div className="mt-7 animate-fade [animation-delay:300ms] sm:mt-[34px]">
        <HealthSwarm accounts={accounts} visibleIds={visibleIds} mode={mode} threshold={threshold} onThreshold={setThreshold} onSelect={select} />
      </div>

      <div className="mt-8 sm:mt-[46px]">
        <Watchlist accounts={watch} threshold={threshold} range={range} onSelect={select} />
      </div>

      <div className="mt-8 sm:mt-10">
        <CohortHeatmap accounts={visible} range={range} />
      </div>

      <AccountDrawer account={selected} onClose={close} />
    </>
  )
}
