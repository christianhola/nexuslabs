import type { ChatTransport, UIMessage, UIMessageChunk } from "ai"

function textOf(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join(" ")
    .trim()
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, ms)
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer)
        resolve()
      },
      { once: true }
    )
  })

class SubagentChatTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
    abortSignal,
  }: {
    messages: UIMessage[]
    abortSignal?: AbortSignal
  }): Promise<ReadableStream<UIMessageChunk>> {
    const lastUser = [...messages].reverse().find((message) => message.role === "user")
    const query = lastUser ? textOf(lastUser) : ""

    const agents = ["claude", "codex"] as const
    const durations = [900, 1300]
    const ids = agents.map((agent, index) => `sa-${agent}-${Date.now()}-${index}`)
    const messageId = `subagent-${Date.now()}`

    const finalText =
      query.trim().length > 0
        ? `Listo: procesé «${query}» con ${agents.length} subagentes en segundo plano. El catálogo tiene 88 plantillas en 10 industrias; las más pedidas son hoteles, tiendas y SaaS.`
        : "Listo: terminé la tarea con 2 subagentes en segundo plano. El catálogo tiene 88 plantillas en 10 industrias; las más pedidas son hoteles, tiendas y SaaS."

    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        const push = (chunk: UIMessageChunk) => controller.enqueue(chunk)

        push({ type: "start", messageId })
        await wait(60, abortSignal)
        push({ type: "start-step" })

        // Lanzar los subagentes en segundo plano: solo se anuncia su identidad,
        // sin exponer grep/sed/ls ni salidas intermedias.
        agents.forEach((agent, index) => {
          push({
            type: "tool-input-start",
            toolCallId: ids[index],
            toolName: "subagent",
          })
          push({
            type: "tool-input-available",
            toolCallId: ids[index],
            toolName: "subagent",
            input: { agent },
          })
        })

        // Ejecución real en segundo plano (Promise.all).
        await Promise.all(agents.map((_, index) => wait(durations[index], abortSignal)))

        // Marcar cada subagente como completado.
        agents.forEach((_, index) => {
          push({
            type: "tool-output-available",
            toolCallId: ids[index],
            output: { ok: true },
          })
        })

        // Pequeña pausa antes de la respuesta final.
        await wait(120, abortSignal)

        const textId = `text-${Date.now()}`
        push({ type: "text-start", id: textId })
        const words = finalText.match(/\S+\s*/g) ?? [finalText]
        for (const word of words) {
          if (abortSignal?.aborted) break
          push({ type: "text-delta", id: textId, delta: word })
          await wait(14 + Math.min(word.length * 2, 20), abortSignal)
        }
        push({ type: "text-end", id: textId })

        push({ type: "finish-step" })
        push({ type: "finish" })
        controller.close()
      },
    })
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null
  }
}

export const subagentTransport = new SubagentChatTransport()