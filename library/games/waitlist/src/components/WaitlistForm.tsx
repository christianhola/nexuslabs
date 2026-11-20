import { ArrowRight, Gift } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { form, success } from '../content'
import { ApiError, joinWaitlist, loadSaved, save, statusPath, type SavedEntry } from '../lib/api'
import { setCount, useWaitlistCount } from '../lib/count'
import { cx } from '../lib/cx'
import { ease } from '../lib/motion'
import { useSearch } from '../lib/router'
import { Countdown } from './Countdown'
import { SuccessPanel } from './SuccessPanel'
import { Button, FieldMessage, Input, Label, LiveDot, TextLink } from './ui'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Email capture → POST /api/waitlist → success state with position and share link. */
export function WaitlistForm() {
  const reduce = useReducedMotion() ?? false
  const inputId = useId()
  const errorId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const focusAfterSwap = useRef(false)
  const search = useSearch()
  const ref = new URLSearchParams(search).get('ref')

  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [error, setError] = useState<string | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<SavedEntry | null>(null)
  const count = useWaitlistCount()

  useEffect(() => {
    setResult(loadSaved())
  }, [])

  // The shake remounts the field row, so focus it after that render.
  useEffect(() => {
    if (shakeKey > 0) inputRef.current?.focus()
  }, [shakeKey])

  function fail(message: string) {
    setError(message)
    setShakeKey((k) => k + 1)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (pending) return
    const value = email.trim()
    if (!EMAIL.test(value)) return fail(form.invalid)
    setPending(true)
    setError(null)
    try {
      const joined = await joinWaitlist({ email: value, ref, company })
      const saved = { ...joined, email: value.toLowerCase() }
      save(saved)
      setCount(joined.count)
      setResult(saved)
    } catch (err) {
      fail(err instanceof ApiError && err.code !== 'offline' ? err.message : form.offline)
    } finally {
      setPending(false)
    }
  }

  function reset() {
    save(null)
    setResult(null)
    setEmail('')
    focusAfterSwap.current = true
  }

  const swap = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 12, filter: 'blur(4px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -8, filter: 'blur(4px)' },
      }

  // Someone opened a share link: their own (offer the status page) or a friend's.
  const ownLink = Boolean(ref && result && result.code === ref)
  const invited = Boolean(ref && !ownLink && !result)

  return (
    <div className="relative">
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          // After "Use a different email", the form mounts once the panel has left.
          if (focusAfterSwap.current) {
            focusAfterSwap.current = false
            inputRef.current?.focus()
          }
        }}
      >
        {result ? (
          <motion.div key="done" {...swap} transition={{ duration: 0.45, ease }}>
            {ownLink && (
              <p className="mb-5 text-small text-muted">
                {success.ownLink}{' '}
                <TextLink href={statusPath(result.code)}>
                  {success.ownLinkCta}
                  <ArrowRight className="ml-1 inline size-3.5" aria-hidden="true" />
                </TextLink>
              </p>
            )}
            <SuccessPanel result={result} onReset={reset} />
          </motion.div>
        ) : (
          <motion.div key="form" {...swap} transition={{ duration: 0.35, ease }}>
            {invited && (
              <p className="mb-4 inline-flex items-center gap-2 text-small text-accent-ink">
                <Gift className="size-4" aria-hidden="true" />
                {success.invited}
              </p>
            )}
            <form onSubmit={onSubmit} noValidate className="max-w-[555px]">
              <Label htmlFor={inputId}>{form.label}</Label>
              <motion.div key={shakeKey} className={cx('mt-[10px] flex gap-2', shakeKey > 0 && !reduce && 'animate-shake')}>
                <Input
                  ref={inputRef}
                  id={inputId}
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  placeholder={form.placeholder}
                  value={email}
                  invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  className="sm:max-w-[308px]"
                />
                <Button type="submit" loading={pending} className="w-[110px] px-0 max-sm:w-[104px]">
                  {form.submit}
                </Button>
              </motion.div>
              {/* Honeypot: hidden from people, irresistible to bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <AnimatePresence initial={false}>
                {error && (
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease }}
                  >
                    <FieldMessage id={errorId} role="alert" tone="error" className="pt-2">
                      {error}
                    </FieldMessage>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex flex-col gap-1.5 text-small text-muted">
        <Countdown />
        {count !== null && count > 0 && (
          <motion.span initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2">
            <LiveDot />
            <span>
              <span className="font-medium text-ink tabular-nums">{count.toLocaleString()}</span> {count === 1 ? form.waitingOne : form.waitingMany}
            </span>
          </motion.span>
        )}
      </div>
    </div>
  )
}
