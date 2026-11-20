import type { ChatTransport, UIMessage, UIMessageChunk } from "ai"

import { data, type Template } from "@/lib/data"

const fold = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

function haystack(template: Template) {
  return fold(
    [
      template.name,
      template.description,
      template.industry,
      template.industryShort,
      template.audience,
      template.kindLabel,
      ...template.tags,
      ...template.features,
      ...template.needs,
    ].join(" ")
  )
}

export function searchTemplates(query: string, limit = 8): Template[] {
  const terms = fold(query).split(" ").filter((term) => term.length > 1)
  if (!terms.length) return []

  return data.items
    .map((template) => {
      const name = fold(template.name)
      const industry = fold(`${template.industry} ${template.industryShort}`)
      const tags = fold(template.tags.join(" "))
      const body = haystack(template)
      let score = 0

      for (const term of terms) {
        if (name === term) score += 40
        else if (name.startsWith(term)) score += 24
        else if (name.includes(term)) score += 14
        if (industry.includes(term)) score += 9
        if (tags.includes(term)) score += 7
        if (body.includes(term)) score += 3
      }

      if (terms.every((term) => body.includes(term))) score += 8
      if (template.featured) score += 1
      return { template, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.template.name.localeCompare(b.template.name))
    .slice(0, limit)
    .map((entry) => entry.template)
}

export function searchSummary(query: string, results: Template[]) {
  const clean = query.trim()
  if (!clean) return ""

  if (!results.length) {
    return `No encontré una plantilla que encaje con «${clean}». Prueba con una industria —hotel, tienda, SaaS, restaurante— o pide una versión a medida.`
  }

  const industries = [...new Set(results.map((item) => item.industryShort))]
  const first = results[0]
  const rest = results.length - 1

  return `Encontré ${results.length} ${results.length === 1 ? "plantilla" : "plantillas"} para «${clean}». La más cercana es ${first.name}, de ${first.industry.toLowerCase()}${
    first.kind === "game"
      ? " y con una demo jugable"
      : first.kind === "app"
        ? " y funciona como app en el navegador"
        : ""
  }. ${rest ? `También hay opciones en ${industries.slice(0, 3).join(", ")}.` : "Puedes abrir su ficha o entrar directo a la demo."}`
}

function textOf(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
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

class SearchChatTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
    abortSignal,
  }: {
    messages: UIMessage[]
    abortSignal?: AbortSignal
  }): Promise<ReadableStream<UIMessageChunk>> {
    const lastUser = [...messages].reverse().find((message) => message.role === "user")
    const query = lastUser ? textOf(lastUser) : ""
    const reply = searchSummary(query, searchTemplates(query, 6))
    const words = reply.match(/\S+\s*/g) ?? [reply]
    const id = `search-${Date.now()}`

    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        const push = (chunk: UIMessageChunk) => controller.enqueue(chunk)
        push({ type: "start" })
        await wait(140, abortSignal)
        push({ type: "text-start", id })
        for (const word of words) {
          if (abortSignal?.aborted) break
          push({ type: "text-delta", id, delta: word })
          await wait(12 + Math.min(word.length * 2, 24), abortSignal)
        }
        push({ type: "text-end", id })
        push({ type: "finish" })
        controller.close()
      },
    })
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null
  }
}

export const searchTransport = new SearchChatTransport()
