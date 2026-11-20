import { motion } from 'motion/react'
import { Check, Minus } from 'lucide-react'

import { cx } from '../lib/cx'

const common = ['password', '12345678', 'qwerty', 'letmein', 'revio', 'iloveyou', 'admin', 'welcome']

export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; checks: { label: string; ok: boolean }[] }

/** Scores a password 0–4 from length, character mix and a short common list. */
export function scorePassword(pw: string): Strength {
  const checks = [
    { label: 'At least 10 characters', ok: pw.length >= 10 },
    { label: 'Upper and lower case', ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { label: 'A number', ok: /\d/.test(pw) },
    { label: 'A symbol', ok: /[^A-Za-z0-9]/.test(pw) },
  ]
  let score = checks.filter((c) => c.ok).length
  if (pw.length < 8) score = Math.min(score, 1)
  if (common.some((w) => pw.toLowerCase().includes(w))) score = Math.min(score, 1)
  if (!pw) score = 0
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']
  return { score: score as Strength['score'], label: pw ? labels[score] : 'Enter a password', checks }
}

const colors = ['bg-white/10', 'bg-[#ff7b5c]', 'bg-[#fbbf24]', 'bg-violet-text', 'bg-[#4ade80]']
const text = ['text-faint', 'text-[#ff8a6b]', 'text-[#fbbf24]', 'text-violet-text', 'text-[#4ade80]']

/** Four-segment meter plus a checklist; announces the label politely. */
export function PasswordStrength({ password, className }: { password: string; className?: string }) {
  const s = scorePassword(password)
  return (
    <div className={cx('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1.5" aria-hidden>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className={cx('h-full rounded-full', colors[s.score])}
                initial={false}
                animate={{ width: s.score >= n ? '100%' : '0%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 30, delay: (n - 1) * 0.04 }}
              />
            </div>
          ))}
        </div>
        <span className={cx('min-w-[68px] whitespace-nowrap text-right text-[13px] font-medium', text[s.score])} aria-live="polite">
          {s.label}
        </span>
      </div>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-[13px] sm:grid-cols-2">
        {s.checks.map((c) => (
          <li key={c.label} className={cx('flex items-center gap-2 transition-colors', c.ok ? 'text-soft' : 'text-faint')}>
            <span className={cx('grid size-4 place-items-center rounded-full transition-colors round', c.ok ? 'bg-up text-white' : 'bg-white/[0.08]')}>
              {c.ok ? <Check className="size-2.5" strokeWidth={3.5} aria-hidden /> : <Minus className="size-2.5" aria-hidden />}
            </span>
            {c.label}
            <span className="sr-only">{c.ok ? ' (met)' : ' (not met)'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
