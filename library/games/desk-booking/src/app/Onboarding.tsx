import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Building2, Check } from 'lucide-react'

import { Button } from '../components/Button'
import { ChoiceChip } from '../components/ChoiceChip'
import { Field, Input } from '../components/Field'
import { Logo } from '../components/Logo'
import { offices, teams } from '../data'
import { cn } from '../lib/cn'
import { duration, ease } from '../lib/motion'
import { useActions, useAppState } from '../lib/store'

/** First-run flow: your name, your office, your home team. */
export function Onboarding() {
  const { profile } = useAppState()
  const { completeOnboarding } = useActions()
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [name, setName] = useState(profile.name)
  const [officeId, setOfficeId] = useState(profile.officeId)
  const [team, setTeam] = useState(profile.team)
  const [error, setError] = useState<string>()
  const steps = ['You', 'Office', 'Team']

  function go(n: number) {
    if (step === 0 && n > 0 && name.trim().length < 2) {
      setError('Enter your name so teammates can find you.')
      return
    }
    setError(undefined)
    setDir(n > step ? 1 : -1)
    setStep(n)
  }

  function finish() {
    completeOnboarding({ name: name.trim(), officeId, team })
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[480px]">
        <div className="mb-8 flex justify-center">
          <Logo size={18} />
        </div>
        <div className="rounded-lg border border-line bg-surface p-6 shadow-soft sm:p-8">
          <ol className="mb-6 flex items-center gap-2" aria-label="Progress">
            {steps.map((s, i) => (
              <li key={s} className="flex flex-1 flex-col gap-1.5" aria-current={i === step ? 'step' : undefined}>
                <span className="h-1 overflow-hidden rounded-full bg-subtle">
                  <motion.span className="block h-full bg-brand-bright" initial={false} animate={{ width: i <= step ? '100%' : '0%' }} transition={{ duration: duration.slow, ease }} />
                </span>
                <span className={cn('text-2xs font-semibold', i <= step ? 'text-fg' : 'text-muted')}>
                  {i + 1}. {s}
                </span>
              </li>
            ))}
          </ol>
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: 24 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 * dir }}
                transition={{ duration: duration.base, ease }}
              >
                {step === 0 && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      go(1)
                    }}
                    className="grid gap-5"
                  >
                    <div>
                      <h1 className="text-h3 font-bold tracking-[-0.02em] text-ink">Welcome to DeskFlow</h1>
                      <p className="mt-1 text-sm text-muted">Three quick questions and your office is ready.</p>
                    </div>
                    <Field label="Your name" error={error}>
                      {(p) => <Input {...p} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoFocus />}
                    </Field>
                    <Button type="submit" className="justify-self-end" iconRight={<ArrowRight className="size-4" aria-hidden />}>
                      Continue
                    </Button>
                  </form>
                )}
                {step === 1 && (
                  <div className="grid gap-5">
                    <div>
                      <h1 className="text-h3 font-bold tracking-[-0.02em] text-ink">Pick your office</h1>
                      <p className="mt-1 text-sm text-muted">You can book desks in any office later.</p>
                    </div>
                    <div role="radiogroup" aria-label="Office" className="grid gap-2">
                      {offices.map((o) => (
                        <OptionCard key={o.id} checked={officeId === o.id} onSelect={() => setOfficeId(o.id)} title={o.name} sub={o.address} />
                      ))}
                    </div>
                    <Nav onBack={() => go(0)} onNext={() => go(2)} />
                  </div>
                )}
                {step === 2 && (
                  <div className="grid gap-5">
                    <div>
                      <h1 className="text-h3 font-bold tracking-[-0.02em] text-ink">Your home team</h1>
                      <p className="mt-1 text-sm text-muted">We’ll seat you near them and show who’s in.</p>
                    </div>
                    <div role="radiogroup" aria-label="Home team" className="flex flex-wrap gap-2">
                      {teams.map((t) => (
                        <ChoiceChip key={t} radio selected={team === t} onClick={() => setTeam(t)}>
                          {t}
                        </ChoiceChip>
                      ))}
                    </div>
                    <Nav onBack={() => go(1)} onNext={finish} last />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          <button type="button" onClick={finish} className="h-10 rounded-sm px-2 font-semibold text-body underline-offset-4 hover:underline">
            Skip for now
          </button>
        </p>
      </div>
    </main>
  )
}

function OptionCard({ checked, onSelect, title, sub }: { checked: boolean; onSelect: () => void; title: string; sub: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 rounded-md p-3 text-left ring-1 ring-inset transition-[background-color,box-shadow] duration-150',
        checked ? 'bg-brand-tint ring-2 ring-brand-bright/60' : 'bg-surface ring-line hover:ring-[#cfd4dc]',
      )}
    >
      <span aria-hidden className={cn('grid size-9 place-items-center rounded-sm', checked ? 'bg-brand-soft text-brand' : 'bg-subtle text-muted')}>
        <Building2 className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-fg">{title}</span>
        <span className="block truncate text-xs text-muted">{sub}</span>
      </span>
      <span aria-hidden className={cn('grid size-5 place-items-center rounded-full ring-1', checked ? 'bg-brand text-white ring-brand' : 'ring-line')}>
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
    </button>
  )
}

function Nav({ onBack, onNext, last }: { onBack: () => void; onNext: () => void; last?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack} icon={<ArrowLeft className="size-4" aria-hidden />}>
        Back
      </Button>
      <Button onClick={onNext} iconRight={last ? <Check className="size-4" aria-hidden /> : <ArrowRight className="size-4" aria-hidden />}>
        {last ? 'Finish' : 'Continue'}
      </Button>
    </div>
  )
}
