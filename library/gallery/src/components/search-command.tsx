import { useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  CornerDownLeft,
  ImageIcon,
  Search,
  Sparkles,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Highlighter } from "@/components/ui/highlighter"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Skeleton } from "@/components/ui/skeleton"
import { TextReveal } from "@/components/ui/text-reveal"
import { data, type Template } from "@/lib/data"
import { searchTemplates, searchTransport } from "@/lib/search"
import { assetUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

const suggestions = ["Hotel boutique", "Tienda de ropa", "SaaS", "Restaurante", "Juego"]

const featured = data.items.filter((item) => item.featured).slice(0, 6)

function messageText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("")
}

function ResultCard({
  template,
  onNavigate,
}: {
  template: Template
  onNavigate: () => void
}) {
  return (
    <article className="group h-full overflow-hidden rounded-xl border border-border bg-background transition hover:border-primary/40">
      <Link
        to={`/plantillas/${template.id}`}
        onClick={onNavigate}
        className="block overflow-hidden"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={assetUrl(template.preview)}
            alt={`Vista previa de ${template.name}`}
            loading="lazy"
            className="size-full object-cover object-top transition duration-500 group-hover:scale-[1.035]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent opacity-70" />
          <Badge
            variant="outline"
            className="absolute bottom-2 left-2 border-white/25 bg-black/35 text-[0.62rem] text-white backdrop-blur"
          >
            {template.kindLabel}
          </Badge>
        </div>
      </Link>

      <div className="p-3">
        <HoverCard>
          <HoverCardTrigger
            render={
              <button
                type="button"
                className="mono-label text-left text-[0.58rem] transition hover:text-foreground"
              />
            }
          >
            {template.industry}
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-64">
            <p className="text-[0.72rem] font-medium">{template.name}</p>
            <p className="mt-1 text-[0.7rem] leading-4 text-muted-foreground">
              {template.description}
            </p>
            <p className="mt-2 border-t border-border pt-2 text-[0.64rem] text-muted-foreground">
              {template.status} · {template.features.slice(0, 2).join(" · ")}
            </p>
          </HoverCardContent>
        </HoverCard>

        <div className="mt-1 flex items-start justify-between gap-2">
          <Link
            to={`/plantillas/${template.id}`}
            onClick={onNavigate}
            className="font-display text-[1.18rem] leading-tight transition hover:text-primary"
          >
            {template.name}
          </Link>
          <a
            href={assetUrl(template.href)}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir la demo de ${template.name}`}
            className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>

        <p className="mt-1 line-clamp-2 text-[0.72rem] leading-5 text-muted-foreground">
          {template.description}
        </p>
      </div>
    </article>
  )
}

function ResultSkeletons() {
  return (
    <div className="mt-3 flex gap-3 overflow-hidden">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="w-[86%] shrink-0 rounded-xl border border-border bg-background p-2 sm:w-[48%]"
        >
          <Skeleton className="aspect-[16/10] w-full rounded-lg" />
          <div className="space-y-2 p-1 pt-3">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SearchCommand({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const sentFor = useRef("")
  const { messages, sendMessage, status } = useChat({
    id: "nexus-search",
    transport: searchTransport,
  })

  const results = useMemo(() => searchTemplates(debounced, 8), [debounced])
  const latestAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")
  const answer = latestAssistant ? messageText(latestAssistant.parts) : ""
  const typing = status === "submitted" || status === "streaming"
  const pending = query.trim() !== debounced
  const showLoading = Boolean(query.trim()) && (pending || (typing && !answer))

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => {
      document.body.style.overflow = original
      window.clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => setDebounced(query.trim()), 180)
    return () => window.clearTimeout(timer)
  }, [query, open])

  useEffect(() => {
    if (!open || !debounced || sentFor.current === debounced) return
    sentFor.current = debounced
    sendMessage({ text: debounced })
  }, [debounced, open, sendMessage])

  function close() {
    setOpen(false)
    setQuery("")
    setDebounced("")
    sentFor.current = ""
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar en el catálogo"
        className={cn(
          "group flex h-10 w-full items-center gap-2 rounded-full border border-border bg-card/60 px-3 text-left text-[0.78rem] text-muted-foreground transition hover:border-primary/40 hover:bg-card hover:text-foreground",
          className
        )}
      >
        <Search className="size-4 shrink-0" />
        <span className="hidden min-w-0 flex-1 truncate xl:inline">
          Buscar una plantilla…
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-black/45 px-3 pt-[7vh] pb-4 backdrop-blur-sm sm:px-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscador del catálogo"
            className="flex max-h-[86dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="border-b border-border p-3 sm:p-4">
              <InputGroup className="h-12 rounded-xl border-transparent bg-muted/55 shadow-none focus-within:bg-background">
                <InputGroupAddon>
                  <Search className="text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && results[0]) {
                      window.location.assign(
                        `${import.meta.env.BASE_URL}plantillas/${results[0].id}`.replace(
                          /([^:]\/)\/+/g,
                          "$1"
                        )
                      )
                    }
                  }}
                  placeholder="Describe el negocio, la industria o lo que necesitas…"
                  aria-label="Buscar plantillas"
                  className="text-[0.92rem]"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  {query ? (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("")
                        inputRef.current?.focus()
                      }}
                      aria-label="Limpiar búsqueda"
                      className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : null}
                  <Kbd>esc</Kbd>
                </InputGroupAddon>
              </InputGroup>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion)
                      inputRef.current?.focus()
                    }}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[0.68rem] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
                <span className="ml-auto hidden items-center gap-1 text-[0.62rem] text-muted-foreground sm:flex">
                  <CornerDownLeft className="size-3" /> abre el primer resultado
                </span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4">
              {!query.trim() ? (
                <div className="pb-2">
                  <TextReveal className="px-2 text-center font-display text-[1.45rem] leading-tight text-muted-foreground sm:text-[1.7rem]">
                    Escribe un negocio y mira las páginas antes de abrirlas.
                  </TextReveal>

                  <div className="mt-5 flex items-center gap-2 px-1">
                    <Sparkles className="size-3.5 text-primary" />
                    <p className="mono-label">Recomendadas para empezar</p>
                  </div>

                  <Carousel className="mt-2.5">
                    <CarouselContent>
                      {featured.map((template) => (
                        <CarouselItem key={template.id}>
                          <ResultCard template={template} onNavigate={close} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-3" />
                    <CarouselNext className="-right-3" />
                  </Carousel>

                  <p className="mt-4 px-2 text-center text-[0.7rem] leading-5 text-muted-foreground">
                    La búsqueda corre en tu navegador sobre el catálogo.{" "}
                    <Highlighter action="underline" color="var(--primary)">
                      Sin enviar tu consulta a ningún servidor.
                    </Highlighter>
                  </p>
                </div>
              ) : (
                <BubbleGroup className="gap-4">
                  <Bubble align="end" variant="muted">
                    <BubbleContent className="text-[0.82rem] leading-5">
                      {query.trim()}
                    </BubbleContent>
                  </Bubble>

                  <div className="flex min-w-0 gap-2.5">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[0.6rem] font-medium text-primary">
                      NL
                    </span>
                    <div className="min-w-0 flex-1">
                      {showLoading ? (
                        <div className="space-y-2 py-1.5">
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ) : (
                        <Bubble variant="ghost">
                          <BubbleContent className="text-[0.82rem] leading-6 text-foreground/90">
                            {answer || "Buscando en el catálogo…"}
                            {typing ? (
                              <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-primary align-middle" />
                            ) : null}
                          </BubbleContent>
                        </Bubble>
                      )}

                      {showLoading ? (
                        <ResultSkeletons />
                      ) : results.length ? (
                        <>
                          <div className="mt-3 flex items-center gap-2">
                            <ImageIcon className="size-3.5 text-primary" />
                            <p className="mono-label">
                              {results.length} páginas encontradas
                            </p>
                          </div>

                          <Carousel className="mt-2.5">
                            <CarouselContent>
                              {results.map((template) => (
                                <CarouselItem key={template.id}>
                                  <ResultCard
                                    template={template}
                                    onNavigate={close}
                                  />
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-3" />
                            <CarouselNext className="-right-3" />
                          </Carousel>

                          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                            Fuente:
                            <HoverCard>
                              <HoverCardTrigger
                                render={
                                  <button
                                    type="button"
                                    className="rounded-full border border-border bg-background px-2 py-0.5 text-[0.66rem] font-medium text-foreground transition hover:border-primary/40"
                                  >
                                    catálogo NEXUS
                                  </button>
                                }
                              />
                              <HoverCardContent className="flex w-64 flex-col gap-1">
                                <p className="text-[0.74rem] font-medium">
                                  Catálogo NEXUS LABS
                                </p>
                                <p className="text-[0.7rem] leading-5 text-muted-foreground">
                                  {data.total} plantillas revisadas, con vista
                                  previa, ficha y demo real. Los resultados se
                                  ordenan por nombre, industria, etiquetas y
                                  funciones.
                                </p>
                                <Link
                                  to="/plantillas"
                                  onClick={close}
                                  className="mt-1 text-[0.68rem] text-muted-foreground underline underline-offset-4 hover:text-foreground"
                                >
                                  Ver el catálogo completo
                                </Link>
                              </HoverCardContent>
                            </HoverCard>
                            <span>·</span>
                            búsqueda local
                          </p>
                        </>
                      ) : (
                        <div className="mt-3 rounded-xl border border-dashed border-border bg-background/60 p-4">
                          <p className="text-[0.8rem] leading-6">
                            No hay resultados para «{query.trim()}». Prueba con{" "}
                            <Highlighter color="var(--primary)">
                              hotel, tienda o SaaS
                            </Highlighter>
                            , o pide una pieza nueva.
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 h-8 gap-1.5 rounded-full"
                            render={
                              <Link to="/contacto" onClick={close} />
                            }
                          >
                            Pedir una versión a medida
                            <ArrowUpRight className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </BubbleGroup>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-border bg-muted/30 px-4 py-2.5 text-[0.66rem] text-muted-foreground">
              <Kbd>⌘K</Kbd> abrir
              <span className="text-border">·</span>
              <Kbd>esc</Kbd> cerrar
              <span className="ml-auto flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {typing ? "escribiendo…" : "listo"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
