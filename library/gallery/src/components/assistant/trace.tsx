import { useEffect, useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"

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
    <div className="w-full">
      <button
        type="button"
        onClick={() => setPinned(!visible)}
        aria-expanded={visible}
        className="group flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
      >
        {open ? (
          <Shimmer duration={1.6}>Pensando…</Shimmer>
        ) : (
          <span>
            Razonó {seconds ?? steps.length} s · {steps.length} pasos
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200",
            visible && "rotate-180"
          )}
          strokeWidth={1.5}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out",
          visible ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <ol className="ml-[3px] space-y-1.5 border-l border-border/70 pl-3.5 pb-1">
            {steps.map((step, index) => (
              <li
                key={`${step}-${index}`}
                className="text-[12.5px] leading-[1.65] text-muted-foreground"
              >
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
    <ul className="flex flex-col gap-1">
      {tools.map((tool) => (
        <li
          key={tool.id}
          className="flex items-baseline gap-2 text-[12px] leading-5 text-muted-foreground"
          title={`${tool.name} · ${tool.detail}`}
        >
          {tool.status === "running" ? (
            <Loader2 className="size-3 shrink-0 translate-y-px animate-spin" strokeWidth={1.5} />
          ) : (
            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-foreground/35" />
          )}
          <span className="shrink-0 text-foreground/75">{tool.label}</span>
          <span className="truncate font-mono text-[10.5px] text-muted-foreground/70">
            {tool.detail}
          </span>
        </li>
      ))}
    </ul>
  )
}
