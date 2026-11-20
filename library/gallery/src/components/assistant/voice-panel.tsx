import { Mic, MicOff, Play, Square, Waves } from "lucide-react"
import { useEffect, useRef } from "react"

import { Orb, type OrbState } from "@/components/ui/orb"
import { cn } from "@/lib/utils"

export type Caption = {
  id: string
  label: string
  text: string
  time: string
  revealed?: number
  active?: boolean
}

const stateLabel: Record<OrbState, string> = {
  idle: "En espera",
  listening: "Escuchando",
  thinking: "Pensando",
  talking: "Hablando",
}

export function VoicePanel({
  state,
  micOn,
  dictation,
  error,
  captions,
  playing,
  onToggleMic,
  onPlay,
  onStop,
  micSupported,
}: {
  state: OrbState
  micOn: boolean
  dictation: string
  error: string | null
  captions: Caption[]
  playing: boolean
  onToggleMic: () => void
  onPlay: () => void
  onStop: () => void
  micSupported: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = scroller.current
    if (node) node.scrollTop = node.scrollHeight
  }, [captions.length, dictation])

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-[oklch(from_var(--paper)_0.93_calc(c*0.6)_h)] dark:bg-[oklch(from_var(--ink)_0.24_calc(c*0.5)_h)]">
        <div className="nx-voice-grid absolute inset-0 opacity-60" />
        <div className="relative flex flex-col items-center gap-3 px-4 py-6">
          <div
            className={cn(
              "relative size-32 rounded-full p-1 transition-all duration-500",
              "bg-muted/40 shadow-[inset_0_2px_10px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]",
              state === "listening" && "ring-2 ring-primary/40",
              state === "talking" && "ring-2 ring-primary/60"
            )}
          >
            <div className="size-full overflow-hidden rounded-full">
              <Orb
                colors={["#f3e0c4", "#a9714a"]}
                seed={7}
                state={state}
              />
            </div>
            {state === "listening" ? (
              <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-primary/30" />
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors",
                state === "idle" ? "bg-muted-foreground/50" : "bg-emerald-500"
              )}
            />
            <p className="text-[0.74rem] font-medium tracking-wide">
              {stateLabel[state]}
            </p>
            {state === "talking" || state === "listening" ? (
              <span className="flex h-3 items-end gap-[3px]" aria-hidden="true">
                {[0, 1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className="w-[2px] rounded-full bg-primary/70"
                    style={{
                      height: state === "talking" ? "100%" : "60%",
                      animation: `nx-bar ${520 + bar * 90}ms ease-in-out ${bar * 70}ms infinite`,
                    }}
                  />
                ))}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleMic}
              disabled={!micSupported}
              aria-pressed={micOn}
              className={cn(
                "flex h-9 items-center gap-2 rounded-full px-4 text-[0.76rem] font-medium transition-all",
                micOn
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "border border-border bg-background hover:bg-muted",
                !micSupported && "cursor-not-allowed opacity-50"
              )}
            >
              {micOn ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
              {micOn ? "Detener voz" : "Hablar"}
            </button>
            {playing ? (
              <button
                type="button"
                onClick={onStop}
                className="flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3 text-[0.76rem] transition-colors hover:bg-muted"
              >
                <Square className="size-3" />
                Parar
              </button>
            ) : (
              <button
                type="button"
                onClick={onPlay}
                className="flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3 text-[0.76rem] transition-colors hover:bg-muted"
              >
                <Play className="size-3" />
                Presentación
              </button>
            )}
          </div>

          <p className="text-center text-[0.64rem] leading-4 text-muted-foreground">
            {micSupported
              ? "Micrófono y voz del navegador. Nada de esto se envía a un servidor."
              : "Tu navegador no ofrece dictado. Puedes leer la conversación y la presentación igual."}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="mono-label flex items-center gap-1.5">
          <Waves className="size-3 text-primary" />
          Transcripción en vivo
        </p>
        <span className="text-[0.62rem] text-muted-foreground">
          {captions.length} {captions.length === 1 ? "bloque" : "bloques"}
        </span>
      </div>

      {dictation ? (
        <p className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-[0.78rem] leading-5 nx-caret">
          {dictation}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-[0.72rem] leading-5 text-destructive">
          {error}
        </p>
      ) : null}

      <div
        ref={scroller}
        aria-live="polite"
        className="max-h-64 min-h-32 space-y-2.5 overflow-y-auto overscroll-contain pr-1"
      >
        {captions.length === 0 ? (
          <p className="py-6 text-center text-[0.72rem] leading-5 text-muted-foreground">
            Pulsa «Presentación» para escuchar al estudio hablar de sí mismo, o
            «Hablar» y dicta tu pregunta: aquí verás el texto en vivo.
          </p>
        ) : (
          captions.map((caption) => (
            <div
              key={caption.id}
              className={cn(
                "rounded-lg px-2.5 py-2 transition-colors",
                caption.active
                  ? "border border-primary/30 bg-primary/5"
                  : "border border-transparent"
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="mono-label text-[0.56rem] tracking-[0.16em]">
                  {caption.label}
                </span>
                <span className="font-mono text-[0.58rem] text-muted-foreground">
                  {caption.time}
                </span>
              </div>
              <p className="mt-0.5 text-[0.78rem] leading-5 text-foreground/85">
                {typeof caption.revealed === "number"
                  ? caption.text.slice(0, caption.revealed)
                  : caption.text}
                {caption.active ? (
                  <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-px animate-pulse bg-primary align-middle" />
                ) : null}
              </p>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
