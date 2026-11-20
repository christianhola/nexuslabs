import type { ReactNode } from 'react'
import type { CandidateStatus, Difficulty } from '../data'
import { cx } from '../lib/cx'

export type Tone = 'neutral' | 'brand' | 'amber' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-white/7 text-muted',
  brand: 'bg-brand/12 text-brand-text',
  amber: 'bg-amber/12 text-amber',
  danger: 'bg-danger/12 text-danger',
  info: 'bg-info/12 text-info',
}

export function Badge({ tone = 'neutral', children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cx('inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[8px] px-2 text-[12.5px] font-medium', tones[tone], className)}>
      {dot && <span aria-hidden className="round size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}


export const statusTone: Record<CandidateStatus, Tone> = { Invited: 'neutral', 'In progress': 'info', Completed: 'amber', Advanced: 'brand', Rejected: 'danger' }
export const difficultyTone: Record<Difficulty, Tone> = { Easy: 'brand', Medium: 'amber', Hard: 'danger' }
