import { useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  MessageCircle,
} from "lucide-react"
import { toast } from "sonner"

import { TemplateCard } from "@/components/catalog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cap, data } from "@/lib/data"
import { assetUrl, mailLink, SCOPES, SITE_URL } from "@/lib/site"

export function TemplatePage() {
  const { id } = useParams()
  const template = data.items.find((item) => item.id === id)
  const [scope, setScope] = useState<string>(SCOPES[1])
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")

  if (!template) {
    return <Navigate to="/plantillas" replace />
  }

  const related = data.items
    .filter(
      (item) => item.category === template.category && item.id !== template.id
    )
    .slice(0, 3)

  const message = [
    `Hola NEXUS LABS 👋 Me interesa la plantilla «${template.name}» y quiero una versión personalizada.`,
    `Alcance: ${scope.toLowerCase()}.`,
    name.trim() ? `Soy ${name.trim()}.` : "",
    notes.trim() ? `Idea: ${notes.trim()}` : "",
    `La vi en ${SITE_URL}`,
  ]
    .filter(Boolean)
    .join("\n")

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto w-full max-w-[1240px] px-5 pt-8 pb-10 sm:px-8">
          <Link
            to="/plantillas"
            className="inline-flex items-center gap-1.5 text-[0.75rem] text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Volver al catálogo
          </Link>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mono-label">
                {template.industry} · {template.kindLabel}
              </p>
              <h1 className="mt-2 font-display text-[3rem] leading-[0.95] tracking-[-0.02em] sm:text-6xl">
                {template.name}
              </h1>
              <p className="mt-4 max-w-2xl text-[0.9rem] leading-6 text-muted-foreground">
                {template.description}
              </p>
            </div>
            <p className="mono-label flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
              <span>{template.status}</span>
              <span aria-hidden="true">·</span>
              <span>{template.kindLabel}</span>
              {template.featured ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-primary">Selección NEXUS</span>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div className="min-w-0">
          <div className="overflow-hidden bg-muted/40">
            <img
              src={assetUrl(template.preview)}
              alt={`Vista previa de ${template.name}`}
              width={1200}
              height={820}
              className="aspect-[16/11] w-full object-cover object-top"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1 rounded-full"
              render={
                <a
                  href={assetUrl(template.href)}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 px-3 text-[0.75rem]"
                >
                  Abrir demo real
                  <ArrowUpRight data-icon="inline-end" />
                </a>
              }
            />
            <p className="text-[0.7rem] text-muted-foreground">
              La demo es exactamente el sitio que recibes como base.
            </p>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-border py-5 text-[0.78rem]">
            <div>
              <dt className="text-muted-foreground">Industria</dt>
              <dd className="mt-0.5 font-medium">{template.industry}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Formato</dt>
              <dd className="mt-0.5 font-medium">{template.kindLabel}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Se entrega</dt>
              <dd className="mt-0.5 font-medium">Código completo y editable</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Empieza desde</dt>
              <dd className="mt-0.5 font-medium">Tu marca y tus fotos</dd>
            </div>
          </dl>

          <div className="mt-7">
            <h2 className="mono-label text-[0.62rem]">
              Lo que ya está resuelto
            </h2>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {template.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-[0.84rem] leading-5"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                  {cap(feature)}
                </li>
              ))}
            </ul>
          </div>

          {template.needs.length ? (
            <div className="mt-7 border-t border-amber-600/30 pt-3">
              <p className="flex items-center gap-2 text-[0.8rem] font-medium text-amber-800 dark:text-amber-200">
                <AlertCircle className="size-3.5" />
                Para producción necesitarás
              </p>
              <ul className="mt-2 space-y-1 text-[0.78rem] leading-5 text-muted-foreground">
                {template.needs.map((need) => (
                  <li key={need}>· {need}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-7 border-t border-border pt-4 text-[0.78rem] leading-6 text-muted-foreground">
            {template.demoNote}
          </p>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="border-t border-border pt-5">
            <p className="mono-label text-[0.6rem]">Tu versión personalizada</p>
            <h2 className="mt-2 font-display text-2xl leading-tight">
              Pide esta base con tu marca.
            </h2>

            <RadioGroup
              value={scope}
              onValueChange={(value) => setScope(String(value))}
              className="mt-4 gap-2"
            >
              {SCOPES.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-3 border-b border-border/70 py-2.5 text-muted-foreground transition has-data-checked:text-foreground"
                >
                  <RadioGroupItem value={option} className="mt-0.5" />
                  <span className="min-w-0">
                    <span className="block text-[0.8rem] font-medium">
                      {option}
                    </span>
                    <span className="mt-0.5 block text-[0.7rem] leading-4 text-muted-foreground">
                      {option === "Landing esencial"
                        ? "Una página, tu identidad y el formulario conectado."
                        : option === "Sitio completo"
                          ? "Varias secciones o páginas, contenido y SEO base."
                          : option === "Tienda con pagos"
                            ? "Catálogo, carrito y cobro con la pasarela que uses."
                            : "Cuentas, base de datos o integraciones a medida."}
                    </span>
                  </span>
                </label>
              ))}
            </RadioGroup>

            <div className="mt-4 grid gap-3">
              <Field>
                <FieldLabel htmlFor="template-name">Tu nombre</FieldLabel>
                <Input
                  id="template-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Cómo te llamas"
                  className="h-9"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="template-notes">
                  Qué quieres cambiar
                </FieldLabel>
                <Textarea
                  id="template-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Colores, secciones nuevas, pagos, idiomas…"
                  rows={3}
                />
              </Field>
            </div>

            <Button
              className="mt-4 h-10 w-full gap-2 rounded-full"
              render={<a href={mailLink(message, `NEXUS LABS · ${template.name}`)} />}
              onClick={() =>
                toast.success("Abriendo correo", {
                  description: "El mensaje ya va escrito, solo pulsa enviar.",
                })
              }
            >
              <MessageCircle data-icon="inline-start" />
              Solicitar por correo
            </Button>
            <p className="mt-2.5 text-center text-[0.68rem] text-muted-foreground">
              Sin formularios que se pierdan: el mensaje sale directo.
            </p>
          </div>
        </aside>
      </div>

      {related.length ? (
        <section className="border-t border-border py-14">
          <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl">
                Más de <span className="display-italic text-primary">{template.industry}</span>
              </h2>
              <Link
                to={`/plantillas?industria=${template.category}`}
                className="text-[0.75rem] text-muted-foreground transition hover:text-foreground"
              >
                Ver todas
              </Link>
            </div>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item, index) => (
                <TemplateCard key={item.id} template={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
