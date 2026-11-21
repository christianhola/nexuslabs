import { ArrowUpRight, MicOff, Square } from "lucide-react"

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
  idle: "Listo",
  listening: "Escuchando",
  thinking: "Pensando",
  talking: "Hablando",
}

/* Franja de voz pegada al compositor: orbe pequeño, estado y dictado. */
export function VoiceBar({
  state,
  micOn,
  dictation,
  error,
  playing,
  onToggleMic,
  onStop,
  micSupported,
  voiceProvider = "browser",
}: {
  state: OrbState
  micOn: boolean
  dictation: string
  error: string | null
  playing: boolean
  onToggleMic: () => void
  onStop: () => void
  micSupported: boolean
  voiceProvider?: "elevenlabs" | "browser"
}) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-border/60 px-4 py-2.5 sm:px-5">
      <div className="flex items-center gap-2.5">
        <span className="relative size-6 shrink-0 overflow-hidden rounded-full border border-border/70">
          <Orb colors={["#10A37F", "#0E8E6E"]} seed={7} state={state} />
        </span>

        <span className="flex items-center gap-1.5 text-[12px] text-foreground/80">
          <span
            className={cn(
              "size-1.5 rounded-full",
              state === "idle" ? "bg-muted-foreground/50" : "bg-[#10A37F]"
            )}
          />
          {stateLabel[state]}
        </span>

        {voiceProvider === "elevenlabs" ? (
          <span className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[#10A37F]" style={{ borderColor: "rgba(16,163,127,0.28)", backgroundColor: "rgba(16,163,127,0.12)" }}>
            Voz real
          </span>
        ) : null}

        {state === "talking" || state === "listening" ? (
          <span className="flex h-2.5 items-end gap-[2px]" aria-hidden="true">
            {[0, 1, 2, 3].map((bar) => (
              <span
                key={bar}
                className="w-[2px] rounded-full bg-foreground/40"
                style={{
                  height: state === "talking" ? "100%" : "55%",
                  animation: `nx-bar ${520 + bar * 90}ms ease-in-out ${bar * 70}ms infinite`,
                }}
              />
            ))}
          </span>
        ) : null}

        <span className="ml-auto flex items-center gap-3 text-[12px]">
          {playing ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Square className="size-3" strokeWidth={1.5} />
              Detener
            </button>
          ) : null}
          {micOn ? (
            <button
              type="button"
              onClick={onToggleMic}
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MicOff className="size-3" strokeWidth={1.5} />
              Cortar micrófono
            </button>
          ) : null}
        </span>
      </div>

      {dictation ? (
        <p className="pl-[34px] text-[13px] leading-5 text-foreground/80 nx-caret">
          {dictation}
        </p>
      ) : !micSupported ? (
        <p className="pl-[34px] text-[12px] leading-5 text-muted-foreground">
          Este navegador no ofrece dictado; puedes escribir o leer la presentación.
        </p>
      ) : null}

      {error ? (
        <p className="pl-[34px] text-[12px] leading-5 text-destructive">{error}</p>
      ) : null}
    </div>
  )
}

/* Transcripción del dictado o de la presentación, en el mismo flujo. */
export function Transcript({ captions }: { captions: Caption[] }) {
  if (!captions.length) return null

  return (
    <div className="max-h-[9.5rem] overflow-y-auto overscroll-contain border-b border-border/60 px-4 py-3 sm:px-5">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Transcripción
        </p>
        <span className="font-mono text-[10px] text-muted-foreground/70">
          {captions.length} {captions.length === 1 ? "bloque" : "bloques"}
        </span>
      </div>

      <ol className="mt-2 space-y-2">
        {captions.map((caption) => (
          <li
            key={caption.id}
            className={cn(
              "border-l pl-3 transition-colors",
              caption.active ? "border-primary/60" : "border-border/60"
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {caption.label}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/70">
                {caption.time}
              </span>
            </div>
            <p className="mt-0.5 text-[13px] leading-[1.55] text-foreground/85">
              {typeof caption.revealed === "number"
                ? caption.text.slice(0, caption.revealed)
                : caption.text}
              {caption.active ? (
                <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-px animate-pulse bg-primary align-middle" />
              ) : null}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function PresentationLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
    >
      Presentación de la empresa
      <ArrowUpRight
        className="size-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
        strokeWidth={1.5}
      />
    </button>
  )
}
