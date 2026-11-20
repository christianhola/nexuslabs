import { useSearchParams } from "react-router-dom"

import { Catalog } from "@/components/catalog"
import { PageHero } from "@/pages/page-hero"
import { data } from "@/lib/data"

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get("industria") ?? "all"
  const industry = data.industries.some((item) => item.id === requested)
    ? requested
    : "all"
  const active = data.industries.find((item) => item.id === industry)

  function changeIndustry(value: string) {
    const next = new URLSearchParams(params)
    if (value === "all") {
      next.delete("industria")
    } else {
      next.set("industria", value)
    }
    setParams(next, { replace: true })
  }

  return (
    <div>
      <PageHero
        eyebrow={`${data.total} plantillas completas`}
        title={
          <>
            El catálogo entero,{" "}
            <span className="display-italic text-primary">sin vitrina</span>.
          </>
        }
        description="Cada pieza tiene su propia página: qué incluye, qué hay que conectar para producción y cuánto cambia con tu marca. Filtra, pagina y abre la que te sirva."
        aside={
          <p className="max-w-[17rem] text-[0.78rem] leading-6 text-muted-foreground">
            {active
              ? active.copy
              : `${data.industries.length} territorios, una misma forma de trabajar.`}
          </p>
        }
      />
      <Catalog
        industry={industry}
        onIndustryChange={changeIndustry}
        showHeading={false}
      />
    </div>
  )
}
