import { Link } from "react-router-dom"
import { ArrowDownRight, ArrowUpRight, Check, MessageCircle, Play } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { NumberTicker } from "@/components/ui/number-ticker"
import { TextAnimate } from "@/components/ui/text-animate"
import { data } from "@/lib/data"
import { assetUrl, customRequest, VIDEO_ID } from "@/lib/site"

const stats = [
  { value: data.total, label: "plantillas completas" },
  { value: data.industries.length, label: "industrias" },
  { value: 100, label: "navegable en el navegador", suffix: "%" },
]

export function Hero() {
  const showcase = data.items.filter((item) => item.featured).slice(0, 2)
  const first = showcase[0]
  const second = showcase[1] ?? first

  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-14 px-5 pt-14 pb-16 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:pt-20 lg:pb-24">
        <div className="min-w-0">
          <BlurFade delay={0.05}>
            <p className="mono-label flex items-center gap-2.5">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
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
            className="mt-7 font-display text-[3.4rem] leading-[0.92] tracking-[-0.03em] sm:text-[4.6rem] lg:text-[5.2rem]"
          >
            Sitios con oficio.
          </TextAnimate>

          <BlurFade delay={0.28}>
            <p className="display-italic mt-1 text-[3.4rem] leading-[0.95] text-primary sm:text-[4.6rem] lg:text-[5.2rem]">
              Listos para tu marca.
            </p>
          </BlurFade>

          <BlurFade delay={0.36}>
            <p className="mt-7 max-w-xl text-[0.98rem] leading-7 text-muted-foreground">
              {data.total} plantillas completas, construidas a mano y revisadas
              una por una: restaurantes, hoteles, tiendas, estudios y apps que
              funcionan en el navegador. Explora, prueba la demo y pide la tuya.
            </p>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-11 w-full gap-2 rounded-full px-6 text-[0.92rem] sm:w-auto"
                render={<Link to="/plantillas" />}
              >
                Explorar el catálogo
                <ArrowDownRight data-icon="inline-end" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-11 w-full gap-2 rounded-full px-5 text-[0.92rem] sm:w-auto"
                render={<a href={customRequest()} />}
              >
                <MessageCircle data-icon="inline-start" />
                Pedir la mía
              </Button>
              <Button
                variant="link"
                className="h-11 gap-2 px-1 text-[0.9rem] text-muted-foreground hover:text-foreground"
                render={
                  <a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noreferrer" />
                }
              >
                <Play className="size-3.5 fill-current" />
                Ver el estudio
              </Button>
            </div>
          </BlurFade>

          <BlurFade delay={0.58}>
            <dl className="mt-11 grid max-w-md grid-cols-3 gap-5 border-t border-border pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl leading-none text-foreground">
                    <NumberTicker value={stat.value} />
                    {stat.suffix ? (
                      <span className="text-xl">{stat.suffix}</span>
                    ) : null}
                  </dd>
                  <dd className="mt-2 text-[0.7rem] leading-4 tracking-[0.02em] text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </BlurFade>

          <BlurFade delay={0.64}>
            <ul className="mt-9 grid max-w-lg gap-x-8 gap-y-2 border-t border-border pt-5 text-[0.8rem] text-muted-foreground sm:grid-cols-2">
              {[
                "Demos reales, no maquetas",
                "Código y licencias originales",
                "Personalización por correo",
                "Sin servidor para explorar",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </BlurFade>
        </div>

        <div className="mx-auto w-full max-w-[560px] lg:max-w-none">
          <BlurFade delay={0.25} direction="up" offset={18}>
            <Link to={`/plantillas/${first.id}`} className="group block">
              <div className="overflow-hidden bg-muted/40">
                <img
                  src={assetUrl(first.preview)}
                  alt={`Portada de la plantilla ${first.name}`}
                  width={840}
                  height={630}
                  className="aspect-[16/11] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </div>
              <div className="flex items-baseline justify-between gap-3 border-b border-border py-2.5">
                <span className="text-[0.84rem]">{first.name}</span>
                <span className="mono-label">{first.industry}</span>
              </div>
            </Link>
          </BlurFade>

          <BlurFade delay={0.4} direction="up" offset={18}>
            <Link to={`/plantillas/${second.id}`} className="group mt-6 flex items-start gap-4">
              <div className="w-[38%] shrink-0 overflow-hidden bg-muted/40">
                <img
                  src={assetUrl(second.preview)}
                  alt={`Portada de la plantilla ${second.name}`}
                  width={480}
                  height={340}
                  className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="min-w-0">
                <p className="mono-label">{second.industry}</p>
                <p className="mt-1.5 font-display text-[1.35rem] leading-tight">
                  {second.name}
                </p>
                <p className="mt-1 line-clamp-2 text-[0.76rem] leading-5 text-muted-foreground">
                  {second.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[0.72rem] text-foreground/80 transition-colors group-hover:text-primary">
                  Ver ficha
                  <ArrowUpRight className="size-3" />
                </span>
              </div>
            </Link>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}
