import { Heart } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'react-router'

import { ArrowLink, Button } from '../components/Button'
import { FilterBar } from '../components/FilterBar'
import { Label } from '../components/Label'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { RoomCard } from '../components/RoomCard'
import { PORTFOLIO_PAGE, PROJECTS, ROOM_TYPES, ROOMS, type RoomType } from '../content'
import { cx } from '../lib/cx'
import { useSaved } from '../lib/store'

type Filter = 'All' | RoomType
const FILTERS: Filter[] = ['All', ...ROOM_TYPES]

export function Portfolio() {
  const [params, setParams] = useSearchParams()
  const { has, ids } = useSaved()
  const raw = params.get('room')
  const filter: Filter = FILTERS.includes(raw as Filter) ? (raw as Filter) : 'All'
  const savedOnly = params.get('saved') === '1'

  const update = (next: { room?: Filter; saved?: boolean }) => {
    const p = new URLSearchParams(params)
    const room = next.room ?? filter
    const saved = next.saved ?? savedOnly
    if (room === 'All') p.delete('room')
    else p.set('room', room)
    if (saved) p.set('saved', '1')
    else p.delete('saved')
    setParams(p, { replace: true, preventScrollReset: true })
  }

  const rooms = ROOMS.filter((r) => (filter === 'All' || r.type === filter) && (!savedOnly || has(r.id)))
  const counts = Object.fromEntries(FILTERS.map((f) => [f, ROOMS.filter((r) => f === 'All' || r.type === f).length])) as Record<Filter, number>

  return (
    <>
      <PageHeader label={PORTFOLIO_PAGE.label} title={PORTFOLIO_PAGE.title} intro={PORTFOLIO_PAGE.intro} />

      <section aria-label="Rooms" className="container-page pb-24">
        <div className="sticky top-14 z-20 -mx-4 flex flex-col gap-3 border-y border-line bg-paper/92 px-4 py-3 backdrop-blur md:top-14 md:-mx-7 md:flex-row md:items-center md:justify-between md:px-7">
          <FilterBar label="Filter by room" options={FILTERS} value={filter} onChange={(room) => update({ room })} counts={counts} />
          <button
            type="button"
            aria-pressed={savedOnly}
            onClick={() => update({ saved: !savedOnly })}
            className={cx(
              'round inline-flex min-h-10 items-center gap-2 self-start rounded-full border px-4 text-[14px] font-medium transition-colors md:self-auto',
              savedOnly ? 'border-rust-ink bg-rust-ink text-snow' : 'border-line-strong bg-card hover:border-ink',
            )}
          >
            <Heart className={cx('size-4', savedOnly && 'fill-current')} strokeWidth={1.75} aria-hidden />
            {PORTFOLIO_PAGE.savedOnly}
            <span className="tabular-nums opacity-75">{ids.length}</span>
          </button>
        </div>

        <p role="status" className="label-sm mt-6 text-muted">
          {rooms.length} {rooms.length === 1 ? 'room' : 'rooms'}
          {filter !== 'All' && ` in ${filter.toLowerCase()}`}
          {savedOnly && ', saved'}
        </p>

        {rooms.length === 0 ? (
          <div className="mt-6 flex flex-col items-start gap-5 rounded-[var(--radius-md)] bg-card p-8 shadow-[var(--shadow-inset)] md:p-12">
            <p className="max-w-md text-[19px] leading-snug tracking-[-0.02em]">{PORTFOLIO_PAGE.empty}</p>
            <Button variant="outline" onClick={() => update({ room: 'All', saved: false })}>
              Show all rooms
            </Button>
          </div>
        ) : (
          <motion.ul layout className="mt-6 grid gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {rooms.map((room) => (
                <motion.li
                  key={room.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <RoomCard room={room} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>

      <section aria-labelledby="projects-title" className="container-page pb-28">
        <div className="border-t border-ink pt-5">
          <Label>Whole projects</Label>
        </div>
        <h2 id="projects-title" className="font-display mt-5 text-[clamp(2.5rem,5vw,5rem)]">
          Projects
        </h2>
        <ul className="mt-10 flex flex-col">
          {PROJECTS.map((p, i) => (
            <li key={p.slug} className="grid items-center gap-4 border-t border-line py-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto] md:grid-cols-[3rem_10rem_minmax(0,1fr)_14rem_auto]">
              <span className="label-sm hidden tabular-nums text-muted md:block">{String(i + 1).padStart(2, '0')}</span>
              <Photo name={p.cover} alt="" className="hidden aspect-[4/3] sm:block" />
              <div>
                <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none font-medium tracking-[-0.045em]">{p.name}</h3>
                <p className="mt-2 max-w-lg text-[14px] text-ink-2">{p.summary}</p>
              </div>
              <p className="label-sm hidden text-muted md:block">
                {p.location}, {p.year}
                <br />
                {p.rooms.length} rooms, {p.size}
              </p>
              <ArrowLink to={`/portfolio/${p.slug}`}>View project</ArrowLink>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
