import { createReadStream, existsSync, statSync } from "node:fs"
import { extname, resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

// In production the previews and demos are served next to the built gallery.
// During development they still live in library/, one level above this project.
function libraryAssets(): Plugin {
  const root = resolve(import.meta.dirname, "..")

  return {
    name: "nexus-library-assets",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = decodeURIComponent((request.url ?? "").split("?")[0])
        const match = pathname.match(/^\/(previews|demos)\/(.+)$/)
        if (!match) return next()

        const folder = resolve(root, match[1])
        let file = resolve(folder, match[2])
        if (!file.startsWith(folder) || !existsSync(file)) return next()
        if (statSync(file).isDirectory()) file = resolve(file, "index.html")
        if (!existsSync(file)) return next()

        const extension = extname(file).toLowerCase()
        const type =
          extension === ".html"
            ? "text/html; charset=utf-8"
            : extension === ".css"
              ? "text/css; charset=utf-8"
              : extension === ".js"
                ? "text/javascript; charset=utf-8"
                : extension === ".png"
                  ? "image/png"
                  : extension === ".webp"
                    ? "image/webp"
                    : extension === ".svg"
                      ? "image/svg+xml"
                      : extension === ".woff2"
                        ? "font/woff2"
                        : "image/jpeg"

        response.setHeader("Content-Type", type)
        response.setHeader("Cache-Control", "public, max-age=3600")
        createReadStream(file).pipe(response)
      })
    },
  }
}

export default defineConfig({
  server: {
    proxy: {
      "/api": { target: "http://localhost:3001", changeOrigin: true },
    },
  },
  plugins: [react(), tailwindcss(), libraryAssets()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
})
