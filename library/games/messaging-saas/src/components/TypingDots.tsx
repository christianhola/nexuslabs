import { cx } from '../lib/cx'

/** Three bouncing dots: "the other side is typing". */
export function TypingDots({ className, label = 'Typing' }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={cx('inline-flex items-center gap-1 rounded-[18px] rounded-bl-[6px] bg-bubble-in px-3.5 py-3', className)}>
      {[0, 1, 2].map((i) => (
        <span key={i} aria-hidden className="size-1.5 animate-typing rounded-full bg-soft" style={{ animationDelay: `${i * 0.16}s` }} />
      ))}
    </span>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cx('block animate-pulse rounded-[8px] bg-white/[0.07]', className)} />
}
