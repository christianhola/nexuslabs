/* Cliente del backend local de voz (ElevenLabs).
   Si el backend no está corriendo o no hay clave, las funciones devuelven null
   y el asistente cae al motor de voz del navegador. */

export type VoiceStatus = {
  ok: boolean
  provider: "elevenlabs"
  available: boolean
  voiceId: string
  ttsModel: string
  sttModel: string
}

let cachedStatus: VoiceStatus | null = null
let statusPromise: Promise<VoiceStatus | null> | null = null

export async function getVoiceStatus(force = false): Promise<VoiceStatus | null> {
  if (cachedStatus && !force) return cachedStatus
  if (statusPromise && !force) return statusPromise

  statusPromise = (async () => {
    try {
      const response = await fetch("/api/voice/status", { cache: "no-store" })
      if (!response.ok) return null
      const data = (await response.json()) as VoiceStatus
      cachedStatus = data
      return data
    } catch {
      cachedStatus = null
      return null
    } finally {
      statusPromise = null
    }
  })()

  return statusPromise
}

export function voiceAvailable(status: VoiceStatus | null): boolean {
  return Boolean(status?.available)
}

/* ---------- TTS ---------- */

export async function speakWithElevenLabs(text: string): Promise<HTMLAudioElement | null> {
  const status = await getVoiceStatus()
  if (!voiceAvailable(status)) return null

  try {
    const response = await fetch("/api/voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (!response.ok) return null

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.preload = "auto"

    // Limpia el object URL cuando termine.
    audio.addEventListener("ended", () => URL.revokeObjectURL(url), { once: true })
    audio.addEventListener("error", () => URL.revokeObjectURL(url), { once: true })

    await audio.play()
    return audio
  } catch {
    return null
  }
}

/* ---------- STT ---------- */

export async function transcribeWithElevenLabs(
  audio: Blob
): Promise<string | null> {
  const status = await getVoiceStatus()
  if (!voiceAvailable(status)) return null

  try {
    const buffer = await audio.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let binary = ""
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
    }
    const base64 = btoa(binary)
    const response = await fetch("/api/voice/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio: base64, mimeType: audio.type || "audio/webm" }),
    })
    if (!response.ok) return null
    const data = (await response.json()) as { text?: string }
    return (data.text || "").trim() || null
  } catch {
    return null
  }
}

export function stopAudio(audio: HTMLAudioElement | null) {
  if (!audio) return
  try {
    audio.pause()
    audio.currentTime = 0
  } catch {
    /* ignore */
  }
}
