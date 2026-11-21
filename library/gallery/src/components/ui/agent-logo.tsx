import * as React from "react"
import { cn } from "cn"

export type AgentKind = "claude" | "codex"

export function AgentLogo({
  kind = "claude",
  className,
  ...props
}: React.ComponentProps<"span"> & { kind?: AgentKind }) {
  const isCodex = kind === "codex"
  return (
    <span
      data-slot="agent-logo"
      data-kind={kind}
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold leading-none",
        isCodex
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-amber-500/15 text-amber-400",
        className
      )}
      {...props}
    >
      {isCodex ? "Cx" : "Cl"}
    </span>
  )
}