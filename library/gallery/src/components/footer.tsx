import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUp, LayoutGrid } from "lucide-react"

import { BrandMark } from "@/components/brand"
import {
  GithubIcon,
  InstagramIcon,
  WhatsappIcon,
} from "@/components/social-icons"
import { Dock, DockIcon } from "@/components/ui/dock"
import { data } from "@/lib/data"
import {
  GITHUB,
  instagramLink,
  INSTAGRAM,
  waLink,
  WHATSAPP,
} from "@/lib/site"

const intro = waLink(
  "Hola NEXUS LABS 👋 Quiero una versión personalizada de una plantilla."
)

const columns = [
  {
    title: "Catálogo",
    links: [
      { label: `Las ${data.total} plantillas`, href: "/plantillas" },
      { label: "Industrias", href: "/industrias" },
      { label: "Comentarios", href: "/comentarios" },
      { label: "Créditos", href: "/creditos" },
    ],
  },
  {
    title: "Estudio",
    links: [
      { label: "El estudio", href: "/estudio" },
      { label: "Cómo trabajamos", href: "/proceso" },
      { label: "Preguntas", href: "/preguntas" },
      { label: "Asistente", href: "/asistente" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border pt-16">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="grid gap-10 pb-14 lg:grid-cols-[1.3fr_1fr_1fr_0.9fr]">
          <div>
            <Link
              to="/"
              className="flex items-center gap-2.5"
              aria-label="NEXUS LABS, volver al inicio"
            >
              <BrandMark className="size-8 text-primary" />
              <span className="text-[1.05rem] tracking-[0.24em]">
                NEXUS{" "}
                <span className="text-muted-foreground">LABS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.82rem] leading-6 text-muted-foreground">
              Estudio de diseño y código. Plantillas completas, demos honestas y
              versiones a medida para negocios que quieren verse como son.
            </p>
            <Dock
              iconSize={34}
              iconMagnification={46}
              iconDistance={110}
              className="mt-6 ml-0 w-fit gap-1 rounded-full border-border/80 bg-card/60 px-2 py-1.5"
            >
              <DockIcon className="border border-border bg-background">
                <a
                  href={intro}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp de NEXUS LABS"
                  title="WhatsApp"
                  className="flex size-full items-center justify-center text-foreground/80 hover:text-primary"
                >
                  <WhatsappIcon />
                </a>
              </DockIcon>
              <DockIcon className="border border-border bg-background">
                <a
                  href={instagramLink()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram de NEXUS LABS"
                  title="Instagram"
                  className="flex size-full items-center justify-center text-foreground/80 hover:text-primary"
                >
                  <InstagramIcon />
                </a>
              </DockIcon>
              <DockIcon className="border border-border bg-background">
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Repositorio en GitHub"
                  title="GitHub"
                  className="flex size-full items-center justify-center text-foreground/80 hover:text-primary"
                >
                  <GithubIcon />
                </a>
              </DockIcon>
            </Dock>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="mono-label">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[0.82rem] text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="mono-label">Contacto directo</p>
            <ul className="mt-4 space-y-2.5 text-[0.82rem]">
              <li>
                <a
                  href={intro}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground transition hover:text-primary"
                >
                  +1 {WHATSAPP.slice(1, 4)} {WHATSAPP.slice(4, 7)}{" "}
                  {WHATSAPP.slice(7)}
                </a>
              </li>
              <li>
                <a
                  href={instagramLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  @{INSTAGRAM}
                </a>
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Aceptando proyectos
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div aria-hidden="true" className="select-none overflow-hidden">
          <p className="bg-gradient-to-b from-foreground/75 to-foreground/5 bg-clip-text text-[12.5vw] leading-[0.78] font-medium tracking-[-0.035em] text-transparent">
            NEXUS LABS
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-border py-6 text-[0.68rem] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} NEXUS LABS. Plantillas creadas por sus
            autores originales; créditos y licencias conservados.
          </p>
          <p className="flex items-center gap-2">
            Hecho con React, shadcn/ui y Magic UI
            <span className="hidden sm:inline">·</span>
            <a
              className="underline-offset-4 hover:text-foreground hover:underline"
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
            >
              Código
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

const floating = [
  { label: "Catálogo", href: "/plantillas", icon: LayoutGrid, external: false },
  { label: "WhatsApp", href: intro, icon: WhatsappIcon, external: true },
  { label: "Instagram", href: instagramLink(), icon: InstagramIcon, external: true },
  { label: "GitHub", href: GITHUB, icon: GithubIcon, external: true },
  { label: "Volver al inicio", href: "/", icon: ArrowUp, external: false },
]

export function FloatingDock() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let timer = 0
    const onScroll = () => {
      setShow(window.scrollY > 640)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setShow(false), 1200)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 flex-col items-center gap-1.5 transition-all duration-500 sm:flex ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[0.55rem] tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
        Nexus Labs
      </span>
      <Dock
        iconSize={34}
        iconMagnification={46}
        iconDistance={100}
        className="mt-0 gap-1 rounded-full border-border/80 bg-background/80 px-2 py-1.5 shadow-soft backdrop-blur-xl"
      >
        {floating.map((item) => (
          <DockIcon
            key={item.label}
            className="border border-border bg-card/80"
          >
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
                title={item.label}
                className="flex size-full items-center justify-center text-foreground/75 hover:text-primary"
              >
                <item.icon className="size-4" />
              </a>
            ) : (
              <Link
                to={item.href}
                aria-label={item.label}
                title={item.label}
                className="flex size-full items-center justify-center text-foreground/75 hover:text-primary"
              >
                <item.icon className="size-4" />
              </Link>
            )}
          </DockIcon>
        ))}
      </Dock>
    </div>
  )
}
