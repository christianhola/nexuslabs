import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <path
        d="M16 2.6 28 9.3v13.4L16 29.4 4 22.7V9.3Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <circle cx="16" cy="9.8" r="2.2" fill="currentColor" />
      <circle cx="10.4" cy="21.2" r="2.2" fill="currentColor" />
      <circle cx="21.6" cy="21.2" r="2.2" fill="currentColor" />
      <path
        d="M16 12.1 11 18.9M16 12.1l5 6.8M12.7 21.2h6.6"
        stroke="currentColor"
        strokeWidth="1.05"
      />
    </svg>
  )
}

export function Wordmark({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <span className={cn("flex items-baseline gap-2", className)}>
      <span className="text-[0.82rem] font-medium tracking-[0.26em]">
        NEXUS
      </span>
      <span className="text-[0.82rem] tracking-[0.26em] text-muted-foreground">
        LABS
      </span>
      {!compact && (
        <span className="hidden text-[0.62rem] tracking-[0.2em] text-muted-foreground/70 uppercase sm:inline">
          Estudio digital
        </span>
      )}
    </span>
  )
}
