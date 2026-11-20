import { Link } from "react-router-dom"
import { ArrowUpRight, Check, MessageCircle, Sparkles } from "lucide-react"

import { TemplateCard } from "@/components/catalog"
import { Hero } from "@/components/hero"
import { Industries } from "@/components/industries"
import { Process, Subscribe } from "@/components/sections"
import { SectionHead } from "@/components/section-head"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { data } from "@/lib/data"
import { customRequest } from "@/lib/site"

const promises = [
  "Demos reales, no maquetas",
  "Código y licencias originales",
  "Personalización por correo",
]

export function HomePage() {
  const featured = data.items.filter((item) => item.featured).slice(0, 6)

  return (
    <div>
      <Hero />
      <Industries />

      <section className="border-y border-border bg-card/25 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <SectionHead
            eyebrow="Selección del estudio"
            title={
              <>
                Seis piezas para{" "}
                <span className="display-italic text-primary">empezar</span>.
              </>
            }
            description="Las que mejor resisten una marca nueva: fotografía, ritmo y estructura ya resueltos. Cada una abre su propia página con todo lo que incluye."
            aside={
              <Badge
                variant="outline"
                className="h-8 gap-1 rounded-full px-3 text-[0.75rem] font-normal"
                render={
                  <Link to="/plantillas">
                    Ver las {data.total}
                    <ArrowUpRight data-icon="inline-end" />
                  </Link>
                }
              />
            }
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((template, index) => (
              <TemplateCard key={template.id} template={template} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Process />

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            {promises.map((promise) => (
              <div
                key={promise}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card/60 px-4 py-3 text-[0.8rem]"
              >
                <Check className="size-3.5 shrink-0 text-primary" />
                {promise}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Subscribe />

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
            <div>
              <p className="mono-label flex items-center gap-2">
                <Sparkles className="size-3 text-primary" />
                Antes de escribir
              </p>
              <p className="mt-2 max-w-xl text-[0.88rem] leading-6 text-muted-foreground">
                Si tienes dudas de alcance, plazos o licencias, hay una página
                para cada cosa. O pregunta al asistente y te orienta sin
                compromiso.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="h-9 rounded-full"
                render={<Link to="/preguntas" />}
              >
                Preguntas
              </Button>
              <Button
                className="h-9 gap-2 rounded-full"
                render={<Link to="/asistente" />}
              >
                <MessageCircle data-icon="inline-start" />
                Hablar con el asistente
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
          <div className="grid gap-6 rounded-3xl border border-border bg-card p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
            <div>
              <p className="mono-label">Tu versión, esta semana</p>
              <h2 className="mt-3 font-display text-4xl leading-[0.98] sm:text-5xl">
                Cuéntanos qué tienes en mente.
              </h2>
              <p className="mt-3 max-w-lg text-[0.88rem] leading-6 text-muted-foreground">
                Elige una plantilla del catálogo o llega con una idea suelta.
                Respondemos con alcance, plazo y una propuesta clara.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                className="h-11 gap-2 rounded-full px-5"
                render={<a href={customRequest()} />}
              >
                <MessageCircle data-icon="inline-start" />
                Escribir por correo
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full"
                render={<Link to="/contacto" />}
              >
                Ver contacto y agenda
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
