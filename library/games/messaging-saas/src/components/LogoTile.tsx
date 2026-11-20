import { Asterisk } from 'lucide-react'

import { logos } from '../content'
import { cx } from '../lib/cx'

type Logo = (typeof logos)[number]

/** A fictional customer wordmark set in one of a few type treatments. */
export function Wordmark({ logo }: { logo: Logo }) {
  switch (logo.style) {
    case 'heavy':
      return <span className="font-display text-[22px] font-black tracking-[-0.04em]">{logo.name}</span>
    case 'stack':
      return (
        <span className="grid text-center font-display text-[15px] font-black uppercase leading-[0.82] tracking-[-0.03em]">
          {logo.name.split(' ').map((w) => (
            <span key={w}>{w}</span>
          ))}
        </span>
      )
    case 'serif-caps':
      return <span className="font-serif text-[16px] uppercase tracking-[0.16em]">{logo.name}</span>
    case 'asterisk':
      return (
        <span className="inline-flex items-center gap-1 font-display text-[21px] font-medium tracking-[-0.02em]">
          <Asterisk aria-hidden className="size-4" strokeWidth={3} />
          {logo.name}
        </span>
      )
    case 'italic':
      return <span className="font-serif text-[26px] italic">{logo.name}</span>
    case 'mono':
      return <span className="font-mono text-[14px] font-semibold tracking-[0.08em]">{logo.name}</span>
    case 'dot':
      return (
        <span className="font-display text-[22px] font-bold tracking-[-0.03em]">
          {logo.name}
          <span className="text-cobalt-text">.</span>
        </span>
      )
  }
}

export function LogoTile({ logo, className }: { logo: Logo; className?: string }) {
  return (
    <div
      role="img"
      aria-label={logo.name}
      className={cx('grid h-[86px] w-[176px] shrink-0 place-items-center rounded-[10px] border border-white/[0.12] bg-tile text-[#e9ebf0] sm:h-[92px] sm:w-[186px]', className)}
    >
      <span aria-hidden>
        <Wordmark logo={logo} />
      </span>
    </div>
  )
}

/** The scrolling row of logo tiles; pauses on hover and stops with reduced motion. */
export function LogoMarquee({ className }: { className?: string }) {
  const row = [...logos, ...logos]
  return (
    <div className={cx('group relative overflow-hidden', className)}>
      <ul className="flex w-max animate-marquee gap-[19px] group-hover:[animation-play-state:paused] motion-reduce:animate-none" aria-label="Brands using Relaytext">
        {row.map((l, i) => (
          <li key={`${l.name}-${i}`} aria-hidden={i >= logos.length || undefined}>
            <LogoTile logo={l} />
          </li>
        ))}
      </ul>
    </div>
  )
}
