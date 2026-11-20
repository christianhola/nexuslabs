// Builds the React gallery in library/gallery and copies it into library/.
// Run after build-library.mjs so demos and previews already exist on disk.

import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGalleryData } from './gallery.mjs'

const LIB = join(dirname(fileURLToPath(import.meta.url)), '..')
const GALLERY = join(LIB, 'gallery')
const BASE_PREFIX = (process.env.BASE_PREFIX ?? '/').replace(/\/*$/, '/')
const WHATSAPP = (process.env.WHATSAPP_NUMBER || '18494789660').replace(/\D/g, '')

const cat = JSON.parse(readFileSync(join(LIB, 'catalog.json'), 'utf8'))
const onDisk = readdirSync(join(LIB, 'demos')).filter((id) => existsSync(join(LIB, 'demos', id, 'index.html')))
const published = cat.templates.filter((t) => onDisk.includes(t.id))
const data = buildGalleryData({ templates: published, built: onDisk, whatsappNumber: WHATSAPP })
writeFileSync(join(GALLERY, 'src', 'templates.json'), JSON.stringify(data))
console.log(`Datos de la galería: ${data.items.length} plantillas, ${data.industries.length} industrias`)

if (!existsSync(join(GALLERY, 'node_modules'))) {
  console.log('Instalando dependencias de la galería…')
  const install = spawnSync('bun', ['install'], { cwd: GALLERY, stdio: 'inherit' })
  if (install.status !== 0) throw new Error('bun install falló en library/gallery')
}

const build = spawnSync('bun', ['x', 'vite', 'build', '--base', BASE_PREFIX], {
  cwd: GALLERY,
  stdio: 'inherit',
})
if (build.status !== 0) throw new Error('La galería no compiló')

rmSync(join(LIB, 'assets'), { recursive: true, force: true })
cpSync(join(GALLERY, 'dist'), LIB, { recursive: true })

// GitHub Pages no conoce las rutas del SPA: manda la 404 al inicio y deja que
// el index restaure la ruta original antes de que React monte el router.
writeFileSync(
  join(LIB, '404.html'),
  `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>NEXUS LABS</title>
    <script>
      try {
        sessionStorage.setItem('nexus-redirect', location.href);
      } catch (error) {}
      location.replace(${JSON.stringify(BASE_PREFIX)});
    </script>
  </head>
  <body></body>
</html>
`,
)
writeFileSync(
  join(LIB, 'library.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      basePrefix: BASE_PREFIX,
      built: onDisk,
      failed: [],
      whatsapp: Boolean(WHATSAPP),
    },
    null,
    2,
  ),
)
