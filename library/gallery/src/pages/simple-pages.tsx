import { Link } from "react-router-dom"
import { ArrowUpRight, MessageCircle } from "lucide-react"

import { Industries } from "@/components/industries"
import { Faq, Process, Studio } from "@/components/sections"
import { Button } from "@/components/ui/button"
import { PageHero } from "@/pages/page-hero"
import { data } from "@/lib/data"
import { GITHUB, customRequest, mailLink } from "@/lib/site"

const talk = mailLink(
  "Hola NEXUS LABS 👋 Quiero hablar de un proyecto y entender alcance y plazos."
)

function Closing({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-2xl leading-tight">{title}</p>
            <p className="mt-1.5 max-w-xl text-[0.84rem] leading-6 text-muted-foreground">
              {copy}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="h-10 gap-2 rounded-full"
              render={<a href={talk} />}
            >
              <MessageCircle data-icon="inline-start" />
              Correo
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full"
              render={<Link to="/contacto" />}
            >
              Contacto
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function IndustriesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Diez territorios"
        title={
          <>
            Un catálogo que habla{" "}
            <span className="display-italic text-primary">tu idioma</span>.
          </>
        }
        description="Cada industria tiene su vocabulario, sus fotos y su forma de vender. Elige la tuya y el catálogo se abre ya filtrado, sin buscar a mano entre ochenta y ocho piezas."
        aside={
          <p className="max-w-[16rem] text-[0.78rem] leading-6 text-muted-foreground">
            {data.industries.map((industry) => industry.label).join(" · ")}
          </p>
        }
      />
      <Industries showHeading={false} />
      <Closing
        title="¿Tu oficio no está en la lista?"
        copy="El catálogo es una base, no un límite. Cuéntanos qué haces y te decimos qué pieza encaja mejor o si conviene diseñar desde cero."
      />
    </div>
  )
}

export function ProcessPage() {
  return (
    <div>
      <PageHero
        eyebrow="Cómo se trabaja"
        title={
          <>
            Menos ceremonia.{" "}
            <span className="display-italic text-primary">Más entrega</span>.
          </>
        }
        description="Tres conversaciones, un alcance claro y un sitio publicado. Sin briefs eternos ni reuniones que no deciden nada."
        aside={
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-full bg-card/60"
            render={<a href={customRequest()} />}
          >
            Empezar un proyecto
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        }
      />
      <Process showHeading={false} />
      <section className="border-t border-border py-14">
        <div className="mx-auto grid w-full max-w-[1240px] gap-6 px-5 sm:grid-cols-3 sm:px-8">
          {[
            {
              title: "Sin anticipos raros",
              copy: "Alcance y precio por escrito antes de tocar código. Se paga por hitos, no por promesas.",
            },
            {
              title: "Una sola persona al mando",
              copy: "Hablas siempre con quien diseña y construye. Nada de teléfono roto entre departamentos.",
            },
            {
              title: "Entrega con accesos",
              copy: "Recibes el repositorio, el dominio y las cuentas. El sitio es tuyo desde el primer día.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-display text-xl">{item.title}</h2>
              <p className="mt-2 text-[0.82rem] leading-6 text-muted-foreground">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>
      <Closing
        title="El siguiente paso es una conversación."
        copy="Cuéntanos qué necesitas y en qué fecha. Te respondemos con alcance, precio y un calendario realista."
      />
    </div>
  )
}

export function StudioPage() {
  return (
    <div>
      <PageHero
        eyebrow="NEXUS LABS"
        title={
          <>
            Un estudio pequeño,{" "}
            <span className="display-italic text-primary">obsesivo</span>.
          </>
        }
        description="No vendemos volumen. Cada pieza del catálogo se instala, se abre, se recorre y se corrige antes de publicarse. Lo que ves en la demo es exactamente lo que recibes como base."
        aside={
          <div className="grid gap-2 text-[0.8rem]">
            <p className="rounded-lg border border-border bg-card/70 px-3.5 py-2.5">
              <span className="text-muted-foreground">Diseño: </span>
              editorial, fotografía y tipografía con criterio.
            </p>
            <p className="rounded-lg border border-border bg-card/70 px-3.5 py-2.5">
              <span className="text-muted-foreground">Código: </span>
              React, TypeScript y Tailwind, editable.
            </p>
            <p className="rounded-lg border border-border bg-card/70 px-3.5 py-2.5">
              <span className="text-muted-foreground">Origen: </span>
              créditos y licencias de cada autor, intactos.
            </p>
          </div>
        }
      />
      <Studio showHeading={false} />
      <Closing
        title="¿Quieres ver cómo se construyó?"
        copy="El repositorio está abierto: scripts, licencias y el historial de cada demo. Sin cajas negras."
      />
    </div>
  )
}

export function FaqPage() {
  return (
    <div>
      <PageHero
        eyebrow="Antes de escribir"
        title={
          <>
            Las dudas{" "}
            <span className="display-italic text-primary">razonables</span>.
          </>
        }
        description="Alcance, demos, pagos, dominio y derechos. Si falta algo, pregunta por correo o al asistente: contestamos con el mismo criterio con el que construimos."
        aside={
          <Button
            className="h-10 gap-2 rounded-full"
            render={<Link to="/asistente" />}
          >
            <MessageCircle data-icon="inline-start" />
            Preguntar al asistente
          </Button>
        }
      />
      <Faq showHeading={false} />
      <Closing
        title="¿Tu pregunta no está aquí?"
        copy="Escríbenos y la contestamos sin rodeos. También puedes revisar los créditos y licencias del catálogo."
      />
    </div>
  )
}

export function CreditsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Créditos y licencias"
        title={
          <>
            El trabajo es de{" "}
            <span className="display-italic text-primary">sus autores</span>.
          </>
        }
        description="NEXUS LABS presenta una biblioteca de plantillas creadas por diseñadores y desarrolladores independientes. Los nombres, créditos y licencias originales se conservan en el repositorio; este catálogo no reclama su autoría."
        aside={
          <div className="grid gap-3">
            <p className="max-w-[17rem] text-[0.78rem] leading-6 text-muted-foreground">
              Si eres autor y quieres corregir un crédito o retirar una pieza,
              escríbenos y se resuelve el mismo día.
            </p>
            <Button
              variant="outline"
              className="h-10 w-fit gap-2 rounded-full bg-card/60"
              render={<a href={GITHUB} target="_blank" rel="noreferrer" />}
            >
              Créditos en GitHub
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
        }
      />
      <section className="py-14">
        <div className="mx-auto grid w-full max-w-[1240px] gap-8 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Qué conservamos</h2>
            <ul className="mt-3 space-y-2 text-[0.84rem] leading-6 text-muted-foreground">
              <li>· El nombre y la autoría original de cada plantilla.</li>
              <li>· El archivo de licencia dentro de cada demo.</li>
              <li>· El código fuente sin ofuscación ni marcas de agua.</li>
              <li>· La atribución visible cuando la licencia lo exige.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl">Qué cambia con tu versión</h2>
            <ul className="mt-3 space-y-2 text-[0.84rem] leading-6 text-muted-foreground">
              <li>· Tu marca, tus textos y tus fotografías con permiso.</li>
              <li>· Las integraciones que la demo no puede tener.</li>
              <li>· El dominio y el hosting a tu nombre.</li>
              <li>· Un acuerdo escrito de uso antes de empezar.</li>
            </ul>
          </div>
        </div>
      </section>
      <Closing
        title="¿Eres autor de una de estas piezas?"
        copy="Escríbenos con el nombre de la plantilla y ajustamos el crédito, la licencia o la retiramos del catálogo."
      />
    </div>
  )
}
