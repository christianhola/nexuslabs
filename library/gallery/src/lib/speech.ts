/* Voz del asistente: reconocimiento (dictado) y síntesis (lectura) usando
   las voces del navegador. No hay claves ni servicios externos. */

type RecognitionResultEvent = Event & {
  resultIndex: number
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      0: { transcript: string }
    }
  }
}

type RecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: RecognitionResultEvent) => void) | null
  onerror: ((event: Event & { error?: string }) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

type RecognitionCtor = new () => RecognitionLike

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null
  const scope = window as unknown as {
    SpeechRecognition?: RecognitionCtor
    webkitSpeechRecognition?: RecognitionCtor
  }
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null
}

export const speechSupported = {
  recognition: () => Boolean(recognitionCtor()),
  synthesis: () => typeof window !== "undefined" && "speechSynthesis" in window,
}

export type DictationHandlers = {
  onInterim: (text: string) => void
  onFinal: (text: string) => void
  onError: (message: string) => void
  onStart: () => void
  onEnd: () => void
}

export type Dictation = {
  start: () => void
  stop: () => void
  isActive: () => boolean
}

export function createDictation(handlers: DictationHandlers): Dictation | null {
  const Ctor = recognitionCtor()
  if (!Ctor) return null

  const recognition = new Ctor()
  recognition.lang = "es-ES"
  recognition.continuous = true
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  let active = false
  let restartTimer: number | null = null

  const clearRestart = () => {
    if (restartTimer) {
      window.clearTimeout(restartTimer)
      restartTimer = null
    }
  }

  recognition.onstart = () => {
    active = true
    handlers.onStart()
  }

  recognition.onresult = (event) => {
    let interim = ""
    let final = ""
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index]
      const transcript = result[0]?.transcript ?? ""
      if (result.isFinal) final += transcript
      else interim += transcript
    }
    if (interim.trim()) handlers.onInterim(interim.trim())
    if (final.trim()) {
      handlers.onInterim("")
      handlers.onFinal(final.trim())
    }
  }

  recognition.onerror = (event) => {
    const code = event.error ?? "desconocido"
    if (code === "no-speech" || code === "aborted") return
    active = false
    clearRestart()
    handlers.onError(
      code === "not-allowed" || code === "service-not-allowed"
        ? "El navegador bloqueó el micrófono. Actívalo en el candado de la barra de direcciones."
        : code === "audio-capture"
          ? "No encuentro un micrófono conectado."
          : "El dictado se detuvo. Vuelve a pulsar el micrófono."
    )
    handlers.onEnd()
  }

  recognition.onend = () => {
    if (!active) {
      handlers.onEnd()
      return
    }
    // Chrome corta la sesión tras unos segundos de silencio: la retomamos.
    clearRestart()
    restartTimer = window.setTimeout(() => {
      if (!active) return
      try {
        recognition.start()
      } catch {
        active = false
        handlers.onEnd()
      }
    }, 320)
  }

  return {
    start() {
      active = true
      clearRestart()
      try {
        recognition.start()
      } catch {
        /* ya estaba escuchando */
      }
    },
    stop() {
      active = false
      clearRestart()
      try {
        recognition.stop()
      } catch {
        /* sin sesión activa */
      }
      handlers.onEnd()
    },
    isActive() {
      return active
    },
  }
}

/* ---------------------------- Síntesis ---------------------------- */

let cachedVoice: SpeechSynthesisVoice | null = null

function resolveVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported.synthesis()) return null
  if (cachedVoice) return cachedVoice

  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const spanish = voices.filter((voice) => voice.lang.toLowerCase().startsWith("es"))
  const preferred =
    spanish.find((voice) => /google/i.test(voice.name) && /es[-_]es/i.test(voice.lang)) ??
    spanish.find((voice) => /google/i.test(voice.name)) ??
    spanish.find((voice) => /es[-_]es/i.test(voice.lang)) ??
    spanish.find((voice) => /es[-_]mx/i.test(voice.lang)) ??
    spanish[0]

  cachedVoice = preferred ?? null
  return cachedVoice
}

export function primeVoices() {
  if (!speechSupported.synthesis()) return
  // Algunos navegadores cargan la lista de voces de forma perezosa.
  window.speechSynthesis.getVoices()
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      cachedVoice = null
      resolveVoice()
    })
  }
}

export function speak(
  text: string,
  options: {
    rate?: number
    pitch?: number
    onStart?: () => void
    onEnd?: () => void
    onError?: () => void
    onBoundary?: (charIndex: number) => void
  } = {}
) {
  if (!speechSupported.synthesis() || !text.trim()) {
    options.onStart?.()
    options.onEnd?.()
    return () => {}
  }

  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(
    text
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[«»"'“”]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  )
  const voice = resolveVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? "es-ES"
  utterance.rate = options.rate ?? 1.02
  utterance.pitch = options.pitch ?? 0.98
  utterance.volume = 1

  utterance.onstart = () => options.onStart?.()
  utterance.onend = () => options.onEnd?.()
  utterance.onerror = () => {
    if (options.onError) options.onError()
    else options.onEnd?.()
  }
  utterance.onboundary = (event) => {
    if (typeof event.charIndex === "number") options.onBoundary?.(event.charIndex)
  }

  synth.speak(utterance)

  return () => {
    utterance.onend = null
    utterance.onerror = null
    synth.cancel()
  }
}

export function stopSpeaking() {
  if (!speechSupported.synthesis()) return
  window.speechSynthesis.cancel()
}

export function estimateSpeechMs(text: string, rate = 1.02) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1200, (words / 165) * 60_000 / rate)
}
