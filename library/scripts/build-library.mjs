// Builds the template library: downloads each template's published source archive,
// patches its router so it works under /demos/<id>/, builds it statically and copies
// the result into library/demos/<id>. Then regenerates library/index.html.
//
// Usage:
//   bun scripts/build-library.mjs --ids portfolio,store
//   bun scripts/build-library.mjs --sites            # every "site" template
//   BASE_PREFIX=/my-repo bun scripts/build-library.mjs --sites
//
// BASE_PREFIX must match where the repo is served (GitHub Pages project sites live
// under /<repo>/; a user site lives at /).

import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGalleryData } from './gallery.mjs'

const LIB = join(dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = join(LIB, '..')
const WORK = join(ROOT, '.build-work')
const CATALOG_PATH = join(LIB, 'catalog.json')
const CATALOG_URL = 'https://pub-0cfed6727a1844b7b9405419b66ad607.r2.dev/catalog.json'

const BASE_PREFIX = (process.env.BASE_PREFIX ?? '/').replace(/\/*$/, '/')
const args = process.argv.slice(2)
const onlySites = args.includes('--sites')
const idsArg = args.find((a) => a.startsWith('--ids=')) ?? (args.includes('--ids') ? `--ids=${args[args.indexOf('--ids') + 1]}` : null)
const wanted = idsArg ? idsArg.slice('--ids='.length).split(',').map((s) => s.trim()).filter(Boolean) : null
const force = args.includes('--force')
const includeApps = args.includes('--static')
const CONCURRENCY = Math.max(1, Number(process.env.BUILD_CONCURRENCY ?? 4))
const WHATSAPP = process.env.WHATSAPP_NUMBER ?? '18494789660'
const GALLERY = join(LIB, 'gallery')

function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

function waHref(name, base) {
  const number = String(WHATSAPP).replace(/\D/g, '')
  const text = encodeURIComponent(`Hola NEXUS LABS 👋 Me interesa la plantilla «${name}» y quiero una versión personalizada. La vi en ${base}`)
  return `https://wa.me/${number}?text=${text}`
}

function run(cmd, cmdArgs, cwd, timeout = 240_000) {
  const res = spawnSync(cmd, cmdArgs, { cwd, encoding: 'utf8', timeout, maxBuffer: 32 * 1024 * 1024 })
  return { ok: res.status === 0, status: res.status, out: (res.stdout ?? '') + (res.stderr ?? '') }
}

async function catalog() {
  if (!existsSync(CATALOG_PATH)) {
    const res = await fetch(CATALOG_URL)
    if (!res.ok) throw new Error(`catalog fetch failed: ${res.status}`)
    writeFileSync(CATALOG_PATH, await res.text())
  }
  return JSON.parse(readFileSync(CATALOG_PATH, 'utf8'))
}

// react-router: make the router path-relative to the demo's own folder.
function patchRouter(dir) {
  const files = []
  const walk = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      const st = statSync(p)
      if (st.isDirectory()) walk(p)
      else if (/\.(tsx?|jsx?)$/.test(name)) files.push(p)
    }
  }
  walk(join(dir, 'src'))

  const basenameExpr = `{import.meta.env.BASE_URL.replace(/\\/$/, '')}`
  let patched = 0
  for (const file of files) {
    let src = readFileSync(file, 'utf8')
    const before = src
    src = src.replace(/<BrowserRouter(\s[^>]*)?>/g, (match, attrs = '') => {
      if (attrs.includes('basename')) return match
      return `<BrowserRouter${attrs} basename=${basenameExpr}>`
    })
    if (src !== before) {
      writeFileSync(file, src)
      patched += 1
    }
  }
  return patched
}

// Some templates spell asset paths as plain strings (`/images/hero.webp`), which
// Vite leaves alone. Point those at the demo's own folder too.
function rewriteRootAssets(dir, base) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const targets = entries
    .filter((e) => !e.name.startsWith('assets') && e.name !== 'index.html')
    .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
  if (!targets.length) return

  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name)
      if (e.isDirectory()) {
        walk(p)
        continue
      }
      if (!/\.(js|css|html|json|svg|webmanifest)$/.test(e.name)) continue
      let src = readFileSync(p, 'utf8')
      const before = src
      for (const target of targets) {
        for (const q of ['"', "'", '`', '(']) {
          src = src.split(`${q}/${target}`).join(`${q}${base}${target}`)
        }
      }
      if (src !== before) writeFileSync(p, src)
    }
  }
  walk(dir)
}

// Every demo gets a NEXUS LABS bar: a way back to the catalogue, an honest note
// that the demo is static, and a WhatsApp shortcut. Root-absolute links inside the
// demo (plain <a href="/about">) are kept within the demo's own folder.
function injectDemoChrome(dir, base, template) {
  const indexPath = join(dir, 'index.html')
  if (!existsSync(indexPath)) return
  let html = readFileSync(indexPath, 'utf8')
  if (html.includes('id="fb-back"')) return

  const name = escHtml(template?.name ?? 'Demo')
  const wa = waHref(template?.name ?? 'una plantilla', base)
  const chrome = `
<style>
#fb-bar,#fb-wa{position:fixed;z-index:2147483647;font:600 12px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;text-decoration:none;border-radius:999px;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
#fb-bar{left:16px;bottom:16px;display:flex;align-items:center;gap:9px;padding:7px 13px 7px 8px;color:#f7f3ea;background:rgba(10,10,14,.78);border:1px solid rgba(255,255,255,.18);box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:.94;transition:opacity .25s,transform .25s}
#fb-bar:hover{opacity:1;transform:translateY(-1px)}
#fb-bar .mark{width:22px;height:22px;border-radius:6px;background:linear-gradient(135deg,#f3ce9f,#d8a273);color:#17130d;display:grid;place-items:center;font-size:10px;font-weight:800}
#fb-bar .back{color:#f7f3ea;text-decoration:none}
#fb-bar .name{color:rgba(247,243,234,.55);font-weight:500;max-width:20ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-left:1px solid rgba(255,255,255,.18);padding-left:9px}
#fb-wa{right:16px;bottom:16px;display:inline-flex;align-items:center;gap:7px;padding:11px 15px;color:#0c1a10;background:#8ee6a8;border:1px solid rgba(0,0,0,.08);box-shadow:0 10px 30px rgba(0,0,0,.35)}
#fb-wa:hover{background:#a3f0b9}
#fb-wa svg{width:15px;height:15px}
#fb-fallback{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:24px;background:rgba(8,8,10,.86);backdrop-filter:blur(8px);font:15px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f7f3ea}
#fb-fallback[hidden]{display:none}
#fb-fallback .box{max-width:380px;background:#111116;border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:26px;box-shadow:0 30px 80px rgba(0,0,0,.6)}
#fb-fallback b{display:block;font-size:18px;margin-bottom:8px;color:#fff}
#fb-fallback p{color:#a8a29a;margin:0 0 18px}
#fb-fallback a,#fb-fallback button{display:inline-block;margin-right:8px;padding:10px 14px;border-radius:999px;font:600 12px/1 inherit;text-decoration:none;cursor:pointer}
#fb-fallback .primary{background:#f3ce9f;color:#17130d;border:0}
#fb-fallback .ghost{background:transparent;color:#f7f3ea;border:1px solid rgba(255,255,255,.2)}
@media(max-width:620px){#fb-bar .name,#fb-wa span{display:none}#fb-wa{padding:12px}}
</style>
<div id="fb-bar" role="navigation" aria-label="Navegación de la demo">
  <span class="mark" aria-hidden="true">N</span>
  <a class="back" id="fb-back" href="${BASE_PREFIX}">← Catálogo</a>
  <span class="name">${name} · demo estática</span>
</div>
<a id="fb-wa" href="${wa}" data-name="${name}" data-number="${String(WHATSAPP).replace(/\D/g, '')}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.3 4.8 4.94-1.3A9.9 9.9 0 1 0 12.04 2Zm5.77 14.03c-.24.68-1.4 1.3-1.93 1.34-.53.05-1.02.24-3.44-.72-2.9-1.14-4.72-4.14-4.86-4.34-.14-.2-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.36.26-.29.57-.36.76-.36l.55.01c.18 0 .41-.07.64.49.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.2-.2.32-.39.5-.19.18-.4.4-.57.54-.19.16-.39.34-.17.67.22.34.98 1.62 2.1 2.62 1.45 1.29 2.66 1.69 3.04 1.88.38.2.6.17.82-.1.22-.27.94-1.1 1.19-1.48.25-.38.5-.31.84-.19.34.12 2.16 1.02 2.53 1.2.37.19.62.28.71.44.1.16.1.94-.14 1.62Z"/></svg><span>Personalizar</span></a>
<div id="fb-fallback" hidden role="alert">
  <div class="box">
    <b>Esta demo no terminó de cargar</b>
    <p>Puede ser la conexión o una ruta interna. Reintenta o vuelve al catálogo; el resto de la biblioteca sigue disponible.</p>
    <button class="primary" type="button" onclick="location.reload()">Reintentar</button>
    <a class="ghost" href="${BASE_PREFIX}">Ir al catálogo</a>
  </div>
</div>
<script>(function(){var base=${JSON.stringify(base)};
document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;if(!a)return;if(a.target&&a.target!=='_self')return;var h=a.getAttribute('href');if(h&&h.charAt(0)==='/'&&h.indexOf(base)!==0){e.preventDefault();location.href=base+h.slice(1);}},true);
document.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='IMG'&&!t.dataset.fbBroken){t.dataset.fbBroken='1';t.style.visibility='hidden';}},true);
var w=document.getElementById('fb-wa');if(w){var n=w.getAttribute('data-name'),num=w.getAttribute('data-number');var msg='Hola NEXUS LABS 👋 Me interesa la plantilla «'+n+'» y quiero una versión personalizada. La vi en '+location.href;w.href='https://wa.me/'+num+'?text='+encodeURIComponent(msg);}
function guard(){var r=document.getElementById('root');if(!r||r.children.length)return;if((r.textContent||'').trim().length)return;var f=document.getElementById('fb-fallback');if(f)f.hidden=false;}
setTimeout(guard,9000);window.addEventListener('load',function(){setTimeout(guard,3000)});
})();</script>`

  html = html.includes('</body>') ? html.replace('</body>', `${chrome}</body>`) : html + chrome
  writeFileSync(indexPath, html)
}

async function buildTemplate(t) {
  const srcDir = join(WORK, t.id)
  const tgz = join(WORK, `${t.id}.tgz`)
  const outDir = join(LIB, 'demos', t.id)

  rmSync(srcDir, { recursive: true, force: true })
  mkdirSync(srcDir, { recursive: true })

  // Local overrides keep small, audited playability fixes in the private source.
  // They are built exactly like the downloaded template, never served as source.
  const override = join(LIB, 'games', t.id)
  if (existsSync(join(override, 'package.json'))) {
    cpSync(override, srcDir, { recursive: true })
  } else {
    const dl = run('curl', ['-fsSL', '-o', tgz, t.archive.url], WORK)
    if (!dl.ok) throw new Error(`download failed: ${dl.out.slice(0, 200)}`)
    const untar = run('tar', ['-xzf', tgz, '-C', srcDir], WORK)
    if (!untar.ok) throw new Error(`extract failed: ${untar.out.slice(0, 200)}`)
  }

  if (!existsSync(join(srcDir, 'index.html'))) throw new Error('not a static Vite app (no index.html)')
  const pkg = JSON.parse(readFileSync(join(srcDir, 'package.json'), 'utf8'))
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  if (!deps.vite) throw new Error('no vite dependency')

  const routerPatch = patchRouter(srcDir)

  const install = run('bun', ['install', '--frozen-lockfile'], srcDir, 300_000)
  if (!install.ok) {
    const retry = run('bun', ['install'], srcDir, 300_000)
    if (!retry.ok) throw new Error(`install failed: ${(install.out + retry.out).slice(-400)}`)
  }

  const base = `${BASE_PREFIX}demos/${t.id}/`
  const build = run('bunx', ['vite', 'build', '--base', base], srcDir, 300_000)
  // Most templates emit dist/client + a Worker; plain Vite templates emit dist/.
  const dist = [join(srcDir, 'dist', 'client'), join(srcDir, 'dist')].find((d) => existsSync(join(d, 'index.html')))
  if (!build.ok || !dist) {
    throw new Error(`build failed: ${build.out.slice(-500)}`)
  }
  if (dist === join(srcDir, 'dist')) rmSync(join(dist, t.id), { recursive: true, force: true })

  // Strip source maps and hidden files the way the template's own postbuild does.
  const clean = (d) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (name.startsWith('.') || name.endsWith('.map')) {
        rmSync(p, { recursive: true, force: true })
        continue
      }
      if (statSync(p).isDirectory()) clean(p)
    }
  }
  clean(dist)

  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(dirname(outDir), { recursive: true })
  cpSync(dist, outDir, { recursive: true })

  // Preview screenshot from the published catalogue.
  mkdirSync(join(LIB, 'previews'), { recursive: true })
  const previewPath = join(LIB, 'previews', `${t.id}.jpg`)
  if (t.preview) run('curl', ['-fsSL', '-o', previewPath, t.preview], WORK)

  rewriteRootAssets(outDir, base)
  injectDemoChrome(outDir, base, t)

  // Free the build tree: only the built site is kept.
  rmSync(srcDir, { recursive: true, force: true })
  rmSync(tgz, { force: true })

  return { routerPatch }
}

const cat = await catalog()
let targets = cat.templates
if (wanted) targets = targets.filter((t) => wanted.includes(t.id))
else if (onlySites) targets = targets.filter((t) => t.kind === 'site')
else if (includeApps) {
  // Apps that keep their state in the browser build like any static site; those
  // needing auth, a database or storage are left out.
  targets = targets.filter((t) => t.kind === 'site' || (t.kind === 'app' && (t.integrations ?? []).length === 0))
}

mkdirSync(WORK, { recursive: true })
mkdirSync(join(LIB, 'demos'), { recursive: true })

const built = []
const failed = []
let cursor = 0

async function worker() {
  for (;;) {
    const t = targets[cursor++]
    if (!t) return
    const outDir = join(LIB, 'demos', t.id)
    if (!force && existsSync(join(outDir, 'index.html'))) {
      built.push(t)
      console.log(`skip ${t.id} (already built)`)
      continue
    }
    const started = Date.now()
    try {
      const info = await buildTemplate(t)
      built.push(t)
      console.log(`ok   ${t.id}  ${((Date.now() - started) / 1000).toFixed(0)}s  router-patch:${info.routerPatch}`)
    } catch (err) {
      failed.push({ id: t.id, error: String(err.message ?? err) })
      console.log(`FAIL ${t.id}: ${String(err.message ?? err).slice(0, 220)}`)
    }
  }
}

await Promise.all(Array.from({ length: Math.min(CONCURRENCY, targets.length || 1) }, worker))

// Regenerate the gallery from whatever is actually on disk.
const onDisk = readdirSync(join(LIB, 'demos')).filter((id) => existsSync(join(LIB, 'demos', id, 'index.html')))
const published = cat.templates.filter((t) => onDisk.includes(t.id))
const data = buildGalleryData({ templates: published, built: onDisk, whatsappNumber: WHATSAPP })
writeFileSync(join(GALLERY, 'src', 'templates.json'), JSON.stringify(data))
console.log(`Datos de la galería: ${data.items.length} plantillas, ${data.industries.length} industrias`)

// One gallery builder owns the public base, 404 fallback and assets copy.
const galleryBuild = spawnSync('bun', ['library/scripts/build-gallery.mjs'], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, BASE_PREFIX },
})
if (galleryBuild.status !== 0) throw new Error('La galería no compiló')

// build-gallery.mjs owns 404.html so demo deep links and the catalog share one
// fallback. Writing another one here would overwrite that router hand-off.
writeFileSync(join(LIB, 'library.json'), JSON.stringify({ generatedAt: new Date().toISOString(), basePrefix: BASE_PREFIX, built: onDisk, failed, whatsapp: Boolean(data.whatsapp) }, null, 2))
writeFileSync(join(LIB, '.nojekyll'), '')

console.log(`\n${onDisk.length} demos listos, ${failed.length} fallos`)
if (failed.length) console.log(failed.map((f) => ` - ${f.id}: ${f.error.slice(0, 160)}`).join('\n'))
