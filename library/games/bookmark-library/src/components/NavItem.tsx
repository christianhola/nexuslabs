import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/** Sidebar row: square glyph, label, count. */
export function NavItem({ href, label, count, active, icon, square = true, force, onClick }: { href: string; label: string; count?: number; active?: boolean; icon?: ReactNode; square?: boolean; force?: 'hover' | 'focus'; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      data-force={force}
      className={cx(
        'group flex h-11 items-center gap-3 rounded-md px-3 text-[16px] tracking-[-0.01em] transition-colors duration-(--duration-fast)',
        active ? 'bg-chip-2/80 font-medium text-ink' : 'text-ink-2 hover:bg-chip data-[force=hover]:bg-chip',
        'data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink',
      )}
    >
      {square && (icon ?? <span aria-hidden className={cx('size-[18px] rounded-[5px]', active ? 'bg-line-2' : 'bg-chip-2')} />)}
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined && <span className={cx('text-[13px] tabular-nums', active ? 'text-muted' : 'text-subtle')}>{count}</span>}
    </Link>
  )
}
