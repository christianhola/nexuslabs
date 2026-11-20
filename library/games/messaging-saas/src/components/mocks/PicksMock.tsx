import { Sparkles } from 'lucide-react'
import { useState } from 'react'

import { featuresPage } from '../../content'
import { cx } from '../../lib/cx'
import { Avatar } from '../Avatar'
import { AppWindow } from './AppWindow'
import { Bubble, ProductCardInline, ProductThumb } from './Chat'

/** AI picks: one shopper, scored products, and the message the model would send for the chosen pick. */
export function PicksMock({ className }: { className?: string }) {
  const picks = featuresPage.picks
  const [i, setI] = useState(0)
  const p = picks[i]
  return (
    <AppWindow title="AI picks · Preview" className={className}>
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_1fr]">
        <div className="grid content-start gap-4">
          <div className="flex items-center gap-3 rounded-[12px] border border-line bg-white/[0.03] p-3">
            <Avatar name="Jess Moreno" initials="JM" tone="cherry" size={40} />
            <div className="grid text-[12px]">
              <span className="text-[14px] font-semibold text-white">Jess Moreno</span>
              <span className="text-faint">Last order 41 days ago · 6 orders</span>
            </div>
          </div>
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">Scored for Jess</legend>
            {picks.map((x, n) => (
              <label key={x.name} className={cx('flex cursor-pointer items-center gap-3 rounded-[12px] border p-2.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#8fb2ff]', n === i ? 'border-cobalt-text bg-cobalt-soft' : 'border-line hover:border-line-strong')}>
                <input type="radio" name="pick" className="sr-only" checked={n === i} onChange={() => setI(n)} />
                <ProductThumb tone={x.tone} className="size-10" />
                <span className="grid min-w-0 flex-1 gap-1">
                  <span className="flex justify-between text-[13px]">
                    <span className="font-semibold text-white">{x.name}</span>
                    <span className="tabular-nums text-soft">{Math.round(x.score * 100)}%</span>
                  </span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                    <span className="block h-full rounded-full bg-cobalt-text transition-[width] duration-500 ease-brand" style={{ width: `${x.score * 100}%` }} />
                  </span>
                  <span className="text-[11px] text-faint">{x.reason}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
        <div className="grid content-start gap-3 rounded-[14px] border border-line bg-[#0b0e18] p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
            <Sparkles aria-hidden className="size-3.5 text-cobalt-text" /> Drafted in your voice
          </p>
          <div aria-live="polite" key={p.name} className="grid gap-2.5">
            <Bubble from="brand" className="animate-pop">
              Hi Jess, your {picks[0].name} should be running low.{' '}
              {i === 0 ? 'Want the same again? Reply YES.' : `This time, want to try the ${p.name}? People with your routine love it.`}
              <ProductCardInline name={p.name} price={p.price} tone={p.tone} />
            </Bubble>
            <Bubble from="shopper" className="animate-pop">YES</Bubble>
          </div>
        </div>
      </div>
    </AppWindow>
  )
}
