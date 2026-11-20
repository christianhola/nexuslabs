import type { Post } from '../content'
import { cx } from '../lib/cx'
import { date } from '../lib/format'
import { Link } from '../lib/router'
import { Avatar } from './Avatar'
import { Badge } from './Badge'

export function PostCard({ post, featured = false, className }: { post: Post; featured?: boolean; className?: string }) {
  return (
    <article className={cx('group relative grid gap-5', featured && 'lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12', className)}>
      <div className="overflow-hidden rounded-card border border-line bg-panel">
        <img src={post.image} alt="" loading="lazy" className={cx('w-full object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.04]', featured ? 'aspect-[16/10]' : 'aspect-[3/2]')} />
      </div>
      <div className="grid content-start gap-3">
        <div className="flex items-center gap-3 text-[13px] text-faint">
          <Badge tone={post.category === 'Compliance' ? 'cherry' : post.category === 'Product' ? 'cobalt' : 'saffron'}>{post.category}</Badge>
          <span>
            {date(post.date)} · {post.readMinutes} min read
          </span>
        </div>
        <h3 className={cx('font-display font-medium tracking-[-0.02em] text-white', featured ? 'text-[30px] leading-[1.15] sm:text-[38px]' : 'text-[21px] leading-[1.25]')}>
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-[''] hover:text-cobalt-text focus-visible:outline-none [&:focus-visible]:after:rounded-card [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-[#8fb2ff]">
            {post.title}
          </Link>
        </h3>
        <p className="text-[15px] leading-[1.6] text-muted">{post.excerpt}</p>
        <div className="mt-1 flex items-center gap-2.5 text-[14px] text-soft">
          <Avatar src={post.author.avatar} name={post.author.name} size={28} />
          {post.author.name}
        </div>
      </div>
    </article>
  )
}
