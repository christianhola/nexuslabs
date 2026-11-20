import type { Item } from '../content'
import { cx } from '../lib/cx'
import { shortDate } from '../lib/dates'
import { Link } from '../lib/router'
import { Thumb } from './Thumb'

/** Search-result row: thumbnail, title, the note, date. */
export function ItemRow({ item, href, active, force, onClick }: { item: Item; href?: string; active?: boolean; force?: 'hover' | 'focus'; onClick?: () => void }) {
  const body = (
    <>
      <Thumb item={item} className="h-[40px] w-[54px] shrink-0 rounded-md" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[17px] font-medium tracking-[-0.015em] text-ink">{item.title}</span>
        <span className="mt-0.5 block truncate text-[14px] text-muted">{item.note}</span>
      </span>
      <span className="shrink-0 self-start pt-1 text-[13px] text-subtle tabular-nums">{shortDate(item.savedAt)}</span>
    </>
  )
  const cls = cx(
    'flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left transition-colors duration-(--duration-fast)',
    active ? 'bg-chip' : 'hover:bg-chip/70 data-[force=hover]:bg-chip/70',
    'data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink',
  )
  if (href)
    return (
      <Link href={href} onClick={onClick} data-force={force} className={cls}>
        {body}
      </Link>
    )
  return (
    <div data-force={force} className={cls}>
      {body}
    </div>
  )
}
