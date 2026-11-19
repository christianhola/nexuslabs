import { ArrowLeft, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { Button, ButtonLink } from '../components/Button'
import { Label } from '../components/Label'
import { PackageCard } from '../components/PackageCard'
import { Photo } from '../components/Photo'
import { RoomCard } from '../components/RoomCard'
import { Swatch } from '../components/Swatch'
import { PACKAGES, QUIZ, QUIZ_PAGE, ROOMS, STYLES, type StyleId } from '../content'
import { cx } from '../lib/cx'
import { scoreQuiz } from '../lib/quiz'
import { useQuiz } from '../lib/store'

function Question({ index, value, onPick }: { index: number; value?: string; onPick: (id: string) => void }) {
  const q = QUIZ[index]
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [index])
  return (
    <fieldset aria-labelledby={`q-${q.id}`}>
      <h2 id={`q-${q.id}`} ref={heading} tabIndex={-1} className="font-display max-w-[18ch] text-[clamp(2.25rem,5vw,4.75rem)] text-balance focus:outline-none">
        {q.prompt}
      </h2>
      <div className={cx('mt-10 grid gap-3', q.kind === 'text' ? 'sm:grid-cols-2' : 'grid-cols-2 lg:grid-cols-4')}>
        {q.options.map((o) => {
          const checked = value === o.id
          return (
            <label key={o.id} className="group relative block cursor-pointer">
              <input type="radio" name={q.id} value={o.id} checked={checked} onChange={() => onPick(o.id)} className="peer sr-only" />
              <span
                className={cx(
                  'flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] bg-card shadow-[var(--shadow-inset)] transition-[box-shadow,transform] duration-[var(--duration-base)] group-hover:shadow-[inset_0_0_0_1px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink',
                  checked && 'shadow-[inset_0_0_0_2px_var(--color-ink)]',
                )}
              >
                {o.image && <Photo name={o.image} alt="" className="aspect-[4/5]" />}
                {o.swatches && (
                  <span className="grid aspect-[4/5] grid-rows-4">
                    {o.swatches.map((hex) => (
                      <span key={hex} style={{ background: hex }} />
                    ))}
                  </span>
                )}
                <span className={cx('flex items-center justify-between gap-3 p-4', q.kind === 'text' && 'min-h-20 text-[clamp(1.125rem,1.6vw,1.375rem)] tracking-[-0.03em]')}>
                  <span className="font-medium">{o.label}</span>
                  <span className={cx('round grid size-6 shrink-0 place-items-center rounded-full border transition-colors', checked ? 'border-ink bg-ink text-paper' : 'border-line-strong text-transparent')} aria-hidden>
                    <Check className="size-3.5" strokeWidth={2.5} />
                  </span>
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function Result({ style, onRetake }: { style: StyleId; onRetake: () => void }) {
  const s = STYLES[style]
  const rooms = ROOMS.filter((r) => r.styles.includes(style)).slice(0, 3)
  const pkg = PACKAGES.find((p) => p.id === s.package)!
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
      <Label>{QUIZ_PAGE.resultLabel}</Label>
      <h1 ref={heading} tabIndex={-1} className="font-display mt-5 text-[clamp(3.5rem,11vw,11rem)] focus:outline-none">
        {s.name}
      </h1>
      <div className="mt-8 grid gap-10 border-t border-ink pt-6 md:grid-cols-12">
        <p className="text-[clamp(1.25rem,2.2vw,1.875rem)] leading-[1.15] tracking-[-0.03em] text-pretty md:col-span-6">{s.summary}</p>
        <div className="md:col-span-5 md:col-start-8">
          <div className="grid grid-cols-4 gap-2">
            {s.palette.map((hex) => (
              <Swatch key={hex} hex={hex} size="lg" />
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Key materials">
            {s.materials.map((m) => (
              <li key={m} className="round rounded-full bg-paper-2 px-3 py-1 text-[13px] text-ink-2">
                {m}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={`/book?package=${s.package}`} icon>
              {QUIZ_PAGE.book}
            </ButtonLink>
            <Button variant="outline" onClick={onRetake}>
              {QUIZ_PAGE.retake}
            </Button>
          </div>
        </div>
      </div>

      <section aria-labelledby="match-title" className="mt-20">
        <Label>{QUIZ_PAGE.matching}</Label>
        <h2 id="match-title" className="sr-only">
          {QUIZ_PAGE.matching}
        </h2>
        <div className="mt-6 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      </section>

      <section aria-labelledby="rec-title" className="mt-20 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Label>{QUIZ_PAGE.recommended}</Label>
          <h2 id="rec-title" className="font-display mt-5 text-[clamp(2.25rem,4vw,4rem)] text-balance">
            {pkg.name}
          </h2>
        </div>
        <PackageCard pkg={pkg} featured className="md:col-span-6 md:col-start-7" />
      </section>
    </motion.div>
  )
}

export function Quiz() {
  const [quiz, setQuiz] = useQuiz()
  const [step, setStep] = useState<number | 'intro' | 'result'>(quiz.result ? 'result' : 'intro')
  const answers = quiz.answers

  const pick = (id: string) => {
    if (typeof step !== 'number') return
    const q = QUIZ[step]
    const next = { ...answers, [q.id]: id }
    setQuiz({ answers: next })
    window.setTimeout(() => {
      if (step < QUIZ.length - 1) setStep(step + 1)
      else {
        setQuiz({ answers: next, result: scoreQuiz(next), at: Date.now() })
        setStep('result')
      }
    }, 280)
  }

  if (step === 'result' && quiz.result)
    return (
      <div className="container-page pt-32 pb-24 md:pt-40">
        <Result
          style={quiz.result}
          onRetake={() => {
            setQuiz(null)
            setStep(0)
          }}
        />
      </div>
    )

  if (step === 'intro' || step === 'result')
    return (
      <section className="container-page grid gap-10 pt-32 pb-24 md:grid-cols-12 md:pt-40">
        <div className="md:col-span-6">
          <Label>{QUIZ_PAGE.label}</Label>
          <h1 className="font-display mt-5 animate-rise text-[clamp(3.5rem,9vw,9rem)]">{QUIZ_PAGE.title}</h1>
          <p className="mt-6 max-w-md text-[17px] leading-snug text-ink-2">{QUIZ_PAGE.intro}</p>
          <Button size="lg" icon className="mt-8" onClick={() => setStep(0)}>
            {QUIZ_PAGE.start}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-5 md:col-start-8">
          <Photo name="stair" alt="" className="aspect-[3/4]" />
          <Photo name="study" alt="" className="mt-16 aspect-[3/4]" />
        </div>
      </section>
    )

  const progress = (step + (answers[QUIZ[step].id] ? 1 : 0)) / QUIZ.length
  return (
    <section aria-label={QUIZ_PAGE.title} className="container-page pt-28 pb-24 md:pt-36">
      <h1 className="sr-only">{QUIZ_PAGE.title}</h1>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep(step === 0 ? 'intro' : step - 1)}
          className="round -ml-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-[14px] font-medium hover:bg-paper-2"
        >
          <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden />
          Back
        </button>
        <p className="label-sm tabular-nums text-muted" aria-live="polite">
          Question {step + 1} of {QUIZ.length}
        </p>
      </div>
      <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={QUIZ.length} aria-valuenow={step}>
        <motion.div className="h-full bg-ink" animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <div className="mt-12">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <Question index={step} value={answers[QUIZ[step].id]} onPick={pick} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
