import { Heart } from 'lucide-react'

import { cx } from '../lib/cx'
import { useSaved } from '../lib/store'
import { useToast } from './Toast'

/** Heart toggle that adds a room to the ideas board (localStorage). */
export function SaveButton({ id, name, className, 'data-force': force, pinned }: { id: string; name: string; className?: string; 'data-force'?: string; pinned?: boolean }) {
  const { has, toggle } = useSaved()
  const toast = useToast()
  const saved = pinned ?? has(id)
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from ideas board` : `Save ${name} to ideas board`}
      data-force={force}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(id)
        toast(saved ? `${name} removed from your ideas board` : `${name} saved to your ideas board`)
      }}
      className={cx(
        'round grid size-11 place-items-center rounded-full bg-snow/90 text-ink shadow-[var(--shadow-card)] backdrop-blur transition-[transform,background-color] duration-[var(--duration-base)] hover:scale-105 hover:bg-snow active:scale-95 data-[force=hover]:scale-105 data-[force=focus]:outline-2 data-[force=focus]:outline-offset-3 data-[force=focus]:outline-ink',
        className,
      )}
    >
      <Heart className={cx('size-[18px] transition-colors', saved ? 'fill-rust text-rust' : 'text-ink')} strokeWidth={1.75} aria-hidden />
    </button>
  )
}
