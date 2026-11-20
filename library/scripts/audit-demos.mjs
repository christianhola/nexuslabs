// Runtime smoke audit for every built demo. Run with:
//   bun library/scripts/audit-demos.mjs http://127.0.0.1:3000
// Requires playwright available to the runtime (not a shipped dependency).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'

const BASE = (process.argv[2] ?? 'http://127.0.0.1:3000').replace(/\/$/, '')
const ROOT = process.env.AUDIT_ROOT ?? join(import.meta.dir, '..')
const OUT = process.env.AUDIT_OUT ?? join(ROOT, '..', 'artifacts')
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY ?? 4)
const catalog = JSON.parse(readFileSync(join(ROOT, 'catalog.json'), 'utf8'))
const templates = catalog.templates

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true })
const results = []
let cursor = 0

async function audit(template) {
  const context = await browser.newContext({
    viewport: { width: 1365, height: 900 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  const pageErrors = []
  const consoleErrors = []
  const failed = []
  let status = 0

  page.on('pageerror', (error) => pageErrors.push(String(error).slice(0, 300)))
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const text = message.text()
      if (!/favicon|Failed to load resource: net::ERR_/i.test(text)) {
        consoleErrors.push(text.slice(0, 240))
      }
    }
  })
  page.on('requestfailed', (request) => {
    const error = request.failure()?.errorText ?? 'failed'
    if (!/ERR_ABORTED|ERR_BLOCKED_BY_CLIENT/i.test(error)) {
      failed.push(`${request.method()} ${request.url()} ${error}`.slice(0, 260))
    }
  })

  try {
    const response = await page.goto(`${BASE}/demos/${template.id}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 25_000,
    })
    status = response?.status() ?? 0
    await page.waitForTimeout(1400)
  } catch (error) {
    pageErrors.push(`navigation: ${String(error).slice(0, 300)}`)
  }

  const snapshot = await page
    .evaluate(() => {
      const body = document.body
      const text = body?.innerText ?? ''
      const canvases = [...document.querySelectorAll('canvas')].map((canvas) => ({
        width: canvas.width,
        height: canvas.height,
      }))
      return {
        title: document.title,
        textLength: text.trim().length,
        nodes: document.querySelectorAll('*').length,
        canvases,
        rootChildren: document.getElementById('root')?.children.length ?? 0,
        hasNextError: Boolean(document.querySelector('nextjs-portal')),
      }
    })
    .catch(() => ({
      title: '',
      textLength: 0,
      nodes: 0,
      canvases: [],
      rootChildren: 0,
      hasNextError: false,
    }))

  await context.close()

  const fatal =
    status >= 400 ||
    pageErrors.length > 0 ||
    snapshot.textLength < 40 ||
    snapshot.nodes < 8
  const warn =
    consoleErrors.length > 0 ||
    failed.length > 0 ||
    snapshot.hasNextError ||
    (template.kind === 'game' && snapshot.canvases.length === 0)

  return {
    id: template.id,
    name: template.name,
    kind: template.kind,
    status,
    severity: fatal ? 'fatal' : warn ? 'warn' : 'ok',
    title: snapshot.title,
    textLength: snapshot.textLength,
    nodes: snapshot.nodes,
    rootChildren: snapshot.rootChildren,
    canvases: snapshot.canvases,
    pageErrors: [...new Set(pageErrors)].slice(0, 4),
    consoleErrors: [...new Set(consoleErrors)].slice(0, 4),
    failed: [...new Set(failed)].slice(0, 5),
  }
}

async function worker() {
  for (;;) {
    const index = cursor++
    if (index >= templates.length) return
    const template = templates[index]
    const result = await audit(template)
    results[index] = result
    const mark = result.severity === 'ok' ? 'OK  ' : result.severity === 'warn' ? 'WARN' : 'FAIL'
    console.log(`${mark} ${result.id} · ${result.textLength} chars · ${result.pageErrors[0] ?? ''}`)
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker))
await browser.close()

const summary = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  total: results.length,
  ok: results.filter((item) => item.severity === 'ok').length,
  warn: results.filter((item) => item.severity === 'warn').length,
  fatal: results.filter((item) => item.severity === 'fatal').length,
  results,
}

writeFileSync(join(OUT, 'demo-audit.json'), JSON.stringify(summary, null, 2))
writeFileSync(
  join(OUT, 'demo-audit.md'),
  [
    `# Auditoría runtime de demos`,
    '',
    `Generada: ${summary.generatedAt}`,
    `Base: ${BASE}`,
    '',
    `- Total: **${summary.total}**`,
    `- Correctas: **${summary.ok}**`,
    `- Avisos: **${summary.warn}**`,
    `- Fallos: **${summary.fatal}**`,
    '',
    '## Fallos',
    '',
    ...results
      .filter((item) => item.severity === 'fatal')
      .map(
        (item) =>
          `- **${item.name}** (\`${item.id}\`): status ${item.status}; ${item.pageErrors[0] ?? 'sin contenido renderizado'}`
      ),
    '',
    '## Avisos',
    '',
    ...results
      .filter((item) => item.severity === 'warn')
      .map(
        (item) =>
          `- **${item.name}** (\`${item.id}\`): ${item.consoleErrors[0] ?? item.failed[0] ?? 'canvas ausente'}`
      ),
    '',
  ].join('\n')
)
console.log(JSON.stringify({ total: summary.total, ok: summary.ok, warn: summary.warn, fatal: summary.fatal }))
