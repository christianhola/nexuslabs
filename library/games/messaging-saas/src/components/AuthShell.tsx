import type { ReactNode } from 'react'

import { images, testimonials } from '../content'
import { Avatar } from './Avatar'
import { Container } from './Container'

/** Split layout for sign-up, log-in and contact: the form on the left, the render and a quote on the right. */
export function AuthShell({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  const t = testimonials[1]
  return (
    <section className="relative pb-20 pt-28 sm:pt-32">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="grid content-start py-4 lg:py-10">{children}</div>
        <div className="grain relative isolate hidden min-h-[640px] overflow-hidden rounded-panel border border-white/10 bg-night lg:block">
          <img src={images.hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_50%]" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080b17] via-[#080b17]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 grid gap-6 p-10">
            {aside ?? (
              <figure className="grid gap-5">
                <blockquote className="font-display text-[26px] leading-[1.3] text-white">“{t.quote}”</blockquote>
                <figcaption className="flex items-center gap-3 text-[14px]">
                  <Avatar src={t.avatar} name={t.name} size={40} />
                  <span>
                    <span className="block font-semibold text-white">{t.name}</span>
                    <span className="block text-soft">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
