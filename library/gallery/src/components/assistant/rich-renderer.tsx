"use client"

import { useCallback, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { motion } from "motion/react"
import { toast } from "sonner"
import NumberFlow from "@number-flow/react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { codeToHtml } from "shiki"
import {
  Copy,
  Download,
  Eye,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Types for structured blocks                                         */
/* ------------------------------------------------------------------ */

type KpiItem = {
  label: string
  value: number
  prefix?: string
  suffix?: string
  trend?: string
  icon?: string
}

type KpiBlock = { items: KpiItem[] }

type ChartBlock = {
  type?: "area" | "bar" | "line"
  title?: string
  xKey?: string
  yKey?: string
  data?: Record<string, unknown>[]
  library?: string
}

type FlowBlock = {
  nodes?: { id: string; label: string }[]
  edges?: { source: string; target: string }[]
}

/* ------------------------------------------------------------------ */
/* Icon resolver (lucide + tabler via dynamic import fallback)         */
/* ------------------------------------------------------------------ */

import * as Lucide from "lucide-react"

function resolveIcon(name?: string): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  if (!name) return Lucide.Activity
  const key = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
  const candidate = (Lucide as Record<string, unknown>)[key]
  if (typeof candidate === "function" || (candidate && typeof candidate === "object" && "$$typeof" in (candidate as object))) {
    return candidate as React.ComponentType<{ className?: string; strokeWidth?: number }>
  }
  return Lucide.Activity
}

/* ------------------------------------------------------------------ */
/* Motion wrapper                                                      */
/* ------------------------------------------------------------------ */

function BlockMotion({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.2 }}
      className="my-3"
    >
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* KPI grid                                                           */
/* ------------------------------------------------------------------ */

function KpiGridBlock({ block }: { block: KpiBlock }) {
  const items = block.items ?? []
  return (
    <BlockMotion>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = resolveIcon(item.icon)
          return (
            <div
              key={index}
              className="rounded-md border border-white/10 bg-[#050505] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </span>
                <Icon className="size-4 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <div className="mt-2 font-mono text-2xl tabular-nums text-foreground">
                {item.prefix}
                <NumberFlow value={item.value} />
                {item.suffix}
              </div>
              {item.trend ? (
                <div className="mt-1 text-[11px] text-muted-foreground">{item.trend}</div>
              ) : null}
            </div>
          )
        })}
      </div>
    </BlockMotion>
  )
}

/* ------------------------------------------------------------------ */
/* Chart                                                              */
/* ------------------------------------------------------------------ */

function ChartBlock({ block }: { block: ChartBlock }) {
  const type = block.type ?? "area"
  const xKey = block.xKey ?? "x"
  const yKey = block.yKey ?? "y"
  const data = block.data ?? []
  const title = block.title

  const gradientId = "chart-gradient"

  return (
    <BlockMotion>
      <div className="rounded-md border border-white/10 bg-[#050505] p-4">
        {title ? (
          <div className="mb-3 text-[12px] font-medium text-foreground/90">{title}</div>
        ) : null}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey={xKey} stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey={yKey} fill="#a78bfa" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : type === "line" ? (
              <LineChart data={data}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey={xKey} stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey={yKey} stroke="#38bdf8" strokeWidth={2} dot={false} />
              </LineChart>
            ) : (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey={xKey} stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey={yKey} stroke="#a78bfa" strokeWidth={2} fill={`url(#${gradientId})`} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </BlockMotion>
  )
}

/* ------------------------------------------------------------------ */
/* Flow diagram                                                       */
/* ------------------------------------------------------------------ */

function FlowDiagramBlock({ block }: { block: FlowBlock }) {
  const nodes: Node[] = (block.nodes ?? []).map((n, i) => ({
    id: n.id,
    data: { label: n.label },
    position: { x: i * 180, y: 60 },
    style: {
      background: "#0a0a0a",
      color: "#fafafa",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 8,
      fontSize: 11,
      padding: 8,
    },
  }))

  const edges: Edge[] = (block.edges ?? []).map((e, i) => ({
    id: `e-${i}`,
    source: e.source,
    target: e.target,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#a78bfa" },
    style: { stroke: "#a78bfa", strokeWidth: 1.5 },
  }))

  return (
    <BlockMotion>
      <div className="h-56 w-full rounded-md border border-white/10 bg-[#050505]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
        >
          <Background color="rgba(255,255,255,0.04)" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </BlockMotion>
  )
}

/* ------------------------------------------------------------------ */
/* Code block with shiki + copy                                       */
/* ------------------------------------------------------------------ */

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [html, setHtml] = useState<string>("")
  const isArtifact = /<!--\s*artifact:\s*([^\s]+)\s*-->/i.test(code)
  const artifactName = code.match(/<!--\s*artifact:\s*([^\s]+)\s*-->/i)?.[1]

  useEffect(() => {
    let cancelled = false
    codeToHtml(code, { lang: language || "text", theme: "github-dark-default" })
      .then((result) => {
        if (!cancelled) setHtml(result)
      })
      .catch(() => {
        if (!cancelled) setHtml(`<pre><code>${code.replace(/</g, "&lt;")}</code></pre>`)
      })
    return () => {
      cancelled = true
    }
  }, [code, language])

  const copy = useCallback(() => {
    navigator.clipboard.writeText(code)
    toast.success("Copiado")
  }, [code])

  const download = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = artifactName || `snippet.${language || "txt"}`
    a.click()
    URL.revokeObjectURL(url)
  }, [code, artifactName, language])

  if (isArtifact) {
    return <ArtifactBlock name={artifactName!} code={code} html={html} onCopy={copy} onDownload={download} />
  }

  return (
    <BlockMotion>
      <div className="overflow-hidden rounded-md border border-white/10 bg-[#050505]">
        <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {language || "code"}
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Copy className="size-3.5" strokeWidth={1.5} />
            Copiar
          </button>
        </div>
        <div
          className="overflow-x-auto p-3 text-[12.5px] leading-6 [&_pre]:!bg-transparent [&_pre]:!m-0 [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: html || `<pre><code>${code.replace(/</g, "&lt;")}</code></pre>` }}
        />
      </div>
    </BlockMotion>
  )
}

/* ------------------------------------------------------------------ */
/* Artifact block (Preview/Code tabs)                                  */
/* ------------------------------------------------------------------ */

function ArtifactBlock({
  name,
  code,
  html,
  onCopy,
  onDownload,
}: {
  name: string
  code: string
  html: string
  onCopy: () => void
  onDownload: () => void
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview")
  const isHtml = /<\w+/.test(code.replace(/<!--.*?-->/s, ""))

  return (
    <BlockMotion>
      <div className="overflow-hidden rounded-md border border-white/10 bg-[#050505]">
        <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-foreground/90">{name}</span>
            <div className="flex items-center gap-1 rounded border border-white/10 p-0.5">
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={cn(
                  "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10.5px]",
                  tab === "preview" ? "bg-white/10 text-foreground" : "text-muted-foreground",
                )}
              >
                <Eye className="size-3" strokeWidth={1.5} /> Preview
              </button>
              <button
                type="button"
                onClick={() => setTab("code")}
                className={cn(
                  "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10.5px]",
                  tab === "code" ? "bg-white/10 text-foreground" : "text-muted-foreground",
                )}
              >
                <Code2 className="size-3" strokeWidth={1.5} /> Code
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Copy className="size-3.5" strokeWidth={1.5} /> Copiar
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Download className="size-3.5" strokeWidth={1.5} /> Descargar
            </button>
          </div>
        </div>
        {tab === "preview" ? (
          isHtml ? (
            <iframe
              srcDoc={code.replace(/<!--.*?-->/s, "")}
              sandbox="allow-scripts"
              className="h-64 w-full bg-white"
              title={name}
            />
          ) : (
            <div className="p-4 text-[13px] text-foreground/90">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{code.replace(/<!--.*?-->/s, "")}</ReactMarkdown>
            </div>
          )
        ) : (
          <div
            className="overflow-x-auto p-3 text-[12.5px] leading-6 [&_pre]:!bg-transparent [&_pre]:!m-0"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </BlockMotion>
  )
}

/* ------------------------------------------------------------------ */
/* Safe JSON parse                                                     */
/* ------------------------------------------------------------------ */

function tryParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function Skeleton() {
  return (
    <div className="my-3 animate-pulse rounded-md border border-white/10 bg-[#050505] p-4">
      <div className="h-3 w-1/3 rounded bg-white/10" />
      <div className="mt-3 h-24 rounded bg-white/5" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main renderer                                                      */
/* ------------------------------------------------------------------ */

export function RichMessageRenderer({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          const language = match ? match[1] : ""
          const code = String(children).replace(/\n$/, "")
          const isBlock = Boolean(match) || code.includes("\n")

          if (!isBlock) {
            return (
              <code className="rounded bg-white/5 px-1 py-0.5 text-[12.5px]" {...props}>
                {children}
              </code>
            )
          }

          // Structured blocks
          if (language === "kpi") {
            const parsed = tryParse<KpiBlock>(code)
            if (!parsed) return <Skeleton />
            return <KpiGridBlock block={parsed} />
          }
          if (language === "chart") {
            const parsed = tryParse<ChartBlock>(code)
            if (!parsed) return <Skeleton />
            return <ChartBlock block={parsed} />
          }
          if (language === "flow") {
            const parsed = tryParse<FlowBlock>(code)
            if (!parsed) return <Skeleton />
            return <FlowDiagramBlock block={parsed} />
          }

          return <CodeBlock language={language} code={code} />
        },
        p({ children }) {
          return <p className="my-2 text-[14.5px] leading-[1.7] text-foreground/90">{children}</p>
        },
      }}
    >
      {text}
    </ReactMarkdown>
  )
}
