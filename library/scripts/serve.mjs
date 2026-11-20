// Serves the built library with per-demo SPA fallback, the same way the static
// host must behave: /demos/<id>/anything → that demo's index.html.
import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const LIB = join(import.meta.dir, '..')
const PORT = Number(process.env.PORT ?? 3000)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
}

function fileAt(pathname) {
  const p = join(LIB, decodeURIComponent(pathname))
  if (!p.startsWith(LIB) || !existsSync(p) || !statSync(p).isFile()) return null
  return p
}

function ok(path, cache = 'no-cache') {
  const ext = path.slice(path.lastIndexOf('.'))
  return new Response(Bun.file(path), {
    headers: { 'content-type': TYPES[ext] ?? 'application/octet-stream', 'cache-control': cache },
  })
}

const server = Bun.serve({
  port: PORT,
  hostname: '0.0.0.0',
  async fetch(req) {
    const url = new URL(req.url)
    let pathname = url.pathname

    // The production artifact is built for GitHub Pages under this prefix.
    // Strip it locally so the same HTML/CSS/JS can be audited at the root.
    if (pathname === '/plantillas-freebuff') pathname = '/'
    if (pathname.startsWith('/plantillas-freebuff/')) {
      pathname = pathname.slice('/plantillas-freebuff'.length)
    }

    if (pathname.endsWith('/')) pathname += 'index.html'
    const direct = fileAt(pathname)
    if (direct) return ok(direct, pathname.includes('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache')

    // SPA fallback inside a demo folder.
    const demo = url.pathname.match(/^(\/demos\/[^/]+)\//)
    if (demo) {
      const index = fileAt(`${demo[1]}/index.html`)
      if (index) return ok(index)
    }

    const root = fileAt('/index.html')
    if (root) return ok(root)
    return new Response('Not found', { status: 404 })
  },
})

console.log(`library on http://localhost:${server.port}`)
