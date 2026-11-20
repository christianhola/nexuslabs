import { useState } from "react"
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  MessageCircle,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Lens } from "@/components/ui/lens"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cap, statusTone, type Template } from "@/lib/data"
import { assetUrl, mailLink, SCOPES, SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

function SheetBody({
  template,
  onClose,
}: {
  template: Template
  onClose: () => void
}) {
  const [scope, setScope] = useState<string>(SCOPES[1])
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")

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
    <>
      <DrawerHeader className="items-start gap-1 border-b border-border p-5 pb-4 text-left">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="mono-label text-[0.6rem]">
              {template.industry} · {template.kindLabel}
            </p>
            <DrawerTitle className="mt-1.5 font-display text-3xl leading-none">
              {template.name}
            </DrawerTitle>
          </div>
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-full"
                aria-label="Cerrar la ficha"
              >
                <X />
              </Button>
            }
          />
        </div>
        <DrawerDescription className="text-[0.8rem] leading-5 text-muted-foreground">
          {template.description}
        </DrawerDescription>
      </DrawerHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        <div className="overflow-hidden rounded-xl border border-border">
          <Lens zoomFactor={1.6} lensSize={150} ariaLabel={`Ampliar ${template.name}`}>
            <img
              src={template.preview}
              alt={`Vista previa de ${template.name}`}
              width={960}
              height={660}
              className="aspect-[16/11] w-full object-cover object-top"
            />
          </Lens>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={cn(statusTone[template.statusClass])}>
            {template.status}
          </Badge>
          <Badge variant="secondary">{template.kindLabel}</Badge>
          {template.featured && <Badge variant="outline">Selección NEXUS</Badge>}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border py-4 text-[0.76rem]">
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

        <div className="mt-5">
          <h3 className="mono-label text-[0.6rem]">Lo que ya está resuelto</h3>
          <ul className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {template.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-[0.8rem] leading-5"
              >
                <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {cap(feature)}
              </li>
            ))}
          </ul>
        </div>

        {template.needs.length ? (
          <div className="mt-5 rounded-xl border border-amber-600/25 bg-amber-500/5 p-3.5">
            <p className="flex items-center gap-2 text-[0.76rem] font-medium text-amber-800 dark:text-amber-200">
              <AlertCircle className="size-3.5" />
              Para producción necesitarás
            </p>
            <ul className="mt-2 space-y-1 text-[0.74rem] leading-5 text-muted-foreground">
              {template.needs.map((need) => (
                <li key={need}>· {need}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-4 rounded-xl border border-border bg-muted/40 p-3.5 text-[0.74rem] leading-5 text-muted-foreground">
          {template.demoNote}
        </p>

        <div className="mt-6">
          <h3 className="mono-label text-[0.6rem]">Tu versión personalizada</h3>
          <RadioGroup
            value={scope}
            onValueChange={(value) => setScope(String(value))}
            className="mt-3 gap-2"
          >
            {SCOPES.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition has-data-checked:border-primary/60 has-data-checked:bg-primary/5"
              >
                <RadioGroupItem value={option} className="mt-0.5" />
                <span className="min-w-0">
                  <span className="block text-[0.82rem] font-medium">
                    {option}
                  </span>
                  <span className="mt-0.5 block text-[0.72rem] leading-4 text-muted-foreground">
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
              <FieldLabel htmlFor={`name-${template.id}`}>Tu nombre</FieldLabel>
              <Input
                id={`name-${template.id}`}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Cómo te llamas"
                className="h-9"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`notes-${template.id}`}>
                Qué quieres cambiar
              </FieldLabel>
              <Textarea
                id={`notes-${template.id}`}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Colores, secciones nuevas, pagos, idiomas…"
                rows={3}
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Button
              className="h-10 flex-1 gap-2 rounded-full"
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
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-full"
              render={<a href={assetUrl(template.href)} target="_blank" rel="noreferrer" />}
              onClick={onClose}
            >
              Ver demo
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
          <p className="mt-2.5 text-center text-[0.68rem] text-muted-foreground">
            Sin formularios que se pierdan: el mensaje sale directo a NEXUS
            LABS.
          </p>
        </div>
      </div>
    </>
  )
}

export function TemplateSheet({
  template,
  onClose,
}: {
  template: Template | null
  onClose: () => void
}) {
  return (
    <Drawer
      open={Boolean(template)}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      swipeDirection="right"
      showSwipeHandle
    >
      <DrawerContent className="[--drawer-content-width:100%]! sm:[--drawer-content-width:36rem]!">
        {template ? (
          <SheetBody
            key={template.id}
            template={template}
            onClose={onClose}
          />
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
