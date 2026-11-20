import { ArrowRight } from 'lucide-react'

import { COPY } from '../content'
import { Button } from '../components/Button'
import { Panel } from '../components/Panel'
import { Wordmark } from '../components/Wordmark'
import { cx } from '../lib/cx'

/** The centred landing card: wordmark, tagline, Get Started. */
export function Hero({ leaving, offsetY, onStart }: { leaving: boolean; offsetY: number; onStart: () => void }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4"
      style={{ paddingTop: offsetY * 2 }}
    >
      <Panel
        tone="frost"
        className={cx(
          'pointer-events-auto flex w-[420px] max-w-full animate-rise flex-col items-center px-6 pb-[46px] pt-[47px] text-center [animation-delay:380ms]',
          '!shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_30px_-6px_rgb(0_0_0/0.13)] ring-1 ring-black/[0.03]',
          'transition-[opacity,transform,filter] duration-[var(--duration-hero)] ease-[var(--ease-out)]',
          leaving && 'pointer-events-none scale-[0.94] opacity-0 blur-[6px]',
        )}
      >
        <Wordmark as="h1" size="hero" className="-ml-1" />
        <p className="mt-[13px] text-[clamp(21px,6vw,var(--text-tagline))] leading-[1.25] tracking-[-0.012em] text-ink">{COPY.tagline}</p>
        <Button size="lg" className="group mt-[27px] min-w-[137px] gap-0 !rounded-[7px] !bg-[#0b0b0b] hover:!bg-[#262626]" onClick={onStart}>
          {COPY.cta}
          <ArrowRight
            aria-hidden
            size={15}
            className="-mr-1 ml-0 w-0 opacity-0 transition-all duration-200 group-hover:ml-1.5 group-hover:w-[15px] group-hover:opacity-100 group-focus-visible:ml-1.5 group-focus-visible:w-[15px] group-focus-visible:opacity-100"
          />
        </Button>
      </Panel>
    </div>
  )
}
