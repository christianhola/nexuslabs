import { Link } from "react-router-dom"
import { ArrowDownRight, ArrowUpRight, Check, MessageCircle, Play } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"
import { TextAnimate } from "@/components/ui/text-animate"
import { cn } from "@/lib/utils"
import { data } from "@/lib/data"
import { assetUrl, customRequest, VIDEO_ID } from "@/lib/site"

const stats = [
  { value: data.total, label: "plantillas completas" },
  { value: data.industries.length, label: "industrias cubiertas" },
  { value: 100, label: "navegable en el navegador", suffix: "%" },
]

export function Hero() {
  const featured = data.items.filter((item) => item.featured)
  const showcase = (featured.length ? featured : data.items).slice(0, 2)
  const first = showcase[0]
  const second = showcase[1] ?? first

  return (
    <section
      id="inicio"
      className="relative isolate overflow-visible"
    >
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_52%_at_50%_-8%,rgba(255,255,255,0.06),transparent_62%)]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute -bottom-48 left-1/2 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-primary/6 blur-[120px]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 lg:pt-28 lg:pb-32">
        {/* Copy column */}
        <div className="min-w-0">
          <BlurFade delay={0.05}>
            <p className="mono-label flex items-center gap-2.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Estudio de diseño y código · Catálogo de plantillas
            </p>
          </BlurFade>

          <TextAnimate
            as="h1"
            animation="blurInUp"
            by="word"
            once
            delay={0.1}
            data-silk-anchor
            className="mt-8 font-display text-[clamp(3rem,7vw,5.6rem)] leading-[0.88] tracking-[-0.035em]"
          >
            Sitios con oficio.
          </TextAnimate>

          <BlurFade delay={0.26}>
            <p data-silk-anchor className="display-italic mt-1 text-[clamp(2.4rem,5.6vw,4.4rem)] leading-[0.92] text-primary">
              Listos para tu marca.
            </p>
          </BlurFade>

          <BlurFade delay={0.36}>
            <p className="mt-8 max-w-[34rem] text-[1.05rem] leading-7 text-muted-foreground">
              {data.total} plantillas completas, construidas a mano y revisadas
              una por una: restaurantes, hoteles, tiendas, estudios y apps que
              funcionan en el navegador. Explora, prueba la demo y pide la tuya.
            </p>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-12 w-full gap-2 rounded-full px-7 text-[0.95rem] transition-transform active:scale-[0.98] sm:w-auto"
                render={<Link to="/plantillas" />}
              >
                Explorar el catálogo
                <ArrowDownRight data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 w-full gap-2 rounded-full px-6 text-[0.95rem] transition-transform active:scale-[0.98] sm:w-auto"
                render={<a href={customRequest()} />}
              >
                <MessageCircle data-icon="inline-start" />
                Pedir la mía
              </Button>
              <Button
                variant="link"
                className="h-12 gap-2 px-1 text-[0.9rem] text-muted-foreground hover:text-foreground"
                render={
                  <a
                    href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <Play className="size-3.5 fill-current" />
                Ver el estudio
              </Button>
            </div>
          </BlurFade>

          <BlurFade delay={0.58}>
            <dl className="mt-12 grid grid-cols-3 gap-0 border-y border-border py-7">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={cn(
                    "px-4 first:pl-0 sm:px-6",
                    index > 0 && "border-l border-border"
                  )}
                >
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-[clamp(2rem,8vw,2.6rem)] leading-none tabular-nums text-foreground sm:text-[3rem]">
                    <NumberTicker value={stat.value} />
                    {stat.suffix ? (
                      <span className="text-[1.6rem] text-primary">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </dd>
                  <dd className="mt-2.5 text-[0.72rem] leading-4 tracking-[0.01em] text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </BlurFade>

          <BlurFade delay={0.64}>
            <ul className="mt-9 grid max-w-[34rem] gap-x-8 gap-y-2.5 border-t border-border pt-6 text-[0.82rem] text-muted-foreground sm:grid-cols-2">
              {[
                "Demos reales, no maquetas",
                "Código y licencias originales",
                "Personalización por correo",
                "Sin servidor para explorar",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="size-3.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </BlurFade>
        </div>

        {/* Showcase column */}
        <div className="mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none">
          {first && second ? (
          <>
          <BlurFade delay={0.22} direction="up" offset={20}>
            <Link to={`/plantillas/${first.id}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-background/30 transition-colors duration-300 group-hover:border-primary/40">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    data-silk-anchor
                    src={assetUrl(first.preview)}
                    alt={`Portada de la plantilla ${first.name}`}
                    width={840}
                    height={525}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04] group-active:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-border px-5 py-3.5">
                  <span className="font-display text-[1.15rem] leading-tight">
                    {first.name}
                  </span>
                  <span className="mono-label">{first.industry}</span>
                </div>
              </div>
            </Link>
          </BlurFade>

          <BlurFade delay={0.38} direction="up" offset={20}>
            <Link
              to={`/plantillas/${second.id}`}
              className="group mt-6 flex items-start gap-5 rounded-2xl border border-border bg-background/20 p-4 transition-colors duration-300 hover:border-primary/30 hover:bg-background/40"
            >
              <div data-silk-anchor className="w-[38%] shrink-0 overflow-hidden rounded-xl border border-border/70">
                <img
                  data-silk-anchor
                  src={assetUrl(second.preview)}
                  alt={`Portada de la plantilla ${second.name}`}
                  width={480}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.05] group-active:scale-[1.02]"
                />
              </div>
              <div className="min-w-0">
                <p className="mono-label">{second.industry}</p>
                <p className="mt-1.5 font-display text-[1.4rem] leading-tight">
                  {second.name}
                </p>
                <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-5 text-muted-foreground">
                  {second.description}
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[0.78rem] text-foreground/85 transition-colors group-hover:text-primary">
                  Ver ficha
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </Link>
          </BlurFade>
          </>
          ) : null}
        </div>
      </div>
    </section>
  )
}