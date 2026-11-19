import { Photo } from './Photo'
import { cx } from '../lib/cx'
import type { ImageKey } from '../content'

/**
 * Portrait with the name set huge and overlapping its right edge, as on the
 * studio's team page.
 */
export function TeamMember({ number, first, last, role, bio, image, className }: { number: string; first: string; last: string; role: string; bio: string; image: ImageKey; className?: string }) {
  return (
    <article className={cx('grid grid-cols-[minmax(0,38%)_minmax(0,1fr)] items-start sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]', className)}>
      <Photo name={image} alt={`Portrait of ${first} ${last}`} className="aspect-[3/4]" />
      <div className="relative z-10 -ml-[clamp(1.25rem,3vw,2.75rem)] flex h-full flex-col">
        <span className="label-sm ml-[clamp(1.25rem,3vw,2.75rem)] pl-3 tabular-nums text-ink-2">{number}</span>
        <h3 className="font-display mt-2 text-[clamp(2.75rem,7vw,6.25rem)] leading-[0.86] tracking-[-0.055em]">
          <span className="block">{first}</span>
          <span className="block">{last}</span>
        </h3>
        <div className="ml-[clamp(1.25rem,3vw,2.75rem)] flex flex-1 flex-col justify-between gap-4 pt-3 pl-3">
          <p className="label-sm text-muted">{role}</p>
          <p className="max-w-[17rem] text-[13px] leading-snug text-ink-2">{bio}</p>
        </div>
      </div>
    </article>
  )
}
