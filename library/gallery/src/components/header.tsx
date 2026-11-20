import { Link } from "react-router-dom"
import { Menu, MessageCircle } from "lucide-react"

import { BrandMark, Wordmark } from "@/components/brand"
import { SearchCommand } from "@/components/search-command"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { waLink } from "@/lib/site"

const intro = waLink(
  "Hola NEXUS LABS 👋 Quiero una versión personalizada de una plantilla."
)

const catalogLinks = [
  {
    title: "Catálogo completo",
    href: "/plantillas",
    description: "Las 88 piezas, con filtros y páginas propias.",
  },
  {
    title: "Por industria",
    href: "/industrias",
    description: "Diez territorios: hoteles, tiendas, clínicas y más.",
  },
  {
    title: "Comentarios",
    href: "/comentarios",
    description: "Deja tu opinión y sube una captura de tu proyecto.",
  },
]

const studioLinks = [
  {
    title: "El estudio",
    href: "/estudio",
    description: "Quién construye, cómo y con qué criterio.",
  },
  {
    title: "Proceso",
    href: "/proceso",
    description: "Alcance, hitos y entrega sin ceremonia.",
  },
  {
    title: "Preguntas",
    href: "/preguntas",
    description: "Pagos, demos, dominio y licencias.",
  },
  {
    title: "Créditos",
    href: "/creditos",
    description: "Autoría y licencias originales del catálogo.",
  },
]

const mobileLinks = [
  { href: "/plantillas", label: "Catálogo" },
  { href: "/industrias", label: "Industrias" },
  { href: "/estudio", label: "Estudio" },
  { href: "/proceso", label: "Proceso" },
  { href: "/preguntas", label: "Preguntas" },
  { href: "/creditos", label: "Créditos" },
  { href: "/comentarios", label: "Comentarios" },
  { href: "/asistente", label: "Asistente" },
  { href: "/contacto", label: "Contacto" },
]

function MenuLink({
  href,
  title,
  children,
}: {
  href: string
  title: string
  children: React.ReactNode
}) {
  return (
    <NavigationMenuLink
      render={
        <Link to={href} className="w-full">
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      }
    />
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-5 px-5 sm:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
          aria-label="NEXUS LABS, ir al inicio"
        >
          <BrandMark className="size-7 text-primary" />
          <Wordmark />
        </Link>

        <div className="ml-auto w-9 shrink-0 sm:w-44 lg:w-52 xl:w-64">
          <SearchCommand />
        </div>

        <div className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-8 px-3 text-[0.82rem] font-normal text-muted-foreground hover:text-foreground">
                  Plantillas
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[26rem] gap-1 p-2">
                    {catalogLinks.map((item) => (
                      <li key={item.href}>
                        <MenuLink href={item.href} title={item.title}>
                          {item.description}
                        </MenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-8 px-3 text-[0.82rem] font-normal text-muted-foreground hover:text-foreground">
                  Estudio
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[26rem] gap-1 p-2">
                    {studioLinks.map((item) => (
                      <li key={item.href}>
                        <MenuLink href={item.href} title={item.title}>
                          {item.description}
                        </MenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  render={
                    <Link
                      to="/comentarios"
                      className="h-8 px-3 text-[0.82rem] text-muted-foreground hover:text-foreground"
                    >
                      Comentarios
                    </Link>
                  }
                />
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  render={
                    <Link
                      to="/asistente"
                      className="h-8 px-3 text-[0.82rem] text-muted-foreground hover:text-foreground"
                    >
                      Asistente
                    </Link>
                  }
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="ml-auto flex items-center gap-1.5 lg:ml-4">
          <AnimatedThemeToggler
            variant="circle"
            duration={480}
            title="Cambiar a día o noche"
            aria-label="Cambiar a día o noche"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted [&_svg]:size-4"
          />

          <Button
            size="sm"
            className="h-9 gap-2 rounded-full px-3.5"
            render={<Link to="/contacto" />}
          >
            <MessageCircle data-icon="inline-start" />
            <span className="hidden sm:inline">Hablemos</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 lg:hidden"
                  aria-label="Abrir menú"
                >
                  <Menu />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Navegación</DropdownMenuLabel>
              {mobileLinks.map((link) => (
                <DropdownMenuItem key={link.href} render={<Link to={link.href} />}>
                  {link.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<a href={intro} target="_blank" rel="noreferrer" />}
              >
                Escribir por WhatsApp
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
