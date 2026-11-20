import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  ArrowUp,
  CornerDownLeft,
  ExternalLink,
  MessageCircle,
  Mic,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import { Shimmer } from "@/components/ui/shimmer"
import { Textarea } from "@/components/ui/textarea"
import { Reasoning, ToolTrace, type ToolTraceItem } from "@/components/assistant/trace"
import { VoicePanel, type Caption } from "@/components/assistant/voice-panel"
import type { OrbState } from "@/components/ui/orb"
import {
  planReply,
  PRESENTATION,
  VOICE_SUGGESTIONS,
  type AssistantAction,
  type AssistantCard,
  type PlanLink,
} from "@/lib/assistant-engine"
import { data } from "@/lib/data"
import { assetUrl, mailLink } from "@/lib/site"
import {
  createDictation,
  estimateSpeechMs,
  primeVoices,
  speak,
  speechSupported,
  stopSpeaking,
  type Dictation,
} from "@/lib/speech"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  visible: number
  streaming?: boolean
  reasoning?: { steps: string[]; open: boolean; seconds: number }
  tools?: ToolTraceItem[]
  cards?: AssistantCard[]
  links?: PlanLink[]
  followUps?: string[]
  action?: AssistantAction
}

const STORAGE_KEY = "nexus-assistant-voice-v2"

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

function welcome(): ChatMessage {
  return {
    id: "nexus-welcome",
    role: "assistant",
    text: "Hola. Soy el asistente de NEXUS LABS. Puedo buscar entre las 88 plantillas, explicarte alcances y plazos, y dejarte el correo listo cuando toque hablar con una persona. También puedes hablarme: pulsa el micrófono y dicta la pregunta.",
    visible: 9999,
    followUps: VOICE_SUGGESTIONS.slice(0, 3),
  }
}

function loadMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return [welcome()]
    const parsed = JSON.parse(raw) as ChatMessage[]
    if (!Array.isArray(parsed) || !parsed.length) return [welcome()]
    return parsed.map((message) => ({
      ...message,
      visible: message.text.length,
      streaming: false,
      reasoning: undefined,
      tools: undefined,
    }))
  } catch {
    return [welcome()]
  }
}

function clock(ms: number) {
  const total = Math.floor(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

/* ------------------------------------------------------------------ */

export function AssistantPage() {
  const initial = useMemo(loadMessages, [])
  const [messages, setMessages] = useState<ChatMessage[]>(initial)
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<"idle" | "thinking" | "writing">("idle")
  const [orb, setOrb] = useState<OrbState>("idle")
  const [micOn, setMicOn] = useState(false)
  const [dictation, setDictation] = useState("")
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const [captions, setCaptions] = useState<Caption[]>([])
  const [playing, setPlaying] = useState(false)

  const scroller = useRef<HTMLDivElement>(null)
  const runRef = useRef(0)
  const busyRef = useRef(false)
  const micRef = useRef(false)
  const dictationRef = useRef<Dictation | null>(null)
  const narrationRef = useRef(0)
  const stopNarrationRef = useRef<() => void>(() => {})
  const speakingRef = useRef(false)
  const askRef = useRef<(question: string) => void>(() => {})

  const busy = phase !== "idle"
  const micSupported = useMemo(() => speechSupported.recognition(), [])
  const voiceAvailable = useMemo(() => speechSupported.synthesis(), [])

  useEffect(() => {
    primeVoices()
  }, [])

  useEffect(() => {
    try {
      const compact = messages.map(({ role, text, cards, links, followUps, action }, index) => ({
        id: `saved-${index}-${role}`,
        role,
        text,
        visible: text.length,
        cards,
        links,
        followUps,
        action,
      }))
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(compact))
    } catch {
      /* la sesión sigue en memoria aunque el navegador no permita guardar */
    }
  }, [messages])

  useEffect(() => {
    const node = scroller.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, phase])

  useEffect(() => {
    micRef.current = micOn
  }, [micOn])

  useEffect(
    () => () => {
      runRef.current += 1
      narrationRef.current += 1
      dictationRef.current?.stop()
      stopSpeaking()
    },
    []
  )

  /* ---------------------------- Voz ---------------------------- */

  const speakAnswer = useCallback(
    (text: string, label = "Respuesta leída") => {
      if (!voiceAvailable || !text.trim()) {
        setOrb(micRef.current ? "listening" : "idle")
        return
      }

      const id = uid("answer")
      const started = performance.now()
      const canSpeak = window.speechSynthesis.getVoices().length > 0
      if (!canSpeak) {
        setCaptions((previous) => [
          {
            id,
            label,
            text,
            time: clock(started),
            revealed: text.length,
            active: false,
          },
        ])
        setOrb(micRef.current ? "listening" : "idle")
        return
      }
      setCaptions((previous) => [
        ...previous,
        {
          id,
          label,
          text,
          time: clock(started),
          revealed: 0,
          active: true,
        },
      ])
      speakingRef.current = true
      setOrb("talking")

      const total = estimateSpeechMs(text)
      const startedTalking = performance.now()
      let boundary = 0

      const paint = () => {
        if (!speakingRef.current) return
        const progress = Math.min(1, (performance.now() - startedTalking) / total)
        const revealed = Math.max(Math.floor(text.length * progress), boundary)
        setCaptions((previous) =>
          previous.map((caption) =>
            caption.id === id
              ? { ...caption, revealed: Math.min(text.length, revealed) }
              : caption
          )
        )
        if (progress < 1) window.setTimeout(paint, 90)
      }
      paint()

      speak(text, {
        rate: 1.04,
        onBoundary: (index) => {
          boundary = Math.min(text.length, index + 10)
        },
        onEnd: () => {
          speakingRef.current = false
          setCaptions((previous) =>
            previous.map((caption) =>
              caption.id === id
                ? { ...caption, revealed: text.length, active: false }
                : caption
            )
          )
          setOrb("idle")
          if (micRef.current) {
            dictationRef.current?.start()
            setOrb("listening")
          }
        },
      })
    },
    [voiceAvailable]
  )

  const toggleMic = useCallback(() => {
    setVoiceError(null)

    if (micRef.current) {
      micRef.current = false
      setMicOn(false)
      setDictation("")
      dictationRef.current?.stop()
      stopSpeaking()
      speakingRef.current = false
      setOrb("idle")
      return
    }

    if (!micSupported) {
      setVoiceError("Este navegador no ofrece dictado por voz. Puedes escribir la pregunta.")
      return
    }

    narrationRef.current += 1
    stopNarrationRef.current()
    stopSpeaking()
    speakingRef.current = false

    if (!dictationRef.current) {
      dictationRef.current = createDictation({
        onStart: () => {
          if (micRef.current) setOrb("listening")
        },
        onInterim: (text) => setDictation(text),
        onFinal: (text) => {
          setDictation("")
          if (!micRef.current) return
          if (busyRef.current) {
            setInput((previous) => `${previous} ${text}`.trim())
            return
          }
          askRef.current(text)
        },
        onError: (message) => {
          setVoiceError(message)
          micRef.current = false
          setMicOn(false)
          setOrb("idle")
        },
        onEnd: () => {
          if (!micRef.current) setOrb("idle")
        },
      })
    }

    micRef.current = true
    setMicOn(true)
    setOrb("listening")
    dictationRef.current?.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [micSupported])

  /* ------------------------- Presentación ------------------------- */

  const stopNarration = useCallback(() => {
    narrationRef.current += 1
    stopNarrationRef.current()
    stopSpeaking()
    setPlaying(false)
    setOrb(micRef.current ? "listening" : "idle")
    setCaptions((previous) =>
      previous.map((caption) =>
        caption.active
          ? { ...caption, active: false, revealed: caption.text.length }
          : caption
      )
    )
  }, [])

  const playPresentation = useCallback(async () => {
    narrationRef.current += 1
    const run = narrationRef.current
    stopSpeaking()
    setPlaying(true)
    setCaptions([])
    setVoiceError(null)

    const startedAt = performance.now()
    const canSpeak = voiceAvailable && window.speechSynthesis.getVoices().length > 0

    for (let index = 0; index < PRESENTATION.length; index += 1) {
      if (narrationRef.current !== run) return
      const segment = PRESENTATION[index]
      const id = `presentation-${index}`
      setCaptions((previous) => [
        ...previous,
        {
          id,
          label: segment.label,
          text: segment.text,
          time: clock(performance.now() - startedAt),
          revealed: 0,
          active: true,
        },
      ])
      setOrb("talking")

      await new Promise<void>((resolve) => {
        let settled = false
        let timer = 0
        let boundary = 0
        let failed = false
        const startedAt = performance.now()
        const total = estimateSpeechMs(segment.text)

        const finish = () => {
          if (settled) return
          settled = true
          window.clearTimeout(timer)
          resolve()
        }

        const paint = (revealed: number) => {
          setCaptions((previous) =>
            previous.map((caption) =>
              caption.id === id
                ? { ...caption, revealed: Math.min(segment.text.length, revealed) }
                : caption
            )
          )
        }

        // La transcripción avanza siempre por tiempo; si el navegador emite
        // límites de palabra, se sincroniza con la voz real.
        const tick = () => {
          if (settled) return
          const progress = Math.min(1, (performance.now() - startedAt) / total)
          paint(Math.max(Math.floor(segment.text.length * progress), boundary))
          if (progress >= 1) {
            if (!canSpeak || failed) finish()
            return
          }
          window.setTimeout(tick, 90)
        }
        tick()

        const cancel = canSpeak
          ? speak(segment.text, {
              rate: 1.03,
              onBoundary: (charIndex) => {
                boundary = Math.min(segment.text.length, charIndex + 14)
              },
              // Si el dispositivo no puede reproducir audio, la transcripción
              // sigue avanzando a ritmo de lectura en lugar de saltar.
              onError: () => {
                failed = true
              },
              onEnd: finish,
            })
          : () => {}

        timer = window.setTimeout(finish, total + 1400)
        stopNarrationRef.current = () => {
          cancel()
          finish()
        }
      })

      if (narrationRef.current !== run) return
      setCaptions((previous) =>
        previous.map((caption) =>
          caption.id === id
            ? { ...caption, revealed: segment.text.length, active: false }
            : caption
        )
      )
    }

    setPlaying(false)
    setOrb(micRef.current ? "listening" : "idle")
  }, [voiceAvailable])

  /* --------------------------- Conversación --------------------------- */

  const ask = useCallback(
    async (question: string) => {
      const value = question.trim()
      if (!value || busyRef.current) return

      if (playing) stopNarration()
      stopSpeaking()
      speakingRef.current = false

      const run = ++runRef.current
      busyRef.current = true
      setVoiceError(null)
      setInput("")
      setDictation("")
      setPhase("thinking")
      setOrb("thinking")
      dictationRef.current?.stop()

      const history = messages.map((message) => ({ role: message.role, text: message.text }))
      const plan = planReply(value, history)

      const userMessage: ChatMessage = {
        id: uid("user"),
        role: "user",
        text: value,
        visible: value.length,
      }

      const assistantId = uid("assistant")
      const startedAt = performance.now()

      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        text: "",
        visible: 0,
        streaming: true,
        reasoning: { steps: [], open: true, seconds: 0 },
        tools: plan.tools.map((tool) => ({ ...tool, status: "running" as const })),
        followUps: plan.followUps,
      }

      setMessages((previous) => [...previous, userMessage, assistantMessage])

      const patch = (updater: (message: ChatMessage) => Partial<ChatMessage>) =>
        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId ? { ...message, ...updater(message) } : message
          )
        )

      for (let index = 0; index < plan.reasoning.length; index += 1) {
        if (runRef.current !== run) return
        await sleep(index === 0 ? 260 : 430)
        if (runRef.current !== run) return
        patch((message) => ({
          reasoning: {
            steps: [...(message.reasoning?.steps ?? []), plan.reasoning[index]],
            open: true,
            seconds: 0,
          },
        }))
      }

      for (let index = 0; index < plan.tools.length; index += 1) {
        if (runRef.current !== run) return
        await sleep(index === 0 ? 380 : 460)
        if (runRef.current !== run) return
        patch((message) => ({
          tools: (message.tools ?? []).map((tool, toolIndex) =>
            toolIndex === index ? { ...tool, status: "done" } : tool
          ),
        }))
      }

      await sleep(260)
      if (runRef.current !== run) return

      const seconds = Math.max(1, Math.round((performance.now() - startedAt) / 1000))
      patch((message) => ({
        reasoning: {
          steps: message.reasoning?.steps ?? [],
          open: false,
          seconds,
        },
      }))
      setPhase("writing")
      setOrb("idle")

      const words = plan.text.match(/\S+\s*/g) ?? [plan.text]
      let written = 0
      for (const word of words) {
        if (runRef.current !== run) return
        written += word.length
        patch(() => ({ text: plan.text.slice(0, written), visible: written }))
        await sleep(14 + Math.min(word.length * 3, 26))
      }

      if (runRef.current !== run) return
      patch((message) => ({
        text: plan.text,
        visible: plan.text.length,
        streaming: false,
        cards: plan.cards,
        links: plan.links,
        action: plan.action,
        reasoning: message.reasoning
          ? { ...message.reasoning, open: false, seconds }
          : undefined,
      }))
      busyRef.current = false
      setPhase("idle")

      const spokenPlan = plan.spoken || plan.text
      if (micRef.current && voiceAvailable) {
        dictationRef.current?.stop()
        speakAnswer(spokenPlan)
      } else {
        setOrb("idle")
        if (micRef.current) {
          dictationRef.current?.start()
          setOrb("listening")
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [messages, playing, speakAnswer, stopNarration, voiceAvailable]
  )

  useEffect(() => {
    askRef.current = (question: string) => {
      void ask(question)
    }
  }, [ask])

  const stopWriting = useCallback(() => {
    if (!busyRef.current) return
    runRef.current += 1
    busyRef.current = false
    setPhase("idle")
    setOrb(micRef.current ? "listening" : "idle")
    setMessages((previous) =>
      previous.map((message) =>
        message.streaming
          ? {
              ...message,
              streaming: false,
              text: message.text || "Respuesta detenida. Pregunta otra vez cuando quieras.",
              visible: message.text.length || 52,
              reasoning: message.reasoning
                ? { ...message.reasoning, open: false }
                : undefined,
            }
          : message
      )
    )
  }, [])

  const restart = useCallback(() => {
    runRef.current += 1
    busyRef.current = false
    stopNarration()
    dictationRef.current?.stop()
    micRef.current = false
    setMicOn(false)
    setDictation("")
    setPhase("idle")
    setOrb("idle")
    setMessages([welcome()])
    setCaptions([])
    setVoiceError(null)
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* sin persistencia */
    }
  }, [stopNarration])

  const micLabel = micOn ? "Detener voz" : "Hablar"

  /* ------------------------------ Vista ------------------------------ */

  return (
    <div className="relative overflow-hidden">
      <div className="paper-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-[1120px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mono-label flex items-center gap-2">
              <Sparkles className="size-3 text-primary" />
              Asistente NEXUS
            </p>
            <h1 className="mt-3 font-display text-[2.4rem] leading-[0.98] sm:text-5xl">
              Pregunta, escucha y{" "}
              <span className="display-italic text-primary">decide</span>.
            </h1>
            <p className="mt-3 max-w-xl text-[0.86rem] leading-6 text-muted-foreground">
              Busca entre {data.total} plantillas, compara fichas y resuelve dudas
              de alcance, plazos y licencias. Con voz: habla y te responde en voz
              alta mientras ves la transcripción.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-7 gap-1.5 px-3 text-[0.7rem]">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Voz + catálogo
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 rounded-full px-2.5 text-[0.7rem]"
              onClick={restart}
            >
              <RotateCcw className="size-3" />
              Nueva conversación
            </Button>
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
          <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/15 text-[0.7rem] font-medium text-primary">
                  NL
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[0.82rem] font-medium">NEXUS LABS</p>
                <p className="flex items-center gap-1.5 text-[0.66rem] text-muted-foreground">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      orb === "idle" ? "bg-emerald-500" : "bg-primary"
                    )}
                  />
                  {phase === "thinking" ? (
                    <Shimmer duration={1.4}>buscando en el catálogo…</Shimmer>
                  ) : phase === "writing" ? (
                    "escribiendo…"
                  ) : orb === "talking" ? (
                    "leyendo en voz alta…"
                  ) : orb === "listening" ? (
                    "te escucho"
                  ) : (
                    "en línea · respuestas del estudio"
                  )}
                </p>
              </div>
              <p className="ml-auto hidden items-center gap-1.5 text-[0.64rem] text-muted-foreground sm:flex">
                <CornerDownLeft className="size-3" />
                Enter envía · Shift+Enter salto
              </p>
            </div>

            <div
              ref={scroller}
              aria-live="polite"
              className="flex h-[min(64vh,38rem)] flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-5"
            >
              {messages.map((message) =>
                message.role === "user" ? (
                  <Message key={message.id} align="end">
                    <MessageContent>
                      <Bubble align="end" variant="muted">
                        <BubbleContent className="text-[0.84rem] leading-6">
                          {message.text}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                ) : (
                  <Message key={message.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                    <MessageAvatar>
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/15 text-[0.6rem] font-medium text-primary">
                          NL
                        </AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                    <MessageContent className="min-w-0 gap-2.5">
                      {message.reasoning ? (
                        <Reasoning
                          steps={message.reasoning.steps}
                          open={message.reasoning.open}
                          seconds={message.reasoning.seconds}
                        />
                      ) : null}

                      {message.tools?.length ? (
                        <ToolTrace tools={message.tools} />
                      ) : null}

                      {message.text ? (
                        <p
                          className={cn(
                            "max-w-[56ch] text-[0.86rem] leading-6 whitespace-pre-wrap",
                            message.streaming && "nx-caret"
                          )}
                        >
                          {message.text.slice(0, Math.min(message.visible, message.text.length))}
                        </p>
                      ) : null}

                      {message.streaming && !message.text ? (
                        <p className="flex items-center gap-2 py-1 text-[0.78rem] text-muted-foreground">
                          <Shimmer duration={1.5}>Redactando respuesta…</Shimmer>
                        </p>
                      ) : null}

                      {message.cards?.length ? (
                        <div className="flex flex-col gap-1.5 pt-1">
                          {message.cards.map((template) => (
                            <div
                              key={template.id}
                              className="group flex items-center gap-3 rounded-xl border border-border/80 bg-background/60 p-2 transition-colors hover:border-primary/40 hover:bg-primary/5"
                            >
                              <Link
                                to={template.to}
                                className="flex min-w-0 flex-1 items-center gap-3"
                              >
                                <img
                                  src={assetUrl(template.preview)}
                                  alt=""
                                  loading="lazy"
                                  className="h-11 w-16 shrink-0 rounded-md object-cover"
                                />
                                <span className="min-w-0">
                                  <span className="block truncate text-[0.8rem] font-medium">
                                    {template.name}
                                  </span>
                                  <span className="mono-label block truncate text-[0.56rem] tracking-[0.14em]">
                                    {template.industry} · {template.kindLabel}
                                  </span>
                                </span>
                              </Link>
                              <a
                                href={assetUrl(template.demo)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                aria-label={`Abrir la demo de ${template.name}`}
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {message.links?.length ? (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {message.links.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[0.72rem] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                            >
                              {link.label}
                              <ArrowRight className="size-3" />
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      {message.action ? (
                        <div className="pt-0.5">
                          {message.action.kind === "narrate" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-2 rounded-full px-3 text-[0.72rem]"
                              onClick={() => void playPresentation()}
                            >
                              <Volume2 className="size-3.5" />
                              {message.action.label}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-2 rounded-full px-3 text-[0.72rem]"
                              render={
                                <a
                                  href={mailLink(
                                    message.action.message,
                                    message.action.subject
                                  )}
                                />
                              }
                            >
                              <MessageCircle className="size-3.5" />
                              {message.action.label}
                            </Button>
                          )}
                        </div>
                      ) : null}

                      {message.followUps?.length && !message.streaming ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {message.followUps.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => void ask(suggestion)}
                              className="rounded-full border border-dashed border-border px-2.5 py-1 text-left text-[0.71rem] text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </MessageContent>
                  </Message>
                )
              )}
            </div>

            {messages.length <= 1 ? (
              <div className="flex flex-wrap gap-1.5 border-t border-border px-4 pt-3 pb-1 sm:px-5">
                {VOICE_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void ask(suggestion)}
                    className="rounded-full border border-border px-2.5 py-1 text-[0.71rem] text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}

            <form
              className="border-t border-border p-3 sm:p-4"
              onSubmit={(event) => {
                event.preventDefault()
                void ask(input)
              }}
            >
              <div className="flex w-full flex-col gap-2 rounded-2xl border border-border/80 bg-background/80 p-2 transition-colors focus-within:border-primary/40">
                <div className="flex items-end gap-2">
                  <Textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault()
                        void ask(input)
                      }
                    }}
                    placeholder={
                      micOn ? "Te escucho… o escribe aquí" : "Pregunta lo que necesites…"
                    }
                    aria-label="Mensaje para el asistente"
                    rows={1}
                    className="max-h-32 min-h-10 flex-1 resize-none border-0 bg-transparent text-[0.85rem] shadow-none focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={toggleMic}
                    disabled={!micSupported}
                    aria-pressed={micOn}
                    aria-label={micLabel}
                    title={micLabel}
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
                      micOn
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      !micSupported && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <Mic className="size-4" />
                  </button>
                  {busy ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="size-9 shrink-0 rounded-full"
                      onClick={stopWriting}
                      aria-label="Detener la respuesta"
                    >
                      <Square className="size-3.5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="icon"
                      className="size-9 shrink-0 rounded-full"
                      disabled={!input.trim()}
                      aria-label="Enviar mensaje"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-[0.63rem] text-muted-foreground">
                  <span>
                    {micOn
                      ? "Toca el micrófono para cortar. Al terminar de hablar, vuelvo a escuchar."
                      : "Enter para enviar. El micrófono activa la conversación hablada."}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mic className="size-2.5" />
                    {micSupported ? "dictado disponible" : "sin dictado en este navegador"}
                  </span>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <VoicePanel
              state={orb}
              micOn={micOn}
              dictation={dictation}
              error={voiceError}
              captions={captions}
              playing={playing}
              onToggleMic={toggleMic}
              onPlay={() => void playPresentation()}
              onStop={stopNarration}
              micSupported={micSupported}
            />
            <p className="mt-3 px-1 text-[0.66rem] leading-5 text-muted-foreground">
              La voz se genera en tu navegador con las voces del sistema. La
              conversación se guarda en esta pestaña y se borra al cerrarla.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
