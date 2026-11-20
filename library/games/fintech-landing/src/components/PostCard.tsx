import { ArrowUpRight } from 'lucide-react'

import type { Post } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Badge } from './Badge'

// Post covers are drawn with gradients; replace with image URLs for real
// photography (e.g. `url(/images/post-1.jpg) center/cover`).
export const covers = [
  'radial-gradient(80% 90% at 20% 20%, #6d55ff, transparent 60%), radial-gradient(70% 80% at 90% 90%, #ff5a36, transparent 60%), #0c0c10',
  'radial-gradient(80% 90% at 80% 10%, #c58ef0, transparent 60%), radial-gradient(70% 80% at 10% 90%, #5b3df6, transparent 60%), #0c0c10',
  'radial-gradient(80% 90% at 30% 80%, #16a34a, transparent 60%), radial-gradient(70% 80% at 90% 10%, #5fd7e4, transparent 60%), #0c0c10',
  'radial-gradient(80% 90% at 70% 70%, #ff5a36, transparent 60%), radial-gradient(70% 80% at 10% 10%, #fbbf24, transparent 55%), #0c0c10',
  'radial-gradient(80% 90% at 10% 60%, #5fd7e4, transparent 60%), radial-gradient(70% 80% at 90% 20%, #6d55ff, transparent 60%), #0c0c10',
  'radial-gradient(80% 90% at 50% 0%, #c58ef0, transparent 60%), radial-gradient(70% 80% at 50% 100%, #16a34a, transparent 60%), #0c0c10',
]

export function coverFor(slug: string, list: { slug: string }[]) {
  const i = Math.max(0, list.findIndex((p) => p.slug === slug))
  return covers[i % covers.length]
}

/** Gradient cover with a slow zoom on hover of the enclosing `group`. */
export function PostCover({ background, tag, className }: { background: string; tag?: string; className?: string }) {
  return (
    <div className={cx('relative overflow-hidden', className)}>
      <div aria-hidden className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background }} />
      <div aria-hidden className="dots absolute inset-0 opacity-60 [mask-image:none]" />
      {tag ? (
        <Badge tone="glass" className="absolute left-4 top-4">
          {tag}
        </Badge>
      ) : null}
    </div>
  )
}

/** Blog teaser card: cover, title, optional excerpt, date and read time. */
export function PostCard({ post, cover, excerpt = false, className }: { post: Post; cover: string; excerpt?: boolean; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cx('depth group relative flex h-full flex-col overflow-hidden rounded-card bg-surface transition-colors duration-300 hover:bg-surface-2', className)}
    >
      <PostCover background={cover} tag={post.tag} className="h-[180px]" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[20px] font-semibold leading-snug tracking-[-0.025em] text-balance">{post.title}</h3>
        {excerpt ? <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">{post.excerpt}</p> : null}
        <div className="mt-auto flex items-center pt-6 text-[13px] text-muted">
          {post.date} · {post.read} read
          <ArrowUpRight
            className="ml-auto size-5 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  )
}
