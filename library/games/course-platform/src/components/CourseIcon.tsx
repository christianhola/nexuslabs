import { Camera, Code2, Coffee, PenTool, Wheat } from 'lucide-react'

import { cx } from '../lib/cx'

const icons = { pen: PenTool, code: Code2, cup: Coffee, camera: Camera, wheat: Wheat } as const
export type CourseIconName = keyof typeof icons

/* The small subject glyph beside a course name. */
export function CourseIcon({ name, className }: { name: CourseIconName; className?: string }) {
  const Icon = icons[name]
  return (
    <span className={cx('round grid size-6 shrink-0 place-items-center rounded-full bg-wash-2 text-muted', className)} aria-hidden>
      <Icon className="size-3.5" />
    </span>
  )
}
