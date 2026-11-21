import { TraceIcon, TraceLine, TraceTitle, TraceDescription } from "@/components/ui/trace"
import { AgentLogo, type AgentKind } from "@/components/ui/agent-logo"
import { cn } from "@/lib/utils"

export type SubagentStatus = "running" | "completed"

export function SubagentRow({
  agent,
  status = "running",
  className,
}: {
  agent?: string
  status?: SubagentStatus
  className?: string
}) {
  const kind: AgentKind = agent === "codex" ? "codex" : "claude"
  const name = kind === "codex" ? "Codex" : "Claude"
  const running = status === "running"
  return (
    <TraceLine
      status={running ? "running" : undefined}
      className={cn("text-muted-foreground", className)}
    >
      <TraceIcon>
        <AgentLogo kind={kind} />
      </TraceIcon>
      <TraceTitle>{name}</TraceTitle>
      <TraceDescription>{running ? "working…" : "completed"}</TraceDescription>
    </TraceLine>
  )
}