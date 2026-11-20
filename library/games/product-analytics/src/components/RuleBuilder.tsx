import { BellRing, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { useStored } from '../lib/storage'
import { Button, IconButton } from './Button'
import { EmptyState } from './EmptyState'
import { Field, Input, Select } from './Field'

type Rule = { id: string; metric: string; condition: string; threshold: number; destination: string }

const metrics = ['Weekly active seats', 'Reports exported', 'Invite acceptance', 'API calls per seat']
const conditions = ['drops by more than', 'rises by more than']
const destinations = ['#cs-alerts in Slack', 'Account owner by email', 'Webhook']

/*
  Signal rules: a small form that saves rules to localStorage and lists
  them with delete. Shows an empty state with no rules.
*/
export function RuleBuilder() {
  const [rules, setRules] = useStored<Rule[]>('rules', [{ id: 'r0', metric: metrics[0]!, condition: conditions[0]!, threshold: 30, destination: destinations[0]! }])
  const [metric, setMetric] = useState(metrics[0]!)
  const [condition, setCondition] = useState(conditions[0]!)
  const [threshold, setThreshold] = useState('25')
  const [destination, setDestination] = useState(destinations[0]!)
  const [error, setError] = useState<string>()

  const add = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(threshold)
    if (!threshold.trim() || !Number.isFinite(n) || n < 1 || n > 100) return setError('Enter a percentage between 1 and 100.')
    setError(undefined)
    setRules((r) => [...r, { id: `r${Date.now()}`, metric, condition, threshold: Math.round(n), destination }])
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={add} noValidate className="grid gap-3 rounded-[var(--radius-card-sm)] border border-line bg-card p-4 sm:grid-cols-2">
        <Field label="When">{(c) => <Select {...c} value={metric} onChange={(e) => setMetric(e.target.value)}>{metrics.map((m) => <option key={m}>{m}</option>)}</Select>}</Field>
        <Field label="Condition">{(c) => <Select {...c} value={condition} onChange={(e) => setCondition(e.target.value)}>{conditions.map((m) => <option key={m}>{m}</option>)}</Select>}</Field>
        <Field label="Threshold, %" error={error}>
          {(c) => <Input {...c} inputMode="numeric" value={threshold} onChange={(e) => setThreshold(e.target.value)} />}
        </Field>
        <Field label="Send to">{(c) => <Select {...c} value={destination} onChange={(e) => setDestination(e.target.value)}>{destinations.map((m) => <option key={m}>{m}</option>)}</Select>}</Field>
        <Button type="submit" variant="dark" className="sm:col-span-2" icon={<BellRing className="size-4" aria-hidden />}>
          Add rule
        </Button>
      </form>
      <div>
        <h4 className="font-display text-[14px] font-semibold text-ink">
          Your rules <span className="font-normal text-faint">({rules.length})</span>
        </h4>
        {rules.length ? (
          <ul className="mt-2 flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {rules.map((r) => (
                <motion.li key={r.id} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 rounded-[12px] bg-wash px-3.5 py-2">
                  <p className="min-w-0 flex-1 text-[13.5px] text-body">
                    <span className="font-semibold text-ink">{r.metric}</span> {r.condition} <span className="font-semibold text-ink">{r.threshold}%</span>, send to {r.destination}
                  </p>
                  <IconButton label={`Delete rule: ${r.metric} ${r.condition} ${r.threshold}%`} onClick={() => setRules((all) => all.filter((x) => x.id !== r.id))}>
                    <Trash2 aria-hidden />
                  </IconButton>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <EmptyState className="mt-2" icon={<BellRing aria-hidden />} title="No rules yet" body="Automatic signals still run. Add a rule above to be told about a metric you care about." />
        )}
      </div>
    </div>
  )
}
