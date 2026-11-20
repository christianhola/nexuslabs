import { BarChart3, CalendarClock, ClipboardCheck, Globe2, MessagesSquare, Newspaper, Plug, Shield, Smartphone, Smile, Users, Zap } from 'lucide-react'
import type { LucideProps } from 'lucide-react'

import type { IconName } from '../content'
import { cx } from '../lib/cx'

const map: Record<IconName, React.ComponentType<LucideProps>> = {
  news: Newspaper,
  chat: MessagesSquare,
  tasks: ClipboardCheck,
  shifts: CalendarClock,
  people: Users,
  surveys: Smile,
  shield: Shield,
  globe: Globe2,
  bolt: Zap,
  phone: Smartphone,
  chart: BarChart3,
  plug: Plug,
}

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const C = map[name]
  return <C className={cx('size-5', className)} strokeWidth={1.75} aria-hidden />
}

/* The line-art icon tile used on module cards. */
export function IconTile({ name, className }: { name: IconName; className?: string }) {
  return (
    <span className={cx('grid size-11 place-items-center rounded-[12px] border-[1.5px] border-ink bg-card text-ink shadow-[3px_3px_0_var(--color-mint)]', className)}>
      <Icon name={name} />
    </span>
  )
}
