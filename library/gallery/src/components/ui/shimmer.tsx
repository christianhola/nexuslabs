import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

export function Shimmer({
  children,
  duration = 2,
  className,
}: {
  children: ReactNode
  duration?: number
  className?: string
}) {
  return (
    <span
      className={cn("nx-shimmer", className)}
      style={{ "--shimmer-duration": `${duration}s` } as CSSProperties}
    >
      {children}
    </span>
  )
}

export default Shimmer
