import type { ChatTransport, UIMessage, UIMessageChunk } from "ai"

import { data } from "@/lib/data"

function textOf(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ")
}

const has = (value: string, words: string[]) =>
  words.some((word) => value.includes(word))

export function answerFor(input: string) {
  const value = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

  if (has(value, ["hola", "buenas", "hey", "que tal"])) {
    return `Hola. Soy el asistente de NEXUS LABS. Puedo orientarte sobre el catálogo, los plazos, las licencias y cómo pedir una versión con tu marca. No creo sitios ni envío mensajes: solo converso. ¿Buscas una plantilla para un negocio concreto?`
  }

  if (has(value, ["plazo", "tiempo", "tarda", "entrega", "cuando", "urgen"])) {
    return `Una landing con tu identidad suele ser un trabajo corto; un sitio completo, una tienda con pagos o una app con cuentas necesitan más margen. El plazo se cierra antes de empezar, por escrito, junto al alcance. En la página /proceso explico cómo se reparte el trabajo y qué recibes en cada hito.`
  }

  if (has(value, ["precio", "cuesta", "cuanto", "presupuesto", "tarifa", "cobran"])) {
    return `El precio depende del alcance, no de la plantilla: una landing con tu marca no cuesta lo mismo que una tienda con pagos o una app con cuentas. Por eso no hay una tarifa única publicada. Cuéntame qué necesitas —tipo de negocio, secciones y si hay pagos o cuentas— y el estudio te responde con alcance y precio concretos por WhatsApp.`
  }

  if (has(value, ["plantilla", "catalogo", "demo", "ejemplo", "industria"])) {
    const industries = data.industries
      .slice(0, 4)
      .map((industry) => industry.label.toLowerCase())
      .join(", ")
    return `Hay ${data.total} plantillas completas, agrupadas en ${data.industries.length} industrias: ${industries} y más. Cada una tiene su propia página con la demo real, lo que incluye y lo que hay que conectar para producción. Puedes filtrar por industria en /plantillas o entrar desde /industrias. Si me dices tu oficio, te digo por dónde empezar.`
  }

  if (has(value, ["pago", "pagar", "pasarela", "stripe", "paypal", "cobro", "carrito"])) {
    return `Las demos son estáticas: enseñan la interfaz terminada, pero no cobran ni envían correos. En tu versión se conecta la pasarela que uses —Stripe, PayPal u otra— con su cuenta y sus claves, y se prueba antes de publicar. Lo mismo pasa con formularios, reservas y bases de datos.`
  }

  if (has(value, ["licencia", "derecho", "autor", "credito", "copia", "legal"])) {
    return `Los diseños pertenecen a sus autores originales y el catálogo conserva sus créditos y licencias. La versión que encargas se construye sobre esa base con permiso y atribución, y el acuerdo de uso se cierra por escrito antes de empezar. En /creditos está el detalle de qué se conserva y qué cambia.`
  }

  if (has(value, ["dominio", "hosting", "publicar", "netlify", "vercel", "github"])) {
    return `Sí. El sitio se publica en el hosting que prefieras y apunta a tu dominio. También puedo dejarlo funcionando y entregarte los accesos: repositorio, dominio y cuentas quedan a tu nombre. La demo de este catálogo vive en GitHub Pages solo como escaparate.`
  }

  if (has(value, ["comentario", "foto", "imagen", "subir", "google drive", "captura"])) {
    return `En /comentarios puedes dejar tu opinión y adjuntar una foto de tu portátil o un enlace de Google Drive. La imagen se reduce en el navegador y se guarda solo ahí: no viaja a ningún servidor. Puedes borrar tu comentario cuando quieras; el resto de la página no se recarga.`
  }

  if (has(value, ["whatsapp", "contacto", "hablar", "escribir", "llamar", "agenda", "cita"])) {
    return `Puedes escribir por WhatsApp al +1 849 478 9660 o usar la página /contacto, donde también puedes elegir una fecha para una llamada. El mensaje sale ya redactado; solo tienes que pulsar enviar. Respondemos en horario de estudio.`
  }

  if (has(value, ["asistente", "ai", "ia", "quien eres", "que puedes", "modelo"])) {
    return `Soy una demostración del asistente de NEXUS LABS, construida con el SDK de Vercel AI sobre una base local de respuestas. No hay un modelo conectado ni puedo crear, editar o enviar nada: solo converso y te oriento. La conversación se guarda mientras la pestaña siga abierta y se borra al cerrarla.`
  }

  if (has(value, ["gracias", "perfecto", "genial", "vale"])) {
    return `A ti. Si quieres el siguiente paso, abre /contacto y elige una fecha, o escribe por WhatsApp al +1 849 478 9660.`
  }

  return `Puedo ayudarte con el catálogo, los plazos, los pagos, el dominio, las licencias o los comentarios. Prueba con algo como «¿cuánto tarda una tienda?» o «¿qué plantilla va para un hotel?». Si tu duda es de un proyecto concreto, lo mejor es escribir por WhatsApp al +1 849 478 9660: ahí responde una persona.`
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, ms)
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer)
        resolve()
      },
      { once: true }
    )
  })

class LocalChatTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
    abortSignal,
  }: {
    messages: UIMessage[]
    abortSignal?: AbortSignal
  }): Promise<ReadableStream<UIMessageChunk>> {
    const lastUser = [...messages].reverse().find((message) => message.role === "user")
    const reply = answerFor(lastUser ? textOf(lastUser) : "")
    const words = reply.match(/\S+\s*/g) ?? [reply]
    const id = `text-${Date.now()}`

    return new ReadableStream<UIMessageChunk>({
      async start(controller) {
        const push = (chunk: UIMessageChunk) => controller.enqueue(chunk)

        push({ type: "start" })
        await wait(260, abortSignal)
        push({ type: "text-start", id })

        for (const word of words) {
          if (abortSignal?.aborted) break
          push({ type: "text-delta", id, delta: word })
          await wait(24 + Math.min(word.length * 4, 40), abortSignal)
        }

        push({ type: "text-end", id })
        push({ type: "finish" })
        controller.close()
      },
    })
  }

  async reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null> {
    return null
  }
}

export const localTransport = new LocalChatTransport()
