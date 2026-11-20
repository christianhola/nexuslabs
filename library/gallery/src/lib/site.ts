export const CONTACT_EMAIL = "info@nexviro.art"
export const CONTACT_EMAIL_ALT = "meridian@nexviro.art"
export const WHATSAPP = "18494789660"
export const WHATSAPP_LABEL = "+1 849 478 9660"
export const INSTAGRAM = "____christian_noir"
export const GITHUB = "https://github.com/christianhola/nexuslabs"
export const VIDEO_ID = "tKoDPOrLMX0"
export const SITE_URL = "https://christianhola.github.io/nexuslabs/"

export function assetUrl(path: string) {
  if (/^(https?:)?\/\//.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`
}

export function mailLink(message: string, subject = "NEXUS LABS · Nueva consulta") {
  return `mailto:${CONTACT_EMAIL}?cc=${encodeURIComponent(CONTACT_EMAIL_ALT)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
}

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`
}

function requestMessage(name?: string, scope?: string) {
  const base = name
    ? `Hola NEXUS LABS 👋 Me interesa la plantilla «${name}» y quiero una versión personalizada.`
    : "Hola NEXUS LABS 👋 Quiero una versión personalizada de una plantilla."
  const detail = scope ? ` La quiero como ${scope.toLowerCase()}.` : ""
  return `${base}${detail} La vi en ${SITE_URL}`
}

export function customRequest(name?: string, scope?: string) {
  return mailLink(
    requestMessage(name, scope),
    name ? `NEXUS LABS · ${name}` : "NEXUS LABS · Versión personalizada"
  )
}

export function customRequestWhatsApp(name?: string, scope?: string) {
  return waLink(requestMessage(name, scope))
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
