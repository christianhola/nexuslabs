import type { Collection, Item, Kind } from '../content'
import { DAY, MONTH_NAMES, endOfDay, rangeLabel, startOfDay } from './dates'

/*
  Natural-language-ish search. `parseQuery` reads a sentence like
  "typography I saved about two weeks ago for the redesign" and pulls out
  filters it understands (dates, tags, collections, content types,
  favourites) as chips. Whatever words remain rank the results. Everything
  runs locally; swap `searchItems` for an embedding search when you have a
  backend.
*/

export type Chip =
  | { id: string; type: 'tag'; label: string; tag: string }
  | { id: string; type: 'date'; label: string; from: number; to: number }
  | { id: string; type: 'collection'; label: string; collectionId: string }
  | { id: string; type: 'kind'; label: string; kind: Kind }
  | { id: string; type: 'favourite'; label: string }

export type Parsed = { chips: Chip[]; terms: string[] }

const STOP = new Set(
  'i me my mine a an the that this those these some any saved save about around ago for from of to in on at with and or was were is it its stuff things thing something which what when where i\'ve ive had have from by into maybe roughly like kind sort bit few couple one those them back look looking find show me all'.split(' '),
)

const NUMBERS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, couple: 2, three: 3, few: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 }

const KIND_WORDS: Record<string, Kind> = {
  video: 'video', videos: 'video', film: 'video', films: 'video', clip: 'video', clips: 'video',
  article: 'article', articles: 'article', post: 'article', posts: 'article', essay: 'article', essays: 'article',
  image: 'image', images: 'image', picture: 'image', pictures: 'image', screenshot: 'image', screenshots: 'image',
  product: 'product', products: 'product',
  typeface: 'font', typefaces: 'font',
  tool: 'tool', tools: 'tool', app: 'tool', apps: 'tool',
}

const TAG_SYNONYMS: Record<string, string> = {
  font: 'typography', fonts: 'typography', type: 'typography', lettering: 'typography',
  color: 'colour', colors: 'colour', colours: 'colour',
  palettes: 'palette',
  photo: 'photography', photos: 'photography', photograph: 'photography', photographs: 'photography',
  plant: 'plants', chair: 'furniture', chairs: 'furniture',
  a11y: 'accessibility',
}

const FAV_WORDS = new Set(['favourite', 'favourites', 'favorite', 'favorites', 'starred', 'loved', 'fave', 'faves'])

export function tagVocabulary(items: Item[]) {
  return [...new Set(items.flatMap((i) => i.tags))].sort()
}

function rangeChip(from: Date, to: Date, label?: string): Chip {
  const f = startOfDay(from).getTime()
  const t = endOfDay(to).getTime()
  return { id: `date:${f}-${t}`, type: 'date', label: label ?? `saved ${rangeLabel(from, to)}`, from: f, to: t }
}

function parseDates(text: string, now: Date): { chip: Chip | null; rest: string } {
  const at = (n: number) => new Date(startOfDay(now).getTime() - n * DAY)
  const rules: Array<[RegExp, (m: RegExpMatchArray) => Chip | null]> = [
    [/\b(?:saved\s+)?today\b|\bthis morning\b/, () => rangeChip(now, now, 'saved today')],
    [/\byesterday\b/, () => rangeChip(at(1), at(1), 'saved yesterday')],
    [/\b(?:about|around|roughly)?\s*(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|couple(?: of)?|few)\s+(day|week|month)s?\s+ago\b/, (m) => {
      const n = /^\d+$/.test(m[1]) ? Number(m[1]) : NUMBERS[m[1].replace(' of', '')] ?? 1
      if (m[2] === 'day') return rangeChip(at(n + 1), at(Math.max(0, n - 1)))
      if (m[2] === 'week') return rangeChip(at(n * 7 + 6), at(Math.max(0, n * 7 - 6)))
      return rangeChip(at(n * 30 + 12), at(Math.max(0, n * 30 - 12)))
    }],
    [/\bthis week\b|\bthe past week\b|\blast few days\b/, () => rangeChip(at(6), now)],
    [/\blast week\b/, () => rangeChip(at(13), at(7))],
    [/\brecently\b|\blately\b/, () => rangeChip(at(13), now, 'saved in the last 2 weeks')],
    [/\bthis month\b/, () => rangeChip(new Date(now.getFullYear(), now.getMonth(), 1), now)],
    [/\blast month\b/, () => rangeChip(new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0))],
    [new RegExp(`\\b(?:in|during|back in)\\s+(may)\\b|\\b(?:in|during|back in)?\\s*(${MONTH_NAMES.filter((m) => m !== 'may').join('|')}|${MONTH_NAMES.map((m) => m.slice(0, 3)).filter((m) => m !== 'may').join('|')})\\b`), (m) => {
      m[1] = m[1] ?? m[2]
      const idx = MONTH_NAMES.findIndex((name) => name.startsWith(m[1]))
      if (idx < 0) return null
      const year = idx > now.getMonth() ? now.getFullYear() - 1 : now.getFullYear()
      const from = new Date(year, idx, 1)
      const to = new Date(year, idx + 1, 0)
      return rangeChip(from, to > now ? now : to, `saved in ${from.toLocaleDateString('en-GB', { month: 'long' })}`)
    }],
  ]
  for (const [re, make] of rules) {
    const m = text.match(re)
    if (!m) continue
    const chip = make(m)
    if (chip) return { chip, rest: text.replace(m[0], ' ') }
  }
  return { chip: null, rest: text }
}

export function parseQuery(raw: string, items: Item[], collections: Collection[], now = new Date()): Parsed {
  let text = ` ${raw.toLowerCase().replace(/[“”"’,.!?]/g, ' ').replace(/'/g, '')} `
  const chips: Chip[] = []
  const push = (c: Chip) => {
    if (!chips.some((x) => x.id === c.id)) chips.push(c)
  }

  // Explicit syntax first: tag:foo, in:collection
  text = text.replace(/\btag:([\w-]+)/g, (_, t: string) => {
    push({ id: `tag:${t}`, type: 'tag', label: `tag: ${t}`, tag: t })
    return ' '
  })

  // Collections by full name ("for the website redesign")
  for (const c of [...collections].sort((a, b) => b.name.length - a.name.length)) {
    const name = c.name.toLowerCase()
    if (text.includes(` ${name} `)) {
      push({ id: `col:${c.id}`, type: 'collection', label: c.name, collectionId: c.id })
      text = text.replace(name, ' ')
    }
  }

  const dates = parseDates(text, now)
  if (dates.chip) push(dates.chip)
  text = dates.rest

  const tags = new Set(tagVocabulary(items))
  const colWords = new Map<string, Collection>()
  for (const c of collections) {
    for (const w of c.name.toLowerCase().split(/\s+/)) if (w.length >= 4 && !STOP.has(w) && !tags.has(w)) colWords.set(w, c)
  }

  const terms: string[] = []
  for (const w of text.split(/\s+/).filter(Boolean)) {
    if (FAV_WORDS.has(w)) {
      push({ id: 'fav', type: 'favourite', label: 'Favourites' })
      continue
    }
    if (KIND_WORDS[w]) {
      const kind = KIND_WORDS[w]
      push({ id: `kind:${kind}`, type: 'kind', label: `type: ${kind === 'font' ? 'typeface' : kind}`, kind })
      continue
    }
    const tag = tags.has(w) ? w : TAG_SYNONYMS[w] && tags.has(TAG_SYNONYMS[w]) ? TAG_SYNONYMS[w] : w.endsWith('s') && tags.has(w.slice(0, -1)) ? w.slice(0, -1) : null
    if (tag) {
      push({ id: `tag:${tag}`, type: 'tag', label: `tag: ${tag}`, tag })
      continue
    }
    const col = colWords.get(w) ?? (w.endsWith('s') ? colWords.get(w.slice(0, -1)) : undefined)
    if (col) {
      push({ id: `col:${col.id}`, type: 'collection', label: col.name, collectionId: col.id })
      continue
    }
    if (STOP.has(w) || w.length < 2) continue
    terms.push(w)
  }
  const order = { tag: 0, kind: 1, date: 2, favourite: 3, collection: 4 }
  chips.sort((a, b) => order[a.type] - order[b.type])
  return { chips, terms }
}

function domain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function matchesChip(item: Item, chip: Chip) {
  switch (chip.type) {
    case 'tag':
      return item.tags.includes(chip.tag)
    case 'date': {
      const t = new Date(item.savedAt).getTime()
      return t >= chip.from && t <= chip.to
    }
    case 'collection':
      return item.collectionId === chip.collectionId
    case 'kind':
      return item.kind === chip.kind
    case 'favourite':
      return item.favourite
  }
}

export type Hit = { item: Item; score: number }

/** Hard-filter by every active chip, then rank by the remaining words. */
export function searchItems(items: Item[], parsed: Parsed, off: Set<string> = new Set()): Hit[] {
  const active = parsed.chips.filter((c) => !off.has(c.id))
  const hits: Hit[] = []
  for (const item of items) {
    if (!active.every((c) => matchesChip(item, c))) continue
    let score = 0
    if (parsed.terms.length) {
      const fields: Array<[string, number]> = [
        [item.title, 3],
        [item.tags.join(' '), 2],
        [item.note, 2],
        [item.why, 2],
        [domain(item.url), 1],
      ]
      for (const term of parsed.terms) {
        const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')
        for (const [text, weight] of fields) if (re.test(text)) score += weight
      }
      if (score === 0) continue
    }
    hits.push({ item, score })
  }
  return hits.sort((a, b) => b.score - a.score || b.item.savedAt.localeCompare(a.item.savedAt))
}

export { domain }
