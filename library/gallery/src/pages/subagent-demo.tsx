import { SubagentDemo } from "@/components/assistant/subagent-demo"

export default function SubagentDemoPage() {
  return (
    <div className="mx-auto w-full max-w-[780px] px-5 py-10 sm:px-6">
      <h1 className="font-display text-2xl tracking-tight">Subagent demo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Subagentes en segundo plano; solo la respuesta final se muestra.
      </p>
      <div className="mt-6">
        <SubagentDemo />
      </div>
    </div>
  )
}