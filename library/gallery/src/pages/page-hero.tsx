import type { ReactNode } from "react"

import { BlurFade } from "@/components/ui/blur-fade"

export function PageHero({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string
  title: ReactNode
  description: string
  aside?: ReactNode
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="paper-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 pt-14 pb-12 sm:px-8 sm:pt-20 sm:pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="min-w-0">
          <BlurFade delay={0.02}>
            <p className="mono-label">{eyebrow}</p>
          </BlurFade>
          <BlurFade delay={0.08}>
            <h1 className="mt-4 max-w-3xl font-display text-[2.6rem] leading-[0.98] tracking-[-0.025em] sm:text-5xl lg:text-[3.8rem]">
              {title}
            </h1>
          </BlurFade>
          <BlurFade delay={0.14}>
            <p className="mt-5 max-w-2xl text-[0.92rem] leading-7 text-muted-foreground">
              {description}
            </p>
          </BlurFade>
        </div>
        {aside ? (
          <BlurFade delay={0.18} className="lg:justify-self-end">
            {aside}
          </BlurFade>
        ) : null}
      </div>
    </section>
  )
}
