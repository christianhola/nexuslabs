import type { ReactNode } from "react"

import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

export function SectionHead({
  eyebrow,
  title,
  description,
  aside,
  className,
}: {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  aside?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div className="max-w-2xl">
        <BlurFade>
          <p className="mono-label">{eyebrow}</p>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h2 className="mt-3 font-display text-4xl leading-[1.02] sm:text-5xl">
            {title}
          </h2>
        </BlurFade>
        {description ? (
          <BlurFade delay={0.12}>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-7 text-muted-foreground">
              {description}
            </p>
          </BlurFade>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  )
}
