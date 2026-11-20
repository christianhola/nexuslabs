import { useEffect, useState } from "react"
import { Brain, Check, ChevronDown, Loader2, Wrench } from "lucide-react"

import { cn } from "@/lib/utils"
import { Shimmer } from "@/components/ui/shimmer"

export function Reasoning({
  steps,
  open,
  seconds,
}: {
  steps: string[]
  open: boolean
  seconds?: number
}) {
  const [pinned, setPinned] = useState<boolean | null>(null)
  const visible = pinned ?? open

  useEffect(() => {
    if (!open) setPinned(null)
  }, [open])

  if (!steps.length) return null

  return (
    <div className="w-full max-w-[54ch]">
      <button
        type="button"
        onClick={() => setPinned(!visible)}
        aria-expanded={visible}
        className="group flex items-center gap-2 rounded-full py-1 pr-2 text-[0.72rem] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Brain className="size-3.5 shrink-0 text-primary/80" />
        {open ? (
          <Shimmer duration={1.6}>Razonando…</Shimmer>
        ) : (
          <span>
            Razonó durante {seconds ?? steps.length} s · {steps.length} pasos
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-300",
            visible && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          visible ? "mt-1 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <ol className="ml-1.5 space-y-1.5 border-l border-border/70 pl-4 pt-1 pb-2">
            {steps.map((step, index) => (
              <li
                key={`${step}-${index}`}
                className="animate-in fade-in slide-in-from-left-1 fill-mode-both text-[0.76rem] leading-5 text-muted-foreground"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <span className="mr-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-primary/45 align-middle" />
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

export type ToolTraceItem = {
  id: string
  name: string
  label: string
  detail: string
  status: "running" | "done"
}

export function ToolTrace({ tools }: { tools: ToolTraceItem[] }) {
  if (!tools.length) return null

  return (
    <ul className="flex flex-wrap gap-1.5">
      {tools.map((tool) => (
        <li
          key={tool.id}
          className={cn(
            "flex max-w-full items-center gap-2 rounded-lg border border-border/80 bg-background/70 px-2.5 py-1.5 text-[0.7rem] transition-colors",
            tool.status === "running" ? "opacity-80" : "opacity-100"
          )}
          title={`${tool.name} · ${tool.detail}`}
        >
          {tool.status === "running" ? (
            <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
          ) : (
            <Check className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          )}
          <span className="truncate font-medium">{tool.label}</span>
          <span className="mono-label hidden truncate text-[0.58rem] tracking-[0.12em] sm:inline">
            {tool.detail}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function ToolBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-border/70 bg-muted/40 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted-foreground">
      <Wrench className="size-2.5" />
      {name}
    </span>
  )
}
