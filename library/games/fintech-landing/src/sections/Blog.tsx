import { ArrowRight } from 'lucide-react'

import { Button } from '../components/Button'
import { coverFor, PostCard } from '../components/PostCard'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { blog, posts } from '../content'

export function Blog() {
  const latest = posts.slice(0, 3)
  return (
    <Section id="blog">
      <SectionHeading eyebrow={blog.eyebrow} title={blog.title} />
      <div className="mx-auto mt-14 grid max-w-[1120px] gap-4 md:grid-cols-3">
        {latest.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <PostCard post={p} cover={coverFor(p.slug, posts)} />
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 flex justify-center">
        <Button href={blog.more.href} variant="outline" size="sm">
          {blog.more.label} <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-1" aria-hidden />
        </Button>
      </Reveal>
    </Section>
  )
}
