import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"

import { SectionHead } from "@/components/section-head"
import { BlurFade } from "@/components/ui/blur-fade"
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
          className={`grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-5 ${
            showHeading ? "mt-10" : ""
          }`}
        >
          {data.industries.map((industry, index) => (
            <BlurFade key={industry.id} delay={index * 0.03} inView>
              <Link
                to={`/plantillas?industria=${industry.id}`}
                className="group flex h-full flex-col"
                aria-label={`Ver plantillas de ${industry.label}`}
              >
                <div className="overflow-hidden bg-muted/40">
                  {industry.cover ? (
                    <img
                      src={assetUrl(industry.cover)}
                      alt=""
                      width={640}
                      height={440}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-muted" />
                  )}
                </div>
                <div className="flex items-baseline justify-between gap-2 pt-2.5">
                  <h3 className="text-[0.84rem] leading-5 font-medium">
                    {industry.label}
                  </h3>
                  <span className="mono-label shrink-0">{industry.count}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[0.72rem] leading-5 text-muted-foreground">
                  {industry.copy}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground transition-colors group-hover:text-primary">
                  Ver
                  <ArrowUpRight className="size-3" />
                </span>
              </Link>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
