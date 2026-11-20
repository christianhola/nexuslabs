import { ArrowRight, Mail, Share } from 'lucide-react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { brand, success } from '../content'
import { shareUrl, statusPath, type SavedEntry } from '../lib/api'
import { ease } from '../lib/motion'
import { CopyField } from './CopyField'
import { Button, ButtonLink, Stat } from './ui'

/** Counts up to the position once, so the number lands with a little weight. */
export function useCountUp(to: number, reduce: boolean) {
  const [value, setValue] = useState(reduce ? to : Math.max(1, Math.round(to * 0.6)))
  useEffect(() => {
    if (reduce) {
      setValue(to)
      return
    }
    const controls = animate(Math.max(1, Math.round(to * 0.6)), to, {
      duration: 1.1,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [to, reduce])
  return value
}

/** Orange check that pops in with a ring pulse. */
export function SuccessCheck() {
  const reduce = useReducedMotion() ?? false
  return (
    <span className="relative grid size-11 shrink-0 place-items-center">
      {!reduce && <span className="absolute inset-0 rounded-full bg-accent animate-pulse-ring" />}
      <motion.span
        className="relative grid size-11 place-items-center rounded-full bg-accent text-white"
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      >
        <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" aria-hidden="true">
          <motion.path
            d="M5 12.5l4.2 4.2L19 7"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.18 }}
          />
        </svg>
      </motion.span>
    </span>
  )
}

type Props = {
  result: SavedEntry
  onReset: () => void
}

export function SuccessPanel({ result, onReset }: Props) {
  const reduce = useReducedMotion() ?? false
  const position = useCountUp(result.position, reduce)
  const link = shareUrl(result.code)
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const exists = result.status === 'exists'

  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease, delay: 0.12 + i * 0.07 },
        }

  return (
    <div className="max-w-[440px]">
      <div role="status" aria-live="polite" className="flex items-center gap-4">
        <SuccessCheck />
        <motion.div {...item(0)} className="min-w-0">
          <p className="text-heading font-semibold text-ink">{exists ? success.existsTitle : success.joinedTitle}</p>
          <p className="truncate text-[14px] text-muted">{result.email}</p>
        </motion.div>
      </div>

      <motion.div {...item(1)} className="mt-6">
        <Stat label={success.positionLabel} value={`#${position.toLocaleString()}`} suffix={`of ${result.count.toLocaleString()}`} tone="accent" />
      </motion.div>

      <motion.p {...item(2)} className="mt-4 text-copy text-muted">
        {exists ? success.existsBody : success.joinedBody}
      </motion.p>

      <motion.div {...item(3)} className="mt-5">
        <CopyField value={link} label="Your share link" copyLabel={success.copy} copiedLabel={success.copied} />
      </motion.div>

      <motion.div {...item(4)} className="mt-3 flex flex-wrap items-center gap-1">
        <ButtonLink href={statusPath(result.code)} variant="ghost" size="sm" className="text-accent-ink" iconEnd={<ArrowRight className="size-4" aria-hidden="true" />}>
          {success.status}
        </ButtonLink>
        {canShare && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Share className="size-4" aria-hidden="true" />}
            onClick={() => navigator.share({ title: brand.name, text: success.shareText, url: link }).catch(() => undefined)}
          >
            Share
          </Button>
        )}
        <ButtonLink
          variant="ghost"
          size="sm"
          href={`mailto:?subject=${encodeURIComponent(`Join me on the ${brand.name} waitlist`)}&body=${encodeURIComponent(`${success.shareText}\n\n${link}`)}`}
          icon={<Mail className="size-4" aria-hidden="true" />}
        >
          Email a friend
        </ButtonLink>
        <span className="mx-1 h-4 w-px bg-line" aria-hidden="true" />
        <Button variant="ghost" size="sm" onClick={onReset}>
          {success.another}
        </Button>
      </motion.div>
    </div>
  )
}
