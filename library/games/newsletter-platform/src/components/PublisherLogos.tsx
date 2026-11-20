import type { Publisher } from '../content'
import { cx } from '../lib/cx'

/*
  Invented publisher wordmarks for the logo strip, each drawn in CSS/SVG in a
  different typographic style so the row reads like real press logos.
  Replace with your customers' logos (with permission).
*/
export function PublisherLogo({ p, className }: { p: Publisher; className?: string }) {
  const c = cx('flex shrink-0 items-center text-[#cfcbd8]', className)
  switch (p.style) {
    case 'pin':
      return (
        <span className={cx(c, 'gap-1.5')}>
          <svg viewBox="0 0 24 24" className="size-8" aria-hidden>
            <circle cx="12" cy="12" r="11" fill="currentColor" />
            <path d="M8 18c2-6 3-9 7-12-1 4-2 6-5 8" stroke="#0a0811" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <span className="font-sans text-[30px] font-bold tracking-[-0.04em]">Quillcast</span>
        </span>
      )
    case 'mono':
      return (
        <span className={cx(c, 'gap-2')}>
          <span className="font-serif text-[40px] font-semibold italic leading-none">H</span>
          <span className="text-[14px] font-semibold tracking-[-0.01em]">Harbor Post Media</span>
        </span>
      )
    case 'script':
      return <span className={cx(c, 'font-serif text-[26px] italic tracking-[-0.02em]')}>The Daily Margin</span>
    case 'block':
      return (
        <span className={cx(c, 'gap-2')}>
          <span className="grid h-7 w-9 place-items-center bg-current" aria-hidden>
            <span className="h-2 w-5 bg-night" />
          </span>
          <span className="font-display text-[26px] font-extrabold tracking-[-0.04em]">Signal/Noise</span>
        </span>
      )
    case 'stack':
      return (
        <span className={cx(c, 'flex-col items-start leading-none')}>
          <span className="text-[9px] font-bold tracking-[0.3em]">THE</span>
          <span className="font-serif text-[28px] font-semibold tracking-[-0.03em]">Fernwood</span>
        </span>
      )
    case 'loud':
      return <span className={cx(c, '-skew-x-12 font-display text-[40px] font-black italic tracking-[-0.06em] [-webkit-text-stroke:1px_currentColor]')}>LOUD</span>
    case 'courier':
      return (
        <span className={cx(c, 'gap-1.5')}>
          <span className="grid size-6 place-items-center bg-current" aria-hidden>
            <svg viewBox="0 0 20 20" className="size-4 fill-night">
              <path d="M10 1.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L1.4 7.7l6-.7z" />
            </svg>
          </span>
          <span className="font-display text-[22px] font-bold tracking-[-0.02em] [font-stretch:80%]">THE PRAIRIE COURIER</span>
        </span>
      )
    case 'badge':
      return (
        <span className={cx('round flex size-10 shrink-0 items-center justify-center rounded-full bg-[#cfcbd8] text-[12px] font-black tracking-[-0.02em] text-[#1a1822]', className)}>OBP</span>
      )
    case 'kestrel':
      return <span className={cx(c, 'font-display text-[30px] font-black tracking-[-0.05em]')}>Kestrel</span>
  }
}

/* The scrolling strip. The list is rendered twice for a seamless loop. */
export function PublisherMarquee({ publishers }: { publishers: Publisher[] }) {
  return (
    <div className="mask-fade-x overflow-hidden" role="list" aria-label="Publishers using Inkwell">
      <div className="flex w-max animate-marquee items-center gap-14 pr-14 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[...publishers, ...publishers].map((p, i) => (
          <div key={i} role={i < publishers.length ? 'listitem' : undefined} aria-hidden={i >= publishers.length || undefined} aria-label={i < publishers.length ? p.name : undefined}>
            <PublisherLogo p={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
