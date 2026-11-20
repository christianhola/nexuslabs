import { Link } from "react-router-dom"
import { ArrowDownRight, Check, Heart, MessageCircle, Play } from "lucide-react"

import { BlurFade } from "@/components/ui/blur-fade"
import { CoolMode } from "@/components/ui/cool-mode"
import { Button } from "@/components/ui/button"
import { Lens } from "@/components/ui/lens"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Pointer } from "@/components/ui/pointer"
import { TextAnimate } from "@/components/ui/text-animate"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { data } from "@/lib/data"
import { assetUrl, customRequest, VIDEO_ID } from "@/lib/site"

const stats = [
  { value: data.total, label: "plantillas completas" },
  { value: data.industries.length, label: "industrias" },
  { value: 100, label: "navegable en el navegador", suffix: "%" },
]

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="paper-glow pointer-events-none absolute inset-0 -z-10" />
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

          <BlurFade delay={0.42}>
            <p className="mt-4 flex min-h-6 flex-wrap items-center gap-x-2 text-sm">
              <span className="text-muted-foreground">Hecho para</span>
              <TypingAnimation
                className="font-medium text-foreground"
                words={[
                  "restaurantes que abren el apetito.",
                  "hoteles que se venden solos.",
                  "tiendas con fotografía real.",
                  "apps que funcionan sin cuenta.",
                ]}
                typeSpeed={38}
                deleteSpeed={18}
                pauseDelay={2100}
                loop
                blinkCursor
              />
            </p>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CoolMode>
                <Button
                  size="lg"
                  className="h-11 gap-2 rounded-full px-6 text-[0.92rem]"
                  render={<Link to="/plantillas" />}
                >
                  Explorar el catálogo
                  <ArrowDownRight data-icon="inline-end" />
                </Button>
              </CoolMode>
              <Button
                variant="outline"
                size="lg"
                className="h-11 gap-2 rounded-full px-5 text-[0.92rem]"
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
            <div className="mt-9 grid max-w-lg gap-2 sm:grid-cols-2">
              {[
                "Demos reales, no maquetas",
                "Código y licencias originales",
                "Personalización por correo",
                "Sin servidor para explorar",
              ].map((item) => (
                <Marker key={item} variant="border" className="pb-2 text-[0.8rem]">
                  <MarkerIcon className="text-primary">
                    <Check />
                  </MarkerIcon>
                  <MarkerContent>{item}</MarkerContent>
                </Marker>
              ))}
            </div>
          </BlurFade>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="absolute -top-8 left-4 z-20 rotate-[-6deg] rounded-full border border-border bg-card/90 px-3.5 py-1.5 text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase backdrop-blur">
            Catálogo abierto
          </div>
          <BlurFade delay={0.25} direction="up" offset={24}>
            <div className="relative w-full rounded-[1.6rem] border border-border bg-card/80 p-2 shadow-soft">
              <div className="relative overflow-hidden rounded-[1.15rem]">
                <Lens zoomFactor={1.45} lensSize={160} ariaLabel="Ampliar la demo del restaurante">
                  <img
                    src={assetUrl("previews/restaurant.jpg")}
                    alt="Portada de la plantilla Restaurant: sala de un restaurante de autor"
                    width={840}
                    height={630}
                    className="aspect-[16/10] w-full object-cover object-top"
                  />
                </Lens>
                <Pointer className="text-rose-400">
                  <span className="flex size-9 items-center justify-center rounded-full bg-background/90 shadow-lg ring-1 ring-border">
                    <Heart className="size-4 fill-current" />
                  </span>
                </Pointer>
                <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-[0.68rem] tracking-[0.12em] text-white/90 uppercase backdrop-blur-md">
                  <span>Restaurant · demo real</span>
                  <span className="text-white/60">Pasa el cursor</span>
                </div>
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.42} direction="up" offset={18}>
            <div className="relative z-10 mt-5 mr-4 ml-auto w-[62%] rounded-2xl border border-border bg-card p-1.5 shadow-soft">
              <img
                src={assetUrl("previews/luxury-hotel.jpg")}
                alt="Portada de la plantilla Luxury Hotel"
                width={480}
                height={340}
                className="aspect-[16/10] w-full rounded-xl object-cover object-top"
              />
              <div className="flex items-center justify-between px-2 py-2">
                <span className="text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase">
                  Luxury Hotel
                </span>
                <span className="size-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </BlurFade>


          <p className="mt-4 text-right text-[0.66rem] tracking-[0.16em] text-muted-foreground/70 uppercase">
            Dos piezas reales del catálogo
          </p>
        </div>
      </div>
    </section>
  )
}
