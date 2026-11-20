import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import { cx } from '../lib/cx'

export type SortDir = 'asc' | 'desc'

/* A sortable column header button; put it inside a <th aria-sort>. */
export function SortHeader({ label, active, dir, onSort, className }: { label: string; active: boolean; dir: SortDir; onSort: () => void; className?: string }) {
  const Icon = !active ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <button type="button" onClick={onSort} className={cx('-mx-1.5 inline-flex h-10 items-center sm:h-8 gap-1 rounded-[7px] px-1.5 font-normal text-faint transition-colors hover:bg-wash hover:text-ink focus-visible:outline-2 focus-visible:outline-flame-strong', active && 'text-ink', className)}>
      {label}
      <Icon className={cx('size-3', active ? 'text-flame-ink' : 'opacity-70')} aria-hidden />
    </button>
  )
}

export const ariaSort = (active: boolean, dir: SortDir) => (active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none') as 'ascending' | 'descending' | 'none'
