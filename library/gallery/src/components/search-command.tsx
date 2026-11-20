import { useEffect, useMemo, useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  CornerDownLeft,
  ImageIcon,
  Search,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Skeleton } from "@/components/ui/skeleton"
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
    <article className="group h-full pb-1">
      <Link
        to={`/plantillas/${template.id}`}
        onClick={onNavigate}
        className="block overflow-hidden bg-muted/40"
      >
        <img
          src={assetUrl(template.preview)}
          alt={`Vista previa de ${template.name}`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>

      <p className="mono-label mt-2.5 text-[0.58rem]">
        {template.industry} <span aria-hidden="true">·</span>{" "}
        {template.kindLabel}
      </p>
      <div className="mt-1 flex items-start justify-between gap-2">
        <Link
          to={`/plantillas/${template.id}`}
          onClick={onNavigate}
          className="font-display text-[1.18rem] leading-tight transition-colors hover:text-primary"
        >
          {template.name}
        </Link>
        <a
          href={assetUrl(template.href)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir la demo de ${template.name}`}
          className="mt-1 inline-flex shrink-0 items-center gap-1 text-[0.68rem] text-muted-foreground transition-colors hover:text-foreground"
        >
          Demo
          <ArrowUpRight className="size-3" />
        </a>
      </div>

      <p className="mt-1 line-clamp-2 text-[0.72rem] leading-5 text-muted-foreground">
        {template.description}
      </p>
    </article>
  )
}

function ResultSkeletons() {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="w-1/2">
          <Skeleton className="aspect-[16/10] w-full" />
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
          "group flex h-10 w-full items-center gap-2 rounded-full border border-border px-3 text-left text-[0.78rem] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground",
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
          className="fixed inset-0 z-[80] flex items-start justify-center bg-background/85 px-3 pt-[7vh] pb-4 sm:px-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscador del catálogo"
            className="flex max-h-[86dvh] w-full max-w-3xl flex-col overflow-hidden border border-border bg-background"
          >
            <div className="border-b border-border p-3 sm:p-4">
              <InputGroup className="h-12 rounded-none border border-border bg-transparent shadow-none">
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

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion)
                      inputRef.current?.focus()
                    }}
                    className="text-[0.68rem] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/40"
                  >
                    {suggestion}
                  </button>
                ))}
                <span className="ml-auto hidden items-center gap-1 text-[0.62rem] text-muted-foreground sm:flex">
                  <CornerDownLeft className="size-3" /> abre el primer resultado
                </span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 [scrollbar-width:thin] sm:px-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border">
              {!query.trim() ? (
                <div className="pb-2">
                  <p className="px-2 font-display text-[1.45rem] leading-tight text-foreground/80 sm:text-[1.7rem]">
                    Escribe un negocio y mira las páginas antes de abrirlas.
                  </p>

                  <p className="mono-label mt-5 px-1">Recomendadas para empezar</p>

                  <div className="mt-3 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                    {featured.map((template) => (
                      <ResultCard
                        key={template.id}
                        template={template}
                        onNavigate={close}
                      />
                    ))}
                  </div>

                  <p className="mt-4 px-2 text-center text-[0.7rem] leading-5 text-muted-foreground">
                    La búsqueda corre en tu navegador sobre el catálogo.{" "}
                    <span className="text-foreground">
                      Sin enviar tu consulta a ningún servidor.
                    </span>
                  </p>
                </div>
              ) : (
                <div className="grid gap-5">
                  <p className="border-l border-primary/60 pl-3 text-[0.82rem] leading-5 text-muted-foreground">
                    {query.trim()}
                  </p>

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
                        <p className="text-[0.82rem] leading-6 text-foreground/90">
                          {answer || "Buscando en el catálogo…"}
                          {typing ? (
                            <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />
                          ) : null}
                        </p>
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

                          <div className="mt-3 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                            {results.map((template) => (
                              <ResultCard
                                key={template.id}
                                template={template}
                                onNavigate={close}
                              />
                            ))}
                          </div>

                          <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                            Fuente:
                            <span className="text-foreground">
                              catálogo NEXUS
                            </span>
                            <span>·</span>
                            búsqueda local ·{" "}
                            <Link
                              to="/plantillas"
                              onClick={close}
                              className="underline underline-offset-4 hover:text-foreground"
                            >
                              ver el catálogo completo
                            </Link>
                          </p>
                        </>
                      ) : (
                        <div className="mt-3 border-t border-border pt-3">
                          <p className="text-[0.8rem] leading-6">
                            No hay resultados para «{query.trim()}». Prueba con{" "}
                            <span className="text-foreground">
                              hotel, tienda o SaaS
                            </span>
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
                </div>
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
