import { useState } from "react"
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Info,
  MessageCircle,
  Send,
} from "lucide-react"

import { PageHero } from "@/pages/page-hero"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { InstagramIcon, WhatsappIcon } from "@/components/social-icons"
import { customRequest, GITHUB, instagramLink, INSTAGRAM, waLink } from "@/lib/site"

const today = new Date()
today.setHours(0, 0, 0, 0)

export function ContactPage() {
  const [date, setDate] = useState<Date | undefined>()
  const [confirm, setConfirm] = useState(false)

  const label = date
    ? new Intl.DateTimeFormat("es", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(date)
    : null

  const message = waLink(
    `Hola NEXUS LABS 👋 Quiero reservar una llamada${
      label ? ` el ${label}` : ""
    } para hablar de un proyecto.`
  )

  return (
    <div>
      <PageHero
        eyebrow="Contacto y agenda"
        title={
          <>
            Hablemos de tu{" "}
            <span className="display-italic text-primary">próximo sitio</span>.
          </>
        }
        description="Elige una fecha para una llamada corta de alcance, o escribe directamente por WhatsApp. Sin formularios que se pierdan ni secuencias automáticas: responde una persona."
        aside={
          <Button
            className="h-11 gap-2 rounded-full px-5"
            render={<a href={customRequest()} target="_blank" rel="noreferrer" />}
          >
            <WhatsappIcon />
            Escribir ahora
          </Button>
        }
      />

      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="mono-label flex items-center gap-2">
                <CalendarDays className="size-3.5 text-primary" />
                Agenda una llamada
              </p>
              <h2 className="mt-2 font-display text-3xl leading-tight">
                Elige el día.
              </h2>
            </div>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full text-muted-foreground"
                    aria-label="Qué incluye la llamada"
                  >
                    <Info />
                  </Button>
                }
              />
              <PopoverContent align="end" className="w-72">
                <p className="text-[0.8rem] font-medium">
                  Qué incluye la llamada
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.74rem] leading-5 text-muted-foreground">
                  <li>· 20 minutos para entender el negocio y el alcance.</li>
                  <li>· Qué plantilla encaja y qué hay que cambiar.</li>
                  <li>· Un plazo y un rango de precio orientativos.</li>
                  <li>· Sin compromiso y sin presentación comercial larga.</li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-card p-3 shadow-soft sm:p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: today }}
              captionLayout="dropdown"
              classNames={{ root: "mx-auto w-full max-w-[21rem]" }}
              className="rounded-xl border-0 p-1 [--cell-size:2.2rem]"
            />
            <div className="mt-3 flex flex-col gap-3 border-t border-border px-2 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[0.66rem] tracking-[0.12em] text-muted-foreground uppercase">
                  Fecha elegida
                </p>
                <p className="mt-0.5 truncate font-display text-xl first-letter:uppercase">
                  {label ?? "Ninguna todavía"}
                </p>
              </div>
              <Button
                className="h-10 shrink-0 gap-2 rounded-full"
                disabled={!date}
                onClick={() => setConfirm(true)}
              >
                <Send data-icon="inline-start" />
                Reservar llamada
              </Button>
            </div>
          </div>
          <p className="mt-2 px-1 text-[0.68rem] leading-5 text-muted-foreground">
            La reserva se confirma por WhatsApp. No se cobra nada y puedes
            cambiar la fecha respondiendo al mismo mensaje.
          </p>
        </div>

        <div className="grid content-start gap-4">
          <a
            href={customRequest()}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-soft"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <WhatsappIcon />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[0.85rem] font-medium">
                WhatsApp
                <ArrowUpRight className="size-3.5 text-muted-foreground transition group-hover:text-primary" />
              </span>
              <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                +1 849 478 9660 · mensaje ya redactado
              </span>
            </span>
          </a>

          <a
            href={instagramLink()}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-soft"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <InstagramIcon />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-[0.85rem] font-medium">
                @{INSTAGRAM}
                <ArrowUpRight className="size-3.5 text-muted-foreground transition group-hover:text-primary" />
              </span>
              <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                Procesos y piezas nuevas del estudio
              </span>
            </span>
          </a>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-[0.85rem] font-medium">
              <Clock className="size-4 text-primary" />
              Horario de estudio
            </p>
            <p className="mt-1.5 text-[0.78rem] leading-6 text-muted-foreground">
              Lunes a viernes, 9:00 a 18:00 (GMT-4). Los mensajes fuera de
              horario se contestan al día siguiente.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[0.85rem] font-medium">Para empezar, cuéntame</p>
            <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-6 text-muted-foreground">
              <li>· Qué negocio tienes y a quién le vendes.</li>
              <li>· Qué plantilla te gustó o qué necesita el sitio.</li>
              <li>· Si hay pagos, cuentas o reservas que conectar.</li>
              <li>· Para cuándo lo necesitas.</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="h-7 px-2.5 text-[0.7rem] font-normal"
                render={
                  <a href={GITHUB} target="_blank" rel="noreferrer">
                    Repositorio
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                }
              />
              <Badge
                variant="secondary"
                className="h-7 gap-1 px-2.5 text-[0.7rem] font-normal"
              >
                <MessageCircle data-icon="inline-start" />
                Respuesta humana
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reservamos el {label}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se abrirá WhatsApp con el mensaje escrito. La cita queda
              confirmada cuando el estudio responda, no al enviar el mensaje.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cambiar fecha</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.open(message, "_blank", "noopener,noreferrer")
              }}
            >
              Abrir WhatsApp
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
