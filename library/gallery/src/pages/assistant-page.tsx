import { useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import {
  ArrowUp,
  CornerDownLeft,
  MessageCircle,
  Sparkles,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import { Textarea } from "@/components/ui/textarea"
import { localTransport } from "@/lib/assistant"
import { mailLink } from "@/lib/site"

const STORAGE_KEY = "nexus-assistant-session-v1"

const suggestions = [
  "¿Cuánto tarda una tienda con pagos?",
  "¿Qué plantilla va para un hotel?",
  "¿Puedo usar mi dominio?",
  "¿De quién son las licencias?",
]

function welcome(): UIMessage {
  return {
    id: "nexus-welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hola. Soy el asistente de NEXUS LABS. Puedo orientarte sobre el catálogo, plazos, pagos, dominio o licencias. No creo sitios ni envío mensajes: solo converso. ¿Qué tienes en mente?",
      },
    ],
  }
}

function loadMessages(): UIMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return [welcome()]
    const parsed = JSON.parse(raw) as UIMessage[]
    return Array.isArray(parsed) && parsed.length ? parsed : [welcome()]
  } catch {
    return [welcome()]
  }
}

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
}

export function AssistantPage() {
  const initial = useMemo(loadMessages, [])
  const { messages, sendMessage, status, error } = useChat({
    id: "nexus-assistant",
    messages: initial,
    transport: localTransport,
  })
  const [input, setInput] = useState("")
  const scroller = useRef<HTMLDivElement>(null)
  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      /* la sesión sigue en memoria aunque el navegador no permita guardar */
    }
  }, [messages])

  useEffect(() => {
    const node = scroller.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, status])

  function send(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput("")
  }

  return (
    <div className="relative overflow-hidden">
      <div className="paper-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-[860px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label flex items-center gap-2">
              <Sparkles className="size-3 text-primary" />
              Asistente NEXUS
            </p>
            <h1 className="mt-3 font-display text-[2.4rem] leading-[0.98] sm:text-5xl">
              Pregunta antes de{" "}
              <span className="display-italic text-primary">escribir</span>.
            </h1>
            <p className="mt-3 max-w-xl text-[0.86rem] leading-6 text-muted-foreground">
              Un asistente para resolver dudas de alcance, plazos y licencias.
              Habla, pregunta y recorre el catálogo; no puede crear, editar ni
              enviar nada por ti.
            </p>
          </div>
          <Badge variant="outline" className="h-7 px-3 text-[0.7rem]">
            Demostración local
          </Badge>
        </div>

        <div className="mt-7 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/15 text-[0.7rem] font-medium text-primary">
                NL
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[0.82rem] font-medium">NEXUS LABS</p>
              <p className="flex items-center gap-1.5 text-[0.66rem] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {busy ? "escribiendo…" : "en línea · respuestas guiadas"}
              </p>
            </div>
            <p className="ml-auto hidden items-center gap-1.5 text-[0.64rem] text-muted-foreground sm:flex">
              <CornerDownLeft className="size-3" />
              Enter para enviar
            </p>
          </div>

          <div
            ref={scroller}
            className="flex h-[min(58vh,34rem)] flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
            aria-live="polite"
          >
            {messages.map((message) =>
              message.role === "user" ? (
                <Message key={message.id} align="end">
                  <MessageContent>
                    <Bubble align="end" variant="muted">
                      <BubbleContent className="text-[0.84rem] leading-6">
                        {messageText(message)}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              ) : (
                <Message key={message.id}>
                  <MessageAvatar>
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/15 text-[0.6rem] font-medium text-primary">
                        NL
                      </AvatarFallback>
                    </Avatar>
                  </MessageAvatar>
                  <MessageContent>
                    <p className="max-w-[52ch] text-[0.86rem] leading-6 whitespace-pre-wrap">
                      {messageText(message)}
                    </p>
                  </MessageContent>
                </Message>
              )
            )}

            {status === "submitted" ? (
              <Message>
                <MessageAvatar>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary/15 text-[0.6rem] font-medium text-primary">
                      NL
                    </AvatarFallback>
                  </Avatar>
                </MessageAvatar>
                <MessageContent>
                  <span className="flex items-center gap-1 py-2">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: `${dot * 120}ms` }}
                      />
                    ))}
                  </span>
                </MessageContent>
              </Message>
            ) : null}

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[0.76rem] text-destructive">
                El asistente no pudo responder. Recarga la página e inténtalo
                otra vez.
              </p>
            ) : null}
          </div>

          {messages.length <= 1 ? (
            <div className="flex flex-wrap gap-2 border-t border-border px-4 pt-3 pb-1 sm:px-5">
              {suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="h-7 cursor-pointer px-2.5 text-[0.7rem] font-normal hover:bg-muted"
                  render={
                    <button type="button" onClick={() => send(suggestion)}>
                      {suggestion}
                    </button>
                  }
                />
              ))}
            </div>
          ) : null}

          <form
            className="flex items-end gap-2 border-t border-border p-3 sm:p-4"
            onSubmit={(event) => {
              event.preventDefault()
              send(input)
            }}
          >
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  send(input)
                }
              }}
              placeholder="Escribe tu pregunta…"
              aria-label="Mensaje para el asistente"
              rows={1}
              className="max-h-32 min-h-10 flex-1 resize-none bg-background text-[0.85rem]"
            />
            <Button
              type="submit"
              size="icon"
              className="size-10 shrink-0 rounded-full"
              disabled={busy || !input.trim()}
              aria-label="Enviar mensaje"
            >
              <ArrowUp />
            </Button>
          </form>
        </div>

        <div className="mt-4 flex flex-col items-start justify-between gap-3 text-[0.7rem] text-muted-foreground sm:flex-row sm:items-center">
          <p className="max-w-xl leading-5">
            Las respuestas se generan con el SDK de Vercel AI sobre una base
            local, sin modelo externo. La conversación se guarda en esta pestaña
            y se borra al cerrarla; no se puede vaciar antes.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 rounded-full px-2 text-[0.72rem]"
            render={
              <a
                href={mailLink(
                  "Hola NEXUS LABS 👋 Vengo del asistente y quiero hablar con una persona.",
                  "NEXUS LABS · Consulta desde el asistente"
                )}
              />
            }
          >
            <MessageCircle data-icon="inline-start" />
            Hablar con una persona
          </Button>
        </div>
      </div>
    </div>
  )
}
