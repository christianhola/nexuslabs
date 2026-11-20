import { photos } from '../content'
import type { Post } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Card } from './Card'
import { Reactor } from './Reactor'
import { Ship } from './Ship'

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
export const formatDate = (iso: string) => dateFmt.format(new Date(`${iso}T00:00:00Z`))

/** A post's cover: its photo when it has one, else art drawn from its tone. */
export function PostCover({ post, className }: { post: Post; className?: string }) {
  const tone = post.tone === 'fire' ? 'fire' : post.tone === 'ocean' ? 'ocean' : 'steel'
  if (post.image) {
    return (
      <Card tone={tone} className={className}>
        <img src={photos[post.image]} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      </Card>
    )
  }
  return (
    <Card tone={tone} className={cx('grid place-items-center', className)}>
      {post.tone === 'ocean' ? <Reactor className="h-[86%] w-auto" label="" /> : null}
      {post.tone === 'steel' ? <Ship kind="frigate" className="w-[72%]" decorative /> : null}
      {post.tone === 'fire' && post.cover ? <span className="text-[64px] font-medium tracking-[-0.05em] text-white/95">{post.cover}</span> : null}
    </Card>
  )
}

export function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article
      className={cx(
        'group relative flex gap-5 rounded-card has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-plasma-text',
        featured ? 'flex-col lg:flex-row lg:items-center lg:gap-10' : 'flex-col',
      )}
    >
      <PostCover post={post} className={cx('transition-transform duration-500 group-hover:scale-[1.01]', featured ? 'aspect-[16/10] lg:w-[58%]' : 'aspect-[16/11]')} />
      <div className="flex flex-col gap-2">
        <p className="flex gap-3 text-[14px]">
          <span className="font-medium text-plasma-text">{post.category}</span>
          <time dateTime={post.date} className="text-faint">
            {formatDate(post.date)}
          </time>
        </p>
        <h3 className={cx('text-balance font-medium tracking-[-0.02em]', featured ? 'text-[30px] sm:text-[36px]' : 'text-[20px]')}>
          <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </Link>
        </h3>
        <p className="text-pretty text-[16px] leading-[1.5] text-muted">{post.summary}</p>
      </div>
    </article>
  )
}
