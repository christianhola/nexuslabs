import { ChevronLeft, Signal, Wifi } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../../lib/cx'

export type Tone = 'cobalt' | 'cherry' | 'saffron'

const swatch: Record<Tone, string> = {
  cobalt: 'from-[#3a6ff0] to-[#1b3a9a]',
  cherry: 'from-[#f0503f] to-[#9e1f15]',
  saffron: 'from-[#f8c74a] to-[#c98a0c]',
}

/** A tiny product "photo": a glossy capsule in one of the hero's colours. */
export function ProductThumb({ tone, className }: { tone: Tone; className?: string }) {
  return (
    <span aria-hidden className={cx('relative grid shrink-0 place-items-center overflow-hidden rounded-[10px] bg-gradient-to-br', swatch[tone], className ?? 'size-12')}>
      <span className="h-[62%] w-[34%] rounded-full bg-white/25 shadow-[inset_0_2px_6px_rgb(255_255_255/0.6)]" />
    </span>
  )
}

export function ProductCardInline({ name, price, tone }: { name: string; price: string; tone: Tone }) {
  return (
    <span className="mt-2 flex items-center gap-3 rounded-[12px] bg-black/25 p-2 pr-3">
      <ProductThumb tone={tone} className="size-11" />
      <span className="grid text-left">
        <span className="text-[13px] font-semibold leading-tight">{name}</span>
        <span className="text-[12px] opacity-80">{price} · Reply ADD</span>
      </span>
    </span>
  )
}

/** One message. Brand messages are outgoing (cobalt, right); shopper messages are incoming (grey, left). */
export function Bubble({ from, children, className, meta }: { from: 'brand' | 'shopper'; children: ReactNode; className?: string; meta?: string }) {
  const out = from === 'brand'
  return (
    <div className={cx('flex flex-col', out ? 'items-end' : 'items-start', className)}>
      <div
        className={cx(
          'max-w-[84%] px-3.5 py-2.5 text-[14px] leading-[1.4]',
          out ? 'rounded-[18px] rounded-br-[6px] bg-bubble-out text-white' : 'rounded-[18px] rounded-bl-[6px] bg-bubble-in text-white',
        )}
      >
        {children}
      </div>
      {meta ? <span className="mt-1 px-1 text-[11px] text-faint">{meta}</span> : null}
    </div>
  )
}

/** A phone-shaped frame with a status bar and a contact header. */
export function PhoneFrame({ contact, children, footer, className }: { contact: string; children: ReactNode; footer?: ReactNode; className?: string }) {
  return (
    <div className={cx('relative mx-auto w-full max-w-[340px] rounded-[46px] border border-white/15 bg-[#05070f] p-2.5 shadow-float', className)}>
      <div className="flex h-[620px] flex-col overflow-hidden rounded-[38px] bg-[#0b0e18]">
        <div className="flex items-center justify-between px-7 pb-1 pt-3.5 text-[12px] font-semibold text-white" aria-hidden>
          <span>9:41</span>
          <span className="h-6 w-24 rounded-full bg-black" />
          <span className="flex items-center gap-1">
            <Signal className="size-3.5" />
            <Wifi className="size-3.5" />
          </span>
        </div>
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <ChevronLeft aria-hidden className="size-5 text-cobalt-text" />
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-white font-display text-[13px] font-bold text-cobalt">
            {contact
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)}
          </span>
          <div className="grid leading-tight">
            <span className="text-[14px] font-semibold text-white">{contact}</span>
            <span className="text-[11px] text-faint">Text message · via Relaytext</span>
          </div>
        </div>
        <div className="no-scrollbar flex flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 py-4">{children}</div>
        {footer ? <div className="border-t border-line p-3">{footer}</div> : null}
      </div>
    </div>
  )
}
