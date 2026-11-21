import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Mic,
  RotateCcw,
  Square,
  Volume2,
} from "lucide-react"

import { Shimmer } from "@/components/ui/shimmer"
import { RichMessageRenderer } from "@/components/assistant/rich-renderer"
import { AgentBeam } from "@/components/assistant/agent-beam"
import { SpaceBackdropVideo } from "@/components/space-backdrop-video"
import { Textarea } from "@/components/ui/textarea"
import { Reasoning, ToolTrace, type ToolTraceItem } from "@/components/assistant/trace"
import {
  PresentationLink,
  Transcript,
  VoiceBar,
  type Caption,
} from "@/components/assistant/voice-bar"
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
import {
  getVoiceStatus,
  speakWithElevenLabs,
  stopAudio,
  voiceAvailable as isElevenLabsAvailable,
} from "@/lib/voice-backend"

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
  const [voiceProvider, setVoiceProvider] = useState<"elevenlabs" | "browser">("browser")

  const endRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)
  const runRef = useRef(0)
  const busyRef = useRef(false)
  const micRef = useRef(false)
  const dictationRef = useRef<Dictation | null>(null)
  const narrationRef = useRef(0)
  const stopNarrationRef = useRef<() => void>(() => {})
  const speakingRef = useRef(false)
  const elevenAudioRef = useRef<HTMLAudioElement | null>(null)
  const askRef = useRef<(question: string) => void>(() => {})

  const busy = phase !== "idle"
  const voiceVisible =
    micOn || playing || captions.length > 0 || orb !== "idle" || Boolean(voiceError)
  const micSupported = useMemo(() => speechSupported.recognition(), [])
  const voiceAvailable = useMemo(() => speechSupported.synthesis(), [])

  useEffect(() => {
    primeVoices()
    void getVoiceStatus().then((status) => {
      if (isElevenLabsAvailable(status)) setVoiceProvider("elevenlabs")
      else setVoiceProvider("browser")
    })
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

  // Mantiene el final de la respuesta por encima del compositor pegajoso,
  // pero solo si el usuario ya estaba cerca del final (no interrumpe scroll manual).
  useEffect(() => {
    const end = endRef.current
    const bar = composerRef.current
    if (!end || !bar) return
    const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
    if (distanceFromBottom > 120) return
    const overlap = end.getBoundingClientRect().bottom + 24 - bar.getBoundingClientRect().top
    if (overlap > 0) window.scrollBy({ top: overlap, behavior: "auto" })
  }, [messages, phase, captions.length, voiceVisible])

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

  const speakAnswerWebSpeech = useCallback(
    (text: string, label = "Respuesta leída") => {
      if (!voiceAvailable || !text.trim()) {
        setOrb(micRef.current ? "listening" : "idle")
        return
      }

      const id = uid("answer")
      const started = performance.now()
      const canSpeak = window.speechSynthesis.getVoices().length > 0
      if (!canSpeak) {
        setCaptions(() => [
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

  const speakAnswer = useCallback(
    (text: string, label = "Respuesta leída") => {
      if (!text.trim()) {
        setOrb(micRef.current ? "listening" : "idle")
        return
      }

      // Voz real con ElevenLabs; si no está disponible o falla, cae a Web Speech.
      void (async () => {
        setOrb("talking")
        const audio = await speakWithElevenLabs(text)
        if (!audio) {
          setOrb(micRef.current ? "listening" : "idle")
          speakAnswerWebSpeech(text, label)
          return
        }

        const id = uid("answer")
        const started = performance.now()
        setCaptions((previous) => [
          ...previous,
          { id, label, text, time: clock(started), revealed: 0, active: true },
        ])
        speakingRef.current = true
        elevenAudioRef.current = audio

        const reveal = () => {
          if (!speakingRef.current) return
          const duration = Number.isFinite(audio.duration) && audio.duration > 0
            ? audio.duration
            : estimateSpeechMs(text) / 1000
          const progress = Math.min(1, audio.currentTime / duration)
          const revealed = Math.max(1, Math.floor(text.length * progress))
          setCaptions((previous) =>
            previous.map((caption) =>
              caption.id === id ? { ...caption, revealed: Math.min(text.length, revealed) } : caption
            )
          )
          if (progress < 1) requestAnimationFrame(reveal)
        }
        requestAnimationFrame(reveal)

        audio.onended = () => {
          speakingRef.current = false
          setCaptions((previous) =>
            previous.map((caption) =>
              caption.id === id ? { ...caption, revealed: text.length, active: false } : caption
            )
          )
          setOrb(micRef.current ? "listening" : "idle")
          if (micRef.current) {
            dictationRef.current?.start()
            setOrb("listening")
          }
          elevenAudioRef.current = null
        }
        audio.onerror = () => {
          speakingRef.current = false
          setOrb(micRef.current ? "listening" : "idle")
          elevenAudioRef.current = null
          speakAnswerWebSpeech(text, label)
        }
      })()
    },
    [speakAnswerWebSpeech]
  )

  const toggleMic = useCallback(() => {
    setVoiceError(null)

    if (micRef.current) {
      micRef.current = false
      setMicOn(false)
      setDictation("")
      dictationRef.current?.stop()
      stopSpeaking()
      stopAudio(elevenAudioRef.current)
      elevenAudioRef.current = null
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
    stopAudio(elevenAudioRef.current)
    elevenAudioRef.current = null
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
      stopAudio(elevenAudioRef.current)
      elevenAudioRef.current = null
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
      if (micRef.current) {
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
    <div className="assistant-theme relative mx-auto w-full max-w-[780px] px-5 pt-10 sm:px-6 sm:pt-14">
      <SpaceBackdropVideo src="/media/nasa/jwst-highlights.mp4" className="-z-10 hidden rounded-2xl sm:block" />
      <AgentBeam />
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Asistente
          </p>
          <h1 className="mt-2 font-display text-[1.9rem] leading-[1.05] tracking-tight sm:text-[2.2rem]">
            Pregunta lo que <span className="display-italic text-primary">necesites</span>.
          </h1>
          <p className="mt-2 max-w-[52ch] text-[13px] leading-6 text-muted-foreground">
            {data.total} plantillas, plazos, licencias y contacto. Escribe, o pulsa el
            micrófono y habla.
          </p>
        </div>

        <button
          type="button"
          onClick={restart}
          className="group inline-flex shrink-0 items-center gap-1.5 self-start text-[12px] text-muted-foreground transition-colors hover:text-foreground sm:mb-1 sm:self-auto"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.5} />
          Nueva conversación
        </button>
      </header>

      <section aria-live="polite" className="divide-y divide-border/60">
        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="py-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Tú
              </p>
              <div className="mt-1.5 ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm border border-[rgba(16,163,127,0.28)] bg-[rgba(16,163,127,0.12)] px-4 py-2.5 text-[15px] leading-[1.65] text-foreground">
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ) : (
            <article key={message.id} className="py-5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Nexus Labs
                </p>
                {message.streaming ? (
                  <p className="text-[11px] text-muted-foreground">
                    <Shimmer duration={1.4}>
                      {phase === "thinking" ? "buscando en el catálogo…" : "escribiendo…"}
                    </Shimmer>
                  </p>
                ) : null}
              </div>

              <div className="mt-2 flex flex-col gap-2.5">
                {message.reasoning ? (
                  <Reasoning
                    steps={message.reasoning.steps}
                    open={message.reasoning.open}
                    seconds={message.reasoning.seconds}
                  />
                ) : null}

                {message.tools?.length ? <ToolTrace tools={message.tools} /> : null}

                {message.text ? (
                  <div className="w-fit max-w-full rounded-2xl rounded-tl-sm border border-border bg-[#050505] px-4 py-2.5">
                    {message.streaming ? (
                      <p
                        className={cn(
                          "whitespace-pre-wrap text-[14.5px] leading-[1.7] text-foreground/90",
                          "nx-caret"
                        )}
                      >
                        {message.text.slice(0, Math.min(message.visible, message.text.length))}
                      </p>
                    ) : (
                      <RichMessageRenderer text={message.text} />
                    )}
                    {!message.streaming && message.text ? (
                      <button
                        type="button"
                        onClick={() => void speakAnswer(message.text)}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Volume2 className="size-3" strokeWidth={1.5} />
                        Leer respuesta
                      </button>
                    ) : null}
                  </div>
                ) : message.streaming ? null : null}

                {message.cards?.length ? (
                  <div className="mt-1 flex flex-col border-t border-border/60">
                    {message.cards.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center gap-3 border-b border-border/60 py-2.5"
                      >
                        <Link
                          to={template.to}
                          className="flex min-w-0 flex-1 items-center gap-3"
                        >
                          <img
                            src={assetUrl(template.preview)}
                            alt=""
                            loading="lazy"
                            className="h-9 w-14 shrink-0 rounded-sm object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-[13.5px] font-medium tracking-tight">
                              {template.name}
                            </span>
                            <span className="block truncate text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                              {template.industry} · {template.kindLabel}
                            </span>
                          </span>
                        </Link>
                        <a
                          href={assetUrl(template.demo)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Abrir la demo de ${template.name}`}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <ArrowUpRight className="size-4" strokeWidth={1.5} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null}

                {message.links?.length ? (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    {message.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="group inline-flex items-center gap-1 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                        <ArrowRight
                          className="size-3 transition-transform group-hover:translate-x-0.5"
                          strokeWidth={1.5}
                        />
                      </Link>
                    ))}
                  </div>
                ) : null}

                {message.action ? (
                  message.action.kind === "narrate" ? (
                    <button
                      type="button"
                      onClick={() => void playPresentation()}
                      className="inline-flex items-center gap-1.5 self-start text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Volume2 className="size-3.5" strokeWidth={1.5} />
                      {message.action.label}
                    </button>
                  ) : (
                    <a
                      href={mailLink(message.action.message, message.action.subject)}
                      className="group inline-flex items-center gap-1.5 self-start text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {message.action.label}
                      <ArrowUpRight
                        className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
                        strokeWidth={1.5}
                      />
                    </a>
                  )
                ) : null}

                {message.followUps?.length && !message.streaming ? (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/70 pt-3">
                    {message.followUps.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => void ask(suggestion)}
                        className="text-left text-[12px] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/40"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          )
        )}
      </section>

      <div ref={endRef} aria-hidden="true" className="h-2" />

      <div
        ref={composerRef}
        className="sticky bottom-0 z-20 -mx-5 mt-2 border-t border-border/70 bg-background sm:-mx-6"
      >
        {voiceVisible ? (
          <VoiceBar
            state={orb}
            micOn={micOn}
            dictation={dictation}
            error={voiceError}
            playing={playing}
            onToggleMic={toggleMic}
            onStop={stopNarration}
            micSupported={micSupported}
            voiceProvider={voiceProvider}
          />
        ) : null}

        <Transcript captions={captions} />

        <form
          className="px-4 py-3 sm:px-5"
          onSubmit={(event) => {
            event.preventDefault()
            void ask(input)
          }}
        >
          <div className="flex items-end gap-2 rounded-md border border-border bg-[#050505] px-3 py-2 transition-colors focus-within:border-[rgba(16,163,127,0.45)]">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void ask(input)
                }
              }}
              placeholder={micOn ? "Te escucho… o escribe aquí" : "Pregunta lo que necesites…"}
              aria-label="Mensaje para el asistente"
              rows={1}
              className="max-h-32 min-h-9 flex-1 resize-none rounded-none border-0 bg-transparent px-0 py-1.5 text-[14px] shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
            />
            <button
              type="button"
              onClick={toggleMic}
              disabled={!micSupported}
              aria-pressed={micOn}
              aria-label={micLabel}
              title={micLabel}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md transition-colors",
                micOn
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                !micSupported && "cursor-not-allowed opacity-40"
              )}
            >
              <Mic className="size-4" strokeWidth={1.5} />
            </button>

            {busy ? (
              <button
                type="button"
                onClick={stopWriting}
                aria-label="Detener la respuesta"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Square className="size-3.5" strokeWidth={1.5} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Enviar mensaje"
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:bg-[#0E8E6E] disabled:opacity-30"
              >
                <ArrowUp className="size-4" strokeWidth={1.75} />
              </button>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <PresentationLink onClick={() => void playPresentation()} />
            <span className="hidden sm:inline">
              Enter envía · Shift+Enter salto de línea · Puedes escribir o usar el micrófono
            </span>
            <span className="sm:hidden">Enter envía</span>
          </div>
        </form>
      </div>
    </div>
  )
}
