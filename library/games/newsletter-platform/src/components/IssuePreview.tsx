import type { Issue } from '../content'
import { brand, images } from '../content'
import { cx } from '../lib/cx'

/*
  Renders an issue the way it lands in the inbox: paper background, the
  publication's accent and font. Used by the editor preview, the template
  modal and the template cards.
*/
export function IssuePreview({ issue, mode = 'desktop', publication = 'The Quiet Hour', className }: { issue: Issue; mode?: 'desktop' | 'mobile' | 'text'; publication?: string; className?: string }) {
  const serif = issue.font === 'serif'
  if (mode === 'text') {
    return (
      <pre className={cx('whitespace-pre-wrap rounded-[10px] bg-paper p-6 font-mono text-[13px] leading-relaxed text-paper-ink', className)}>
        {[issue.title.toUpperCase(), issue.subtitle, '', ...issue.blocks.map((b) => (b.type === 'divider' ? '----' : b.type === 'image' ? '[image]' : b.type === 'button' ? `${b.text} -> ${b.href}` : b.type === 'quote' ? `> ${b.text}` : b.type === 'heading' ? `## ${b.text}` : (b.text ?? '')))].join('\n')}
      </pre>
    )
  }
  return (
    <article
      className={cx('issue mx-auto bg-paper text-paper-ink', mode === 'mobile' ? 'max-w-[380px] rounded-[22px] px-5 py-6 text-[15px]' : 'max-w-[640px] rounded-[10px] px-8 py-9 text-[16px] sm:px-12', className)}
      style={{ ['--issue-accent' as string]: issue.accent }}
    >
      <p className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: `color-mix(in srgb, ${issue.accent} 78%, black)` }}>
        <span className="round size-2 rounded-full" style={{ background: issue.accent }} aria-hidden />
        {publication}
      </p>
      <h1 className={cx('mt-3 text-balance leading-[1.1] tracking-[-0.02em]', serif ? 'font-serif text-[2em] font-semibold' : 'font-display text-[1.9em] font-extrabold')}>{issue.title || 'Untitled issue'}</h1>
      {issue.subtitle ? <p className="mt-2 text-[1.05em] text-[#5b5765]">{issue.subtitle}</p> : null}
      <div className="mt-5 border-t border-[#e6e2dc] pt-1">
        {issue.blocks.map((b) => {
          switch (b.type) {
            case 'heading':
              return <h2 key={b.id} className={serif ? '' : '!font-display !font-bold'}>{b.text}</h2>
            case 'paragraph':
              return <p key={b.id}>{b.text}</p>
            case 'quote':
              return <blockquote key={b.id}>{b.text}</blockquote>
            case 'image':
              return <img key={b.id} src={images[b.image ?? 'desk']} alt="" className="mt-5 aspect-[3/2] w-full rounded-[6px] object-cover" />
            case 'divider':
              return <hr key={b.id} className="mx-auto mt-6 w-16 border-t-2" style={{ borderColor: issue.accent }} />
            case 'button':
              return (
                <p key={b.id} className="!mt-6">
                  <span className="inline-flex h-11 items-center rounded-[6px] px-5 text-[0.95em] font-semibold text-white" style={{ background: issue.accent }}>
                    {b.text || 'Button'}
                  </span>
                </p>
              )
          }
        })}
      </div>
      <p className="mt-8 border-t border-[#e6e2dc] pt-4 text-[12px] text-[#6b6775]">Sent with {brand.name}. Unsubscribe or manage your preferences.</p>
    </article>
  )
}
