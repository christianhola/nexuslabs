import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Copy,
  MessageCircle,
  MoreHorizontal,
  Search,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

import { SectionHead } from "@/components/section-head"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
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
import { cap, data, statusTone, type Template } from "@/lib/data"
import { assetUrl, customRequest } from "@/lib/site"
import { cn } from "@/lib/utils"

const PAGE_SIZES = [12, 24, 48] as const

export function TemplateCard({
  template,
  index,
}: {
  template: Template
  index: number
}) {
  const demoHref = assetUrl(template.href)
  const detailHref = `/plantillas/${template.id}`

  async function copyLink() {
    const url = new URL(demoHref, window.location.origin).href
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Enlace copiado", { description: url })
    } catch {
      toast.error("No se pudo copiar el enlace")
    }
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-soft">
      <Link
        to={detailHref}
        aria-label={`Abrir la ficha de ${template.name}`}
        className="relative block overflow-hidden"
      >
        <img
          src={assetUrl(template.preview)}
          alt={`Vista previa de la plantilla ${template.name}`}
          width={640}
          height={440}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          className="aspect-[16/11] w-full object-cover object-top transition duration-700 group-hover:scale-[1.035]"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 opacity-70" />
        <Badge
          variant="outline"
          className={cn(
            "absolute top-2.5 left-2.5 backdrop-blur-md",
            statusTone[template.statusClass]
          )}
        >
          {template.status}
        </Badge>
        <span className="absolute right-2.5 bottom-2.5 flex translate-y-1 items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[0.65rem] font-medium text-foreground opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
          Ver ficha <ArrowUpRight className="size-3" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <HoverCard>
            <HoverCardTrigger
              render={
                <button
                  type="button"
                  className="mono-label text-left text-[0.6rem] transition hover:text-foreground"
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
              <dl className="mt-2.5 space-y-1 border-t border-border pt-2 text-[0.66rem] text-muted-foreground">
                <div className="flex justify-between gap-3">
                  <dt>Tipo</dt>
                  <dd className="text-foreground/80">{template.kindLabel}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Estado de la demo</dt>
                  <dd className="text-foreground/80">{template.status}</dd>
                </div>
              </dl>
            </HoverCardContent>
          </HoverCard>
          <span className="text-[0.6rem] tracking-[0.12em] text-muted-foreground/80 uppercase">
            {template.kindLabel}
          </span>
        </div>

        <h3 className="mt-1.5 font-display text-[1.5rem] leading-none">
          <Link
            to={detailHref}
            className="transition hover:text-primary"
          >
            {template.name}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[0.8rem] leading-5 text-muted-foreground">
          {template.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {template.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-border/80 px-2 py-0.5 text-[0.64rem] text-muted-foreground"
            >
              {cap(feature)}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-1.5 pt-4">
          <Button
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-[0.74rem]"
            render={
              <a
                href={customRequest(template.name)}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <MessageCircle data-icon="inline-start" />
            Personalizar
          </Button>
          <Badge
            variant="outline"
            className="h-8 gap-1 rounded-full px-3 text-[0.72rem] font-normal"
            render={
              <a href={demoHref} target="_blank" rel="noreferrer">
                Ver demo
                <ArrowUpRight data-icon="inline-end" />
              </a>
            }
          />

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
              <DropdownMenuItem
                render={<a href={demoHref} target="_blank" rel="noreferrer" />}
              >
                Abrir la demo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink}>
                <Copy />
                Copiar enlace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={
                  <a
                    href={customRequest(template.name)}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <MessageCircle />
                Pedir por WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
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

export function Catalog({
  industry,
  onIndustryChange,
  showHeading = true,
}: {
  industry: string
  onIndustryChange: (value: string) => void
  showHeading?: boolean
}) {
  const [query, setQuery] = useState("")
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0])
  const [page, setPage] = useState(1)
  const [industryOpen, setIndustryOpen] = useState(false)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return data.items.filter((item) => {
      if (industry !== "all" && item.category !== industry) return false
      if (featuredOnly && !item.featured) return false
      if (!needle) return true
      return [item.name, item.description, item.industry, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [industry, featuredOnly, query])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, pages)
  const shown = filtered.slice((current - 1) * pageSize, current * pageSize)
  const activeIndustry = data.industries.find((item) => item.id === industry)

  function reset() {
    setQuery("")
    onIndustryChange("all")
    setFeaturedOnly(false)
    setPage(1)
  }

  function goTo(target: number) {
    setPage(target)
    window.setTimeout(() => {
      document
        .getElementById("lista-plantillas")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 20)
  }

  return (
    <section className="relative border-y border-border bg-card/25 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
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
          className={`flex flex-col gap-3 border-y border-border py-3 lg:flex-row lg:items-center ${
            showHeading ? "mt-9" : ""
          }`}
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar restaurante, hotel, tienda, CRM…"
              aria-label="Buscar plantillas"
              className="h-10 border-0 bg-transparent pl-6 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu open={industryOpen} onOpenChange={setIndustryOpen}>
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
                  value={industry}
                  onValueChange={(value) => {
                    onIndustryChange(String(value))
                    setPage(1)
                    setIndustryOpen(false)
                  }}
                >
                  <DropdownMenuRadioItem value="all">
                    Todas
                  </DropdownMenuRadioItem>
                  {data.industries.map((item) => (
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
                checked={featuredOnly}
                onCheckedChange={(checked) => {
                  setFeaturedOnly(Boolean(checked))
                  setPage(1)
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

        <div id="lista-plantillas" className="scroll-mt-24">
          {shown.length ? (
            <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="surface mt-7 flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
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
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setPage(1)
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
