import { cn } from "@/lib/utils"

function Highlighter({
  children,
  action = "highlight",
  color = "var(--primary)",
  className,
}: {
  children: React.ReactNode
  action?: "highlight" | "underline"
  color?: string
  className?: string
}) {
  return (
    <span
      data-slot="highlighter"
      className={cn(
        "relative inline rounded-[0.2em] px-[0.12em] text-foreground",
        className
      )}
      style={
        action === "highlight"
          ? {
              backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 100%)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 42%",
              backgroundPosition: "0 82%",
              opacity: 1,
            }
          : {
              textDecoration: "underline",
              textDecorationColor: color,
              textDecorationThickness: "0.16em",
              textUnderlineOffset: "0.18em",
            }
      }
    >
      {children}
    </span>
  )
}

export { Highlighter }
