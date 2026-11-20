// NEXUS LABS — data for the React gallery (shadcn/ui + Magic UI).
// Takes the built templates and returns the payload the gallery renders.

const REPO = 'https://github.com/christianhola/plantillas-freebuff'
const VIDEO_ID = 'tKoDPOrLMX0'

const FEATURED = [
  'restaurant', 'luxury-hotel', 'store', 'saas-landing', 'food-ordering', 'interior-showroom',
  'boutique-hotel', 'portfolio', 'creative-agency', 'skincare-shop', 'estate-agent', 'conference',
  'architecture-studio', 'travel-landing', 'bar-lounge', 'restaurant-chain',
]

const INDUSTRIES = [
  {
    id: 'restaurantes', label: 'Restaurantes y bares', short: 'Restaurantes',
    copy: 'Cartas, reservas y pedidos que abren el apetito.',
    covers: ['restaurant', 'food-ordering', 'bar-lounge', 'restaurant-chain'],
    audience: 'gastronomía',
    ids: ['restaurant', 'restaurant-chain', 'bar-lounge', 'food-ordering', 'burger-delivery'],
  },
  {
    id: 'hoteles', label: 'Hoteles y viajes', short: 'Hoteles',
    copy: 'Habitaciones, experiencias y reservas con fotografía que vende sola.',
    covers: ['luxury-hotel', 'boutique-hotel', 'wellness-retreat', 'travel-landing'],
    audience: 'hotelería y viajes',
    ids: ['luxury-hotel', 'boutique-hotel', 'wellness-retreat', 'tour-operator', 'yacht-club', 'yacht-rental', 'travel-landing'],
  },
  {
    id: 'tiendas', label: 'Tiendas y producto', short: 'Tiendas',
    copy: 'Catálogo, ficha de producto y checkout listos para tu marca.',
    covers: ['store', 'skincare-shop', 'motorcycle-shop', 'maker-shop'],
    audience: 'comercio y producto',
    ids: ['store', 'skincare-shop', 'motorcycle-shop', 'kitchenware-shop', 'maker-shop', 'farm-produce', 'hardware-product', 'illustration-store', 'shopify-storefront'],
  },
  {
    id: 'inmobiliaria', label: 'Inmobiliaria y arquitectura', short: 'Inmobiliaria',
    copy: 'Propiedades y proyectos con narrativa editorial.',
    covers: ['interior-showroom', 'luxury-real-estate', 'architecture-studio', 'estate-agent'],
    audience: 'inmobiliaria y arquitectura',
    ids: ['estate-agent', 'luxury-real-estate', 'architecture-studio', 'architecture-portfolio', 'interior-studio', 'interior-showroom'],
  },
  {
    id: 'saas', label: 'SaaS y producto digital', short: 'SaaS',
    copy: 'Landings, paneles y precios que explican el producto.',
    covers: ['saas-landing', 'product-analytics', 'payments-landing', 'usage-billing'],
    audience: 'producto digital',
    ids: ['saas-landing', 'fintech-landing', 'waitlist', 'customer-health', 'insurance-landing', 'messaging-saas', 'product-analytics', 'payments-landing', 'coding-assessment', 'team-platform', 'mac-utility', 'usage-billing', 'newsletter-platform', 'fractional-hr', 'screen-recorder', 'voice-dictation', 'retirement-advisor', 'retro-terminal', 'energy-api', 'fusion-energy'],
  },
  {
    id: 'educacion', label: 'Educación y cursos', short: 'Educación',
    copy: 'Admisiones, cursos y plataformas para enseñar sin fricción.',
    covers: ['course-platform', 'language-school', 'online-courses', 'e-learning'],
    audience: 'educación',
    ids: ['study', 'study-planner', 'language-school', 'ai-study-assistant', 'course-platform', 'e-learning', 'online-courses', 'creator-course'],
  },
  {
    id: 'eventos', label: 'Eventos y cultura', short: 'Eventos',
    copy: 'Agendas, boletas y carteleras con presencia propia.',
    covers: ['conference', 'music-venue', 'theatre', 'exhibition'],
    audience: 'eventos y cultura',
    ids: ['music-venue', 'conference', 'exhibition', 'events-studio', 'theatre', 'wedding-planner', 'marathon'],
  },
  {
    id: 'portafolios', label: 'Portafolios y estudios', short: 'Portafolios',
    copy: 'Tu trabajo al frente, sin ruido alrededor.',
    covers: ['portfolio', 'creative-agency', 'architecture-portfolio', 'designer-portfolio'],
    audience: 'estudios y talento',
    ids: ['portfolio', 'designer-portfolio', 'creative-agency', 'blog', 'talent-agency', 'film-studio'],
  },
  {
    id: 'causas', label: 'Causas y comunidad', short: 'Causas',
    copy: 'Campañas, donaciones e historias que mueven a actuar.',
    covers: ['charity-impact', 'conservation', 'nonprofit', 'fundraising'],
    audience: 'causas sociales',
    ids: ['charity-impact', 'nonprofit', 'recycling-campaign', 'climate-story', 'fundraising', 'conservation'],
  },
  {
    id: 'apps', label: 'Apps y juegos', short: 'Apps',
    copy: 'Herramientas y juegos que funcionan dentro del navegador.',
    covers: ['tasks', 'study', 'crm', 'chess'],
    audience: 'apps y juegos',
    ids: ['ai-chat', 'crm', 'chess', 'orbit', 'flappy-bird', 'coil', 'bedwars', 'crosscut', 'tasks', 'moodboard', 'bug-tracker', 'desk-booking', 'baby-tracker', 'car-auction', 'music-library', 'bookmark-library', 'indie-game', 'bedwars-lite', 'blank-website', 'web-app', 'json-api'],
  },
]

const TAG_ES = {
  booking: 'reservas en línea', reservations: 'reservas', checkout: 'checkout', cart: 'carrito',
  pricing: 'planes y precios', menu: 'carta digital', food: 'gastronomía', restaurant: 'restaurante',
  delivery: 'domicilios', ordering: 'pedidos', rewards: 'recompensas', catering: 'catering',
  wine: 'carta de vinos', 'tasting-menu': 'menú degustación', takeaway: 'para llevar', hotel: 'hotel',
  hospitality: 'hotelería', spa: 'spa', luxury: 'experiencia de lujo', travel: 'viajes',
  itinerary: 'itinerarios', reviews: 'reseñas', 'tour-operator': 'tours', yacht: 'yates',
  marina: 'marina', charter: 'chárter', wellness: 'bienestar', retreat: 'retiros',
  ecommerce: 'tienda en línea', store: 'catálogo', shop: 'compra', catalogue: 'catálogo',
  'product-grid': 'grilla de productos', configurator: 'configurador', skincare: 'cuidado de la piel',
  beauty: 'belleza', automotive: 'automotriz', motorcycles: 'motos', kitchenware: 'menaje',
  handmade: 'hecho a mano', leather: 'marroquinería', furniture: 'muebles',
  'interior-design': 'interiorismo', showroom: 'showroom', architecture: 'arquitectura',
  'real-estate': 'inmobiliaria', property: 'propiedades', listings: 'listados', valuation: 'valoración',
  agency: 'agencia', studio: 'estudio', portfolio: 'portafolio', 'case-studies': 'casos de estudio',
  creative: 'creatividad', editorial: 'editorial', blog: 'blog', newsletter: 'newsletter', saas: 'SaaS',
  dashboard: 'panel de control', analytics: 'analítica', 'product-mock': 'mock de producto', ai: 'IA',
  chat: 'chat', assistant: 'asistente', crm: 'CRM', business: 'gestión', productivity: 'productividad',
  todo: 'tareas', tasks: 'tareas', kanban: 'tablero kanban', planner: 'planificador',
  calendar: 'calendario', education: 'educación', courses: 'cursos', 'online-courses': 'cursos en línea',
  'course-builder': 'creador de cursos', 'lesson-player': 'reproductor de lecciones',
  certificates: 'certificados', 'language-school': 'escuela de idiomas', quiz: 'quiz interactivo',
  flashcards: 'fichas de estudio', events: 'eventos', conference: 'conferencia', agenda: 'agenda',
  speakers: 'ponentes', tickets: 'boletas', ticketing: 'boletería', 'seat-map': 'mapa de sillas',
  theatre: 'teatro', 'music-venue': 'música en vivo', concerts: 'conciertos', nightlife: 'vida nocturna',
  film: 'cine', cinematic: 'estética cinematográfica', wedding: 'bodas', rsvp: 'confirmación de asistencia',
  budget: 'presupuesto', marathon: 'maratón', sports: 'deportes', nonprofit: 'causa social',
  charity: 'donaciones', donations: 'donaciones', fundraising: 'recaudación', volunteer: 'voluntariado',
  climate: 'clima', environment: 'medio ambiente', conservation: 'conservación', game: 'juego',
  multiplayer: 'multijugador', canvas: 'canvas interactivo', '3d': '3D', voxel: 'vóxel', arcade: 'arcade',
  'single-player': 'un jugador', fintech: 'fintech', payments: 'pagos', insurance: 'seguros',
  startup: 'startup', 'deep-tech': 'deep tech', energy: 'energía', 'developer-tools': 'herramientas para devs',
  'api-docs': 'documentación de API', docs: 'documentación', changelog: 'changelog', download: 'descarga',
  mac: 'macOS', app: 'app', mobile: 'móvil', health: 'salud', parenting: 'crianza', baby: 'bebés',
  tracker: 'seguimiento', timeline: 'línea de tiempo', localstorage: 'datos locales',
  marketplace: 'marketplace', auction: 'subastas', cars: 'autos', bidding: 'pujas', music: 'música',
  audio: 'audio', player: 'reproductor', licensing: 'licencias', bookmarks: 'marcadores',
  search: 'búsqueda', collections: 'colecciones', video: 'video', 'screen-recording': 'grabación de pantalla',
  voice: 'voz', dictation: 'dictado', hardware: 'hardware', led: 'iluminación LED',
  specs: 'especificaciones', apps: 'apps', faq: 'preguntas frecuentes', calculator: 'calculadora',
  illustration: 'ilustración', 'digital-goods': 'productos digitales', bundles: 'bundles',
  consulting: 'consultoría', hr: 'recursos humanos', 'people-ops': 'people ops', services: 'servicios',
  team: 'equipo', careers: 'empleo', 'press-kit': 'press kit', devlog: 'devlog', characters: 'personajes',
  farm: 'finca', preserves: 'conservas', recipes: 'recetas', carousel: 'carrusel', exhibition: 'exposición',
  museum: 'museo', gallery: 'galería', art: 'arte', 'audio-guide': 'audioguía', 'floor-plan': 'plano',
  activations: 'activaciones', venues: 'sedes', waitlist: 'lista de espera', launch: 'lanzamiento',
  marketing: 'marketing', landing: 'landing', minimal: 'estética minimalista', serif: 'tipografía serif',
  monochrome: 'monocromo', playful: 'tono lúdico', warm: 'paleta cálida', pastel: 'paleta pastel',
  green: 'paleta verde', brutalist: 'estilo brutalista', retro: 'estética retro', crt: 'estética CRT',
  terminal: 'terminal', keyboard: 'atajos de teclado', interactive: 'interacción en vivo',
  filters: 'filtros', filters2: 'filtros', story: 'relato de marca', scrollytelling: 'scrollytelling',
  'data-story': 'historia de datos', charts: 'gráficos', journalism: 'periodismo', community: 'comunidad',
  'annual-report': 'informe anual', membership: 'membresía', 'talent-agency': 'agencia de talento',
  entertainment: 'entretenimiento', roster: 'elenco', shopify: 'Shopify', storefront: 'storefront',
  creator: 'creadores', monetization: 'monetización', editor: 'editor', templates: 'plantillas',
  timetable: 'horarios', admissions: 'admisiones', application: 'postulaciones',
  'placement-test': 'test de nivel', media: 'medios', personal: 'marca personal',
  'industrial-design': 'diseño industrial', 'product-design': 'diseño de producto',
}

const FUNCTIONAL = new Set([
  'booking', 'reservations', 'checkout', 'cart', 'menu', 'delivery', 'ordering', 'catering', 'itinerary',
  'reviews', 'ecommerce', 'shop', 'catalogue', 'configurator', 'listings', 'valuation', 'pricing',
  'dashboard', 'analytics', 'crm', 'events', 'tickets', 'ticketing', 'seat-map', 'rsvp', 'budget',
  'donations', 'fundraising', 'quiz', 'courses', 'flashcards', 'calendar', 'planner', 'tracker',
  'bookmarks', 'search', 'multiplayer', 'auction', 'bidding', 'waitlist', 'download', 'faq', 'calculator',
  'membership', 'agenda', 'speakers', 'audio-guide', 'floor-plan', 'product-mock', 'filters',
])

const OVERRIDES = {
  restaurant: 'Carta de temporada, menú degustación, reservas y pedidos para llevar en un mismo sitio. La fotografía manda y la tipografía serif le da el tono de sala.',
  'restaurant-chain': 'Grupo gastronómico con sedes, menús por local, eventos y reservas. Ideal para operar varias marcas bajo un mismo sistema.',
  'bar-lounge': 'Bar y lounge con carta de cócteles, agenda de eventos y reservas. Luz baja, tipografía grande y ganas de salir.',
  'food-ordering': 'Pedidos de comida con menú, carrito, checkout y seguimiento de domicilio. Pensado para operar desde el primer día.',
  'luxury-hotel': 'Suite, spa, experiencias y reservas con una estética de hotel cinco estrellas: fotografía amplia, detalles en serif y ritmo pausado.',
  'boutique-hotel': 'Hotel boutique con guía del barrio, eventos y reservas. Cada sección se lee como una revista de viaje.',
  'wellness-retreat': 'Retiro de bienestar con programas, alojamiento y reservas. Silencio, montaña y fotografía lenta.',
  'travel-landing': 'Planificador de viajes con itinerarios, ofertas y diario. Para vender experiencias, no solo destinos.',
  store: 'Tienda con catálogo, filtros, ficha de producto y carrito. Lista para conectar tu pasarela de pagos.',
  'skincare-shop': 'Tienda de skincare con quiz de rutina, reseñas y checkout. Una marca de belleza se ve como marca de belleza.',
  'motorcycle-shop': 'Tienda de motos con configurador, catálogo y agenda de taller.',
  'maker-shop': 'Tienda de taller artesanal con productos hechos a mano, historia y pedidos personalizados.',
  'interior-showroom': 'Showroom de interiorismo con catálogo de piezas, ambientes y agenda de visita.',
  'interior-studio': 'Estudio de interiorismo con servicios, portafolio por ambientes, quiz de estilo y reservas.',
  'architecture-studio': 'Estudio de arquitectura con proyectos, equipo, vacantes y una dirección de arte editorial en blanco y negro.',
  'estate-agent': 'Inmobiliaria con listados, búsqueda por filtros y ficha de propiedad. Cada inmueble con su propia página.',
  'luxury-real-estate': 'Inmobiliaria de lujo con propiedades, valoración y narrativa editorial. Precio alto, ruido bajo.',
  'saas-landing': 'Landing de producto con mock en vivo, bento de funciones, precios y FAQ. Lista para explicar algo complejo en treinta segundos.',
  'product-analytics': 'Analítica de producto con panel, métricas y comparativas. Un SaaS que se entiende al primer scroll.',
  'creative-agency': 'Agencia creativa con casos, servicios, equipo y 3D. Un sitio que también funciona como carta de presentación.',
  portfolio: 'Portafolio personal con proyectos, about y contacto. La página desaparece y lo que queda es tu trabajo.',
  'designer-portfolio': 'Portafolio de diseño de producto con casos de estudio y proceso. Para mostrar criterio, no solo imágenes.',
  'course-platform': 'Plataforma de cursos con tienda de creadores, lecciones y analítica.',
  conference: 'Conferencia con agenda, ponentes, sedes y boletas. Un evento que se entiende antes de inscribirse.',
  'music-venue': 'Sala de conciertos con cartel, boletería y eventos. Estética nocturna para una noche real.',
  theatre: 'Teatro con temporada, mapa de sillas y membresías. La cartelera como pieza de diseño.',
  'wedding-planner': 'Wedding planner con portafolio, presupuesto y confirmación de asistencia. Elegancia sin cursilería.',
  exhibition: 'Museo o galería con exposiciones, audioguía, plano y boletas.',
  'charity-impact': 'Causa social con campañas, donaciones y voluntariado. Transparencia y emoción en la misma página.',
  tasks: 'App de tareas con tableros, prioridades y estado local. Funciona sin cuenta ni servidor.',
  study: 'App de estudio con fichas, repaso y progreso. Todo se guarda en el navegador.',
  crm: 'CRM con pipeline, contactos y panel. Demo funcional con datos de ejemplo.',
  'ai-chat': 'Interfaz de chat con IA, historial y ajustes de tono. Lista para conectar tu modelo.',
  chess: 'Ajedrez con tablero, reglas completas y modo local. Sin dependencias externas.',
  bedwars: 'Juego vóxel multijugador con construcción y combate. Requiere servidor para partidas en línea.',
  'indie-game': 'Mini juego indie dibujado a mano, con press kit y devlog.',
}

const NEEDS = {
  booking: 'Reservas reales (calendario y correo)',
  reservations: 'Reservas reales (calendario y correo)',
  checkout: 'Pagos en línea (pasarela)',
  cart: 'Carrito con persistencia de pedidos',
  payments: 'Pagos y conciliación',
  orders: 'Gestión de pedidos',
  delivery: 'Pedidos y direcciones de entrega',
  accounts: 'Cuentas de usuario',
  auth: 'Inicio de sesión',
  database: 'Base de datos',
  donations: 'Donaciones reales',
  tickets: 'Emisión de boletas',
  ticketing: 'Emisión de boletas',
  newsletter: 'Suscripciones por correo',
  waitlist: 'Lista de espera persistente',
  multiplayer: 'Partidas en línea',
  auction: 'Pujas en vivo',
  bidding: 'Pujas en vivo',
  rsvp: 'Confirmaciones por correo',
  'real-time': 'Tiempo real',
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

function tagsOf(t) {
  return (t.tags ?? []).filter((x) => !x.startsWith('category:'))
}

function industryFor(t) {
  const explicit = INDUSTRIES.find((industry) => industry.ids.includes(t.id))
  if (explicit) return explicit
  const tags = tagsOf(t)
  if (t.kind === 'game' || tags.includes('game')) return INDUSTRIES[9]
  if (t.kind === 'app') return INDUSTRIES[9]
  if (t.kind === 'store') return INDUSTRIES[2]
  if ((t.tags ?? []).some((x) => x.startsWith('category:saas'))) return INDUSTRIES[4]
  if ((t.tags ?? []).some((x) => x.startsWith('category:store'))) return INDUSTRIES[2]
  if ((t.tags ?? []).some((x) => x.startsWith('category:portfolio'))) return INDUSTRIES[7]
  return INDUSTRIES[4]
}

function featuresOf(t) {
  const tags = tagsOf(t)
  const functional = tags.filter((x) => FUNCTIONAL.has(x))
  const rest = tags.filter((x) => !FUNCTIONAL.has(x) && TAG_ES[x])
  const picked = []
  for (const tag of [...functional, ...rest]) {
    const phrase = TAG_ES[tag]
    if (phrase && !picked.includes(phrase)) picked.push(phrase)
    if (picked.length === 5) break
  }
  if (picked.length < 4) {
    for (const fallback of ['Diseño responsive', 'Navegación completa', 'Contenido editable', 'Código fuente incluido']) {
      if (!picked.includes(fallback)) picked.push(fallback)
      if (picked.length === 5) break
    }
  }
  return picked
}

function needsOf(t) {
  const integrations = t.integrations ?? []
  const tags = tagsOf(t)
  const needs = []
  if (integrations.length) needs.push('Servicios externos conectados (' + integrations.join(', ') + ')')
  for (const tag of tags) {
    const need = NEEDS[tag]
    if (need && !needs.includes(need)) needs.push(need)
    if (needs.length === 4) break
  }
  return needs
}

function descriptionFor(t, industry) {
  if (OVERRIDES[t.id]) return OVERRIDES[t.id]
  const features = featuresOf(t).filter((x) => !/^(estética|paleta|tipografía|tono|monocromo|estilo)/.test(x)).slice(0, 3)
  const list = features.length > 1
    ? features.slice(0, -1).join(', ') + ' y ' + features[features.length - 1]
    : features[0] ?? 'contenido editable'
  if (t.kind === 'app') {
    return 'Aplicación de ' + industry.audience + ' que funciona en el navegador: ' + list + '. Guarda su estado en el dispositivo, sin cuentas ni servidor.'
  }
  return 'Sitio de ' + industry.audience + ' con ' + list + '. Una base real para lanzar con tu marca, tus textos y tus fotos.'
}

function priorityOf(t) {
  const index = FEATURED.indexOf(t.id)
  return index === -1 ? 999 : index
}

export function buildGalleryData({ templates, built, whatsappNumber = '' }) {
  const wa = String(whatsappNumber).replace(/\D/g, '')
  const cover = (industry) => {
    const id = industry.covers.find((x) => built.includes(x) && templates.some((t) => t.id === x))
    return id ? `previews/${id}.jpg` : null
  }

  const items = templates
    .slice()
    .sort((a, b) => priorityOf(a) - priorityOf(b) || a.name.localeCompare(b.name))
    .map((t) => {
      const industry = industryFor(t)
      const hasIntegrations = (t.integrations ?? []).length > 0
      return {
        id: t.id,
        name: t.name,
        href: `demos/${t.id}/`,
        preview: `previews/${t.id}.jpg`,
        industry: industry.label,
        industryShort: industry.short,
        audience: industry.label.toLowerCase(),
        category: industry.id,
        kind: t.kind,
        kindLabel: t.kind === 'app' ? 'App de navegador' : 'Sitio completo',
        status: hasIntegrations ? 'Requiere servicio externo' : t.kind === 'app' ? 'App local' : 'Demo estática',
        statusClass: hasIntegrations ? 'service' : t.kind === 'app' ? 'app' : 'static',
        featured: priorityOf(t) !== 999,
        features: featuresOf(t),
        needs: needsOf(t),
        tags: tagsOf(t),
        description: descriptionFor(t, industry),
        demoNote: hasIntegrations
          ? 'Esta plantilla está pensada para conectar servicios externos. En la demo se muestra la interfaz; la parte de datos necesita backend.'
          : t.kind === 'app'
            ? 'App de navegador: el estado se guarda en tu dispositivo (localStorage). No hay cuentas, base de datos ni servidor conectado en la demo.'
            : 'Demo estática: formularios, reservas y pagos se pueden recorrer, pero en GitHub Pages no se envían ni se cobran. En tu versión conectamos el backend que necesites.',
      }
    })

  const industries = INDUSTRIES.map((industry) => ({
    id: industry.id,
    label: industry.label,
    short: industry.short,
    copy: industry.copy,
    audience: industry.audience,
    cover: cover(industry),
    count: items.filter((item) => item.category === industry.id).length,
  }))

  return {
    industries,
    items,
    total: built.length,
    apps: items.filter((item) => item.kind === 'app').length,
    whatsapp: wa,
  }
}
