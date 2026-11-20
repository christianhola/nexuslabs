import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, Check, Minus, SearchX } from 'lucide-react'

import { Badge } from '../components/Badge'
import type { BadgeTone } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { Chip } from '../components/Chip'
import { Container } from '../components/Container'
import { Dialog } from '../components/Dialog'
import { EmptyState } from '../components/EmptyState'
import { Select } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { capabilities, categories, makers, regions, statusLabel } from '../content'
import type { CategoryId, Maker } from '../content'
import { categoryIcon } from '../lib/icons'
import { useLocation } from '../lib/router'

const statusTone: Record<Maker['status'], BadgeTone> = { live: 'live', beta: 'beta', soon: 'soon' }
const sorts = ['Name', 'Most models', 'Newest'] as const
type Sort = (typeof sorts)[number]

type Filters = { q: string; category: CategoryId | 'all'; region: string; liveOnly: boolean; sort: Sort }

const isCategory = (v: string | null): v is CategoryId => categories.some((c) => c.id === v)

function readFilters(search: string): Filters {
  const p = new URLSearchParams(search)
  const cat = p.get('category')
  const region = p.get('region') ?? ''
  const sort = p.get('sort') as Sort | null
  return {
    q: p.get('q') ?? '',
    category: isCategory(cat) ? cat : 'all',
    region: (regions as readonly string[]).includes(region) ? region : 'All regions',
    liveOnly: p.get('live') === '1',
    sort: sort && sorts.includes(sort) ? sort : 'Name',
  }
}

// Filters live in the URL, so a reload, a shared link or the back button keeps them.
function writeFilters(f: Filters) {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.category !== 'all') p.set('category', f.category)
  if (f.region !== 'All regions') p.set('region', f.region)
  if (f.liveOnly) p.set('live', '1')
  if (f.sort !== 'Name') p.set('sort', f.sort)
  const qs = p.toString()
  window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`)
}

function matches(m: Maker, q: string) {
  if (!q) return true
  const needle = q.toLowerCase()
  const cat = categories.find((c) => c.id === m.category)!
  return [m.name, m.note, cat.label, cat.short, ...m.capabilities, ...m.regions].some((s) => s.toLowerCase().includes(needle))
}

export function DevicesPage() {
  const { search } = useLocation()
  const [f, setF] = useState<Filters>(() => readFilters(search))
  const [open, setOpen] = useState<Maker | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => writeFilters(f), [f])

  // Press "/" anywhere to jump to the search box.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key === '/' && !/input|textarea|select/i.test(t.tagName)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', on)
    return () => document.removeEventListener('keydown', on)
  }, [])

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }))

  // Everything except the category filter: drives the chip counts.
  const base = useMemo(
    () => makers.filter((m) => matches(m, f.q.trim()) && (f.region === 'All regions' || m.regions.includes(f.region as Maker['regions'][number])) && (!f.liveOnly || m.status === 'live')),
    [f.q, f.region, f.liveOnly],
  )
  const results = useMemo(() => {
    const list = base.filter((m) => f.category === 'all' || m.category === f.category)
    const sorted = [...list]
    if (f.sort === 'Name') sorted.sort((a, b) => a.name.localeCompare(b.name))
    if (f.sort === 'Most models') sorted.sort((a, b) => b.models - a.models)
    if (f.sort === 'Newest') sorted.sort((a, b) => b.since.localeCompare(a.since) || a.name.localeCompare(b.name))
    return sorted
  }, [base, f.category, f.sort])

  const totals = {
    brands: makers.filter((m) => m.status === 'live').length,
    models: makers.reduce((s, m) => s + m.models, 0),
  }
  const filtered = f.q || f.category !== 'all' || f.region !== 'All regions' || f.liveOnly
  const clear = () => setF({ q: '', category: 'all', region: 'All regions', liveOnly: false, sort: f.sort })

  return (
    <>
      <PageHeader
        eyebrow="Device coverage"
        title="Every brand your customers own"
        body="Search the makers Gridwise connects to today, what each one supports, and where. New brands land every month."
        aside={
          <dl className="grid grid-cols-3 gap-6 sm:gap-10">
            {[
              { k: 'Brands live', v: totals.brands },
              { k: 'Device models', v: totals.models },
              { k: 'Categories', v: categories.length },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-[13.5px] text-muted">{s.k}</dt>
                <dd className="mt-1 text-[34px] font-medium leading-none tracking-[-0.04em] tabular">{s.v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section aria-label="Directory" className="pb-24">
        <Container>
          <div className="grid gap-3 md:grid-cols-[1fr_200px_180px]">
            <SearchInput
              ref={searchRef}
              label="Search device makers"
              placeholder="Search brands, devices or capabilities"
              value={f.q}
              onValueChange={(v) => set('q', v)}
            />
            <Select label={<span className="sr-only">Region</span>} options={['All regions', ...regions]} value={f.region} onChange={(e) => set('region', e.target.value)} />
            <Select label={<span className="sr-only">Sort by</span>} options={sorts} value={f.sort} onChange={(e) => set('sort', e.target.value as Sort)} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
              <Chip pressed={f.category === 'all'} onClick={() => set('category', 'all')} count={base.length}>
                All
              </Chip>
              {categories.map((c) => (
                <Chip key={c.id} pressed={f.category === c.id} onClick={() => set('category', c.id)} count={base.filter((m) => m.category === c.id).length}>
                  {c.short}
                </Chip>
              ))}
            </div>
            <Checkbox checked={f.liveOnly} onChange={(v) => set('liveOnly', v)} label="Live only" />
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-[14px] text-muted" aria-live="polite">
              {results.length === 1 ? '1 brand' : `${results.length} brands`}
              {f.q && (
                <>
                  {' '}
                  matching “<span className="text-ink">{f.q}</span>”
                </>
              )}
            </p>
            {filtered && (
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear filters
              </Button>
            )}
          </div>

          {results.length === 0 ? (
            <EmptyState
              className="mt-8"
              icon={<SearchX className="size-5" aria-hidden />}
              title="No brands match"
              body="Try a shorter search or another region. If a brand you need is missing, tell us and we will prioritise it."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={clear}>
                    Clear filters
                  </Button>
                  <ButtonLink href="/contact" size="sm">
                    Request a brand
                  </ButtonLink>
                </div>
              }
            />
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((m) => (
                <li key={m.id}>
                  <MakerCard maker={m} onOpen={() => setOpen(m)} />
                </li>
              ))}
            </ul>
          )}

          <Card tone="mint" className="mt-10 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-[22px] font-medium tracking-[-0.025em]">Missing a brand?</h2>
              <p className="mt-1 text-[15px] text-muted">Most new integrations ship within eight weeks of a customer request.</p>
            </div>
            <ButtonLink href="/contact" icon={<ArrowRight className="size-4" aria-hidden />}>
              Request a brand
            </ButtonLink>
          </Card>
        </Container>
      </section>

      <Dialog open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} description={open ? categories.find((c) => c.id === open.category)?.label : undefined} className="sm:max-w-[540px]">
        {open && <MakerDetail maker={open} />}
      </Dialog>
    </>
  )
}

function MakerCard({ maker, onOpen }: { maker: Maker; onOpen: () => void }) {
  const cat = categories.find((c) => c.id === maker.category)!
  const Icon = categoryIcon[maker.category]
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group flex h-full w-full flex-col rounded-card bg-paper p-5 text-left shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow duration-200 hover:shadow-[inset_0_0_0_1px_var(--color-line-strong),var(--shadow-card)]"
    >
      <div className="flex w-full items-start justify-between gap-3">
        <span className="grid size-11 place-items-center rounded-control-sm bg-mint-2">
          <Icon className="size-5" aria-hidden />
        </span>
        <Badge tone={statusTone[maker.status]} dot={maker.status === 'live'}>
          {statusLabel[maker.status]}
        </Badge>
      </div>
      <h3 className="mt-5 text-[19px] font-medium tracking-[-0.02em]">{maker.name}</h3>
      <p className="text-[14px] text-muted">
        {cat.label}, {maker.models} {maker.models === 1 ? 'model' : 'models'}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Capabilities">
        {maker.capabilities.slice(0, 4).map((c) => (
          <li key={c} className="round rounded-pill bg-mint-2 px-2.5 py-1 text-[12.5px] text-ink-2">
            {c}
          </li>
        ))}
        {maker.capabilities.length > 4 && <li className="round rounded-pill px-1.5 py-1 text-[12.5px] text-muted">+{maker.capabilities.length - 4} more</li>}
      </ul>
      <p className="mt-auto pt-5 text-[13px] text-muted">{maker.regions.join(', ')}</p>
    </button>
  )
}

function MakerDetail({ maker }: { maker: Maker }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={statusTone[maker.status]} dot={maker.status === 'live'}>
          {statusLabel[maker.status]}
        </Badge>
        <Badge>{maker.models} models</Badge>
        <Badge>{maker.status === 'soon' ? `Expected ${maker.since}` : `Since ${maker.since}`}</Badge>
      </div>
      <p className="mt-4 text-[15px] leading-6 text-ink-2">{maker.note}</p>
      <h3 className="mt-6 text-[14px] font-medium">Capabilities</h3>
      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {capabilities.map((c) => {
          const has = maker.capabilities.includes(c)
          return (
            <li key={c} className={`flex items-center gap-2 text-[14px] ${has ? 'text-ink' : 'text-faint'}`}>
              {has ? <Check className="size-4 text-leaf" aria-hidden /> : <Minus className="size-4" aria-hidden />}
              {c}
              <span className="sr-only">{has ? ', supported' : ', not supported'}</span>
            </li>
          )
        })}
      </ul>
      <h3 className="mt-6 text-[14px] font-medium">Regions</h3>
      <p className="mt-1 text-[14px] text-muted">{maker.regions.join(', ')}</p>
      <div className="mt-7 flex flex-wrap gap-2">
        <ButtonLink href="/docs" size="sm">
          Read the quickstart
        </ButtonLink>
        <ButtonLink href={`/contact?device=${maker.category}`} size="sm" variant="outline">
          Ask about {maker.name}
        </ButtonLink>
      </div>
    </div>
  )
}
