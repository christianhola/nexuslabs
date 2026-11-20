import { useMemo, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, RotateCcw } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, Select } from '../components/Field'
import { HealthDot } from '../components/HealthDot'
import { Link } from '../components/Link'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { Pill } from '../components/Pill'
import { Progress } from '../components/Progress'
import { SegmentTag } from '../components/SegmentTag'
import { useToast } from '../components/Toast'
import { isoFromToday, PLAYBOOKS, type Account, type Playbook } from '../data'
import { cx } from '../lib/cx'
import { dayMonth, money } from '../lib/format'
import { current } from '../lib/metrics'
import { DEFAULT_ASSIGNEE, matches, TEAM } from '../lib/playbooks'
import { useStore } from '../lib/store'

export function Playbooks() {
  const { accounts, settings, checks, toggleCheck, resetChecks, assignees, setAssignee } = useStore()
  const toast = useToast()
  const threshold = settings.threshold
  const [pbId, setPbId] = useState<Playbook['id']>(PLAYBOOKS[0]!.id)
  const [acctId, setAcctId] = useState<string | null>(null)

  const matched = useMemo(
    () => Object.fromEntries(PLAYBOOKS.map((p) => [p.id, accounts.filter((a) => matches(p.id, a, threshold)).sort((a, b) => b.arr - a.arr)])) as Record<Playbook['id'], Account[]>,
    [accounts, threshold],
  )
  const pb = PLAYBOOKS.find((p) => p.id === pbId)!
  const list = matched[pb.id]
  const acct = list.find((a) => a.id === acctId) ?? list[0] ?? null
  const done = (p: Playbook, a: Account) => (checks[`${p.id}:${a.id}`] ?? []).filter((s) => p.steps.some((x) => x.id === s)).length
  const assignee = (p: Playbook, step: Playbook['steps'][number], a: Account) => {
    const who = assignees[`${p.id}:${step.id}`] ?? DEFAULT_ASSIGNEE[step.role]
    return who === 'Account owner' ? a.owner : who
  }

  const toggle = (step: string) => {
    if (!acct) return
    const before = done(pb, acct)
    const checked = (checks[`${pb.id}:${acct.id}`] ?? []).includes(step)
    toggleCheck(pb.id, acct.id, step)
    if (!checked && before + 1 === pb.steps.length) toast.show({ tone: 'success', title: `${pb.name} playbook complete`, body: acct.name })
  }

  return (
    <>
      <PageHeader
        eyebrow={`${PLAYBOOKS.length} playbooks`}
        title="Playbooks"
        lede="Risk playbooks pick up accounts automatically from their health signals. Work each one as a checklist; progress is saved in this browser."
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <nav aria-label="Playbooks" className="animate-rise [animation-delay:120ms]">
          <ul className="border-t-2 border-rule">
            {PLAYBOOKS.map((p) => {
              const n = matched[p.id].length
              const total = n * p.steps.length
              const progress = total ? matched[p.id].reduce((s, a) => s + done(p, a), 0) / total : 0
              const active = p.id === pb.id
              return (
                <li key={p.id} className="border-b border-line">
                  <button
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    onClick={() => {
                      setPbId(p.id)
                      setAcctId(null)
                    }}
                    className={cx(
                      'relative block w-full cursor-pointer py-4 pr-2 pl-4 text-left transition-colors',
                      'before:absolute before:top-4 before:bottom-4 before:left-0 before:w-[2px] before:rounded-full before:transition-colors',
                      active ? 'before:bg-risk' : 'before:bg-transparent hover:before:bg-line',
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className={cx('font-serif text-[20px] leading-tight', active ? 'text-fg' : 'text-muted')}>{p.name}</span>
                      <span className={cx('tnum font-mono text-[13px]', n ? 'text-fg' : 'text-muted')}>{n}</span>
                    </span>
                    <span className="mt-1 block text-[13px] text-muted">{p.trigger}</span>
                    <Progress value={progress} label={`${p.name} progress`} className="mt-3" />
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={pb.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="min-w-0 space-y-8">
            <Panel id="playbook" title={pb.name} meta={`${list.length} accounts · ${money(list.reduce((s, a) => s + a.arr, 0))}`}>
              <p className="mt-3 text-[14px] text-muted">
                <span className="text-fg">Trigger:</span> {pb.trigger}. <span className="text-fg">Goal:</span> {pb.goal}.
              </p>
              <h3 className="caps mt-7 text-[10px] tracking-[0.22em] text-muted">Steps and default owners</h3>
              <ol className="mt-3">
                {pb.steps.map((s, i) => (
                  <li key={s.id} className="grid grid-cols-[28px_1fr] items-center gap-x-3 gap-y-2 border-t border-line py-3 sm:grid-cols-[28px_1fr_236px]">
                    <span className="tnum font-mono text-[12px] text-risk">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[14px]">
                      {s.title} <span className="tnum font-mono text-[11.5px] text-muted">· day {s.dueDays}</span>
                    </span>
                    <Select
                      label={`Owner for step ${i + 1}`}
                      hideLabel
                      options={TEAM.map((t) => ({ value: t, label: t === 'Account owner' ? `${s.role === 'CSM' ? 'CSM' : s.role}: account owner` : `${s.role}: ${t}` }))}
                      value={assignees[`${pb.id}:${s.id}`] ?? DEFAULT_ASSIGNEE[s.role]}
                      onChange={(e) => {
                        setAssignee(pb.id, s.id, e.target.value)
                        toast.show({ tone: 'info', title: 'Step reassigned', body: `${s.title.split(' ').slice(0, 5).join(' ')}… → ${e.target.value}` })
                      }}
                      className="col-start-2 sm:col-start-3"
                    />
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel id="playbook-accounts" title="Work the checklist" meta={acct ? `${done(pb, acct)} of ${pb.steps.length} done` : undefined}>
              {list.length === 0 ? (
                <EmptyState title="No accounts in this playbook">Nothing matches “{pb.trigger.toLowerCase()}” right now. Change the threshold in Settings to widen it.</EmptyState>
              ) : (
                <div className="mt-7 grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)]">
                  <ul aria-label="Accounts in this playbook" className="scroll-thin max-h-[440px] overflow-y-auto border-t border-line pr-1">
                    {list.map((a) => {
                      const n = done(pb, a)
                      const on = acct?.id === a.id
                      return (
                        <li key={a.id}>
                          <button
                            type="button"
                            aria-current={on ? 'true' : undefined}
                            onClick={() => setAcctId(a.id)}
                            className={cx('flex min-h-[52px] w-full cursor-pointer items-center gap-3 border-b border-line px-2 text-left transition-colors', on ? 'bg-raised shadow-[inset_2px_0_0_var(--risk)]' : 'hover:bg-fg/[0.035]')}
                          >
                            <HealthDot score={current(a)} size={9} />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[14px]">{a.name}</span>
                              <span className="tnum block font-mono text-[11px] text-muted">
                                {money(a.arr)} · {current(a)}
                              </span>
                            </span>
                            <span className={cx('tnum font-mono text-[12px]', n === pb.steps.length ? 'text-fg' : 'text-muted')}>
                              {n}/{pb.steps.length}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  {acct && (
                    <div key={acct.id} className="min-w-0 animate-fade">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <div className="flex min-w-0 items-baseline gap-3">
                          <h3 className="truncate font-serif text-[22px]">{acct.name}</h3>
                          <SegmentTag>{acct.segment}</SegmentTag>
                        </div>
                        <Link to={`/accounts/${acct.id}`} className="caps inline-flex min-h-10 items-center gap-1.5 text-[10px] tracking-[0.2em] text-muted hover:text-fg sm:min-h-0">
                          Open account <ArrowUpRight className="size-3" strokeWidth={1.75} aria-hidden="true" />
                        </Link>
                      </div>
                      <Progress value={done(pb, acct) / pb.steps.length} label={`${acct.name} checklist progress`} className="mt-4" />
                      <ul className="mt-5 space-y-1">
                        {pb.steps.map((s) => {
                          const who = assignee(pb, s, acct)
                          const checked = (checks[`${pb.id}:${acct.id}`] ?? []).includes(s.id)
                          return (
                            <li key={s.id} className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-line py-3">
                              <Checkbox strike label={s.title} description={`Due ${dayMonth(isoFromToday(s.dueDays))} · ${s.role}`} checked={checked} onChange={() => toggle(s.id)} className="min-w-0 flex-1" />
                              <span className="flex items-center gap-2 text-[12.5px] text-muted">
                                <Avatar name={who} size={24} />
                                {who}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                      <Pill
                        variant="ghost"
                        size="sm"
                        icon={<RotateCcw strokeWidth={1.75} />}
                        className="mt-5"
                        disabled={done(pb, acct) === 0}
                        onClick={() => {
                          resetChecks(pb.id, acct.id)
                          toast.show({ tone: 'info', title: 'Checklist reset', body: `${pb.name} · ${acct.name}` })
                        }}
                      >
                        Reset checklist
                      </Pill>
                    </div>
                  )}
                </div>
              )}
            </Panel>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
