import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  Surfaces. Every card is a lit squircle; `tone` picks its light:
  - plain: near-black glass, for lists and forms
  - fire: ember to amber, the heat of the plasma
  - ocean: deep navy lifting to blue
  - stripes: blue light through vertical slats (the stat card)
  - steel: cool grey, for neutral media
*/
export type CardTone = 'plain' | 'fire' | 'ocean' | 'stripes' | 'steel'

const tones: Record<CardTone, string> = {
  plain: 'bg-surface',
  fire: 'bg-[radial-gradient(120%_80%_at_50%_100%,#ffd36b_0%,#ff9a2e_28%,#e2520e_55%,#6e1f05_85%,#2a0b02_100%)]',
  ocean: 'bg-[radial-gradient(120%_90%_at_50%_100%,#6ea2ff_0%,#2f56a8_40%,#162a57_75%,#0c1630_100%)]',
  stripes:
    'bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0)_0_7px,rgb(220_232_255/0.16)_7px_9px),radial-gradient(90%_70%_at_50%_15%,#8fb4f2_0%,#4a6fc0_45%,#1d3263_100%)]',
  steel: 'bg-[linear-gradient(160deg,#2a2f3a_0%,#14171e_100%)]',
}

export function Card({
  tone = 'plain',
  children,
  className,
  as: As = 'div',
  interactive = false,
  id,
}: {
  id?: string
  tone?: CardTone
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'li' | 'section'
  interactive?: boolean
}) {
  return (
    <As
      id={id}
      className={cx(
        'depth relative isolate overflow-hidden rounded-card',
        tones[tone],
        interactive && 'transition-transform duration-300 ease-out hover:-translate-y-1',
        className,
      )}
    >
      {children}
    </As>
  )
}

/** The text block that sits at the top of a feature card. */
export function CardText({ title, body, className }: { title: ReactNode; body: ReactNode; className?: string }) {
  return (
    <div className={cx('relative z-10 flex flex-col gap-1 p-5 sm:p-6', className)}>
      <h3 className="text-[16px] font-medium text-white">{title}</h3>
      <p className="text-pretty text-[16px] leading-[1.42] text-white/85">{body}</p>
    </div>
  )
}
