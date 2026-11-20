import { ClipboardList, FileText, ListChecks, PlayCircle } from 'lucide-react'

import type { LessonType } from '../content'
import { cx } from '../lib/cx'

const map = { video: PlayCircle, text: FileText, quiz: ListChecks, assignment: ClipboardList } as const
const tone = { video: 'bg-flame-soft text-flame-ink', text: 'bg-wash-2 text-ink', quiz: 'bg-violet-soft text-violet', assignment: 'bg-azure-soft text-indigo-ink' } as const

/* The tinted glyph for a lesson type (video, text, quiz, assignment). */
export function LessonTypeIcon({ type, className }: { type: LessonType; className?: string }) {
  const Icon = map[type]
  return (
    <span className={cx('grid size-7 shrink-0 place-items-center rounded-[8px]', tone[type], className)} aria-hidden>
      <Icon className="size-[15px]" />
    </span>
  )
}
