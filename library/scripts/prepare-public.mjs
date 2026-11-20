// Copies only the deployable artefact from library/ into dist-public/.
// The public repository must never receive source, catalogues, scripts or maps.
//
// Usage:
//   bun library/scripts/prepare-public.mjs
//   BASE_PREFIX=/plantillas-freebuff/ bun library/scripts/prepare-public.mjs
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const LIB = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = join(LIB, '..')
const OUT = join(ROOT, 'dist-public')
const BASE = (process.env.BASE_PREFIX ?? '/plantillas-freebuff/').replace(/\/*$/, '/')

// Everything the site needs at runtime. Nothing else may be published.
const ALLOW = ['index.html', '404.html', '.nojekyll', 'vite.svg', 'assets', 'demos', 'previews']

function fail(message) {
  console.error(`prepare-public: ${message}`)
  process.exit(1)
}

if (!existsSync(join(LIB, 'index.html'))) fail('falta library/index.html; compila la galería primero')
if (!existsSync(join(LIB, 'demos'))) fail('falta library/demos; compila las plantillas primero')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

let files = 0
let bytes = 0
for (const entry of ALLOW) {
  const from = join(LIB, entry)
  if (!existsSync(from)) {
    if (entry === '.nojekyll') continue
    fail(`falta ${entry} en library/`)
  }
  cpSync(from, join(OUT, entry), {
    recursive: true,
    filter: (source) => {
      const name = source.split(/[\\/]/).pop() ?? ''
      if (name === '.DS_Store' || name.endsWith('.map') || name.endsWith('.log')) return false
      if (name.startsWith('.') && name !== '.nojekyll') return false
      return true
    },
  })
}

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isSymbolicLink()) fail(`symlink no permitido: ${path}`)
    if (stat.isDirectory()) walk(path)
    else {
      files += 1
      bytes += stat.size
    }
  }
}
walk(OUT)

if (files < 100) fail(`solo ${files} archivos; el artefacto parece incompleto`)
if (!existsSync(join(OUT, 'demos'))) fail('el artefacto no contiene demos')
if (!existsSync(join(OUT, 'previews'))) fail('el artefacto no contiene capturas')

const demoCount = readdirSync(join(OUT, 'demos')).filter((id) =>
  existsSync(join(OUT, 'demos', id, 'index.html'))
).length
if (demoCount < 1) fail('no hay demos con index.html')

console.log(
  `prepare-public: ${files} archivos, ${(bytes / 1024 / 1024).toFixed(1)} MiB, ${demoCount} demos → ${OUT}`
)
console.log(`prepare-public: prefijo público ${BASE}`)
