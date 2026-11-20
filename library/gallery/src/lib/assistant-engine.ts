import { data, type Template } from "@/lib/data"
import { CONTACT_EMAIL, CONTACT_EMAIL_ALT, SCOPES } from "@/lib/site"

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export type AssistantCard = {
  id: string
  name: string
  industry: string
  kindLabel: string
  preview: string
  to: string
  demo: string
}

export type ToolRun = {
  id: string
  name: string
  label: string
  detail: string
}

export type PlanLink = { label: string; to: string }

export type AssistantAction =
  | { kind: "narrate"; label: string }
  | { kind: "mail"; label: string; message: string; subject: string }

export type AssistantPlan = {
  intent: string
  reasoning: string[]
  tools: ToolRun[]
  text: string
  spoken: string
  cards: AssistantCard[]
  links: PlanLink[]
  followUps: string[]
  action?: AssistantAction
}

export type HistoryTurn = { role: "user" | "assistant"; text: string }

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const fold = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9@.]+/g, " ")
    .trim()

function makeRng(seed: number) {
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

type Rng = () => number

const pick = <T,>(rng: Rng, items: readonly T[]): T =>
  items[Math.floor(rng() * items.length) % items.length]

const shuffle = <T,>(rng: Rng, items: readonly T[]): T[] => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

const normalizeSpace = (value: string) => value.replace(/\s+/g, " ").trim()

const join = (...parts: Array<string | undefined | false>) =>
  normalizeSpace(parts.filter(Boolean).join(" "))

function card(template: Template): AssistantCard {
  return {
    id: template.id,
    name: template.name,
    industry: template.industryShort,
    kindLabel: template.kindLabel,
    preview: template.preview,
    to: `/plantillas/${template.id}`,
    demo: template.href,
  }
}

const byIndustry = (short: string) =>
  data.items.filter((item) => item.industryShort === short)

const industries = data.industries.map((industry) => industry.short)

const sectorCopy: Record<string, { blurb: string; examples: string[] }> = {
  Restaurantes: {
    blurb: "cartas, reservas y pedidos",
    examples: ["menú de temporada", "reservas de mesa", "pedidos a domicilio"],
  },
  Hoteles: {
    blurb: "habitaciones, experiencias y reservas",
    examples: ["suite y spa", "guía del barrio", "chárter de yates"],
  },
  Tiendas: {
    blurb: "catálogo, ficha de producto y checkout",
    examples: ["marca de skincare", "taller artesanal", "producto digital"],
  },
  Inmobiliaria: {
    blurb: "propiedades y proyectos con narrativa editorial",
    examples: ["listado con filtros", "estudio de arquitectura", "showroom de interiorismo"],
  },
  SaaS: {
    blurb: "landing, panel y precios de producto",
    examples: ["analítica de producto", "herramienta para devs", "app de escritorio"],
  },
  Educación: {
    blurb: "admisiones, cursos y plataformas",
    examples: ["escuela online", "cursos con reproductor", "planificador de estudio"],
  },
  Eventos: {
    blurb: "agendas, carteleras y boletas",
    examples: ["conferencia con ponentes", "temporada de teatro", "maratón de ciudad"],
  },
  Portafolios: {
    blurb: "trabajo al frente, sin ruido alrededor",
    examples: ["portafolio personal", "agencia creativa", "blog editorial"],
  },
  Causas: {
    blurb: "campañas, donaciones e historias",
    examples: ["campaña de reciclaje", "historia de datos", "recaudación"],
  },
  Apps: {
    blurb: "herramientas y juegos dentro del navegador",
    examples: ["gestor de tareas", "juego voxel", "app de seguimiento"],
  },
}

const sectorKeywords: Array<{ short: string; words: string[] }> = [
  { short: "Restaurantes", words: ["restaurante", "bar", "cafeteria", "cafe", "comida", "cocina", "gastronomia", "pizzeria", "burger", "menu", "chef"] },
  { short: "Hoteles", words: ["hotel", "hostal", "hostel", "resort", "viaje", "viajes", "turismo", "spa", "retiro", "yate", "villa", "alojamiento", "booking", "reserva"] },
  { short: "Tiendas", words: ["tienda", "ecommerce", "comercio", "producto", "productos", "shop", "carrito", "catalogo", "marca", "skincare", "ropa", "joyas", "artesania"] },
  { short: "Inmobiliaria", words: ["inmobiliaria", "inmueble", "propiedad", "propiedades", "arquitectura", "arquitecto", "interior", "interiorismo", "showroom", "piso", "apartamento"] },
  { short: "SaaS", words: ["saas", "startup", "software", "fintech", "analitica", "panel", "dashboard", "producto digital", "herramienta", "api", "b2b"] },
  { short: "Educación", words: ["curso", "cursos", "escuela", "academia", "educacion", "profesor", "estudiantes", "formacion", "clase", "universidad"] },
  { short: "Eventos", words: ["evento", "eventos", "concierto", "teatro", "boda", "conferencia", "maraton", "festival", "boleteria", "boletas", "agenda cultural"] },
  { short: "Portafolios", words: ["portafolio", "portfolio", "fotografo", "disenador", "estudio", "agencia", "artista", "blog", "freelance", "marca personal"] },
  { short: "Causas", words: ["ong", "fundacion", "causa", "donacion", "donaciones", "voluntariado", "social", "caridad", "ambiente", "clima", "reciclaje"] },
  { short: "Apps", words: ["juego", "jugar", "juegos", "app", "aplicacion", "multijugador", "productividad", "tareas", "habitos", "herramienta web"] },
]

function detectSector(text: string) {
  const value = ` ${fold(text)} `
  let best: { short: string; hits: number } | null = null
  for (const sector of sectorKeywords) {
    let hits = 0
    for (const word of sector.words) {
      if (value.includes(` ${word} `) || value.includes(`${word} `) || value.includes(` ${word}`)) {
        hits += word.includes(" ") ? 3 : 2
      }
    }
    if (hits && (!best || hits > best.hits)) best = { short: sector.short, hits }
  }
  return best?.short
}

function findNamedTemplates(text: string) {
  const value = ` ${fold(text)} `
  const found: Template[] = []
  for (const template of data.items) {
    const name = fold(template.name)
    if (name.length < 4) continue
    if (value.includes(` ${name} `) || value.includes(` ${name}`)) found.push(template)
  }
  return found
}

function templateLine(template: Template) {
  const firstFeature = template.features[0]
  return `${template.name} — ${template.industry.toLowerCase()}${firstFeature ? `, con ${firstFeature}` : ""}`
}

function picks(rng: Rng, templates: Template[], count: number) {
  const featured = templates.filter((item) => item.featured)
  const pool = featured.length >= count ? featured : templates
  return shuffle(rng, pool).slice(0, count)
}

/* ------------------------------------------------------------------ */
/* Intenciones                                                         */
/* ------------------------------------------------------------------ */

type Built = {
  text: string
  spoken?: string
  tools?: ToolRun[]
  cards?: AssistantCard[]
  links?: PlanLink[]
  followUps?: string[]
  action?: AssistantAction
}

type Builder = (ctx: {
  rng: Rng
  raw: string
  text: string
  history: HistoryTurn[]
  sector?: string
}) => Built

const openings = {
  pricing: [
    "Aquí no hay una tarifa de catálogo, y es a propósito.",
    "El precio no sale de la plantilla: sale del alcance.",
    "Te lo digo sin rodeos: no publicamos una lista de precios.",
  ],
  timeline: [
    "Depende del alcance, pero hay un orden claro.",
    "El plazo se cierra antes de empezar, no a mitad del trabajo.",
    "Cada tipo de entrega tiene un ritmo distinto.",
  ],
  catalog: [
    "Sí, y hay bastante donde elegir.",
    "El catálogo está pensado para eso.",
    "Te ahorro el recorrido: hay una ficha para casi todo.",
  ],
  payments: [
    "Las demos se recorren, pero no cobran por sí solas.",
    "Eso se conecta en tu versión, no en la demo.",
    "La pasarela no viene puesta: se integra con tu cuenta.",
  ],
  domain: [
    "Sí, el dominio es tuyo y queda a tu nombre.",
    "Publicar es la parte fácil; la decisión es dónde.",
    "Puedes quedarte con todo el control técnico.",
  ],
  licenses: [
    "Los créditos importan, y aquí se conservan.",
    "Te lo explico claro porque hay letra pequeña en otros catálogos.",
    "Cada plantilla mantiene la autoría de su diseño original.",
  ],
  comments: [
    "Los comentarios están abiertos y no pasan por ningún servidor.",
    "Puedes dejar tu opinión con una foto de tu portátil si quieres.",
    "Esa página funciona sin cuenta.",
  ],
  contact: [
    "Lo más rápido es un correo, y llega a una persona.",
    "Puedes escribir o reservar una llamada.",
    "Te doy la vía directa.",
  ],
  assistant: [
    "Sí, puedo hablar y escuchar en este navegador.",
    "La voz está activada en esta misma página.",
    "Además de escribir, puedes dictarme la pregunta.",
  ],
  sector: [
    "Para ese sector hay material concreto.",
    "Eso encaja en una industria que ya está cubierta.",
    "Hay varias fichas que van justo a eso.",
  ],
  quality: [
    "Se revisa antes de entregar, no después.",
    "La calidad aquí significa tres cosas medibles.",
    "No es solo que se vea bien.",
  ],
  process: [
    "El proceso tiene cinco tramos y ninguno es sorpresa.",
    "Trabajamos por hitos, con algo que ver en cada uno.",
    "Nada empieza sin alcance por escrito.",
  ],
  stack: [
    "El stack es deliberadamente aburrido.",
    "Sin frameworks exóticos: lo que sobrevive a una migración.",
    "La base es estática y rápida por defecto.",
  ],
  support: [
    "Después de publicar no te quedas solo.",
    "Hay dos formas de acompañarte tras la entrega.",
    "El mantenimiento se acuerda aparte, sin letra pequeña.",
  ],
  templatesCustom: [
    "Se puede partir de una plantilla y llevarla a tu terreno.",
    "Ninguna plantilla está cerrada.",
    "Casi todo lo que ves se puede volver tu versión.",
  ],
  compare: [
    "Se parecen en la base y se diferencian en el tono.",
    "Buena pregunta: la diferencia no es estética.",
    "Depende de qué quieras que haga el visitante.",
  ],
  thanks: [
    "A ti.",
    "Gracias por mirar con calma.",
    "Un placer.",
  ],
} as const

const INTENTS: Array<{ id: string; words: string[]; build: Builder }> = [
  {
    id: "pricing",
    words: ["precio", "precios", "cuanto cuesta", "cuanto vale", "tarifa", "tarifas", "presupuesto", "cobran", "coste", "costo", "caro", "barato", "pagar por", "inversion"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.pricing),
        "El punto de partida son cuatro alcances:",
        `${SCOPES[0]} (una página, una idea, tu identidad); ${SCOPES[1].toLowerCase()} (entre cinco y ocho páginas con navegación y fichas); ${SCOPES[2].toLowerCase()} (catálogo, carrito, checkout y pasarela); y ${SCOPES[3].toLowerCase()} (cuentas, datos y panel).`,
        "Lo que mueve el número es el contenido que hay que producir, las integraciones y las cuentas que necesites, no el número de secciones.",
        "Si me dices el tipo de negocio y si hay pagos o reservas, puedo orientarte mejor y el estudio te responde con alcance y precio cerrados por correo."
      ),
      tools: [
        { id: "scopes", name: "leer_alcances", label: "Reviso los cuatro alcances", detail: `${SCOPES.length} tramos · sin tarifa fija publicada` },
        { id: "budget", name: "estimar_esfuerzo", label: "Estimo el esfuerzo por integraciones", detail: "contenido + integraciones + cuentas" },
      ],
      followUps: ["¿Qué incluye el sitio completo?", "¿Cuánto tarda una tienda?", "Quiero un presupuesto por correo"],
      action: {
        kind: "mail",
        label: "Pedir presupuesto por correo",
        message: "Hola NEXUS LABS 👋 Quiero un presupuesto. Mi negocio es … y necesito … (pagos / reservas / cuentas).",
        subject: "NEXUS LABS · Presupuesto",
      },
    }),
  },
  {
    id: "timeline",
    words: ["plazo", "plazos", "cuanto tarda", "cuanto tiempo", "entrega", "entregas", "urgencia", "urgente", "semanas", "dias", "demora", "cuando estaria"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.timeline),
        "Una landing con tu identidad es un trabajo corto; un sitio completo necesita algo más de margen; una tienda con pagos o una app con cuentas piden más recorrido porque hay pruebas de por medio.",
        "El calendario se cierra antes de empezar, por escrito, junto al alcance: así el plazo no se negocia a mitad del proyecto.",
        "En la página de proceso cuento cómo se reparte el trabajo y qué recibes en cada hito."
      ),
      links: [{ label: "Ver el proceso", to: "/proceso" }],
      tools: [
        { id: "process", name: "leer_proceso", label: "Consulto el proceso de entrega", detail: "5 hitos · alcance antes de empezar" },
      ],
      followUps: ["¿Qué incluye cada hito?", "¿Cuánto tarda una tienda con pagos?", "Reservar una llamada"],
    }),
  },
  {
    id: "catalog",
    words: ["plantilla", "plantillas", "catalogo", "demo", "demos", "ejemplo", "ejemplos", "opciones", "que tienes", "que hay"],
    build: ({ rng, sector }) => {
      if (sector) return sectorReply(rng, sector)
      const sample = picks(rng, data.items, 3)
      return {
        text: join(
          pick(rng, openings.catalog),
          `Hay ${data.total} plantillas completas repartidas en ${data.industries.length} industrias: ${industries.slice(0, 5).join(", ")} y el resto.`,
          `Por ejemplo ${sample.map(templateLine).join("; ")}.`,
          "Cada ficha trae la demo real, lo que incluye y lo que hay que conectar para producción.",
          "Dime tu oficio y te digo por dónde empezar sin dar vueltas."
        ),
        cards: sample.map(card),
        tools: [
          { id: "catalog", name: "leer_catalogo", label: "Recorro el catálogo", detail: `${data.total} plantillas · ${data.industries.length} industrias` },
          { id: "pick", name: "seleccionar_destacadas", label: "Elijo tres puntos de entrada", detail: sample.map((item) => item.name).join(", ") },
        ],
        followUps: ["¿Qué hay para un hotel?", "Enséñame algo para una tienda", "¿Hay juegos jugables?"],
      }
    },
  },
  {
    id: "sector",
    words: [],
    build: ({ rng, sector }) => sectorReply(rng, sector ?? "SaaS"),
  },
  {
    id: "payments",
    words: ["pago", "pagos", "pagar", "pasarela", "stripe", "paypal", "cobro", "cobrar", "carrito", "checkout", "suscripcion", "suscripciones", "facturacion", "tienda online"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.payments),
        "En la demo todo es interfaz: puedes recorrer el carrito, el checkout o el formulario de reservas, pero no sale dinero ni un correo porque GitHub Pages no ejecuta backend.",
        "En tu versión se conecta la pasarela que uses —Stripe, PayPal u otra— con tu cuenta y tus claves, y se prueba el flujo completo antes de publicar, incluidos los correos de confirmación.",
        "Si además necesitas stock, envíos o suscripciones, eso se decide en el alcance y cambia la estimación."
      ),
      tools: [
        { id: "checkout", name: "revisar_checkout", label: "Reviso qué falta para cobrar", detail: "pasarela + cuenta + pruebas de extremo a extremo" },
        { id: "integrations", name: "leer_integraciones", label: "Consulto integraciones disponibles", detail: "Stripe · PayPal · correo transaccional" },
      ],
      followUps: ["¿Cómo se prueba un pago?", "¿Qué plantilla ya trae carrito?", "Pedir presupuesto por correo"],
    }),
  },
  {
    id: "domain",
    words: ["dominio", "hosting", "publicar", "publicacion", "netlify", "vercel", "cloudflare", "github pages", "servidor", "donde vive", "deploy", "desplegar"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.domain),
        "El sitio se publica en el hosting que prefieras —Cloudflare, Vercel, Netlify o el que ya uses— y apunta a tu dominio, con HTTPS y las redirecciones bien puestas.",
        "Si quieres, te entrego el repositorio, el dominio y las cuentas a tu nombre: te quedas con el control técnico completo.",
        "Esta galería vive en GitHub Pages solo como escaparate del catálogo."
      ),
      tools: [
        { id: "hosting", name: "revisar_despliegue", label: "Reviso opciones de publicación", detail: "Cloudflare · Vercel · Netlify · dominio propio" },
      ],
      followUps: ["¿Quién paga el hosting?", "¿Puedo usar mi dominio actual?", "¿Cómo se entrega el código?"],
    }),
  },
  {
    id: "licenses",
    words: ["licencia", "licencias", "derecho", "derechos", "autor", "autores", "credito", "creditos", "copia", "copiar", "legal", "propiedad", "copyright", "puedo revender"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.licenses),
        "Cada plantilla del catálogo conserva los créditos y la licencia de su diseño original; la página de créditos dice de dónde viene cada base.",
        "La versión que encargas se construye sobre esa base con permiso y atribución, y el acuerdo de uso —qué puedes revender y qué no— se cierra por escrito antes de empezar.",
        "El código de tu proyecto y tus contenidos son tuyos; lo que no se puede es quitar la autoría del diseño de origen."
      ),
      tools: [
        { id: "credits", name: "revisar_creditos", label: "Reviso créditos y licencias", detail: "autoría original conservada en cada ficha" },
      ],
      links: [{ label: "Ver créditos", to: "/creditos" }],
      followUps: ["¿Puedo usar la plantilla para un cliente?", "¿Se quita la atribución?", "¿El código es mío?"],
    }),
  },
  {
    id: "comments",
    words: ["comentario", "comentarios", "opinion", "opiniones", "resena", "resenas", "foto", "fotos", "imagen", "subir", "google drive", "captura", "testimonio"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.comments),
        "Puedes dejar tu opinión y adjuntar una foto de tu portátil o un enlace de Google Drive; la imagen se reduce en el navegador y se guarda solo ahí.",
        "No viaja a ningún servidor y puedes borrar tu comentario cuando quieras, sin recargar la página.",
        "Si prefieres contarlo en privado, el correo del estudio es mejor sitio."
      ),
      tools: [
        { id: "comments", name: "leer_comentarios", label: "Reviso la página de comentarios", detail: "opinión + foto o enlace · guardado local" },
      ],
      links: [{ label: "Abrir comentarios", to: "/comentarios" }],
      followUps: ["¿Se guarda mi foto?", "¿Puedo borrar mi comentario?", "¿Dónde leo las opiniones?"],
    }),
  },
  {
    id: "contact",
    words: ["whatsapp", "correo", "email", "contacto", "contactar", "hablar", "escribir", "llamar", "agenda", "cita", "reunion", "telefono", "info@", "meridian@", "presupuesto por correo"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.contact),
        `Escribe a ${CONTACT_EMAIL}, con copia a ${CONTACT_EMAIL_ALT}. El mensaje sale ya redactado: solo tienes que pulsar enviar.`,
        "Si prefieres una llamada, en la página de contacto puedes elegir fecha y hora.",
        "Respondemos en horario de estudio; las consultas del asistente llegan al mismo buzón."
      ),
      tools: [
        { id: "mail", name: "redactar_correo", label: "Preparo el correo de contacto", detail: `${CONTACT_EMAIL} · cc ${CONTACT_EMAIL_ALT}` },
      ],
      links: [{ label: "Ver contacto y agenda", to: "/contacto" }],
      action: {
        kind: "mail",
        label: "Escribir a NEXUS LABS",
        message: "Hola NEXUS LABS 👋 Vengo del asistente y quiero contarles mi proyecto. Mi negocio es … y necesito …",
        subject: "NEXUS LABS · Consulta desde el asistente",
      },
      followUps: ["Reservar una llamada", "¿En cuánto responden?", "Quiero una versión a medida"],
    }),
  },
  {
    id: "assistant",
    words: ["voz", "microfono", "hablar contigo", "puedes hablar", "escuchar", "dictar", "asistente", "eres un bot", "eres una ia", "inteligencia artificial", "modelo", "gpt", "gemini", "como funcionas", "quien eres"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.assistant),
        "Pulsa el botón de voz y te escucho; puedo mantener la conversación hablada mientras recorro el catálogo por ti.",
        "Trabajo con el catálogo real de las 88 plantillas y con la información del estudio: busco fichas, comparo opciones y te dejo el correo listo cuando toca hablar con una persona.",
        "Si algo no está en esa base, te lo digo en vez de inventarlo."
      ),
      tools: [
        { id: "voice", name: "estado_de_voz", label: "Compruebo micrófono y síntesis", detail: "reconocimiento + voz en el navegador" },
        { id: "catalog", name: "leer_catalogo", label: "Cargo el catálogo", detail: `${data.total} plantillas disponibles` },
      ],
      action: { kind: "narrate", label: "Escuchar la presentación del estudio" },
      followUps: ["¿Qué puedes hacer?", "Preséntame la empresa", "¿Cómo buscas en el catálogo?"],
    }),
  },
  {
    id: "quality",
    words: ["responsive", "movil", "accesibilidad", "accesible", "rendimiento", "velocidad", "seo", "optimizacion", "core web vitals", "lighthouse", "navegadores", "tablet"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.quality),
        "Que se vea bien en móvil, tablet y escritorio; que se pueda recorrer con teclado y con lector de pantalla; y que cargue rápido con imágenes optimizadas y sin scripts de sobra.",
        "En la entrega se revisan las tres cosas antes de publicar, no se dejan para el final.",
        "El SEO técnico —títulos, descripciones, datos estructurados, sitemap— va incluido en el sitio completo."
      ),
      tools: [
        { id: "audit", name: "revisar_calidad", label: "Reviso la lista de calidad", detail: "móvil · teclado · peso de página · metadatos" },
      ],
      followUps: ["¿Incluye SEO?", "¿Funciona sin JavaScript?", "¿Qué navegadores soportan?"],
    }),
  },
  {
    id: "process",
    words: ["proceso", "como funciona", "como trabajan", "como se hace", "metodologia", "hitos", "fases", "brief", "revisiones", "como empiezo", "empezar"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.process),
        "Primero el brief: qué vendes, a quién y qué tiene que pasar cuando alguien entra.",
        "Después el alcance por escrito con lo que entra y lo que no, la dirección visual y los textos, la construcción, y una revisión de calidad en móvil, teclado y velocidad antes de publicar.",
        "Al cerrar recibes el sitio funcionando y los accesos a tu nombre."
      ),
      tools: [
        { id: "process", name: "leer_proceso", label: "Consulto los hitos del proyecto", detail: "brief → alcance → diseño → build → QA" },
      ],
      links: [{ label: "Ver el proceso completo", to: "/proceso" }],
      followUps: ["¿Cuántas revisiones incluye?", "¿Qué necesitan de mí?", "Reservar una llamada"],
    }),
  },
  {
    id: "stack",
    words: ["tecnologia", "stack", "react", "next", "vite", "tailwind", "typescript", "wordpress", "codigo", "framework", "base de datos", "cms"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.stack),
        "React y TypeScript para la interfaz, Tailwind para el sistema visual, y una base estática o un runtime ligero según lo que necesite el proyecto.",
        "Para datos y cuentas se elige la pieza mínima que aguante: base gestionada, autenticación y almacenamiento de archivos, sin montar más infraestructura de la necesaria.",
        "Si tu equipo ya tiene un stack, se respeta: la entrega se adapta a lo que puedas mantener."
      ),
      tools: [
        { id: "stack", name: "leer_stack", label: "Reviso el stack de referencia", detail: "React · TypeScript · Tailwind · runtime ligero" },
      ],
      followUps: ["¿Se entrega el código?", "¿Puedo editarlo yo?", "¿Usan WordPress?"],
    }),
  },
  {
    id: "support",
    words: ["mantenimiento", "soporte", "despues de entregar", "actualizaciones", "cambios", "formacion", "capacitacion", "garantia", "arreglar", "bug"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.support),
        "Hay dos formas de seguir: una bolsa de horas para cambios puntuales o un mantenimiento mensual con actualizaciones, copias y pequeñas mejoras.",
        "La formación va incluida: una sesión para que puedas editar textos e imágenes sin depender de nadie.",
        "Los errores de lo entregado se corrigen sin coste dentro del periodo acordado."
      ),
      tools: [
        { id: "support", name: "revisar_soporte", label: "Reviso las opciones de soporte", detail: "bolsa de horas · mantenimiento mensual · formación" },
      ],
      followUps: ["¿Cuánto cuesta el mantenimiento?", "¿Puedo editar los textos?", "Pedir presupuesto por correo"],
    }),
  },
  {
    id: "templatesCustom",
    words: ["personalizar", "personalizada", "a medida", "modificar", "adaptar", "mi marca", "mi logo", "mis colores", "cambiar", "version propia", "encargar"],
    build: ({ rng, sector }) => {
      const sample = sector ? picks(rng, byIndustry(sector), 2) : picks(rng, data.items, 2)
      return {
        text: join(
          pick(rng, openings.templatesCustom),
          "Se cambia la identidad —tipografía, color, fotografía y textos— y se ajustan las secciones que hagan falta; si el proyecto pide algo que la base no tiene, se construye encima.",
          sample.length ? `Un punto de partida razonable sería ${sample.map((item) => item.name).join(" o ")}.` : "",
          "Cuéntame el negocio y qué quieres que haga el visitante, y el estudio responde con alcance, plazo y precio por correo."
        ),
        cards: sample.map(card),
        tools: [
          { id: "scope", name: "calcular_alcance", label: "Calculo qué hay que tocar", detail: "identidad + secciones + integraciones" },
          { id: "mail", name: "redactar_correo", label: "Preparo la solicitud", detail: `${CONTACT_EMAIL}` },
        ],
        followUps: ["¿Cuánto tarda una versión propia?", "¿Puedo cambiar solo los textos?", "Pedir presupuesto por correo"],
        action: {
          kind: "mail",
          label: "Pedir mi versión por correo",
          message: `Hola NEXUS LABS 👋 Me interesa una versión personalizada${sample[0] ? ` de «${sample[0].name}»` : ""}. Mi negocio es … y quiero …`,
          subject: "NEXUS LABS · Versión personalizada",
        },
      }
    },
  },
  {
    id: "compare",
    words: [],
    build: ({ rng, history, text }) => {
      const named = findNamedTemplates(text)
      const previous = history.length ? findNamedTemplates(history.filter((turn) => turn.role === "assistant").map((turn) => turn.text).join(" ")) : []
      const chosen = named.length >= 2 ? named.slice(0, 3) : [...named, ...previous].slice(0, 2)
      if (chosen.length < 2) {
        const sample = picks(rng, data.items.filter((item) => item.featured), 2)
        return {
          text: join(
            "Si me dices los dos nombres, los comparo punto por punto. Mientras tanto, un criterio útil:",
            "mira qué tiene que hacer el visitante —reservar, comprar, leer o contactar— y elige la plantilla que ya esté resuelta en ese gesto.",
            `Con esa lógica, ${sample[0].name} y ${sample[1].name} son buenos ejemplos de dos caminos distintos.`
          ),
          cards: sample.map(card),
          tools: [{ id: "compare", name: "comparar_plantillas", label: "Comparo dos fichas del catálogo", detail: sample.map((item) => item.name).join(" vs ") }],
          followUps: ["Compara dos plantillas de hotel", "¿Cuál es más rápida de lanzar?", "Ver todo el catálogo"],
        }
      }
      const [first, second] = chosen
      return {
        text: join(
          pick(rng, openings.compare),
          `${first.name} va por ${first.industry.toLowerCase()} y ${first.features.slice(0, 3).join(", ")}.`,
          `${second.name} también es ${second.industry.toLowerCase()}, pero su fuerza está en ${second.features.slice(0, 3).join(", ")}.`,
          first.kind === second.kind
            ? "Las dos son del mismo tipo de entrega, así que la decisión es de tono y de contenido."
            : `${first.name} es ${first.kindLabel.toLowerCase()} y ${second.name}, ${second.kindLabel.toLowerCase()}: eso cambia lo que puedes pedirle a cada una.`,
          "Ábrelas en paralelo y quédate con la que resuelva antes el gesto principal."
        ),
        cards: chosen.map(card),
        tools: [{ id: "compare", name: "comparar_plantillas", label: "Comparo las dos fichas", detail: `${first.name} vs ${second.name}` }],
        followUps: [`¿Qué necesita ${first.name} para producción?`, `Enséñame la demo de ${second.name}`, "Pedir las dos por correo"],
      }
    },
  },
  {
    id: "games",
    words: ["juego", "juegos", "jugar", "multijugador", "arcade", "voxel", "orbit", "coil", "canvas"],
    build: ({ rng }) => {
      const games = data.items.filter((item) => item.kind === "game" || item.tags.includes("game") || item.tags.includes("multiplayer"))
      const sample = picks(rng, games.length ? games : byIndustry("Apps"), 3)
      return {
        text: join(
          "Hay juegos que se pueden jugar de verdad dentro del navegador.",
          sample.length ? `Ahora mismo: ${sample.map((item) => `${item.name} (${item.features.slice(0, 2).join(", ")})`).join("; ")}.` : "",
          "Los multijugador guardan la partida en el dispositivo por defecto; para jugar entre varias personas de verdad hace falta un servicio de tiempo real, y eso se conecta en tu versión.",
          "Puedes abrirlos desde la ficha y probarlos sin instalar nada."
        ),
        cards: sample.map(card),
        tools: [
          { id: "games", name: "buscar_juegos", label: "Busco demos jugables", detail: `${sample.length} títulos con canvas interactivo` },
        ],
        followUps: ["¿Orbit es multijugador real?", "¿Cómo se conecta el tiempo real?", "¿Hay más juegos?"],
      }
    },
  },
  {
    id: "thanks",
    words: ["gracias", "genial", "perfecto", "vale", "listo", "adios", "hasta luego", "buenisimo"],
    build: ({ rng }) => ({
      text: join(
        pick(rng, openings.thanks),
        "Si quieres el siguiente paso, te dejo el correo listo o nos vemos en la página de contacto para elegir una fecha.",
        "Y si te surge otra duda, aquí sigo."
      ),
      tools: [{ id: "mail", name: "redactar_correo", label: "Dejo el correo preparado", detail: `${CONTACT_EMAIL}` }],
      followUps: ["Ver el catálogo", "Hablar con una persona", "Escuchar la presentación"],
      action: {
        kind: "mail",
        label: "Escribir a NEXUS LABS",
        message: "Hola NEXUS LABS 👋 Vengo del asistente y quiero contarles mi proyecto.",
        subject: "NEXUS LABS · Consulta",
      },
    }),
  },
]

function templateReply(rng: Rng, template: Template): Built {
  const needs = template.needs.filter(Boolean)
  return {
    text: join(
      `${template.name} es ${template.kindLabel.toLowerCase()} de ${template.industry.toLowerCase()}.`,
      template.description,
      needs.length
        ? `Para llevarla a producción hay que resolver ${needs.join(" y ").toLowerCase()}; el resto ya está montado.`
        : "No arrastra dependencias raras: se puede publicar tal cual o adaptarla a tu marca.",
      pick(rng, [
        "Puedes abrir la demo y volver aquí con dudas concretas.",
        "Ábrela en otra pestaña y te cuento lo que haga falta.",
      ])
    ),
    spoken: join(
      `${template.name} es ${template.kindLabel.toLowerCase()} de ${template.industry.toLowerCase()}.`,
      template.description,
      needs.length ? `Habría que conectar ${needs.join(" y ").toLowerCase()}.` : "",
      "Te la dejo en pantalla."
    ),
    cards: [card(template)],
    tools: [
      { id: `read-${template.id}`, name: "leer_ficha", label: `Leo la ficha de ${template.name}`, detail: `${template.kindLabel} · ${template.industryShort}` },
      { id: `needs-${template.id}`, name: "revisar_pendientes", label: "Reviso lo que falta para producción", detail: needs.length ? needs.join(", ") : "nada pendiente" },
    ],
    followUps: [
      `¿Cuánto tarda una versión de ${template.name}?`,
      "¿Qué incluye una versión personalizada?",
      "Pedir presupuesto por correo",
    ],
    action: {
      kind: "mail",
      label: `Pedir ${template.name} por correo`,
      message: `Hola NEXUS LABS 👋 Me interesa «${template.name}» y quiero una versión con mi marca. Mi negocio es …`,
      subject: `NEXUS LABS · ${template.name}`,
    },
  }
}

function sectorReply(rng: Rng, sector: string): Built {
  const templates = byIndustry(sector)
  const sample = picks(rng, templates, Math.min(3, templates.length))
  const copy = sectorCopy[sector] ?? { blurb: "proyectos del sector", examples: [] }
  const industry = data.industries.find((item) => item.short === sector)

  return {
    text: join(
      pick(rng, openings.sector),
      `${industry?.label ?? sector} reúne ${templates.length} ${templates.length === 1 ? "plantilla" : "plantillas"}, pensadas para ${copy.blurb}.`,
      sample.length ? `Para empezar miraría ${sample.map((item) => item.name).join(", ")}.` : "",
      sample[0] ? `${sample[0].name}: ${sample[0].description}` : "",
      "Si me dices qué tiene que hacer el visitante —reservar, comprar, pedir cita o leer— afino la elección."
    ),
    spoken: join(
      `Para ${(industry?.label ?? sector).toLowerCase()} hay ${templates.length} plantillas.`,
      sample.length ? `Te dejo ${sample.map((item) => item.name).join(", ")} en pantalla para que las abras.` : "",
      "Dime qué tiene que hacer el visitante y te digo cuál elegir."
    ),
    cards: sample.map(card),
    tools: [
      {
        id: `search-${sector}`,
        name: "buscar_plantillas",
        label: `Busco en ${industry?.label ?? sector}`,
        detail: `${templates.length} fichas · ${copy.examples.slice(0, 3).join(", ")}`,
      },
      ...(sample.length
        ? [{ id: `read-${sector}`, name: "leer_ficha", label: "Leo la ficha más cercana", detail: sample[0].name }]
        : []),
    ],
    followUps: sample.length
      ? [`Ver ${sample[0].name}`, `¿Cuánto tarda una versión así?`, "Pedir presupuesto por correo"]
      : ["Ver todo el catálogo", "Pedir una versión a medida", "Hablar con una persona"],
  }
}

/* ------------------------------------------------------------------ */
/* Planificador                                                        */
/* ------------------------------------------------------------------ */

function scoreWords(value: string, words: string[]) {
  let score = 0
  for (const word of words) {
    if (!word) continue
    if (value.includes(word)) score += word.includes(" ") ? 16 : Math.min(12, 4 + word.length)
  }
  return score
}

function reasoningFor(text: string, sector: string | undefined, toolCount: number, rng: Rng) {
  const subject = text.length > 60 ? `${text.slice(0, 57).trim()}…` : text
  const steps = [
    pick(rng, [
      `Leo la pregunta: «${subject}»`,
      `Entiendo la consulta: «${subject}»`,
      `Separo la pregunta en lo que puedo comprobar: «${subject}»`,
    ]),
    sector
      ? `Filtro el catálogo por ${sector.toLowerCase()}`
      : pick(rng, ["Reviso el catálogo completo de las 88 fichas", "Recorro las 88 fichas y sus etiquetas"]),
    `Ejecuto ${toolCount} ${toolCount === 1 ? "herramienta" : "herramientas"} sobre los datos del estudio`,
    pick(rng, [
      "Ordeno la respuesta y las fichas que te sirven",
      "Convierto los datos en una respuesta corta",
      "Preparo la respuesta y dejo el siguiente paso listo",
    ]),
  ]
  return steps
}

export function planReply(input: string, history: HistoryTurn[] = []): AssistantPlan {
  const raw = input.trim()
  const text = fold(raw)
  const sector = detectSector(raw)
  const named = findNamedTemplates(raw)
  const rng = makeRng(
    Date.now() % 233280 + raw.length * 7919 + history.length * 9301 + Math.floor(Math.random() * 997)
  )

  const conversation = fold(history.slice(-6).map((turn) => turn.text).join(" "))
  const contextSector = sector ?? detectSector(conversation)

  const ranked = INTENTS.map((intent) => ({
    intent,
    score:
      scoreWords(text, intent.words) +
      (intent.id === "compare" && named.length >= 2 ? 40 : 0) +
      (intent.id === "sector" && sector ? 18 : 0),
  }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const byId = (id: string) => INTENTS.find((intent) => intent.id === id)!

  let chosen = ranked[0]?.intent
  if (named.length >= 2) chosen = byId("compare")
  if (!chosen) chosen = sector ? byId("sector") : byId("catalog")

  const wantsTemplate = chosen.id === "catalog" || chosen.id === "sector"
  const built =
    named.length === 1 && wantsTemplate
      ? templateReply(rng, named[0])
      : chosen.build({ rng, raw, text, history, sector: contextSector })
  const tools = built.tools ?? []
  const reasoning = reasoningFor(raw, contextSector, tools.length, rng)

  if (!built.text) {
    return {
      intent: "fallback",
      reasoning,
      tools,
      text: "No tengo esa respuesta con certeza y prefiero no inventarla. Puedo ayudarte con el catálogo, plazos, pagos, dominio, licencias o comentarios, o pasarte el correo del estudio para que te responda una persona.",
      spoken:
        "No tengo esa respuesta con certeza y prefiero no inventarla. Puedo ayudarte con el catálogo, los plazos, los pagos, el dominio o las licencias.",
      cards: [],
      links: [{ label: "Ver el catálogo", to: "/plantillas" }],
      followUps: ["¿Qué plantillas hay?", "¿Cuánto tarda un proyecto?", "Hablar con una persona"],
    }
  }

  return {
    intent: chosen.id,
    reasoning,
    tools,
    cards: (built.cards ?? []).slice(0, 3),
    links: built.links ?? [],
    followUps: built.followUps ?? [],
    action: built.action,
    text: built.text,
    spoken: built.spoken ?? built.text,
  }
}

/* ------------------------------------------------------------------ */
/* Presentación larga del estudio (para la voz y la transcripción)     */
/* ------------------------------------------------------------------ */

export type NarrationSegment = { label: string; text: string }

export const PRESENTATION: NarrationSegment[] = [
  {
    label: "Quiénes somos",
    text: "Somos NEXUS LABS, un estudio pequeño que diseña y construye sitios web con una idea simple: que la página se entienda en los primeros diez segundos. No hacemos presentaciones infinitas ni entregamos maquetas que nadie puede tocar. Empezamos con una conversación, seguimos con un alcance escrito y terminamos con un sitio publicado, funcionando y a tu nombre.",
  },
  {
    label: "Qué ofrecemos",
    text: "Ofrecemos cuatro formas de trabajar. La primera es una landing esencial: una sola página, una idea clara, tu identidad y un contacto que funciona. La segunda es un sitio completo, de cinco a ocho páginas, con navegación, fichas y contenido que puedes editar. La tercera es una tienda con pagos: catálogo, carrito, checkout y pasarela conectada. La cuarta es una aplicación a medida, con cuentas, datos y panel de administración.",
  },
  {
    label: "El catálogo",
    text: "El catálogo reúne ochenta y ocho plantillas completas, agrupadas en diez industrias: restaurantes y bares, hoteles y viajes, tiendas y producto, inmobiliaria y arquitectura, SaaS y producto digital, educación y cursos, eventos y cultura, portafolios y estudios, causas y comunidad, y apps y juegos. Cada plantilla tiene su ficha, su demo real y una lista honesta de lo que hay que conectar antes de salir a producción.",
  },
  {
    label: "Por qué una plantilla",
    text: "Una plantilla no es una solución mágica, pero sí es un buen punto de partida. Evita discutir desde cero qué es una cabecera o dónde va el botón de reservar, y permite dedicar el tiempo a lo que de verdad diferencia tu negocio: el contenido, la fotografía y el gesto principal que quieres que haga el visitante. Nosotros la adaptamos a tu marca, no al contrario.",
  },
  {
    label: "Cómo trabajamos",
    text: "Todo empieza con un brief: qué vendes, a quién se lo vendes y qué tiene que pasar cuando alguien entra en la página. Con eso escribimos el alcance, con lo que entra y lo que no. Después viene la dirección visual y los textos, luego la construcción, y al final una revisión de calidad en móvil, tablet y escritorio, con teclado, con lector de pantalla y midiendo el peso de cada página.",
  },
  {
    label: "Plazos y alcance",
    text: "Los plazos dependen del alcance, y por eso se cierran antes de empezar. Una landing con tu identidad es un trabajo corto. Un sitio completo necesita algo más de margen. Una tienda con pagos o una app con cuentas piden más recorrido, porque hay integraciones que probar y flujos que romper a propósito para ver qué pasa. Nunca prometemos una fecha que no podamos sostener.",
  },
  {
    label: "Pagos y reservas",
    text: "Las demos del catálogo son estáticas: se pueden recorrer, pero no cobran ni envían correos, porque GitHub Pages no ejecuta backend. En tu versión conectamos la pasarela que uses, con tu cuenta y tus claves, y probamos el flujo completo antes de publicar, incluidos los correos de confirmación. Lo mismo pasa con reservas, formularios, suscripciones y bases de datos.",
  },
  {
    label: "Voz e inteligencia",
    text: "Este asistente tiene voz. Puedes hablarle con el micrófono y te responde en voz alta mientras busca en el catálogo, y puedes leer la transcripción en vivo de lo que va diciendo. No es un adorno: sirve para dictar una consulta larga sin escribir y para escuchar una explicación mientras miras las plantillas. Cuando algo no está en su base, lo dice y te pasa el correo del estudio.",
  },
  {
    label: "Calidad",
    text: "Calidad, para nosotros, significa tres cosas medibles. Que se vea bien en cualquier pantalla. Que se pueda usar con teclado y con lector de pantalla, con contraste suficiente y textos alternativos. Y que cargue rápido, con imágenes optimizadas, sin scripts que no aportan nada. Eso se revisa antes de publicar, no se deja para el final.",
  },
  {
    label: "Tecnología",
    text: "Trabajamos con React y TypeScript en la interfaz, Tailwind para el sistema visual, y una base estática o un runtime ligero según lo que necesite el proyecto. Para datos y cuentas elegimos la pieza mínima que aguante: base gestionada, autenticación y almacenamiento de archivos. Nada de infraestructura que no puedas mantener tú mismo dentro de un año.",
  },
  {
    label: "Licencias",
    text: "Cada plantilla conserva los créditos y la licencia de su diseño original, y la página de créditos dice de dónde viene cada base. La versión que encargas se construye sobre esa base con permiso y atribución. El código de tu proyecto y tus contenidos son tuyos. Lo que no se puede es borrar la autoría del diseño de origen.",
  },
  {
    label: "Dominio y hosting",
    text: "El sitio se publica en el hosting que prefieras: Cloudflare, Vercel, Netlify o el que ya uses. Apunta a tu dominio, con HTTPS y redirecciones bien puestas. Si quieres, te entregamos el repositorio, el dominio y las cuentas a tu nombre, para que no dependas de nosotros para un cambio de contraseña o una renovación.",
  },
  {
    label: "Después de entregar",
    text: "Después de publicar no te quedas solo. Hay dos formas de seguir: una bolsa de horas para cambios puntuales, o un mantenimiento mensual con actualizaciones, copias y pequeñas mejoras. La formación va incluida, con una sesión para que puedas editar textos e imágenes sin llamar a nadie. Y los errores de lo entregado se corrigen sin coste dentro del periodo acordado.",
  },
  {
    label: "Precio",
    text: "No publicamos una tarifa única, porque el precio no sale de la plantilla: sale del alcance. Lo que mueve el número es el contenido que hay que producir, las integraciones y las cuentas que necesites. Cuéntanos el tipo de negocio, las secciones y si hay pagos o reservas, y recibirás una propuesta con alcance y precio cerrados, por escrito, antes de empezar.",
  },
  {
    label: "Cómo empezar",
    text: "Si esto encaja con lo que necesitas, el siguiente paso es un correo a info arroba nexviro punto art, con copia a meridian arroba nexviro punto art. Cuéntanos qué tienes en mente y en qué plazo te gustaría estar en línea. Si prefieres hablar, en la página de contacto puedes elegir una fecha para una llamada. Respondemos en horario de estudio, y la primera conversación no se cobra.",
  },
]

export const VOICE_SUGGESTIONS = [
  "¿Qué plantilla va para un hotel?",
  "¿Cuánto tarda una tienda con pagos?",
  "Preséntame la empresa",
  "¿Puedo usar mi dominio?",
]
