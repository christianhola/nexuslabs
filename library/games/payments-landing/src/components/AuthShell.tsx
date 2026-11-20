import type { ReactNode } from 'react'

import { why } from '../content'
import { Avatar } from './Avatar'
import { PaymentCard } from './PaymentCard'
import { Shapes } from './Shapes'

/** Split layout for sign-up and log-in: form left, brand panel right. */
export function AuthShell({ title, body, children }: { title: ReactNode; body: ReactNode; children: ReactNode }) {
  return (
    <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <div className="px-5 pb-16 pt-28 sm:px-10 sm:pt-36 lg:px-20">
        <div className="mx-auto max-w-[480px]">
          <h1 className="text-[34px] font-medium leading-[1.1] tracking-[-0.035em] text-ink sm:text-[40px]">{title}</h1>
          <p className="mt-3 text-[15.5px] leading-[1.6] text-muted">{body}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <aside aria-label="Why Ledgerly" className="relative hidden overflow-hidden bg-mist lg:block">
        <Shapes />
        <div className="relative flex h-full flex-col items-center justify-center gap-10 p-16">
          <div className="animate-float">
            <PaymentCard label="Business card" last4="4242" className="w-[240px]" />
          </div>
          <figure className="max-w-[380px] rounded-card bg-white p-6 shadow-card">
            <blockquote className="text-[16px] leading-[1.55] text-ink-2">“{why.quote.text}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <Avatar initials={why.quote.initials} />
              <span className="text-[13.5px]">
                <span className="block font-medium text-ink">{why.quote.name}</span>
                <span className="text-muted">{why.quote.role}</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </aside>
    </section>
  )
}
