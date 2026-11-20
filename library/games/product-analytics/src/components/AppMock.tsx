import {
  BadgeCheck,
  Check,
  Bell,
  Filter,
  HelpCircle,
  LayoutGrid,
  MessageSquare,
  PanelLeft,
  Route,
  Search,
  Settings,
  Share2,
  Shield,
  SearchX,
  TrendingDown,
  TrendingUp,
  Users,
  Star,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { accountFilters, accounts, defaultFilters, funnels, mockNav, overview, signalFeed } from '../content'
import type { Account, FilterKey, MockView, Platform } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'
import { Avatar } from './Avatar'
import { Button, IconButton } from './Button'
import { Chip } from './Chip'
import { EmptyState } from './EmptyState'
import { FunnelChart } from './FunnelChart'
import { LineChart } from './LineChart'
import { FilterMenu } from './Menu'
import { Segmented } from './Segmented'
import { Sparkline } from './Sparkline'

/*
  The live product mock in the hero: a Pulseboard workspace with a sidebar,
  an Accounts-at-risk list (platform switch, filter menus, removable chips,
  search, watch toggles), an Overview and a Funnel view. It is laid out at
  a fixed 1200px and scaled to fit by <ScaledFrame>. State persists in
  localStorage under pulseboard:mock.
*/

const icons: Record<string, ReactNode> = {
  grid: <LayoutGrid aria-hidden />,
  filter: <Filter aria-hidden />,
  users: <Users aria-hidden />,
  route: <Route aria-hidden />,
  bell: <Bell aria-hidden />,
  shield: <Shield aria-hidden />,
  settings: <Settings aria-hidden />,
  help: <HelpCircle aria-hidden />,
}

type MockState = { view: MockView; platform: Platform; filters: Record<FilterKey, string[]>; query: string; watched: string[] }
const initial: MockState = { view: 'accounts', platform: 'web', filters: defaultFilters, query: '', watched: ['a2'] }

const thresholds: Record<string, number> = { '> 30%': 30, '> 40%': 40, '> 50%': 50 }

export function filterAccounts(list: Account[], s: Pick<MockState, 'platform' | 'filters' | 'query'>) {
  const q = s.query.trim().toLowerCase()
  const minDrop = s.filters.drop.length ? Math.min(...s.filters.drop.map((d) => thresholds[d] ?? 0)) : 0
  return list.filter(
    (a) =>
      a.platform.includes(s.platform) &&
      (!s.filters.plan.length || s.filters.plan.includes(a.plan)) &&
      a.drop > minDrop &&
      (!s.filters.region.length || s.filters.region.includes(a.region)) &&
      (!s.filters.owner.length || s.filters.owner.includes(a.owner)) &&
      (!q || a.name.toLowerCase().includes(q) || a.domain.includes(q) || a.tags.some((t) => t.label.toLowerCase().includes(q))),
  )
}

export function AppMock({ className, storageKey = 'mock' }: { className?: string; storageKey?: string }) {
  const [state, setState] = useStored<MockState>(storageKey, initial)
  const s = { ...initial, ...state, filters: { ...initial.filters, ...state.filters } }
  const set = (patch: Partial<MockState>) => setState((prev) => ({ ...initial, ...prev, ...patch }))
  const title = [...mockNav.main, ...mockNav.support].find((n) => n.id === s.view)?.label ?? 'Accounts'

  return (
    <div className={cx('flex h-[720px] w-[1200px] overflow-hidden rounded-[18px] bg-card text-left text-[13px] text-body', className)}>
      {/* Sidebar */}
      <nav aria-label="Demo workspace" className="flex w-[176px] shrink-0 flex-col gap-1 border-r border-line bg-[#f7f8f6] px-3 py-4">
        <div className="mb-4 flex items-center justify-between px-1.5">
          <span className="grid size-7 place-items-center rounded-[8px] bg-lime font-display text-[11px] font-extrabold text-ink">PB</span>
          <PanelLeft className="size-4 text-muted" aria-hidden />
        </div>
        <p className="px-2 pb-1 text-[11px] text-faint">Main menu</p>
        {mockNav.main.map((n) => (
          <NavItem key={n.id} active={s.view === n.id} onClick={() => set({ view: n.id })} icon={icons[n.icon]} badge={'badge' in n ? n.badge : undefined}>
            {n.label}
          </NavItem>
        ))}
        <p className="mt-5 px-2 pb-1 text-[11px] text-faint">Support</p>
        {mockNav.support.map((n) => (
          <NavItem key={n.id} active={s.view === n.id} onClick={() => set({ view: n.id })} icon={icons[n.icon]}>
            {n.label}
          </NavItem>
        ))}
      </nav>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col px-9 py-5">
        <div className="flex items-center justify-between gap-6">
          <p className="text-[11.5px] text-faint">
            Workspace <span aria-hidden>/</span> <span className="text-ink">{title}</span>
          </p>
          <label className="flex h-9 w-[236px] items-center gap-2 rounded-[10px] bg-wash px-3 text-[12px]">
            <Search className="size-3.5 text-ink" aria-hidden />
            <span className="sr-only">Search accounts</span>
            <input
              value={s.query}
              onChange={(e) => set({ query: e.target.value, view: 'accounts' })}
              placeholder="Search for anything..."
              className="min-w-0 flex-1 bg-transparent text-ink placeholder:text-faint focus:outline-none"
            />
          </label>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={s.view} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="flex min-h-0 flex-1 flex-col">
            {s.view === 'accounts' ? (
              <AccountsView s={s} set={set} />
            ) : s.view === 'overview' ? (
              <OverviewView />
            ) : s.view === 'funnels' ? (
              <FunnelsView />
            ) : (
              <div className="pt-8">
                <h3 className="font-display text-[26px] font-bold tracking-[-0.035em] text-ink">{title}</h3>
                <EmptyState
                  className="mt-6"
                  icon={icons[[...mockNav.main, ...mockNav.support].find((n) => n.id === s.view)?.icon ?? 'grid']}
                  title={`${title} is not part of this demo`}
                  body="The live demo covers Overview, Funnels and Accounts. Start a free workspace to explore the rest."
                  action={
                    <Button size="sm" variant="dark" onClick={() => set({ view: 'accounts' })}>
                      Back to Accounts
                    </Button>
                  }
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function NavItem({ children, active, onClick, icon, badge }: { children: ReactNode; active: boolean; onClick: () => void; icon: ReactNode; badge?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'flex h-8 w-full items-center gap-2.5 rounded-[9px] px-2 text-[12.5px] transition-colors focus-visible:outline-2 focus-visible:outline-leaf [&_svg]:size-3.5',
        active ? 'bg-card font-semibold text-ink shadow-[0_1px_2px_rgb(0_0_0/0.06)]' : 'text-body hover:bg-black/[0.04]',
      )}
    >
      {icon}
      <span className="flex-1 text-left">{children}</span>
      {badge ? (
        <span className="flex -space-x-1.5" aria-label={`${badge} new`}>
          <span className="round size-4 rounded-full bg-[#f3c9a6] ring-2 ring-[#f7f8f6]" />
          <span className="round size-4 rounded-full bg-[#c9d8f5] ring-2 ring-[#f7f8f6]" />
        </span>
      ) : null}
    </button>
  )
}

function AccountsView({ s, set }: { s: MockState; set: (p: Partial<MockState>) => void }) {
  const list = useMemo(() => filterAccounts(accounts, s), [s])
  const chips = (Object.keys(accountFilters) as FilterKey[]).flatMap((k) => s.filters[k].map((v) => ({ k, v })))
  const toggle = (k: FilterKey, v: string) => set({ filters: { ...s.filters, [k]: s.filters[k].includes(v) ? s.filters[k].filter((x) => x !== v) : [...s.filters[k], v] } })
  const clear = () => set({ filters: { plan: [], drop: [], region: [], owner: [] }, query: '' })

  return (
    <>
      <div className="mt-8 flex items-center gap-3">
        <h3 className="font-display text-[26px] font-bold tracking-[-0.035em] text-ink">Accounts at risk</h3>
        <Segmented
          size="xs"
          label="Platform"
          value={s.platform}
          onChange={(platform) => set({ platform })}
          options={[
            { value: 'web', label: 'Web' },
            { value: 'ios', label: 'iOS' },
          ]}
        />
      </div>
      <p className="mt-1.5 text-[12px] text-muted">Accounts whose usage dropped in the last 14 days, ranked by the revenue at stake.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {(Object.keys(accountFilters) as FilterKey[]).map((k) => (
          <FilterMenu key={k} size="sm" label={accountFilters[k].label} options={accountFilters[k].options} selected={s.filters[k]} onToggle={(v) => toggle(k, v)} />
        ))}
      </div>
      <div className="mt-3 flex min-h-7 flex-wrap items-center gap-2">
        {chips.map(({ k, v }) => (
          <Chip key={k + v} size="sm" label={accountFilters[k].label.split(' ')[0]!} value={v} onRemove={() => toggle(k, v)} />
        ))}
        {chips.length ? (
          <button type="button" onClick={clear} className="h-7 rounded-full px-2 text-[11.5px] font-medium text-leaf hover:underline focus-visible:outline-2 focus-visible:outline-leaf">
            Clear all
          </button>
        ) : null}
      </div>

      <p className="mt-6 text-[12px] text-muted" aria-live="polite">
        {list.length} {list.length === 1 ? 'account' : 'accounts'} found
      </p>

      {list.length ? (
        <ul className="mt-3 grid grid-cols-2 gap-3.5">
          {list.map((a) => (
            <AccountCard key={a.id} a={a} watched={s.watched.includes(a.id)} onWatch={() => set({ watched: s.watched.includes(a.id) ? s.watched.filter((x) => x !== a.id) : [...s.watched, a.id] })} />
          ))}
        </ul>
      ) : (
        <EmptyState
          className="mt-3"
          icon={<SearchX aria-hidden />}
          title="No accounts match these filters"
          body="Good news, or the filters are too tight. Clear them to see every account at risk."
          action={
            <Button size="sm" variant="dark" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      )}
    </>
  )
}

function AccountCard({ a, watched, onWatch }: { a: Account; watched: boolean; onWatch: () => void }) {
  const [pinged, setPinged] = useState(false)
  return (
    <li className="rounded-[14px] border border-line bg-[#fafbf9] p-4">
      <div className="flex items-start gap-3">
        <Avatar name={a.name} hue={a.hue} size={36} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 font-display text-[13.5px] font-bold text-ink">
            {a.name}
            <BadgeCheck className="size-3.5 text-ink" aria-label="Verified domain" />
          </p>
          <p className="text-[11.5px] text-faint">
            @{a.domain} <span aria-hidden>·</span> {a.plan} plan, {a.seats} seats
          </p>
        </div>
        <IconButton label={watched ? `Stop watching ${a.name}` : `Watch ${a.name}`} tone="dark" active={watched} onClick={onWatch} className="!size-8 [&_svg]:!size-3.5">
          {watched ? <Star fill="currentColor" aria-hidden /> : <Share2 aria-hidden />}
        </IconButton>
        <IconButton label={pinged ? `Owner of ${a.name} notified` : `Notify the owner of ${a.name}`} tone="lime" active={pinged} onClick={() => setPinged(true)} className="!size-8 [&_svg]:!size-3.5">
          {pinged ? <Check aria-hidden /> : <MessageSquare aria-hidden />}
        </IconButton>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {a.tags.map((t) =>
          t.hot ? (
            <span key={t.label} className="rounded-[6px] bg-lime px-1.5 py-0.5 text-[11px] font-medium text-ink">
              {t.label}
            </span>
          ) : (
            <span key={t.label} className="px-1 text-[11px] text-body">
              {t.label}
            </span>
          ),
        )}
      </div>
      <p className="mt-2.5 line-clamp-2 text-[11.5px] leading-[1.5] text-muted">{a.note}</p>
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-bad">
          <TrendingDown className="size-3.5" aria-hidden />−{a.drop}% active seats
        </span>
        <Sparkline values={a.trend} width={88} height={24} />
      </div>
    </li>
  )
}

function OverviewView() {
  return (
    <>
      <h3 className="mt-8 font-display text-[26px] font-bold tracking-[-0.035em] text-ink">Overview</h3>
      <p className="mt-1.5 text-[12px] text-muted">The last 12 weeks across web and iOS.</p>
      <div className="mt-5 grid grid-cols-4 gap-3">
        {overview.kpis.map((k) => (
          <div key={k.label} className="rounded-[14px] border border-line bg-[#fafbf9] p-4">
            <p className="text-[11.5px] text-muted">{k.label}</p>
            <p className="mt-1 font-display text-[22px] font-bold tracking-[-0.03em] text-ink">{formatKpi(k.value, k.format)}</p>
            <p className={cx('mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold', (k.delta > 0) !== k.label.includes('risk') ? 'text-ok' : 'text-bad')}>
              {k.delta > 0 ? <TrendingUp className="size-3.5" aria-hidden /> : <TrendingDown className="size-3.5" aria-hidden />}
              {k.delta > 0 ? '+' : ''}
              {k.delta}% vs last period
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_300px] gap-3">
        <div className="rounded-[14px] border border-line p-4">
          <p className="font-display text-[13px] font-semibold text-ink">Weekly active users, thousands</p>
          <LineChart className="mt-2" values={overview.series} labels={overview.seriesLabels} format={(v) => `${v.toFixed(1)}k`} height={200} label="Weekly active users, thousands" />
        </div>
        <div className="rounded-[14px] border border-line p-4">
          <p className="font-display text-[13px] font-semibold text-ink">Latest signals</p>
          <ul className="mt-2 divide-y divide-line">
            {signalFeed.slice(0, 4).map((f) => (
              <li key={f.id} className="py-2">
                <p className="text-[12px] font-medium text-ink">{f.title}</p>
                <p className="text-[11px] text-faint">
                  {f.detail}, {f.time} ago
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

function FunnelsView() {
  const [seg, setSeg] = useState(0)
  const [step, setStep] = useState(3)
  const steps = funnels.steps.map((st) => ({ label: st.label, value: st.values[seg]! }))
  const lost = steps[step - 1] ? steps[step - 1]!.value - steps[step]!.value : 0
  return (
    <>
      <div className="mt-8 flex items-center gap-3">
        <h3 className="font-display text-[26px] font-bold tracking-[-0.035em] text-ink">{funnels.name}</h3>
        <Segmented size="xs" label="Segment" value={String(seg)} onChange={(v) => setSeg(Number(v))} options={funnels.segments.map((l, i) => ({ value: String(i), label: l }))} />
      </div>
      <p className="mt-1.5 text-[12px] text-muted">Last 30 days. Select a step to see who dropped there.</p>
      <div className="mt-5 grid grid-cols-[1fr_260px] gap-4">
        <div className="rounded-[14px] border border-line p-5">
          <FunnelChart steps={steps} selected={step} onSelect={setStep} compact />
        </div>
        <div className="rounded-[14px] bg-night p-5 text-on-dark">
          <p className="text-[11.5px] text-white/70">Dropped before</p>
          <p className="font-display text-[15px] font-semibold">{steps[step]!.label}</p>
          <p className="mt-3 font-display text-[30px] font-bold tracking-[-0.03em]">{lost.toLocaleString('en-US')}</p>
          <p className="text-[11.5px] text-white/70">people in 30 days</p>
          <p className="mt-4 text-[11.5px] leading-relaxed text-white/80">Most common last screen: the setup checklist. 64% never opened the invite dialog.</p>
        </div>
      </div>
    </>
  )
}

function formatKpi(v: number, f: string) {
  if (f === 'pct') return `${v}%`
  if (f === 'usd') return `$${(v / 1000).toFixed(1)}k`
  if (f === 'days') return `${v} days`
  return v.toLocaleString('en-US')
}
