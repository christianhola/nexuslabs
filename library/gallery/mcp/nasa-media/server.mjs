// Servidor MCP "nasa-media": busca videos en la NASA Image and Video Library
// y descarga el MP4 directamente a public/media/nasa/.
//
// Ejecutar: node mcp/nasa-media/server.mjs
// Registrar en el cliente MCP (stdio).

import { McpServer } from "@modelcontextprotocol/server"
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio"
import { z } from "zod"
import { mkdirSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const PROJECT_ROOT = resolve(__dirname, "..", "..")
const MEDIA_DIR = join(PROJECT_ROOT, "public", "media", "nasa")

const BASE = "https://images-api.nasa.gov"

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.json()
}

function pickMp4(urls) {
  // Prioriza calidad media/HD evitando archivos gigantes: medium > large > small > mobile > preview
  const order = ["~medium.mp4", "~large.mp4", "~small.mp4", "~mobile.mp4", "~preview.mp4", "~orig.mp4"]
  for (const suffix of order) {
    const match = urls.find((u) => u.endsWith(suffix))
    if (match) return match
  }
  return urls.find((u) => u.endsWith(".mp4")) || null
}

const server = new McpServer({ name: "nasa-media", version: "1.0.0" })

server.registerTool(
  "search_nasa_videos",
  {
    description: "Busca videos en la NASA Image and Video Library.",
    inputSchema: {
      query: z.string().describe("Termino de busqueda"),
      limit: z.number().optional().describe("Cantidad maxima de resultados (default 10)"),
    },
  },
  async ({ query, limit = 10 }) => {
    const data = await fetchJson(`${BASE}/search?q=${encodeURIComponent(query)}&media_type=video`)
    const items = (data.collection?.items || []).slice(0, limit).map((item) => {
      const d = item.data?.[0] || {}
      return {
        nasa_id: d.nasa_id,
        title: d.title,
        description: d.description,
        date_created: d.date_created,
      }
    })
    return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] }
  }
)

server.registerTool(
  "download_nasa_video",
  {
    description: "Descarga el mejor MP4 disponible de un video de la NASA a public/media/nasa/<nasa_id>.mp4.",
    inputSchema: {
      nasa_id: z.string().describe("nasa_id del video"),
    },
  },
  async ({ nasa_id }) => {
    const data = await fetchJson(`${BASE}/asset/${encodeURIComponent(nasa_id)}`)
    const urls = (data.collection?.items || []).map((i) => i.href).filter(Boolean)
    const mp4 = pickMp4(urls)
    if (!mp4) throw new Error("No se encontro MP4 para " + nasa_id)

    const res = await fetch(mp4)
    if (!res.ok) throw new Error(`HTTP ${res.status} al descargar ${mp4}`)
    const buf = Buffer.from(await res.arrayBuffer())

    mkdirSync(MEDIA_DIR, { recursive: true })
    const filename = `${nasa_id}.mp4`.replace(/[^\w.\-]/g, "_")
    const outPath = join(MEDIA_DIR, filename)
    writeFileSync(outPath, buf)

    return {
      content: [
        { type: "text", text: JSON.stringify({ saved: outPath, source: mp4, bytes: buf.length }, null, 2) },
      ],
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
console.error("[nasa-media] MCP server listo (stdio)")
