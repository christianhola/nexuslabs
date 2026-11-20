import { ArrowUpRight, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'

import { AvatarStack } from '../components/Avatar'
import { BarSpark } from '../components/BarSpark'
import { Container } from '../components/Container'
import { LessonTypeIcon } from '../components/LessonTypeIcon'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { SortableList } from '../components/SortableList'
import { features, people, seedCourse } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/* "Smart features" bento: four live mini-demos, each linking to its page. */
export function Features() {
  const [k1, k2, k3, k4] = features.items
  return (
    <section aria-labelledby="features-title" className="bg-canvas py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading id="features-title" eyebrow={features.eyebrow} title={features.title} lead={features.lead} />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Tile item={k1!}>
              <MiniOutline />
            </Tile>
          </Reveal>
          <Reveal delay={0.06}>
            <Tile item={k2!}>
              <MiniQuiz />
            </Tile>
          </Reveal>
          <Reveal delay={0.04}>
            <Tile item={k3!}>
              <MiniGroups />
            </Tile>
          </Reveal>
          <Reveal delay={0.1}>
            <Tile item={k4!}>
              <div className="rounded-[14px] border border-line bg-card p-4 shadow-card">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] text-muted">Completion by module</p>
                  <p className="font-display text-[20px] font-medium text-ink">71%</p>
                </div>
                <div className="mt-3 h-[110px]">
                  <BarSpark values={[100, 92, 84, 80, 74, 71]} label="Completion falls from 100% at module 1 to 71% at module 6" />
                </div>
              </div>
            </Tile>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function Tile({ item, children }: { item: (typeof features.items)[number]; children: React.ReactNode }) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-card sm:p-7">
      <div className="flex-1 rounded-[14px] bg-wash p-4 sm:p-5">{children}</div>
      <div className="mt-6 flex items-end justify-between gap-6">
        <div>
          <h3 className="font-display text-[19px] font-medium tracking-[-0.015em] text-ink">{item.title}</h3>
          <p className="mt-1.5 max-w-[420px] text-[14.5px] leading-relaxed text-muted">{item.body}</p>
        </div>
        <Link href={item.href} aria-label={`${item.title}: learn more`} className="grid size-11 shrink-0 place-items-center rounded-[10px] border border-line text-ink transition-colors hover:border-flame-strong hover:bg-flame-soft hover:text-flame-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
          <ArrowUpRight className="size-[18px]" aria-hidden />
        </Link>
      </div>
    </article>
  )
}

function MiniOutline() {
  const [items, setItems] = useState(() => seedCourse.modules[1]!.lessons.concat(seedCourse.modules[0]!.lessons.slice(1, 2)))
  return (
    <div className="rounded-[14px] border border-line bg-card p-2 shadow-card">
      <p className="px-2 pb-1 pt-1.5 text-[12.5px] text-muted">Module 2: drag to reorder</p>
      <SortableList
        items={items}
        onChange={setItems}
        label="Lessons in module 2"
        itemLabel={(l) => l.title}
        itemClassName="rounded-[10px] py-0.5 pr-2"
        render={(l) => (
          <div className="flex min-w-0 flex-1 items-center gap-2.5 py-1">
            <LessonTypeIcon type={l.type} />
            <span className="min-w-0 flex-1 truncate text-[13.5px] text-ink">{l.title}</span>
            <span className="text-[12px] tabular-nums text-faint">{l.minutes} min</span>
          </div>
        )}
      />
    </div>
  )
}

function MiniQuiz() {
  const board = [
    { name: people[2].name, pts: 980 },
    { name: people[3].name, pts: 940 },
    { name: people[0].name, pts: 915 },
  ]
  const [picked, setPicked] = useState<number | null>(null)
  const answers = ['Serif + grotesk', 'Two scripts', 'Mono + display', 'All caps sans']
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.1fr_1fr]">
      <div className="rounded-[14px] border border-line bg-card p-4 shadow-card">
        <p className="text-[12px] text-muted">Question 7 of 20</p>
        <p className="mt-1 font-display text-[14.5px] font-medium text-ink">Which pairing reads best for long body copy?</p>
        <div className="mt-3 flex flex-col gap-1.5" role="radiogroup" aria-label="Answers">
          {answers.map((a, i) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={picked === i}
                onClick={() => setPicked(i)}
                className={cx(
                  'flex h-10 w-full items-center justify-between rounded-[9px] border px-3 text-left text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-flame-strong sm:h-9',
                  picked === i ? (i === 0 ? 'border-ok bg-ok-soft text-ok' : 'border-bad bg-bad-soft text-bad') : 'border-line text-ink hover:bg-wash',
                )}
              >
                {a}
                {picked === i ? <span className="text-[12px] font-medium">{i === 0 ? 'Correct, +50' : 'Not quite'}</span> : null}
              </button>
          ))}
        </div>
      </div>
      <div className="rounded-[14px] border border-line bg-card p-4 shadow-card">
        <p className="text-[12px] text-muted">Leaderboard</p>
        <ol className="mt-2 flex flex-col gap-2">
          {board.map((b, i) => (
            <li key={b.name} className="flex items-center gap-2 text-[13px]">
              <span className={cx('round grid size-6 place-items-center rounded-full text-[11px] font-medium', i === 0 ? 'bg-flame-strong text-white' : 'bg-wash-2 text-ink')}>{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-ink">{b.name}</span>
              <span className="tabular-nums text-muted">{b.pts + (picked === 0 && i === 2 ? 50 : 0)}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[12px] text-muted">Join code <span className="font-mono text-ink">7Q4K2M</span></p>
      </div>
    </div>
  )
}

function MiniGroups() {
  const [joined, setJoined] = useState<string[]>([])
  return (
    <div className="rounded-[14px] border border-line bg-card p-3 shadow-card">
      <div className="flex items-center justify-between px-1.5 py-1">
        <p className="text-[13px] font-medium text-ink">Community groups</p>
        <span className="round grid size-5 place-items-center rounded-full bg-flame-strong text-white" aria-hidden>
          <Plus className="size-3" />
        </span>
      </div>
      <ul className="mt-1 flex flex-col gap-1.5">
        {features.groups.map((g, i) => {
          const on = joined.includes(g.name)
          return (
            <li key={g.name} className={cx('flex items-center gap-3 rounded-[11px] border border-line p-2', i === 1 && 'shadow-card')}>
              <AvatarStack people={people.slice(i, i + 2)} size={22} label={`${g.name} members`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-ink">{g.name}</span>
                <span className="block text-[11.5px] text-muted">{on ? `${parseInt(g.members) + 1} members` : g.members}</span>
              </span>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setJoined((j) => (on ? j.filter((x) => x !== g.name) : [...j, g.name]))}
                className={cx('inline-flex h-10 items-center gap-1 rounded-[8px] px-2.5 text-[12.5px] font-medium focus-visible:outline-2 focus-visible:outline-flame-strong sm:h-8', on ? 'bg-flame-soft text-flame-ink' : 'text-ink hover:bg-wash')}
                aria-label={`${on ? 'Leave' : 'Join'} ${g.name}`}
              >
                {on ? 'Joined' : 'Join'}
                {on ? null : <ChevronRight className="size-3.5" aria-hidden />}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
