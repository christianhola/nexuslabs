import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

import { ItemRow } from '../components/ItemRow'
import { Mark } from '../components/Logo'
import { NavItem } from '../components/NavItem'
import { QueryChips } from '../components/QueryChips'
import { SearchBox } from '../components/SearchBox'
import { APP, HERO, KINDS } from '../content'
import { cx } from '../lib/cx'
import { relativeDate } from '../lib/dates'
import { seedLibrary } from '../lib/library'
import { Link } from '../lib/router'
import { parseQuery, searchItems } from '../lib/search'
import { useReducedMotion } from '../lib/useReducedMotion'

/*
  The product shot under the hero, built from the real components and the
  real search over the seed shelf. It types the demo sentence once, then
  it's yours: edit the query, drop a chip, open a result.
*/
export function HeroDemo() {
  const lib = useMemo(() => seedLibrary(), [])
  const reduce = useReducedMotion()
  const [query, setQuery] = useState(reduce ? HERO.demoQuery : '')
  const [typing, setTyping] = useState(!reduce)
  const [focused, setFocused] = useState(false)
  const [off, setOff] = useState<Set<string>>(new Set())
  const touched = useRef(false)

  useEffect(() => {
    if (reduce) {
      if (!touched.current) setQuery(HERO.demoQuery)
      setTyping(false)
      return
    }
    let i = 0
    let t = 0
    const tick = () => {
      if (touched.current) return setTyping(false)
      i++
      setQuery(HERO.demoQuery.slice(0, i))
      if (i < HERO.demoQuery.length) t = window.setTimeout(tick, 26 + Math.random() * 40)
      else setTyping(false)
    }
    t = window.setTimeout(tick, 900)
    return () => window.clearTimeout(t)
  }, [reduce])

  const parsed = useMemo(() => parseQuery(query, lib.items, lib.collections), [query, lib])
  const hits = useMemo(() => (query.trim() ? searchItems(lib.items, parsed, off) : lib.items.slice(0, 4).map((item) => ({ item, score: 0 }))), [lib, parsed, off, query])
  const counts = (id: string) => lib.items.filter((i) => i.collectionId === id).length
  const background = lib.items.filter((i) => !i.image).slice(0, 8)

  return (
    <div className="relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[22px] bg-panel shadow-[inset_0_0_0_1px_var(--color-line)]">
      <div className="flex h-[66px] items-center justify-between border-b border-line px-6 sm:px-8">
        <Mark className="size-8" />
        <span className="flex items-center gap-2">
          <span aria-hidden className="grid size-8 place-items-center rounded-sm bg-chip text-[13px] font-medium text-ink-2">
            S
          </span>
          <ChevronDown aria-hidden className="size-3.5 text-subtle" />
        </span>
      </div>

      <div className="relative flex h-[600px] sm:h-[640px]">
        <aside aria-label="Library sections" className="hidden w-[274px] shrink-0 flex-col gap-1 border-r border-line px-4 pt-7 md:flex">
          <NavItem href="/app/today" label={APP.views.today} />
          <NavItem href="/app" label={APP.views.shelf} count={lib.items.length} active />
          <NavItem href="/app/favourites" label={APP.views.favourites} count={lib.items.filter((i) => i.favourite).length} />
          <p className="mt-7 mb-2 px-3 text-[12px] tracking-[0.08em] text-subtle uppercase">Collections</p>
          {lib.collections.slice(0, 3).map((c) => (
            <NavItem key={c.id} href={`/app/c/${c.id}`} label={c.name} count={counts(c.id)} square={false} />
          ))}
        </aside>

        {/* The shelf behind the palette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden grid-cols-4 content-end gap-4 p-8 pl-[300px] lg:grid">
          {background.map((item) => (
            <div key={item.id} className="h-[180px] rounded-xl bg-[#f1f1ec] p-4">
              <div className="flex justify-between text-[12px] tracking-[0.06em] text-subtle uppercase">
                <span>{KINDS[item.kind]}</span>
                <span className="tracking-normal normal-case">{relativeDate(item.savedAt)}</span>
              </div>
              <p className="mt-3 text-[15px] font-medium text-ink-2">{item.title}</p>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-3 top-0 sm:inset-x-6 md:right-auto md:left-[310px] md:w-[min(880px,calc(100%-340px))]">
          <div className="-mt-px overflow-hidden rounded-[20px] bg-paper shadow-pop ring-1 ring-line has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ink">
            <div className="relative px-6 py-3.5 sm:px-9">
              <label htmlFor="hero-search" className="sr-only">
                Search the demo shelf
              </label>
              <SearchBox
                id="hero-search"
                value={query}
                onChange={(e) => {
                  touched.current = true
                  setTyping(false)
                  setOff(new Set())
                  setQuery(e.target.value)
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onClear={() => {
                  touched.current = true
                  setQuery('')
                }}
                placeholder="Search in your own words"
              />
              {!focused && (
                <span aria-hidden className="pointer-events-none absolute inset-y-0 right-16 left-15 hidden items-center overflow-hidden text-[20px] tracking-[-0.015em] whitespace-pre sm:flex sm:left-[72px]">
                  <span className="invisible">{query}</span>
                  <span className={cx('ml-px h-6 w-[1.5px] bg-ink', !typing && 'animate-caret')} />
                </span>
              )}
            </div>
            <div className={cx('border-y border-line px-6 transition-[padding] duration-(--duration-base) sm:px-9', parsed.chips.length ? 'py-4' : 'py-0')}>
              <QueryChips
                chips={parsed.chips}
                off={off}
                onToggle={(id) =>
                  setOff((s) => {
                    const n = new Set(s)
                    if (n.has(id)) n.delete(id)
                    else n.add(id)
                    return n
                  })
                }
              />
            </div>
            <div className="px-3 pt-5 pb-4 sm:px-6">
              <p className="px-3 pb-2 text-[14px] text-muted">{query.trim() ? `My shelf · ${hits.length} ${hits.length === 1 ? 'match' : 'matches'}` : 'Recently saved'}</p>
              {hits.length ? (
                <ul className="flex flex-col">
                  {hits.slice(0, 5).map(({ item }) => (
                    <li key={item.id}>
                      <ItemRow item={item} href={`/app/item/${item.id}`} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-6 text-[15px] text-muted">{APP.emptySearch.title}. {APP.emptySearch.body}</p>
              )}
              <div className="mt-2 flex justify-end px-3">
                <Link href={`/app${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`} className="inline-flex h-10 items-center gap-1.5 rounded-sm px-3 text-[14px] font-medium text-ink hover:bg-chip">
                  Open the library
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
