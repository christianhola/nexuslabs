import { cn } from "@/lib/utils"

export function SpaceBackdropVideo({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden border border-white/10",
        className
      )}
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
    </div>
  )
}
