// Generates the painterly SVG artwork in public/images/art/. Run with
// `node scripts/art.mjs` after changing a palette or seed. The output is
// checked in, so the app never runs this at build time.
import { mkdirSync, writeFileSync } from 'node:fs'

const out = new URL('../public/images/art/', import.meta.url).pathname
mkdirSync(out, { recursive: true })

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const f = (n) => Math.round(n * 10) / 10

// Shared filters: a brushy edge wobble and a canvas-grain overlay.
const defs = (seed) => `
  <filter id="brush" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="${seed}" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed + 3}"/>
    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.16 0"/>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>`

const petal = (len, wid) =>
  `M0 0 C${f(wid)} ${f(-len * 0.28)} ${f(wid * 0.85)} ${f(-len)} 0 ${f(-len * 0.96)} C${f(-wid * 0.85)} ${f(-len)} ${f(-wid)} ${f(-len * 0.28)} 0 0Z`

let gid = 0
function flower(r, cx, cy, radius, palette, layers = 5) {
  const parts = []
  const grads = []
  for (let k = 0; k < layers; k++) {
    const n = 6 + k + Math.floor(r() * 3)
    const len = radius * (1 - k * 0.16)
    const wid = len * (0.5 + r() * 0.12)
    const base = palette[Math.min(k, palette.length - 1)]
    const id = `g${gid++}`
    grads.push(
      `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${base[0]}"/><stop offset="1" stop-color="${base[1]}"/></linearGradient>`,
    )
    const off = r() * 360
    for (let i = 0; i < n; i++) {
      const a = off + (360 / n) * i + (r() - 0.5) * 18
      const l = len * (0.85 + r() * 0.25)
      parts.push(
        `<path d="${petal(l, wid)}" transform="translate(${f(cx)} ${f(cy)}) rotate(${f(a)})" fill="url(#${id})" stroke="${base[1]}" stroke-opacity="0.35" stroke-width="1.5"/>`,
      )
    }
  }
  parts.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(radius * 0.12)}" fill="${palette[palette.length - 1][0]}"/>`)
  return { grads: grads.join(''), body: `<g filter="url(#brush)">${parts.join('')}</g>` }
}

function leaf(cx, cy, len, angle, c1, c2) {
  const w = len * 0.32
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(angle)})" filter="url(#brush)">
    <path d="M0 0 C${f(w)} ${f(-len * 0.3)} ${f(w * 0.7)} ${f(-len * 0.8)} 0 ${f(-len)} C${f(-w * 0.7)} ${f(-len * 0.8)} ${f(-w)} ${f(-len * 0.3)} 0 0Z" fill="${c1}"/>
    <path d="M0 0 L0 ${f(-len * 0.95)}" stroke="${c2}" stroke-width="2.5" opacity="0.7"/></g>`
}

function svg(w, h, seed, inner, extraDefs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>${defs(seed)}${extraDefs}</defs>
${inner}
<rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>
`
}

// 1. Peony on rose: one big bloom, a stem and two leaves.
{
  const r = rng(7)
  gid = 0
  const pal = [
    ['#b3263f', '#ef8a9b'],
    ['#c0304a', '#f59aab'],
    ['#a51f3a', '#f2a0ae'],
    ['#9c1834', '#e66f86'],
    ['#7d1029', '#d9506c'],
  ]
  const fl = flower(r, 470, 265, 255, [...pal, ['#6d0c24', '#c43c5b']], 6)
  const inner = `<rect width="800" height="800" fill="#d9878f"/>
  <rect width="800" height="800" fill="#c46f79" opacity="0.35" filter="url(#soft)"/>
  <path d="M520 400 C560 560 600 680 690 820" stroke="#a62b45" stroke-width="9" fill="none" filter="url(#brush)"/>
  ${leaf(560, 560, 200, 62, '#b8364f', '#7e1830')}
  ${leaf(610, 670, 160, 132, '#c2465c', '#8a1d36')}
  ${leaf(548, 500, 130, -38, '#b13049', '#7e1830')}
  ${fl.body}`
  writeFileSync(out + 'peony.svg', svg(800, 800, 7, inner, fl.grads))
}

// 2. Dark florals: a tapestry of blooms with a black cat peeking up.
{
  const r = rng(21)
  gid = 0
  const palettes = [
    [['#7a2c3c', '#d98a8f'], ['#8d3445', '#e8a4a2'], ['#6a2233', '#cf7d83']],
    [['#c9b79a', '#f6eedc'], ['#d6c6a8', '#fffaf0'], ['#b9a280', '#f1e3c4']],
    [['#5b1a2a', '#a8475d'], ['#6c2236', '#b8566b'], ['#4a1222', '#93394e']],
    [['#c76b55', '#f5b59a'], ['#d27b62', '#ffc7ad'], ['#b85c48', '#efa68b']],
    [['#c8a14a', '#f1d77e'], ['#b88f38', '#e8c868']],
  ]
  let grads = ''
  let body = ''
  for (let i = 0; i < 26; i++) {
    const x = r() * 1000
    const y = r() * 700
    body += leaf(x, y, 90 + r() * 90, r() * 360, ['#3e4a35', '#4f5c40', '#5f6b4a', '#34402e'][i % 4], '#26301f')
  }
  const spots = [
    [140, 140, 120], [420, 90, 95], [700, 170, 130], [930, 80, 90], [90, 470, 110],
    [330, 360, 100], [880, 430, 120], [610, 560, 80], [210, 660, 90], [990, 690, 100],
  ]
  spots.forEach(([x, y, rad], i) => {
    const fl = flower(r, x, y, rad, palettes[i % palettes.length], 3)
    grads += fl.grads
    body += fl.body
  })
  const cat = `<g transform="translate(500 700)">
    <path d="M-150 0 C-150 -150 -120 -210 -110 -260 L-60 -190 C-20 -205 20 -205 60 -190 L110 -260 C120 -210 150 -150 150 0Z" fill="#1d1a1a"/>
    <path d="M-150 0 C-150 -150 -120 -210 -110 -260 L-60 -190 C-20 -205 20 -205 60 -190 L110 -260 C120 -210 150 -150 150 0Z" fill="#6b5a4c" opacity="0.18" filter="url(#brush)"/>
    <ellipse cx="-48" cy="-110" rx="26" ry="22" fill="#cfe3e0"/><ellipse cx="48" cy="-110" rx="26" ry="22" fill="#cfe3e0"/>
    <ellipse cx="-48" cy="-110" rx="16" ry="18" fill="#5d8f95"/><ellipse cx="48" cy="-110" rx="16" ry="18" fill="#5d8f95"/>
    <circle cx="-48" cy="-110" r="7" fill="#0c0c0c"/><circle cx="48" cy="-110" r="7" fill="#0c0c0c"/>
    <circle cx="-42" cy="-116" r="4" fill="#fff"/><circle cx="54" cy="-116" r="4" fill="#fff"/>
    <path d="M-12 -62 L12 -62 L0 -48Z" fill="#3a2a2a"/></g>`
  const inner = `<rect width="1000" height="700" fill="#2c3027"/>${body}${cat}`
  writeFileSync(out + 'florals.svg', svg(1000, 700, 21, inner, grads))
}

// 3. Two sitters: abstract cats in sunglasses at a green table, rose wall.
{
  const inner = `<rect width="760" height="1000" fill="#e3828c"/>
  <rect width="760" height="1000" fill="#f2a7ae" opacity="0.4" filter="url(#soft)"/>
  <g filter="url(#brush)">
    <rect x="0" y="0" width="70" height="680" fill="#3c8a86"/>
    <circle cx="35" cy="120" r="24" fill="#e7b7c6"/><circle cx="30" cy="300" r="20" fill="#f0c9a2"/><circle cx="40" cy="480" r="22" fill="#a8cfe0"/>
    <path d="M560 420 L760 380 L760 760 L600 760Z" fill="#8a5f4a"/>
    <path d="M0 680 L760 610 L760 1000 L0 1000Z" fill="#3e9c80"/>
    <path d="M0 680 L760 610" stroke="#2b7a63" stroke-width="10"/>
    <!-- left sitter -->
    <path d="M90 690 C70 560 110 470 200 440 C290 470 330 560 300 690Z" fill="#9db6cf"/>
    <path d="M120 660 C110 560 150 500 190 490 C230 520 240 600 230 660Z" fill="#f4f1ea"/>
    <circle cx="200" cy="370" r="92" fill="#f4f1ea"/>
    <path d="M128 330 C150 300 180 290 200 300 C190 260 150 250 120 270Z" fill="#1d1d1f"/>
    <path d="M118 300 L120 220 L170 285Z" fill="#1d1d1f"/><path d="M282 300 L282 222 L232 285Z" fill="#f4f1ea"/>
    <rect x="128" y="352" width="62" height="40" rx="18" fill="#6fd0c9" stroke="#1d1d1f" stroke-width="6"/>
    <rect x="208" y="352" width="62" height="40" rx="18" fill="#6fd0c9" stroke="#1d1d1f" stroke-width="6"/>
    <path d="M190 370 L208 370" stroke="#1d1d1f" stroke-width="6"/>
    <path d="M190 420 L200 430 L210 420" stroke="#d9707f" stroke-width="5" fill="none"/>
    <!-- right sitter -->
    <path d="M400 640 C380 500 420 400 520 370 C620 400 650 500 630 640Z" fill="#a9c3dc"/>
    <path d="M450 620 C440 520 480 450 520 440 C570 470 580 560 570 620Z" fill="#f7f4ee"/>
    <circle cx="520" cy="300" r="88" fill="#f7f4ee"/>
    <path d="M450 250 L452 170 L500 230Z" fill="#f7f4ee"/><path d="M590 250 L594 168 L544 230Z" fill="#1d1d1f"/>
    <path d="M540 230 C580 220 610 250 606 290 C590 270 560 260 540 262Z" fill="#1d1d1f"/>
    <rect x="448" y="282" width="64" height="40" rx="18" fill="#1d1d1f"/>
    <rect x="528" y="282" width="64" height="40" rx="18" fill="#1d1d1f"/>
    <path d="M470 380 L570 380" stroke="#1d1d1f" stroke-width="8"/>
    <path d="M510 345 L520 354 L530 345" stroke="#d9707f" stroke-width="5" fill="none"/>
    <!-- bottle and glasses -->
    <rect x="335" y="520" width="48" height="160" rx="10" fill="#2f6b3f"/>
    <rect x="350" y="460" width="18" height="70" fill="#2f6b3f"/>
    <rect x="340" y="580" width="38" height="44" fill="#e9dcb4"/>
    <path d="M430 600 C430 650 490 650 490 600Z" fill="#9b1b26" stroke="#e8e2dc" stroke-width="3"/>
    <path d="M460 646 L460 720 M440 722 L480 722" stroke="#e8e2dc" stroke-width="4"/>
    <path d="M260 640 C260 690 320 690 320 640Z" fill="#9b1b26" stroke="#e8e2dc" stroke-width="3"/>
    <path d="M290 686 L290 760 M270 762 L310 762" stroke="#e8e2dc" stroke-width="4"/>
    <ellipse cx="610" cy="820" rx="120" ry="50" fill="#d9d6cc"/>
    <ellipse cx="570" cy="810" rx="34" ry="20" fill="#8f8a80"/><ellipse cx="640" cy="826" rx="34" ry="20" fill="#8f8a80"/><ellipse cx="660" cy="795" rx="30" ry="18" fill="#a29c90"/>
  </g>`
  writeFileSync(out + 'sitters.svg', svg(760, 1000, 33, inner))
}

// 4. Profile: a split-face abstract portrait in ochre, terracotta and blue.
{
  const inner = `<rect width="800" height="1000" fill="#e9c27a"/>
  <rect x="0" y="0" width="400" height="1000" fill="#2f5e9c" opacity="0.92"/>
  <g filter="url(#brush)">
    <circle cx="610" cy="200" r="90" fill="#f4e3c3"/>
    <path d="M250 1000 C230 860 260 760 330 700 C260 650 230 560 250 460 C270 330 350 250 450 250 C560 250 620 330 610 420 L660 470 L610 500 C620 540 610 570 590 590 C560 640 520 650 480 650 L470 720 C560 760 620 860 620 1000Z" fill="#c8553d"/>
    <path d="M250 1000 C230 860 260 760 330 700 C260 650 230 560 250 460 C270 330 350 250 400 250 L400 1000Z" fill="#e48a6a"/>
    <path d="M300 300 C340 220 470 200 560 260 C520 230 380 220 300 330 C280 380 270 440 280 470 C250 400 260 340 300 300Z" fill="#1f1b1a"/>
    <path d="M470 400 C500 380 540 380 560 400 C540 420 500 420 470 400Z" fill="#fff8ec"/>
    <circle cx="515" cy="400" r="12" fill="#1f1b1a"/>
    <path d="M330 420 C350 400 380 400 395 420 C380 440 350 440 330 420Z" fill="#fff8ec"/>
    <circle cx="362" cy="420" r="11" fill="#2f5e9c"/>
    <path d="M520 560 C545 565 570 560 585 552" stroke="#7e2a1e" stroke-width="8" fill="none"/>
    <path d="M0 860 L800 820 L800 1000 L0 1000Z" fill="#22303f" opacity="0.85"/>
  </g>`
  writeFileSync(out + 'profile.svg', svg(800, 1000, 44, inner))
}

// 5. Dusk: a soft gradient field, the kind of colour study that pins well.
{
  const inner = `<rect width="1000" height="800" fill="#f3d9c6"/>
  <g filter="url(#soft)">
    <circle cx="220" cy="200" r="260" fill="#f59d7a"/>
    <circle cx="760" cy="180" r="240" fill="#a7b8f0"/>
    <circle cx="560" cy="620" r="300" fill="#f2c4dc"/>
    <circle cx="140" cy="700" r="200" fill="#ffd27a"/>
  </g>
  <rect width="1000" height="800" fill="url(#sheen)" opacity="0.5"/>`
  const sheen = `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`
  writeFileSync(out + 'dusk.svg', svg(1000, 800, 55, inner, sheen))
}

console.log('wrote art to', out)
