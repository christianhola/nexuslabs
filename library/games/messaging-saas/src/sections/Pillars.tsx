import { Check, CreditCard, Sparkles } from 'lucide-react'

import { Card } from '../components/Card'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/Section'
import { Bubble, ProductCardInline } from '../components/mocks/Chat'
import { Avatar } from '../components/Avatar'
import { pillars } from '../content'
import { Link } from '../lib/router'

/** A miniature, static product moment for each pillar card. */
function Moment({ id }: { id: string }) {
  if (id === 'text-to-buy')
    return (
      <div className="grid gap-2">
        <Bubble from="brand">Your Guji is almost gone. Same again? Reply YES.</Bubble>
        <Bubble from="shopper">YES</Bubble>
        <div className="flex items-center gap-2 self-end rounded-full bg-mint/15 px-3 py-1.5 text-[12px] font-semibold text-mint-text">
          <CreditCard aria-hidden className="size-3.5" /> Paid $19.00 · Visa 4242
        </div>
      </div>
    )
  if (id === 'recommendations')
    return (
      <div className="grid gap-2">
        <div className="flex items-center gap-2 text-[12px] text-faint">
          <Sparkles aria-hidden className="size-3.5 text-cobalt-text" /> Picked for Jess · 82% match
        </div>
        <Bubble from="brand">
          People who love Guji also reorder this.
          <ProductCardInline name="Kenya Nyeri, 340g" price="$16.00" tone="cherry" />
        </Bubble>
      </div>
    )
  return (
    <div className="grid gap-2">
      <Bubble from="shopper">Does the Field knit run small?</Bubble>
      <div className="flex items-start gap-2 rounded-[12px] border border-cobalt/40 bg-cobalt-soft p-2.5 text-[12.5px] leading-snug text-soft">
        <Avatar name="Relaytext AI" initials="AI" size={22} />
        True to size. From your last orders, M fits. Reply YES for a M.
      </div>
    </div>
  )
}

export function Pillars() {
  return (
    <Section id="product" className="bg-panel pt-8 sm:pt-12">
      <SectionHeading eyebrow="Why it earns more" title={<>Conventional SMS broadcasts.<br className="hidden sm:block" /> Relaytext converses.</>} body="Three things a shopper can do in a Relaytext thread that they can’t do with a link and a coupon." />
      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.id} delay={i * 90}>
            <Card tone="tile" className="group grid h-full content-start gap-6 p-6 transition-[border-color,transform] duration-300 ease-brand hover:-translate-y-1 hover:border-white/20 sm:p-7">
              <div className="min-h-[178px] rounded-[16px] border border-line bg-[#0f121b] p-4">
                <Moment id={p.id} />
              </div>
              <div className="grid gap-3">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-cobalt-text">{p.eyebrow}</p>
                <h3 className="font-display text-[26px] font-medium tracking-[-0.02em] text-white">{p.title}</h3>
                <p className="text-[15px] leading-[1.6] text-muted">{p.body}</p>
              </div>
              <ul className="grid gap-2 border-t border-line pt-5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-[14px] text-soft">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt-text" strokeWidth={2.6} />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href={`/features#${p.id}`} className="inline-flex min-h-10 items-center text-[14px] font-semibold text-cobalt-text hover:text-white">
                More on {p.eyebrow.toLowerCase()} <span aria-hidden>→</span>
              </Link>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
