// Verifies dist-public/ before it is pushed to the public repository.
// Fails on source files, maps, internal catalogues, secrets, wrong asset bases
// or an incomplete demo set.
//
// Usage:
//   bun library/scripts/verify-public.mjs
//   BASE_PREFIX=/nexuslabs/ bun library/scripts/verify-public.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const LIB = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = join(LIB, '..')
const OUT = process.env.PUBLIC_DIR ?? join(ROOT, 'dist-public')
const BASE = (process.env.BASE_PREFIX ?? '/nexuslabs/').replace(/\/*$/, '/')
const errors = []

const fail = (message) => errors.push(message)

if (!existsSync(OUT)) {
  console.error(`verify-public: no existe ${OUT}`)
  process.exit(1)
}

const FORBIDDEN_NAMES = new Set([
  'catalog.json',
  'library.json',
  'templates.json',
  'package.json',
  'package-lock.json',
  'bun.lock',
  'bun.lockb',
  'tsconfig.json',
  'vite.config.ts',
  'wrangler.jsonc',
])
const FORBIDDEN_DIRS = new Set([
  '.git',
  '.github',
  '.bootstrap',
  '.build-work',
  'gallery',
  'node_modules',
  'scripts',
  'src',
])
const FORBIDDEN_EXT = new Set(['.map', '.ts', '.tsx', '.jsx', '.mjs', '.cjs', '.scss', '.sass', '.less'])
const TEXT_EXT = new Set([
  '.html',
  '.js',
  '.css',
  '.svg',
  '.json',
  '.webmanifest',
  '.txt',
  '.xml',
])

// Markers that must never appear in a public byte. They identify the private
// catalogue, its bucket, build scripts or credentials.
const LEAK_PATTERNS = [
  [/pub-[a-f0-9]{20,}\.r2\.dev/i, 'bucket R2 interno'],
  [/r2\.dev/i, 'host de almacenamiento interno'],
  [/catalog\.json/i, 'catálogo privado'],
  [/templates\.json/i, 'datos generados de la galería'],
  [/build-library(?:\.mjs)?/i, 'script de construcción privado'],
  [/build-gallery(?:\.mjs)?/i, 'script de construcción privado'],
  [/(?:^|[^.\w])\.bootstrap\b/i, 'bootstrap privado'],
  [/sourceMappingURL/i, 'referencia a source map'],
  [/BEGIN (?:OPENSSH|RSA|EC|DSA) PRIVATE KEY/, 'clave privada'],
  [/\bgh[pousr]_[A-Za-z0-9]{20,}\b/, 'token de GitHub'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}\b/, 'token de GitHub'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'clave de AWS'],
  [/(?:api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{24,}['"]/i, 'posible secreto embebido'],
]

const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    const stat = statSync(path)
    const rel = relative(OUT, path)
    if (stat.isSymbolicLink()) {
      fail(`symlink no permitido: ${rel}`)
      continue
    }
    if (stat.isDirectory()) {
      if (FORBIDDEN_DIRS.has(name)) fail(`directorio privado publicado: ${rel}`)
      walk(path)
      continue
    }
    files.push({ path, rel, size: stat.size, name })
  }
}
walk(OUT)

for (const file of files) {
  if (FORBIDDEN_NAMES.has(file.name)) fail(`archivo privado publicado: ${file.rel}`)
  if (FORBIDDEN_EXT.has(extname(file.name).toLowerCase())) fail(`archivo de fuente/mapa publicado: ${file.rel}`)
  if (file.name.startsWith('.') && file.name !== '.nojekyll') fail(`archivo oculto publicado: ${file.rel}`)
  if (file.name === '.nojekyll') continue
  if (!TEXT_EXT.has(extname(file.name).toLowerCase())) continue

  const text = readFileSync(file.path, 'utf8')
  for (const [pattern, label] of LEAK_PATTERNS) {
    if (pattern.test(text)) fail(`${label} en ${file.rel}`)
  }
}

if (!existsSync(join(OUT, 'index.html'))) fail('falta index.html')
else {
  const html = readFileSync(join(OUT, 'index.html'), 'utf8')
  if (!html.includes(`${BASE}assets/`)) fail(`index.html no referencia ${BASE}assets/`)
}

if (!existsSync(join(OUT, '.nojekyll'))) fail('falta .nojekyll (Pages ignora _assets)')

const demosDir = join(OUT, 'demos')
if (!existsSync(demosDir)) fail('falta demos/')
else {
  const demos = readdirSync(demosDir).filter((id) => existsSync(join(demosDir, id, 'index.html')))
  if (!demos.length) fail('no hay demos con index.html')

  const manifestPath = join(LIB, 'library.json')
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const built = new Set(manifest.built ?? [])
    const missing = [...built].filter((id) => !demos.includes(id))
    if (missing.length) fail(`demos declaradas pero ausentes: ${missing.slice(0, 8).join(', ')}`)
  }

  for (const id of demos) {
    const html = readFileSync(join(demosDir, id, 'index.html'), 'utf8')
    const refs = [...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((match) => match[1])
    for (const ref of refs) {
      if (ref === BASE.slice(0, -1)) continue
      const isAsset = /\/assets\//.test(ref) || /\.(?:js|css)(?:\?|$)/.test(ref)
      if (isAsset && !ref.startsWith(BASE)) {
        fail(`asset fuera del prefijo en ${id}: ${ref.slice(0, 120)}`)
      }
      if (ref.startsWith('/demos/') || ref.startsWith('/assets/') || ref.startsWith('/images/')) {
        fail(`base incorrecta en ${id}: ${ref.slice(0, 120)}`)
      }
    }

    const assetsDir = join(demosDir, id, 'assets')
    if (existsSync(assetsDir)) {
      for (const name of readdirSync(assetsDir)) {
        if (!name.endsWith('.js')) continue
        const js = readFileSync(join(assetsDir, name), 'utf8')
        if (/basename:\s*`\/demos\//.test(js) || /"\/demos\/[^"]+"\s*\+/.test(js)) {
          fail(`router con base /demos/ en ${id}/${name} (debe ser ${BASE}demos/${id}/)`)
        }
      }
    }
  }

  const previews = existsSync(join(OUT, 'previews'))
    ? new Set(readdirSync(join(OUT, 'previews')).map((name) => name.replace(/\.[^.]+$/, '')))
    : new Set()
  const withoutPreview = demos.filter((id) => !previews.has(id))
  if (withoutPreview.length) {
    fail(`demos sin captura: ${withoutPreview.slice(0, 8).join(', ')}`)
  }
}

if (errors.length) {
  console.error(`verify-public: ${errors.length} problema(s)`)
  for (const error of [...new Set(errors)].slice(0, 60)) console.error(` - ${error}`)
  process.exit(1)
}

const totalMiB = (files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(1)
console.log(`verify-public: OK · ${files.length} archivos · ${totalMiB} MiB · ${readdirSync(join(OUT, 'demos')).length} demos`)
console.log(`verify-public: sin mapas, fuente, catálogo, scripts ni credenciales`)
