export const WHATSAPP = "18494789660"
export const INSTAGRAM = "____christian_noir"
export const GITHUB = "https://github.com/christianhola/plantillas-freebuff"
export const VIDEO_ID = "tKoDPOrLMX0"
export const SITE_URL = "https://christianhola.github.io/plantillas-freebuff/"

export function assetUrl(path: string) {
  if (/^(https?:)?\/\//.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`
}

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`
}

export function customRequest(name?: string, scope?: string) {
  const base = name
    ? `Hola NEXUS LABS 👋 Me interesa la plantilla «${name}» y quiero una versión personalizada.`
    : "Hola NEXUS LABS 👋 Quiero una versión personalizada de una plantilla."
  const detail = scope ? ` La quiero como ${scope.toLowerCase()}.` : ""
  return waLink(`${base}${detail} La vi en ${SITE_URL}`)
}

export function instagramLink() {
  return `https://instagram.com/${INSTAGRAM}`
}

export const SCOPES = [
  "Landing esencial",
  "Sitio completo",
  "Tienda con pagos",
  "App a medida",
] as const
