import { cn } from "@/lib/utils"

function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ aspectRatio: String(ratio) }}
      className={cn("relative w-full overflow-hidden", className)}
      {...props}
    />
  )
}

export { AspectRatio }
