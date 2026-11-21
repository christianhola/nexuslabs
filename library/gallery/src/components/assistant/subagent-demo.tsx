import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Message, MessageContent } from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Trace } from "@/components/ui/trace"
import { MessageScroller } from "@/components/ui/message-scroller"
import { SubagentRow } from "@/components/assistant/subagent-row"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { subagentTransport } from "@/lib/subagent-transport"

function isSubagentPart(part: unknown): boolean {
  const p = part as { type?: string; toolName?: string } | null
  if (p?.type === "tool-subagent" || p?.type === "subagent" || p?.type === "tool-call") return true
  if (p?.type === "dynamic-tool" && p?.toolName === "subagent") return true
  return false
}

function agentFromPart(part: unknown): string {
  const p = part as { input?: { agent?: string } | null } | null
  return p?.input?.agent ?? "claude"
}

function statusFromPart(part: unknown): "running" | "completed" {
  const p = part as { state?: string } | null
  if (p?.state === "output-available" || p?.state === "output-error") return "completed"
  return "running"
}

function textFromParts(parts: unknown[]): string {
  return (parts as Array<{ type?: string; text?: string }>)
    .filter((part) => part?.type === "text")
    .map((part) => part?.text ?? "")
    .join("")
}

export function SubagentDemo() {
  const { messages, sendMessage, status, error } = useChat({
    id: "nexus-subagent-demo",
    transport: subagentTransport,
  })

  const [input, setInput] = React.useState("")
  const running = status === "submitted" || status === "streaming"

  function submit(prompt?: string) {
    const text = (prompt ?? input).trim()
    if (!text || running) return
    sendMessage({ text })
    setInput("")
  }

  return (
    <div className="assistant-theme flex h-[480px] w-full flex-col border border-border bg-background">
      <MessageScroller className="p-4">
        {messages.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">
            Escribe una tarea y los subagentes la procesan en segundo plano. Solo verás su respuesta final.
          </p>
        ) : null}
        {messages.map((message) => (
          <Message
            key={message.id}
            align={message.role === "user" ? "end" : "start"}
            className="mb-4"
          >
            <MessageContent>
              {message.role === "assistant" ? (
                <Bubble variant="muted">
                  <BubbleContent>
                    {message.parts.some(isSubagentPart) ? (
                      <Trace className="mb-2">
                        {message.parts
                          .filter(isSubagentPart)
                          .map((part, index) => (
                            <SubagentRow
                              key={`${message.id}-${index}`}
                              agent={agentFromPart(part)}
                              status={statusFromPart(part)}
                            />
                          ))}
                      </Trace>
                    ) : null}
                    <p className="whitespace-pre-wrap text-[14px] leading-[1.65]">
                      {textFromParts(message.parts)}
                      {running && message === messages[messages.length - 1] && !textFromParts(message.parts) ? (
                        <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />
                      ) : null}
                    </p>
                  </BubbleContent>
                </Bubble>
              ) : (
                <Bubble variant="default" align="end">
                  <BubbleContent>{textFromParts(message.parts)}</BubbleContent>
                </Bubble>
              )}
            </MessageContent>
          </Message>
        ))}
        {error ? (
          <p className="px-2 text-sm text-destructive">{error.message}</p>
        ) : null}
      </MessageScroller>

      <form
        className="flex items-center gap-2 border-t border-border p-3"
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Pide algo a los subagentes…"
          disabled={running}
          className="h-9"
        />
        <Button type="submit" size="sm" disabled={running || !input.trim()} className="h-9">
          Enviar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={running}
          className="h-9"
          onClick={() => submit("Investiga el catálogo y dame un resumen.")}
        >
          Demo
        </Button>
      </form>
    </div>
  )
}

export default SubagentDemo