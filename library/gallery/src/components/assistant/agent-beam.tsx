"use client"

import React, { useRef } from "react"
import { AnimatedBeam } from "@/registry/magicui/animated-beam"
import { cn } from "@/lib/utils"
import { Database, Cpu, Terminal, Zap, FileText, BarChart3 } from "lucide-react"

const Circle = ({
  ref: forwardedRef,
  className,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>
  className?: string
  children?: React.ReactNode
}) => (
  <div
    ref={forwardedRef}
    className={cn(
      "z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background p-2",
      className,
    )}
  >
    {children}
  </div>
)

export function AgentBeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const d1 = useRef<HTMLDivElement>(null)
  const d2 = useRef<HTMLDivElement>(null)
  const d3 = useRef<HTMLDivElement>(null)
  const d4 = useRef<HTMLDivElement>(null)
  const d5 = useRef<HTMLDivElement>(null)
  const d6 = useRef<HTMLDivElement>(null)
  const center = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex h-[260px] w-full items-center justify-center overflow-hidden"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-md flex-col items-stretch justify-between gap-8">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={d1}><Database className="size-4" strokeWidth={1.5} /></Circle>
          <Circle ref={d5}><FileText className="size-4" strokeWidth={1.5} /></Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={d2}><Terminal className="size-4" strokeWidth={1.5} /></Circle>
          <Circle ref={center} className="size-14 border-primary/40">
            <Cpu className="size-5 text-primary" strokeWidth={1.5} />
          </Circle>
          <Circle ref={d6}><BarChart3 className="size-4" strokeWidth={1.5} /></Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={d3}><Zap className="size-4" strokeWidth={1.5} /></Circle>
          <Circle ref={d4}><Database className="size-4" strokeWidth={1.5} /></Circle>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={d1} toRef={center} curvature={-60} endYOffset={-8} />
      <AnimatedBeam containerRef={containerRef} fromRef={d2} toRef={center} />
      <AnimatedBeam containerRef={containerRef} fromRef={d3} toRef={center} curvature={60} endYOffset={8} />
      <AnimatedBeam containerRef={containerRef} fromRef={d5} toRef={center} curvature={-60} endYOffset={-8} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={d6} toRef={center} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={d4} toRef={center} curvature={60} endYOffset={8} reverse />
    </div>
  )
}
