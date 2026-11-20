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

// GitHub Pages does not rewrite SPA routes. On a deep link into a demo, this
// 404 fetches that demo's own index and writes it in place: the app then boots
// with the original pathname and its router resolves the inner page. Anything
// else goes back to the catalog. No source, scripts or routes are exposed.
writeFileSync(
  join(LIB, '404.html'),
  `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Abriendo la demo — NEXUS LABS</title>
    <style>
      html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#08080a;color:#f7f3ea;font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-align:center;padding:24px}a{color:#f3ce9f}.mark{width:44px;height:44px;border-radius:12px;margin:0 auto 16px;background:linear-gradient(135deg,#f3ce9f,#d8a273);color:#17130d;display:grid;place-items:center;font-weight:800}p{margin:8px 0}
    </style>
  </head>
  <body>
    <div>
      <div class="mark">N</div>
      <p id="status">Abriendo la demo de NEXUS LABS…</p>
      <p><a id="go" href="${BASE_PREFIX}">Volver al catálogo</a></p>
    </div>
    <script>
      (function () {
        var base = ${JSON.stringify(BASE_PREFIX)};
        var path = location.pathname;
        var prefix = base + 'demos/';
        if (path.indexOf(prefix) === 0) {
          var id = path.slice(prefix.length).split('/')[0];
          if (/^[a-z0-9][a-z0-9-]*$/.test(id)) {
            fetch(prefix + id + '/index.html', { cache: 'no-store' })
              .then(function (response) {
                if (!response.ok) throw new Error('missing');
                return response.text();
              })
              .then(function (html) {
                document.open();
                document.write(html);
                document.close();
              })
              .catch(function () {
                document.getElementById('status').textContent = 'Esa demo no está disponible.';
              });
            return;
          }
        }
        try {
          sessionStorage.setItem('nexus-redirect', location.href);
        } catch (error) {}
        location.replace(base);
      })();
    </script>
  </body>
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
