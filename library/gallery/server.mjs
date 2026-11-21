// Backend local para la voz del asistente NEXUS LABS.
// Expone ElevenLabs (TTS + STT) sin exponer la clave en el navegador.
//
// Uso:
//   cp .env.example .env   (rellena ELEVENLABS_API_KEY)
//   bun server.mjs          (o node server.mjs)   -> lee .env automáticamente
//   PORT=3001 bun server.mjs
//
// Variables:
//   ELEVENLABS_API_KEY   (obligatoria para voz real)
//   ELEVENLABS_VOICE_ID  (opcional; por defecto Rachel)
//   ELEVENLABS_MODEL     (opcional; por defecto eleven_multilingual_v2)
//   ELEVENLABS_STT_MODEL (opcional; por defecto scribe_v1)
//   PORT                 (opcional; por defecto 3001)

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import { createServer } from "node:http"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"

const SERVER_DIR = dirname(fileURLToPath(import.meta.url))

// Carga .env local si existe (sin dependencias).
// Busca junto al server.mjs y en el directorio de trabajo, para que funcione
// tanto con `cd gallery && node server.mjs` como con `node library/gallery/server.mjs`.
const envDirs = [SERVER_DIR, process.cwd()]
for (const dir of envDirs) {
  for (const candidate of [".env", ".env.local"]) {
    try {
      const raw = readFileSync(resolve(dir, candidate), "utf-8")
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) continue
        const eq = trimmed.indexOf("=")
        if (eq === -1) continue
        const key = trimmed.slice(0, eq).trim()
        let value = trimmed.slice(eq + 1).trim()
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        if (key && process.env[key] === undefined) process.env[key] = value
      }
    } catch {
      /* sin archivo */
    }
  }
}

const PORT = Number(process.env.PORT || 3001)
const API_KEY = process.env.ELEVENLABS_API_KEY || ""
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM"
const TTS_MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2"
const STT_MODEL = process.env.ELEVENLABS_STT_MODEL || "scribe_v1"

const client = API_KEY ? new ElevenLabsClient({ apiKey: API_KEY }) : null

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
}

function json(res, status, body) {
  cors(res)
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString("utf-8")
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const server = createServer(async (req, res) => {
  cors(res)
  if (req.method === "OPTIONS") {
    res.statusCode = 204
    res.end()
    return
  }

  const url = new URL(req.url || "/", `http://localhost:${PORT}`)

  if (req.method === "GET" && url.pathname === "/api/voice/status") {
    return json(res, 200, {
      ok: true,
      provider: "elevenlabs",
      available: Boolean(client),
      voiceId: VOICE_ID,
      ttsModel: TTS_MODEL,
      sttModel: STT_MODEL,
    })
  }

  if (req.method === "POST" && url.pathname === "/api/voice/speak") {
    if (!client) return json(res, 503, { error: "ELEVENLABS_API_KEY no configurada" })
    const body = await readBody(req)
    const text = String(body.text || "").trim()
    if (!text) return json(res, 400, { error: "text vacío" })

    try {
      const stream = await client.textToSpeech.convert(VOICE_ID, {
        text,
        modelId: TTS_MODEL,
        outputFormat: "mp3_44100_128",
      })
      const chunks = []
      const reader = stream.getReader ? stream.getReader() : null
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(Buffer.from(value))
        }
      } else {
        for await (const chunk of stream) chunks.push(Buffer.from(chunk))
      }
      const audio = Buffer.concat(chunks)
      cors(res)
      res.statusCode = 200
      res.setHeader("Content-Type", "audio/mpeg")
      res.setHeader("Content-Length", String(audio.length))
      res.setHeader("Cache-Control", "no-store")
      res.end(audio)
    } catch (error) {
      json(res, 502, { error: String(error?.message || error) })
    }
    return
  }

  if (req.method === "POST" && url.pathname === "/api/voice/transcribe") {
    if (!client) return json(res, 503, { error: "ELEVENLABS_API_KEY no configurada" })
    const body = await readBody(req)
    const audioBase64 = String(body.audio || "")
    if (!audioBase64) return json(res, 400, { error: "audio vacío" })

    const mimeType = String(body.mimeType || "audio/webm")
    const buffer = Buffer.from(audioBase64, "base64")
    const file = new Blob([buffer], { type: mimeType })

    try {
      const result = await client.speechToText.convert({
        file,
        modelId: STT_MODEL,
        languageCode: body.languageCode || "es",
      })
      const text = result?.text || result?.transcript || ""
      json(res, 200, { text })
    } catch (error) {
      json(res, 502, { error: String(error?.message || error) })
    }
    return
  }

  // Health check simple
  if (req.method === "GET" && url.pathname === "/") {
    return json(res, 200, { ok: true, service: "nexus-voice-backend", port: PORT })
  }

  json(res, 404, { error: "not found" })
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[nexus-voice] escuchando en http://0.0.0.0:${PORT}`)
  console.log(`[nexus-voice] elevenlabs: ${client ? "configurado" : "SIN CLAVE (fallback a Web Speech)"}`)
})
