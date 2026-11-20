import { Activity, Calendar, ChevronDown, Clock, Eye, ListVideo, MessageSquare, Play, Plus, Search, User } from 'lucide-react'
import type { ReactNode } from 'react'

import type { PresenterId, Scene } from '@/content'
import { cn } from '@/lib/cn'
import { Link } from '@/lib/router'
import { Badge } from './ui'
import { ScreenMock } from './ScreenMock'

/* Library building blocks shared by the hero composition and the real app. */

/** The yellow "list" glyph the reference puts before each playlist. */
export function PlaylistIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn('size-[13px] shrink-0 text-folder', className)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path d="M2 4h8M2 8h8M2 12h5" />
      <path d="M12 9.5v5M12 9.5l2.5 1.2" />
    </svg>
  )
}

export function WorkspaceHeader({ name, onSearch, compact }: { name: string; onSearch?: () => void; compact?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between', compact ? 'h-8' : 'h-10')}>
      <span className="inline-flex items-center gap-2 font-display text-[19px] font-semibold tracking-[-0.03em]">
        {name}
        <ChevronDown className="size-3.5 text-muted" />
      </span>
      {onSearch ? (
        <button type="button" onClick={onSearch} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg" aria-label="Search clips">
          <Search className="size-4" />
        </button>
      ) : (
        <Search className="size-[15px] text-muted" aria-hidden />
      )}
    </div>
  )
}

export type NavRow = { id: string; label: string; count?: number; icon: 'mine' | 'watched' | 'activity' | 'archive' | 'playlist'; tone?: 'ok'; to?: string; onClick?: () => void; active?: boolean; actions?: ReactNode }

const ICONS = {
  mine: User,
  watched: Eye,
  activity: Activity,
  archive: ListVideo,
}

/** One row in the library sidebar: link or button, with a trailing count. */
export function SidebarRow({ row, size = 'md' }: { row: NavRow; size?: 'sm' | 'md' }) {
  const Icon = row.icon === 'playlist' ? null : ICONS[row.icon]
  const cls = cn(
    'group/row flex w-full items-center gap-2 rounded-[8px] px-2.5 text-left transition-colors duration-150',
    size === 'sm' ? 'h-[30px] text-[12.5px]' : 'h-9 text-[13.5px] pointer-coarse:h-10',
    row.active ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2/70 hover:text-fg',
  )
  const inner = (
    <>
      {Icon ? <Icon className="size-[13px] shrink-0" /> : <PlaylistIcon />}
      <span className="min-w-0 flex-1 truncate">{row.label}</span>
      {row.count !== undefined && (row.tone === 'ok' ? <Badge tone="ok">{row.count}</Badge> : <span className="text-[11px] text-faint tabular-nums">{row.count.toLocaleString('en')}</span>)}
    </>
  )
  return (
    <div className="group/item relative flex items-center">
      {row.to ? (
        <Link to={row.to} className={cls} aria-current={row.active ? 'page' : undefined}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={row.onClick} className={cls} aria-current={row.active ? 'page' : undefined}>
          {inner}
        </button>
      )}
      {row.actions}
    </div>
  )
}

export function PlaylistsHeading({ count, onAdd, size = 'md' }: { count: number; onAdd?: () => void; size?: 'sm' | 'md' }) {
  return (
    <div className={cn('flex items-center justify-between pl-2.5', size === 'sm' ? 'h-8 text-[12.5px]' : 'h-9 text-[13px]')}>
      <span className="font-medium text-fg">
        Playlists <span className="text-faint">({count})</span>
      </span>
      {onAdd ? (
        <button type="button" onClick={onAdd} className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg pointer-coarse:size-10" aria-label="New playlist">
          <Plus className="size-4" />
        </button>
      ) : (
        <Plus className="mr-2 size-3.5 text-muted" aria-hidden />
      )}
    </div>
  )
}

export function ClipMeta({ duration, ago, views, comments, className }: { duration: string; ago: string; views?: number; comments?: number; className?: string }) {
  return (
    <p className={cn('flex flex-wrap items-center gap-x-1.5 text-[12px] text-muted', className)}>
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3" aria-hidden />
        <span className="sr-only">Length</span>
        {duration}
      </span>
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <Calendar className="size-3" aria-hidden />
        {ago}
      </span>
      {views !== undefined && (
        <>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1" title={`${views} views`}>
            <Play className="size-3" aria-hidden />
            <span className="sr-only">Views</span>
            {views}
          </span>
        </>
      )}
      {comments !== undefined && (
        <span className="inline-flex items-center gap-1" title={`${comments} comments`}>
          <MessageSquare className="ml-1 size-3" aria-hidden />
          <span className="sr-only">Comments</span>
          {comments}
        </span>
      )}
    </p>
  )
}

/**
 * A clip in the library: CSS poster frame, title and meta over a bottom
 * gradient. The whole card is one link; `menu` sits on top for actions.
 */
export function ClipCard({
  to,
  title,
  scene,
  presenter,
  duration,
  ago,
  views,
  comments,
  unwatched,
  menu,
  className,
  layout = 'overlay',
}: {
  to: string
  title: string
  scene: Scene
  presenter: PresenterId
  duration: string
  ago: string
  views?: number
  comments?: number
  unwatched?: boolean
  menu?: ReactNode
  className?: string
  layout?: 'overlay' | 'stacked'
}) {
  if (layout === 'stacked')
    return (
      <div className={cn('group/card relative', className)}>
        <Link to={to} className="block rounded-[14px]">
          <div className="relative overflow-hidden rounded-[14px] ring-1 ring-line transition-[box-shadow,transform] duration-200 group-hover/card:ring-line-strong">
            <ScreenMock scene={scene} presenter={presenter} className="aspect-video w-full transition-transform duration-500 ease-out group-hover/card:scale-[1.02]" />
            <span className="absolute right-2 bottom-2 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-medium text-fg tabular-nums">{duration}</span>
            {unwatched && <span className="absolute top-2.5 right-2.5 rounded-full bg-record px-2 py-0.5 text-[11px] font-medium text-white">New</span>}
          </div>
          <p className="mt-3 truncate pr-9 text-[14.5px] font-medium">{title}</p>
          <ClipMeta duration={duration} ago={ago} views={views} comments={comments} className="mt-1" />
        </Link>
        {menu && <div className="absolute right-0 bottom-[22px]">{menu}</div>}
      </div>
    )
  return (
    <div className={cn('group/card relative', className)}>
      <Link to={to} className="relative block overflow-hidden rounded-[12px] bg-surface ring-1 ring-line transition-shadow duration-200 hover:ring-line-strong">
        <ScreenMock scene={scene} presenter={presenter} bubble={false} className="aspect-[1.38] w-full opacity-70" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#141312] via-[#141312]/85 to-transparent px-[15px] pt-10 pb-[14px]">
          <p className="truncate text-[14px] font-medium text-fg/90">{title}</p>
          <ClipMeta duration={duration} ago={ago} views={views} comments={comments} className="mt-[5px] text-[12px]" />
        </div>
      </Link>
      {menu}
    </div>
  )
}
