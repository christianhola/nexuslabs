import { Star } from 'lucide-react'

import { KINDS } from '../content'
import type { Item } from '../content'
import { cx } from '../lib/cx'
import { relativeDate } from '../lib/dates'
import { Link } from '../lib/router'
import { domain } from '../lib/search'
import { Tag } from './Chip'
import { Thumb } from './Thumb'

/** Grid card. The star is a sibling of the link, never nested in it. */
export function ItemCard({ item, onFavourite, force, collectionName }: { item: Item; onFavourite?: (id: string) => void; force?: 'hover' | 'focus'; collectionName?: string }) {
  return (
    <article className="group relative">
      <Link
        href={`/app/item/${item.id}`}
        data-force={force}
        className={cx(
          'flex h-full flex-col overflow-hidden rounded-xl bg-panel shadow-[inset_0_0_0_1px_var(--color-line)] transition-[box-shadow,transform] duration-(--duration-base) ease-out-soft',
          'hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_var(--color-line-2),0_14px_30px_-18px_rgb(30_30_15/0.3)] data-[force=hover]:-translate-y-0.5 data-[force=hover]:shadow-[inset_0_0_0_1px_var(--color-line-2),0_14px_30px_-18px_rgb(30_30_15/0.3)]',
          'data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink',
        )}
      >
        <Thumb item={item} className="aspect-[16/10] w-full" />
        <span className="flex flex-1 flex-col gap-1.5 p-4">
          <span className="flex items-center justify-between text-[12px] tracking-[0.06em] text-subtle uppercase">
            <span>{KINDS[item.kind]}</span>
            <span className="tracking-normal normal-case">{relativeDate(item.savedAt)}</span>
          </span>
          <span className="text-[16px] leading-[1.3] font-medium tracking-[-0.015em] text-ink">{item.title}</span>
          <span className="line-clamp-2 text-[14px] leading-[1.45] text-muted">{item.why}</span>
          <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
            {item.tags.slice(0, 3).map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
            <span className="ml-auto truncate text-[12.5px] text-subtle">{collectionName ?? domain(item.url)}</span>
          </span>
        </span>
      </Link>
      {onFavourite && (
        <button
          type="button"
          aria-pressed={item.favourite}
          aria-label={item.favourite ? `Remove ${item.title} from favourites` : `Add ${item.title} to favourites`}
          onClick={() => onFavourite(item.id)}
          className={cx(
            'absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-paper/90 shadow-card backdrop-blur transition-[opacity,transform] duration-(--duration-fast) hover:scale-105 active:scale-95',
            item.favourite ? 'text-ink' : 'text-ink-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 sm:group-focus-within:opacity-100',
          )}
        >
          <Star aria-hidden className={cx('size-4.5', item.favourite && 'fill-lime stroke-ink')} />
        </button>
      )}
    </article>
  )
}
