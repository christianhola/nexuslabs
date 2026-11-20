import { useState } from "react"
import { Link } from "react-router-dom"
import confetti from "canvas-confetti"
import {
  ArrowUpRight,
  Check,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { SectionHead } from "@/components/section-head"
import { InstagramIcon } from "@/components/social-icons"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Backlight } from "@/components/ui/backlight"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DitherField } from "@/components/ui/dither-field"
import { GlareHover } from "@/components/ui/glare-hover"
import { HexagonPattern } from "@/components/ui/hexagon-pattern"
import { Input } from "@/components/ui/input"
import { Item, ItemContent, ItemMedia, ItemTitle, ItemDescription } from "@/components/ui/item"
import { NoiseTexture } from "@/components/ui/noise-texture"
import { TextAnimate } from "@/components/ui/text-animate"
import { data } from "@/lib/data"
import {
  customRequest,
  GITHUB,
  instagramLink,
  INSTAGRAM,
  VIDEO_ID,
  waLink,
} from "@/lib/site"

const steps = [
  {
    pattern: "horizon" as const,
    title: "Elige el territorio",
    copy: "Abre las demos y quédate con la que ya habla el idioma de tu negocio. No empiezas de cero: ajustas algo que funciona.",
  },
  {
    pattern: "waves" as const,
    title: "Cuéntanos tu versión",
    copy: "Por WhatsApp defines alcance, marca, fotos y lo que necesitas conectar. Sin briefs eternos ni reuniones de relleno.",
  },
  {
    pattern: "aurora" as const,
    title: "Recibes el sitio real",
    copy: "Tu contenido, tu dominio, tus pagos. Entregamos el código y lo dejamos publicado contigo, no una captura bonita.",
  },
]

export function Process({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="proceso" className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        {showHeading && (
          <SectionHead
            eyebrow="Cómo se trabaja"
            title={
              <>
                Menos ceremonia.{" "}
                <span className="display-italic text-primary">Más entrega.</span>
              </>
            }
            description="Un proceso corto, en tres conversaciones. Tú decides hasta dónde llegar y nosotros ponemos el criterio técnico y visual."
          />
        )}

        <div className={`grid gap-4 md:grid-cols-3 ${showHeading ? "mt-10" : ""}`}>
          {steps.map((step, index) => (
            <BlurFade key={step.title} delay={index * 0.07} inView>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <DitherField
                  pattern={step.pattern}
                  color="var(--primary)"
                  intensity={0.9}
                  interactive={false}
                  className="h-40 w-full opacity-90"
                />
                <div className="relative flex flex-1 flex-col p-5">
                  <h3 className="font-display text-2xl leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[0.82rem] leading-6 text-muted-foreground">
                    {step.copy}
                  </p>
                </div>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Studio({ showHeading = true }: { showHeading?: boolean }) {
  const [playing, setPlaying] = useState(false)
  return (
    <section id="estudio" className="border-y border-border bg-card/25 py-20 sm:py-24">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <BlurFade inView>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-soft">
              {playing ? (
                <iframe
                  className="aspect-video w-full"
                  src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                  title="NEXUS LABS en vídeo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group relative block w-full text-left"
                  aria-label="Reproducir el vídeo de NEXUS LABS"
                >
                  <img
                    src={`https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                    alt="Miniatura del vídeo de presentación de NEXUS LABS"
                    width={960}
                    height={540}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Backlight blur={12}>
                      <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition group-hover:scale-105">
                        <Play className="ml-0.5 size-5 fill-current" />
                      </span>
                    </Backlight>
                  </span>
                  <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[0.65rem] tracking-[0.16em] text-white/90 uppercase backdrop-blur">
                    <Sparkles className="size-3" />
                    Dentro del estudio
                  </span>
                </button>
              )}
            </div>
          </div>
        </BlurFade>

        <div>
          {showHeading && (
            <SectionHead
              eyebrow="NEXUS LABS"
              title={
                <>
                  Un estudio pequeño,{" "}
                  <span className="display-italic text-primary">obsesivo</span>.
                </>
              }
              description="No vendemos volumen. Cada plantilla del catálogo se instala, se abre, se recorre y se corrige antes de publicarse. Lo que ves en la demo es exactamente lo que recibes como base."
            />
          )}

          <div className={`grid gap-2 ${showHeading ? "mt-7" : ""}`}>
            {[
              {
                title: "Diseño con criterio editorial",
                copy: "Tipografía, ritmo y fotografía tratados como en una revista, no como un tema genérico.",
              },
              {
                title: "Código real, sin cajas negras",
                copy: "React, TypeScript y Tailwind. Componentes accesibles, no imágenes de una interfaz.",
              },
              {
                title: "Respeto por el trabajo original",
                copy: "Créditos y licencias de cada autor conservados en el repositorio.",
              },
            ].map((item) => (
              <Item key={item.title} variant="outline" className="bg-background/60">
                <ItemMedia variant="icon">
                  <Check className="size-4 text-primary" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{item.title}</ItemTitle>
                  <ItemDescription>{item.copy}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              className="h-10 gap-2 rounded-full"
              render={
                <a
                  href={instagramLink()}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              <InstagramIcon />
              @{INSTAGRAM}
            </Button>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-full"
              render={<a href={GITHUB} target="_blank" rel="noreferrer" />}
            >
              Ver el repositorio
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Subscribe() {
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      toast.error("Revisa el correo", {
        description: "Escribe un email válido para avisarte.",
      })
      return
    }
    if (!consent) {
      toast.error("Falta tu permiso", {
        description: "Marca la casilla para que podamos escribirte.",
      })
      return
    }

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { x: 0.15, y: 0.75 },
      colors: ["#e7c79b", "#b4763c", "#f4eee3", "#8ba57e"],
    })
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { x: 0.85, y: 0.75 },
      colors: ["#e7c79b", "#b4763c", "#f4eee3", "#8ba57e"],
    })

    const message = `Hola NEXUS LABS 👋 Quiero recibir el aviso de nuevas plantillas.\nMi correo: ${value}`
    window.open(waLink(message), "_blank", "noopener,noreferrer")
    toast.success("Perfecto", {
      description: "Te escribimos por WhatsApp para confirmar el aviso.",
    })
    setEmail("")
  }

  return (
    <section id="aviso" className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <BlurFade inView>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
            <NoiseTexture className="opacity-[0.35] dark:opacity-40" />
            <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mono-label">Aviso de nuevas piezas</p>
                <h2 className="mt-3 font-display text-3xl leading-[1.05] sm:text-4xl">
                  Te avisamos cuando salga{" "}
                  <span className="display-italic text-primary">la siguiente</span>.
                </h2>
                <p className="mt-3 max-w-md text-[0.85rem] leading-6 text-muted-foreground">
                  Una nota corta, sin ruido: nuevas plantillas, mejoras y alguna
                  que otra pieza de estudio. Nada de secuencias automáticas.
                </p>
              </div>

              <form onSubmit={submit} className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="tu@correo.com"
                    aria-label="Tu correo electrónico"
                    className="h-11 flex-1 bg-background/80"
                    required
                  />
                  <Button type="submit" className="h-11 gap-2 rounded-full px-5">
                    Avisarme
                    <ArrowUpRight data-icon="inline-end" />
                  </Button>
                </div>
                <label className="flex items-start gap-2.5 text-[0.72rem] leading-4 text-muted-foreground">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(Boolean(checked))}
                    className="mt-0.5"
                    aria-label="Acepto que me escriban por WhatsApp"
                  />
                  Acepto que NEXUS LABS me escriba por WhatsApp sobre el aviso.
                </label>
              </form>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

const faqs = [
  {
    q: "¿Qué incluye exactamente una plantilla?",
    a: "El sitio completo: todas las secciones que ves en la demo, sus estilos, imágenes de referencia y el código fuente editable. No es una captura ni un Figma: es una web que funciona.",
  },
  {
    q: "¿Puedo probarla antes de pedir cambios?",
    a: "Sí. Cada ficha abre la demo real, no una maqueta. Puedes navegar, abrir menús y recorrer los formularios. En GitHub Pages no se envían correos ni se cobran pagos: eso se conecta en tu versión.",
  },
  {
    q: "¿Los formularios y pagos funcionan en la demo?",
    a: "La interfaz está terminada, pero al ser una demo estática no hay servidor detrás. En tu versión personalizada conectamos el correo, la base de datos o la pasarela que necesites y lo dejamos probado antes de publicar.",
  },
  {
    q: "¿Cuánto tarda una versión personalizada?",
    a: "Depende del alcance: una landing con tu marca es un trabajo corto; una tienda con pagos o una app con cuentas es otro. Por WhatsApp te damos alcance y plazo concretos antes de empezar, sin sorpresas.",
  },
  {
    q: "¿Puedo usar mi propio dominio?",
    a: "Sí. El sitio se despliega en el hosting que prefieras y apunta a tu dominio. También podemos dejarlo funcionando y entregarte los accesos.",
  },
  {
    q: "¿De quién son los derechos de estas plantillas?",
    a: "De sus autores originales. Este catálogo es una presentación comercial de la biblioteca y conserva créditos y licencias. La versión que encargues se construye sobre esa base con permiso y atribución.",
  },
]

export function Faq({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="preguntas" className="py-20 sm:py-24">
      <div
        className={
          showHeading
            ? "mx-auto grid w-full max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]"
            : "mx-auto w-full max-w-3xl px-5 sm:px-8"
        }
      >
        {showHeading && (
          <SectionHead
            eyebrow="Antes de escribir"
            title={
              <>
                Las dudas{" "}
                <span className="display-italic text-primary">razonables</span>.
              </>
            }
            description="Si falta algo, pregúntalo por WhatsApp: contestamos con el mismo criterio con el que construimos."
          />
        )}
        <BlurFade inView>
          <Accordion className="border-t border-border">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`faq-${index}`}>
                <AccordionTrigger className="py-4 text-[0.92rem] hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl text-[0.84rem] leading-6 text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </BlurFade>
      </div>
    </section>
  )
}

export function Credits() {
  return (
    <section className="border-y border-border bg-card/25 py-14">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="mono-label">Créditos y licencias</p>
          <p className="mt-3 text-[0.86rem] leading-6 text-muted-foreground">
            NEXUS LABS presenta una biblioteca de {data.total} plantillas
            creadas por autores independientes. Los diseños, nombres y licencias
            originales se conservan en el repositorio; este catálogo no reclama
            su autoría. Si eres autor y quieres ajustar un crédito, escríbenos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            render={<a href={GITHUB} target="_blank" rel="noreferrer" />}
          >
            Créditos en GitHub
            <ArrowUpRight data-icon="inline-end" />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            render={
              <a
                href={waLink(
                  "Hola NEXUS LABS 👋 Quiero revisar un crédito de una plantilla del catálogo."
                )}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <MessageCircle data-icon="inline-start" />
            Hablar del catálogo
          </Button>
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section id="contacto" className="py-20 sm:py-24">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <GlareHover
          background="var(--card)"
          color="#e7c79b"
          opacity={0.28}
          angle={-28}
          size={320}
          duration={900}
          className="relative overflow-hidden rounded-3xl border border-border shadow-soft"
        >
          <HexagonPattern
            radius={28}
            gap={10}
            className="absolute inset-0 h-full w-full stroke-foreground/10 [mask-image:radial-gradient(80%_80%_at_70%_20%,black,transparent)]"
          />
          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="mono-label">Tu versión, esta semana</p>
              <TextAnimate
                as="h2"
                animation="blurInUp"
                by="word"
                startOnView
                once
                className="mt-3 font-display text-[2.6rem] leading-[0.98] sm:text-6xl"
              >
                Cuéntanos qué tienes en mente.
              </TextAnimate>
              <p className="mt-4 max-w-lg text-[0.9rem] leading-6 text-muted-foreground">
                Elige una plantilla del catálogo o llega con una idea suelta.
                Respondemos con alcance, plazo y una propuesta clara por
                WhatsApp.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="h-12 gap-2 rounded-full text-[0.92rem]"
                render={
                  <a
                    href={customRequest()}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <MessageCircle data-icon="inline-start" />
                Escribir por WhatsApp
              </Button>
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-full bg-background/60"
                render={<Link to="/plantillas" />}
              >
                Volver al catálogo
                <ArrowUpRight data-icon="inline-end" />
              </Button>
              <p className="mt-1 text-center text-[0.68rem] text-muted-foreground">
                +1 849 478 9660 · respuesta en horario de estudio
              </p>
            </div>
          </div>
        </GlareHover>
      </div>
    </section>
  )
}
