/*
  Drafts the "Test our AI" preview from a store hostname. It is deterministic
  (same URL, same preview) and runs in the Worker. Swap `buildPreview` for a
  call to your own model when you wire one up.
*/

export type PreviewMessage = { from: 'brand' | 'shopper'; text: string; product?: { name: string; price: string; tone: 'cobalt' | 'cherry' | 'saffron' } }

export type Preview = {
  host: string
  brand: string
  category: string
  shopper: string
  lift: number
  replyRate: number
  messages: PreviewMessage[]
}

const WORDS = ['coffee', 'roasters', 'tea', 'skin', 'care', 'beauty', 'wear', 'goods', 'supply', 'studio', 'shop', 'store', 'home', 'pet', 'co', 'labs', 'kitchen', 'apparel', 'knit', 'outdoor']

type Catalogue = { category: string; hero: string; heroPrice: string; pick: string; pickPrice: string; unit: string }

const CATALOGUES: { test: RegExp; c: Catalogue }[] = [
  { test: /coffee|roast|bean|tea|brew|cafe|espresso/, c: { category: 'Coffee & tea', hero: 'House Blend, 340g', heroPrice: '$18.00', pick: 'Single Origin Sampler', pickPrice: '$24.00', unit: 'bag' } },
  { test: /skin|beauty|glow|serum|cosmetic|care|balm|derm/, c: { category: 'Beauty', hero: 'Daily Serum, 30ml', heroPrice: '$38.00', pick: 'Night Balm', pickPrice: '$44.00', unit: 'bottle' } },
  { test: /wear|apparel|knit|cloth|thread|shoe|fashion|denim|tee/, c: { category: 'Apparel', hero: 'Everyday Tee', heroPrice: '$32.00', pick: 'Field Knit Sweater', pickPrice: '$88.00', unit: 'tee' } },
  { test: /pet|dog|cat|paw/, c: { category: 'Pet', hero: 'Salmon Bites, 200g', heroPrice: '$14.00', pick: 'Chew Toy Trio', pickPrice: '$19.00', unit: 'pack' } },
  { test: /food|snack|kitchen|bake|choc|sauce|spice/, c: { category: 'Food', hero: 'Pantry Box', heroPrice: '$42.00', pick: 'Hot Honey', pickPrice: '$12.00', unit: 'box' } },
]

const FALLBACK: Catalogue = { category: 'Ecommerce', hero: 'Your bestseller', heroPrice: '$29.00', pick: 'The add-on most people pick', pickPrice: '$15.00', unit: 'order' }

const NAMES = ['Jess', 'Sam', 'Priya', 'Leo', 'Maya', 'Noah', 'Ava', 'Theo']

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/** `havencoffee` → `Haven Coffee`, `fieldnote-skincare` → `Fieldnote Skincare`. */
export function brandFromHost(host: string) {
  const label = host.split('.')[0]
  const hyphenated = /[-_]/.test(label)
  const parts = label.split(/[-_]/).flatMap((part) => {
    if (hyphenated) return [part]
    for (const w of WORDS) {
      if (part.length > w.length + 2 && part.endsWith(w)) return [part.slice(0, -w.length), w]
    }
    return [part]
  })
  return parts
    .filter(Boolean)
    .map((p) => (p === 'co' ? 'Co.' : p[0].toUpperCase() + p.slice(1)))
    .join(' ')
}

export function buildPreview(host: string): Preview {
  const h = hash(host)
  const brand = brandFromHost(host)
  const c = CATALOGUES.find((x) => x.test.test(host))?.c ?? FALLBACK
  const shopper = NAMES[h % NAMES.length]
  return {
    host,
    brand,
    category: c.category,
    shopper,
    lift: 20 + (h % 15),
    replyRate: 31 + ((h >> 4) % 17),
    messages: [
      { from: 'brand', text: `Hi ${shopper}, it’s ${brand}. Your ${c.hero} should be running low. Want the same again? Reply YES.` },
      { from: 'shopper', text: 'YES' },
      { from: 'brand', text: `Done. ${c.heroPrice} on your saved card, shipping today. Shoppers like you also love this:`, product: { name: c.pick, price: c.pickPrice, tone: (['cobalt', 'cherry', 'saffron'] as const)[h % 3] } },
      { from: 'shopper', text: 'Does it come in a smaller size?' },
      { from: 'brand', text: `It does: a travel size for ${c.pickPrice === '$15.00' ? '$9.00' : 'a little less'}. Reply ADD and it joins today’s ${c.unit}.` },
    ],
  }
}
