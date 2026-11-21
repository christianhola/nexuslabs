import { Link } from "react-router-dom"
import { Mail } from "lucide-react"

import { BrandMark } from "@/components/brand"
import {
  GithubIcon,
  InstagramIcon,
  WhatsappIcon,
} from "@/components/social-icons"
import { data } from "@/lib/data"
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_ALT,
  GITHUB,
  instagramLink,
  INSTAGRAM,
  mailLink,
  WHATSAPP_LABEL,
  waLink,
} from "@/lib/site"

const intro = mailLink(
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
      { label: "Privacidad y términos", href: "/legal" },
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
            <div className="mt-6 flex items-center gap-4 border-t border-border pt-5">
              {[
                { href: intro, label: "Correo", icon: Mail, external: false },
                {
                  href: instagramLink(),
                  label: "Instagram",
                  icon: InstagramIcon,
                  external: true,
                },
                { href: GITHUB, label: "GitHub", icon: GithubIcon, external: true },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1.5 text-[0.76rem] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <item.icon className="size-3.5" />
                  {item.label}
                </a>
              ))}
            </div>
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
                  href={waLink(
                    "Hola NEXUS LABS 👋 Quiero una versión personalizada de una plantilla."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-foreground transition hover:text-primary"
                >
                  <WhatsappIcon className="size-3.5 text-emerald-500" />
                  {WHATSAPP_LABEL}
                </a>
              </li>
              <li>
                <a
                  href={intro}
                  className="text-foreground transition hover:text-primary"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={intro}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {CONTACT_EMAIL_ALT}
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
          <p className="text-[12.5vw] leading-[0.78] font-medium tracking-[-0.035em] text-foreground/[0.06]">
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
