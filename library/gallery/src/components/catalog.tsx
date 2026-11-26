import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Copy,
  Eye,
  MessageCircle,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { SectionHead } from "@/components/section-head"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { data, type Template } from "@/lib/data"
import { TemplateCardSkeleton } from "@/components/skeleton-showcase"
import { assetUrl, customRequest } from "@/lib/site"

const PAGE_SIZES = [12, 24, 48] as const

export function templatePrice(template: Template) {
  return (
    template.price ??
    (template.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 80) + 29
  )
}

export function priceTier(price: number) {
  if (price <= 45) return { id: "basico", label: "Básico" }
  if (price <= 80) return { id: "pro", label: "Pro" }
  return { id: "premium", label: "Premium" }
}

const TIER_OPTIONS = [
  { id: "all", label: "Todos los precios" },
  { id: "basico", label: "Básico (≤ 45 €)" },
  { id: "pro", label: "Pro (46–80 €)" },
  { id: "premium", label: "Premium (> 80 €)" },
]

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevancia" },
  { id: "price-asc", label: "Precio: menor a mayor" },
  { id: "price-desc", label: "Precio: mayor a menor" },
  { id: "name", label: "Nombre A–Z" },
]

export function TemplateCard({
  template,
  index,
}: {
  template: Template
  index: number
}) {
  const [open, setOpen] = useState(false)
  const demoHref = assetUrl(template.href)
  const detailHref = `/plantillas/${template.id}`
  const price = templatePrice(template)
  const tier = priceTier(price)

  async function copyLink() {
    // Sin demo publicada se comparte la ficha, no un enlace muerto.
    const url = new URL(template.hasDemo ? demoHref : detailHref, window.location.origin).href
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado", { description: url })
    } catch {
      toast.error("No se pudo copiar el enlace")
    }
  }

  return (
    <article className="group flex flex-col [contain-intrinsic-size:auto_420px] [content-visibility:auto]">
      <div className="relative overflow-hidden transition-all duration-300">
        <Link
          to={detailHref}
          aria-label={`Abrir la ficha de ${template.name}`}
          className="block"
        >
          <div data-silk-anchor className="relative aspect-[16/10] overflow-hidden">
            <img
              src={assetUrl(template.preview)}
              alt={`Vista previa de la plantilla ${template.name}`}
              width={640}
              height={400}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.05] group-active:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </Link>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="mono-label truncate">{template.industry}</span>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="rounded-full px-2 py-0 text-[0.62rem] font-medium"
              >
                {tier.label}
              </Badge>
              <span className="text-[0.85rem] font-medium text-foreground">
                Desde €{price}
              </span>
            </div>
          </div>

          <h3
            data-silk-anchor
            className="font-display text-[1.55rem] leading-[1.05] tracking-[-0.015em]"
          >
            <Link to={detailHref} className="transition-colors hover:text-primary">
              {template.name}
            </Link>
          </h3>

          <p className="line-clamp-2 text-[0.82rem] leading-6 text-muted-foreground">
            {template.description}
          </p>

          <div className="mt-1 flex items-center gap-4 pt-3 text-[0.78rem]">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1 text-foreground/90 transition-colors hover:text-primary"
            >
              <Eye className="size-3.5" />
              Vista rápida
            </button>
            {template.hasDemo && (
              <a
                href={demoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-foreground/90 transition-colors hover:text-primary"
              >
                Ver demo
                <ArrowUpRight className="size-3.5" />
              </a>
            )}
            <a
              href={customRequest(template.name)}
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle className="size-3.5" />
              Personalizar
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="ml-auto text-muted-foreground"
                    aria-label={`Más acciones para ${template.name}`}
                  >
                    <MoreHorizontal />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>{template.name}</DropdownMenuLabel>
                <DropdownMenuItem render={<Link to={detailHref} />}>
                  Abrir ficha completa
                </DropdownMenuItem>
                {template.hasDemo && (
                  <DropdownMenuItem
                    render={<a href={demoHref} target="_blank" rel="noreferrer" />}
                  >
                    Abrir la demo
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={copyLink}>
                  <Copy />
                  Copiar enlace
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<a href={customRequest(template.name)} />}
                >
                  <MessageCircle />
                  Pedir por correo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="grid gap-0 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="relative aspect-[16/10] overflow-hidden bg-background/40 sm:aspect-auto sm:min-h-[22rem]">
              <img
                src={assetUrl(template.preview)}
                alt={`Vista previa de ${template.name}`}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="mono-label truncate">{template.industry}</span>
                  <Badge
                    variant="outline"
                    className="rounded-full px-2 py-0 text-[0.62rem] font-medium"
                  >
                    {tier.label}
                  </Badge>
                </div>
                <DialogTitle>{template.name}</DialogTitle>
                <DialogDescription>{template.description}</DialogDescription>
              </DialogHeader>
              <div className="px-6">
                <p className="text-[0.82rem] leading-6 text-muted-foreground">
                  {template.demoNote}
                </p>
                {template.features.length ? (
                  <ul className="mt-4 grid gap-1.5">
                    {template.features.slice(0, 6).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[0.78rem] leading-5"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {feature.charAt(0).toUpperCase() + feature.slice(1)}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-[0.75rem]">
                  <div>
                    <dt className="text-muted-foreground">Formato</dt>
                    <dd className="mt-0.5 font-medium">{template.kindLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Empieza desde</dt>
                    <dd className="mt-0.5 font-medium">Desde €{price}</dd>
                  </div>
                </dl>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="rounded-full"
                  render={<Link to={detailHref} />}
                  onClick={() => setOpen(false)}
                >
                  Ficha completa
                </Button>
                {template.hasDemo && (
                  <Button
                    className="rounded-full gap-2"
                    render={<a href={demoHref} target="_blank" rel="noreferrer" />}
                  >
                    Ver demo
                    <ArrowUpRight className="size-3.5" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="rounded-full gap-2"
                  render={<a href={customRequest(template.name)} />}
                >
                  <MessageCircle className="size-3.5" />
                  Personalizar
                </Button>
              </DialogFooter>
            </div>
          </div>
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 rounded-full"
                aria-label="Cerrar vista rápida"
              >
                <X />
              </Button>
            }
          />
        </DialogContent>
      </Dialog>
    </article>
  )
}

function pageList(page: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
  const set = new Set([1, total, page - 1, page, page + 1])
  return [...set]
    .filter((value) => value >= 1 && value <= total)
    .sort((a, b) => a - b)
    .flatMap((value, index, all) =>
      index > 0 && value - all[index - 1] > 1 ? ["gap", value] : [value]
    ) as (number | "gap")[]
}

function readFilters(params: URLSearchParams) {
  const industry = params.get("industria") ?? "all"
  const query = params.get("q") ?? ""
  const kind = params.get("tipo") ?? "all"
  const status = params.get("estado") ?? "all"
  const priceTierId = params.get("precio") ?? "all"
  const featuredOnly = params.get("destacadas") === "1"
  const sort = params.get("orden") ?? "relevance"
  const pageSizeRaw = Number(params.get("porPagina"))
  const pageSize = PAGE_SIZES.includes(pageSizeRaw as (typeof PAGE_SIZES)[number])
    ? pageSizeRaw
    : PAGE_SIZES[0]
  const pageRaw = Number(params.get("pagina"))
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
  return { industry, query, kind, status, priceTierId, featuredOnly, sort, pageSize, page }
}

export function Catalog({
  showHeading = true,
}: {
  showHeading?: boolean
}) {
  const [params, setParams] = useSearchParams()
  const filters = readFilters(params)

  const [queryInput, setQueryInput] = useState(filters.query)
  const [loading, setLoading] = useState(true)

  // keep local input in sync when URL changes externally
  useEffect(() => {
    setQueryInput(filters.query)
  }, [filters.query])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [])

  function updateParams(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "" ) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    }
    // remove defaults to keep URL clean
    if (next.get("industria") === "all") next.delete("industria")
    if (next.get("tipo") === "all") next.delete("tipo")
    if (next.get("estado") === "all") next.delete("estado")
    if (next.get("precio") === "all") next.delete("precio")
    if (next.get("destacadas") !== "1") next.delete("destacadas")
    if (next.get("orden") === "relevance" || !next.get("orden")) next.delete("orden")
    if (next.get("porPagina") === String(PAGE_SIZES[0])) next.delete("porPagina")
    if (next.get("pagina") === "1") next.delete("pagina")
    if (!next.get("q")) next.delete("q")
    setParams(next, { replace: true })
  }

  const industries = data.industries

  const filtered = useMemo(() => {
    const needle = filters.query.trim().toLowerCase()
    let items = data.items.filter((item) => {
      if (filters.industry !== "all" && item.category !== filters.industry) return false
      if (filters.kind !== "all" && item.kind !== filters.kind) return false
      if (filters.status !== "all" && item.statusClass !== filters.status) return false
      if (filters.priceTierId !== "all" && priceTier(templatePrice(item)).id !== filters.priceTierId) return false
      if (filters.featuredOnly && !item.featured) return false
      if (!needle) return true
      return [item.name, item.description, item.industry, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })

    if (filters.sort === "price-asc") {
      items = [...items].sort((a, b) => templatePrice(a) - templatePrice(b))
    } else if (filters.sort === "price-desc") {
      items = [...items].sort((a, b) => templatePrice(b) - templatePrice(a))
    } else if (filters.sort === "name") {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name))
    }
    return items
  }, [filters])

  const pages = Math.max(1, Math.ceil(filtered.length / filters.pageSize))
  const current = Math.min(filters.page, pages)
  const shown = filtered.slice((current - 1) * filters.pageSize, current * filters.pageSize)
  const activeIndustry = data.industries.find((item) => item.id === filters.industry)

  function reset() {
    setQueryInput("")
    updateParams({
      q: null,
      industria: null,
      tipo: null,
      estado: null,
      precio: null,
      destacadas: null,
      orden: null,
      pagina: null,
      porPagina: null,
    })
  }

  function goTo(target: number) {
    updateParams({ pagina: String(target) })
    window.setTimeout(() => {
      document
        .getElementById("lista-plantillas")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 20)
  }

  const activeFilterCount = [
    filters.query,
    filters.industry !== "all",
    filters.kind !== "all",
    filters.status !== "all",
    filters.priceTierId !== "all",
    filters.featuredOnly,
    filters.sort !== "relevance",
  ].filter(Boolean).length

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {showHeading && (
          <SectionHead
            eyebrow="Catálogo abierto"
            title={
              <>
                Elige una base.{" "}
                <span className="display-italic text-primary">Hazla tuya.</span>
              </>
            }
            description="Todas las plantillas se pueden recorrer aquí mismo. Abre la página de una pieza para ver qué incluye, qué necesita para producción y cuánto tarda una versión a tu medida."
            aside={
              <div className="flex items-center gap-2 text-[0.72rem] text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                {activeIndustry ? activeIndustry.label : "Todas las industrias"}
              </div>
            }
          />
        )}

        <div
          className={`flex flex-col gap-3 ${showHeading ? "mt-9" : ""}`}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1 rounded-full border border-border bg-background/60 px-4 backdrop-blur-md">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={queryInput}
                onChange={(event) => {
                  setQueryInput(event.target.value)
                  // debounce-ish: update URL on change
                  updateParams({ q: event.target.value || null, pagina: null })
                }}
                placeholder="Buscar restaurante, hotel, tienda, CRM…"
                aria-label="Buscar plantillas"
                className="h-10 border-0 bg-transparent pl-8 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 min-w-[10.5rem] justify-between gap-2 rounded-full px-3.5 text-[0.78rem] font-normal"
                    >
                      {activeIndustry ? activeIndustry.short : "Todas las industrias"}
                      <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                    </Button>
                  }
                />
                <DropdownMenuContent align="start" className="w-60">
                  <DropdownMenuLabel>Filtrar por industria</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={filters.industry}
                    onValueChange={(value) => {
                      updateParams({ industria: String(value) === "all" ? null : String(value), pagina: null })
                    }}
                  >
                    <DropdownMenuRadioItem value="all">
                      Todas
                    </DropdownMenuRadioItem>
                    {industries.map((item) => (
                      <DropdownMenuRadioItem key={item.id} value={item.id}>
                        {item.label}
                        <span className="ml-auto text-[0.65rem] text-muted-foreground">
                          {item.count}
                        </span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <label className="flex h-9 items-center gap-2 rounded-full border border-border px-3 text-[0.76rem] text-muted-foreground">
                <Switch
                  checked={filters.featuredOnly}
                  onCheckedChange={(checked) => {
                    updateParams({
                      destacadas: checked ? "1" : null,
                      pagina: null,
                    })
                  }}
                  size="sm"
                  aria-label="Mostrar solo destacadas"
                />
                Destacadas
              </label>

              <span className="ml-auto flex min-w-[4.5rem] items-center justify-end gap-1.5 text-[0.7rem] text-muted-foreground">
                <Check className="size-3 text-primary" />
                {filtered.length} de {data.items.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <span className="text-[0.7rem] text-muted-foreground">Facetas:</span>

            <Select
              value={filters.kind}
              onValueChange={(value) => {
                updateParams({ tipo: String(value) === "all" ? null : String(value), pagina: null })
              }}
            >
              <SelectTrigger className="h-8 w-[8.5rem] rounded-full text-[0.74rem]" aria-label="Filtrar por tipo">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="site">Sitio web</SelectItem>
                <SelectItem value="app">Aplicación</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => {
                updateParams({ estado: String(value) === "all" ? null : String(value), pagina: null })
              }}
            >
              <SelectTrigger className="h-8 w-[9.5rem] rounded-full text-[0.74rem]" aria-label="Filtrar por estado">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="static">Demo estática</SelectItem>
                <SelectItem value="app">App</SelectItem>
                <SelectItem value="service">Servicio</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.priceTierId}
              onValueChange={(value) => {
                updateParams({ precio: String(value) === "all" ? null : String(value), pagina: null })
              }}
            >
              <SelectTrigger className="h-8 w-[10.5rem] rounded-full text-[0.74rem]" aria-label="Filtrar por precio">
                <SelectValue placeholder="Precio" />
              </SelectTrigger>
              <SelectContent align="start">
                {TIER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sort}
              onValueChange={(value) => {
                updateParams({ orden: String(value) === "relevance" ? null : String(value), pagina: null })
              }}
            >
              <SelectTrigger className="h-8 w-[11rem] rounded-full text-[0.74rem]" aria-label="Ordenar">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent align="start">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 rounded-full px-3 text-[0.74rem]"
                onClick={reset}
              >
                <X className="size-3.5" />
                Limpiar ({activeFilterCount})
              </Button>
            ) : null}
          </div>
        </div>

        <div id="lista-plantillas" className="scroll-mt-24">
          {loading ? (
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: filters.pageSize }).map((_, index) => (
                <TemplateCardSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : shown.length ? (
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-3 border-t border-border px-6 py-16 text-center">
              <p className="font-display text-2xl">
                No hay plantillas con esos filtros.
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Prueba otra palabra o vuelve a todo el catálogo. Si buscas algo
                que no existe, lo diseñamos.
              </p>
              <Button
                variant="outline"
                className="mt-1 rounded-full"
                onClick={reset}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>

        {filtered.length ? (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-5 sm:flex-row">
            <div className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
              <span>Por página</span>
              <Select
                value={String(filters.pageSize)}
                onValueChange={(value) => {
                  updateParams({ porPagina: String(value), pagina: null })
                }}
              >
                <SelectTrigger
                  className="h-8 w-[4.5rem] rounded-full"
                  aria-label="Plantillas por página"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start">
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full"
                    disabled={current === 1}
                    onClick={() => goTo(current - 1)}
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                </PaginationItem>
                {pageList(current, pages).map((value, index) =>
                  value === "gap" ? (
                    <PaginationItem key={`gap-${index}`}>
                      <span className="px-1 text-muted-foreground">…</span>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={value}>
                      <Button
                        variant={value === current ? "outline" : "ghost"}
                        size="icon-sm"
                        className="rounded-full"
                        aria-current={value === current ? "page" : undefined}
                        onClick={() => goTo(value)}
                      >
                        {value}
                      </Button>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 rounded-full"
                    disabled={current === pages}
                    onClick={() => goTo(current + 1)}
                    aria-label="Página siguiente"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="size-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-[0.7rem] text-muted-foreground sm:hidden">
              Página {current} de {pages}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}