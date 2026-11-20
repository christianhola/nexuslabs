import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

import { SectionHead } from "@/components/section-head"
import { BlurFade } from "@/components/ui/blur-fade"
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern"
import { data } from "@/lib/data"
import { assetUrl } from "@/lib/site"

export function Industries({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        {showHeading && (
          <SectionHead
            eyebrow="Diez territorios, un mismo criterio"
            title={
              <>
                Diseñado para oficios{" "}
                <span className="display-italic text-primary">concretos</span>.
              </>
            }
            description="Cada plantilla nace de un negocio real: su vocabulario, sus fotos, su forma de vender. Elige tu territorio y el catálogo se abre ya filtrado."
            aside={
              <p className="max-w-[15rem] text-[0.78rem] leading-5 text-muted-foreground">
                {data.industries
                  .map((industry) => industry.short)
                  .join(" · ")}
              </p>
            }
          />
        )}

        <div
          className={`relative overflow-hidden rounded-3xl border border-border bg-card/40 p-3 sm:p-4 ${
            showHeading ? "mt-10" : ""
          }`}
        >
          <InteractiveGridPattern
            squares={[36, 16]}
            className="pointer-events-auto opacity-[0.18] [mask-image:radial-gradient(75%_75%_at_50%_40%,black,transparent)]"
            squaresClassName="stroke-foreground/25 hover:fill-primary/20"
          />
          <div className="relative grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {data.industries.map((industry, index) => (
              <BlurFade key={industry.id} delay={index * 0.035} inView>
                <Link
                  to={`/plantillas?industria=${industry.id}`}
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-background/70 text-left transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
                  aria-label={`Ver plantillas de ${industry.label}`}
                >
                  <div className="relative overflow-hidden">
                    {industry.cover ? (
                      <img
                        src={assetUrl(industry.cover)}
                        alt=""
                        width={640}
                        height={440}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full object-cover object-top transition duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-muted" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <span className="absolute top-2.5 left-2.5 rounded-full border border-white/20 bg-black/35 px-2 py-0.5 text-[0.58rem] tracking-[0.14em] text-white/85 uppercase backdrop-blur">
                      {industry.count} plantillas
                    </span>
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-2 px-3 py-3">
                    <div>
                      <h3 className="text-[0.86rem] leading-5 font-medium">
                        {industry.label}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[0.72rem] leading-4 text-muted-foreground">
                        {industry.copy}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
