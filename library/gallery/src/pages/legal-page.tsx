import { Link } from "react-router-dom"
import { Mail, ShieldCheck, Scale, FileText } from "lucide-react"

import { PageHero } from "@/pages/page-hero"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CONTACT_EMAIL_ALT, mailLink } from "@/lib/site"

type Section = { id: string; title: string; body: React.ReactNode }

const sections: Section[] = [
  {
    id: "quienes-somos",
    title: "1. Quiénes somos",
    body: (
      <>
        <p>
          NEXUS LABS es una iniciativa independiente de tecnología y desarrollo digital,
          dirigida por Christian y ubicada en La Romana, República Dominicana.
        </p>
        <p>
          Desarrollamos proyectos relacionados con diseño web, aplicaciones, automatización de
          procesos e inteligencia artificial.
        </p>
        <p>
          NEXUS LABS se presenta actualmente como una marca o proyecto independiente. Esta
          denominación no implica que exista una sociedad mercantil formalmente constituida o
          registrada.
        </p>
        <p>
          Nuestro objetivo es ofrecer soluciones digitales funcionales, accesibles y adaptadas a
          las necesidades de cada cliente.
        </p>
      </>
    ),
  },
  {
    id: "privacidad",
    title: "2. Política de privacidad",
    body: (
      <>
        <p>
          Respetamos la privacidad de quienes visitan nuestro sitio web o se comunican con
          nosotros.
        </p>
        <p>
          Podemos recibir información como nombres, correos electrónicos, teléfonos, mensajes e
          información sobre proyectos cuando las personas la proporcionan voluntariamente.
        </p>
        <p>
          Utilizamos esa información para responder consultas, preparar presupuestos, gestionar
          solicitudes y prestar los servicios acordados.
        </p>
        <p>
          No vendemos la información personal recibida a través de nuestros servicios.
        </p>
        <p>
          Cuando sea necesario utilizar proveedores externos, como alojamiento web, correo
          electrónico o herramientas de inteligencia artificial, procuraremos limitar el
          tratamiento a la información necesaria y comunicarlo cuando corresponda.
        </p>
        <p>
          Los datos se conservarán durante el tiempo necesario para cumplir las finalidades
          indicadas y las obligaciones legales aplicables.
        </p>
        <p>
          Las personas podrán solicitar información sobre sus datos, su rectificación o
          eliminación cuando corresponda, escribiendo a{" "}
          <a
            href={mailLink("Solicitud sobre mis datos personales")}
            className="text-primary underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL_ALT}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    title: "3. Seguridad",
    body: (
      <>
        <p>
          NEXUS LABS procura aplicar buenas prácticas de seguridad y protección de información.
        </p>
        <p>
          El acceso a cuentas, archivos y sistemas de los clientes deberá contar con
          autorización.
        </p>
        <p>
          No garantizamos que ningún servicio digital esté completamente libre de riesgos, pero
          nos comprometemos a atender responsablemente los problemas de seguridad que se detecten
          dentro de los servicios contratados.
        </p>
      </>
    ),
  },
  {
    id: "condiciones",
    title: "4. Condiciones de servicio",
    body: (
      <>
        <p>
          Los servicios de NEXUS LABS se ofrecen mediante presupuestos y acuerdos individuales.
        </p>
        <p>
          Antes de comenzar un proyecto, se procurará establecer por escrito:
        </p>
        <ul>
          <li>El servicio solicitado.</li>
          <li>El precio acordado.</li>
          <li>Los plazos de entrega.</li>
          <li>Las revisiones incluidas.</li>
          <li>Las condiciones de pago.</li>
          <li>Las responsabilidades de cada parte.</li>
        </ul>
        <p>
          Las funcionalidades adicionales que no estén incluidas en el presupuesto original
          podrán requerir un nuevo acuerdo.
        </p>
      </>
    ),
  },
  {
    id: "pagos",
    title: "5. Pagos y cancelaciones",
    body: (
      <>
        <p>
          Los proyectos pueden contratarse con un anticipo del 50 % y un pago final del 50 %,
          salvo que ambas partes acuerden otras condiciones.
        </p>
        <p>
          Si un proyecto es cancelado, se revisarán los trabajos realizados, los pagos efectuados
          y los gastos autorizados para determinar los importes pendientes o reembolsables
          conforme al acuerdo y la legislación aplicable.
        </p>
      </>
    ),
  },
  {
    id: "propiedad",
    title: "6. Propiedad intelectual",
    body: (
      <>
        <p>
          Los diseños, contenidos y componentes originales desarrollados por NEXUS LABS estarán
          sujetos a los derechos que legalmente correspondan.
        </p>
        <p>
          Los derechos de uso o titularidad sobre trabajos personalizados se establecerán en cada
          contrato.
        </p>
        <p>
          Las herramientas, bibliotecas, imágenes y otros materiales de terceros conservarán sus
          respectivas licencias.
        </p>
      </>
    ),
  },
  {
    id: "ia",
    title: "7. Uso de inteligencia artificial",
    body: (
      <>
        <p>
          Algunos proyectos pueden incorporar herramientas de inteligencia artificial.
        </p>
        <p>
          Estas herramientas pueden generar resultados incorrectos o incompletos, por lo que
          deberán utilizarse con controles adecuados y supervisión humana cuando el riesgo lo
          requiera.
        </p>
        <p>
          Las integraciones y el tratamiento de información de clientes requerirán las
          autorizaciones correspondientes.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "8. Cookies y tecnologías externas",
    body: (
      <>
        <p>
          Este sitio puede utilizar tecnologías necesarias para su funcionamiento.
        </p>
        <p>
          Antes de activar herramientas adicionales de análisis, publicidad o seguimiento, se
          informará sobre su uso y se solicitará consentimiento cuando la legislación aplicable
          lo requiera.
        </p>
      </>
    ),
  },
  {
    id: "garantias",
    title: "9. Garantías",
    body: (
      <>
        <p>
          Los proyectos podrán incluir garantías técnicas definidas en cada presupuesto o
          contrato.
        </p>
        <p>
          NEXUS LABS procurará corregir los defectos reproducibles cubiertos por el alcance y el
          período de garantía acordados.
        </p>
        <p>
          Las solicitudes de nuevas funcionalidades se tratarán como trabajos adicionales.
        </p>
      </>
    ),
  },
  {
    id: "contacto",
    title: "10. Contacto",
    body: (
      <>
        <p>
          Para presupuestos, consultas técnicas, asuntos de privacidad o solicitudes
          comerciales:
        </p>
        <div className="mt-3 rounded-md border border-border bg-muted/30 p-4 text-[0.85rem] leading-6">
          <p className="font-medium text-foreground">NEXUS LABS</p>
          <p className="text-muted-foreground">La Romana, República Dominicana</p>
          <p>
            <a
              href={mailLink("Consulta legal / privacidad")}
              className="text-primary underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL_ALT}
            </a>
          </p>
          <p className="text-muted-foreground">
            Portafolio:{" "}
            <a
              href="https://christianhola.github.io/nexuslabs/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              christianhola.github.io/nexuslabs/
            </a>
          </p>
        </div>
      </>
    ),
  },
  {
    id: "filosofia",
    title: "11. Nuestra filosofía",
    body: (
      <>
        <p className="font-display text-lg text-foreground">
          Tecnología accesible. Ingeniería responsable. Resultados verificables.
        </p>
        <p>
          Creemos que cualquier negocio puede beneficiarse de soluciones tecnológicas modernas.
        </p>
        <p>
          Nuestro trabajo se basa en la transparencia, la responsabilidad, el aprendizaje, la
          seguridad y la mejora continua.
        </p>
        <p>
          Buscamos construir soluciones útiles, con objetivos claros y compromisos realistas.
        </p>
      </>
    ),
  },
]

const pricing = [
  { name: "NEXUS BASIC", price: "RD$2,500", note: "Pago único", desc: "Landing adaptable a móviles, información del negocio, botón de WhatsApp y diseño profesional." },
  { name: "NEXUS PRO", price: "RD$4,500", note: "Pago único", desc: "Página de hasta 4 secciones, galería, formulario y personalización de marca." },
  { name: "NEXUS BUSINESS", price: "RD$7,500", note: "Pago único", desc: "Sitio de hasta 5 páginas, catálogo sencillo, formularios y configuración inicial." },
  { name: "NEXUS AUTOMATION", price: "RD$2,000", note: "Desde", desc: "Formulario conectado con registro de solicitudes, avisos y confirmaciones por correo." },
  { name: "NEXUS AI", price: "RD$5,000", note: "Desde", desc: "Chatbot de preguntas frecuentes con base de conocimiento limitada. Integraciones RAG/MCP avanzadas se cotizan aparte." },
]

export function LegalPage() {
  return (
    <div>
      <PageHero
        eyebrow="Información legal"
        title={
          <>
            Privacidad, términos y{" "}
            <span className="display-italic text-primary">condiciones</span>.
          </>
        }
        description="Todo lo que necesitas saber sobre cómo trabajamos, cómo tratamos tus datos y qué incluye cada servicio. Sin letra pequeña escondida."
        aside={
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="h-7 rounded-full px-2.5 text-[0.7rem] font-normal">
              <ShieldCheck className="mr-1 size-3" />
              Privacidad
            </Badge>
            <Badge variant="outline" className="h-7 rounded-full px-2.5 text-[0.7rem] font-normal">
              <Scale className="mr-1 size-3" />
              Términos
            </Badge>
            <Badge variant="outline" className="h-7 rounded-full px-2.5 text-[0.7rem] font-normal">
              <FileText className="mr-1 size-3" />
              Precios
            </Badge>
          </div>
        }
      />

      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_16rem]">
        <article className="min-w-0 space-y-10">
          <p className="text-[0.72rem] text-muted-foreground">
            Última actualización: 20 de noviembre de 2026 · La Romana, República Dominicana
          </p>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-2xl text-foreground">{section.title}</h2>
              <div className="mt-3 space-y-3 text-[0.88rem] leading-7 text-muted-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:text-primary">
                {section.body}
              </div>
            </section>
          ))}

          <section id="precios" className="scroll-mt-24 border-t border-border pt-10">
            <h2 className="font-display text-2xl text-foreground">Precios de lanzamiento (RD$)</h2>
            <p className="mt-2 text-[0.82rem] text-muted-foreground">
              Tarifas promocionales sugeridas, en pesos dominicanos. Pago único salvo indicación.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {pricing.map((item) => (
                <div
                  key={item.name}
                  className="rounded-md border border-border bg-[#050505] p-4 transition-colors hover:border-[rgba(16,163,127,0.28)]"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[0.78rem] font-medium tracking-[0.12em] text-muted-foreground">
                      {item.name}
                    </p>
                    <p className="font-display text-xl text-foreground">{item.price}</p>
                  </div>
                  <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.14em] text-primary">
                    {item.note}
                  </p>
                  <p className="mt-2 text-[0.78rem] leading-6 text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.72rem] text-muted-foreground">
              Dominio, hosting, APIs de pago, mantenimiento y funcionalidades adicionales no están
              incluidos. Se cotizan por separado.
            </p>
          </section>

          <section className="border-t border-border pt-8">
            <p className="text-[0.78rem] text-muted-foreground">
              Este es un modelo informativo preliminar, no una garantía de validez legal. Conviene
              revisarlo con un profesional jurídico antes de utilizarlo comercialmente.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                className="h-10 gap-2 rounded-full"
                render={<a href={mailLink("Consulta sobre precios y condiciones")} />}
              >
                <Mail data-icon="inline-start" />
                Escribir al estudio
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-full"
                render={<Link to="/contacto" />}
              >
                Contacto
              </Button>
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-1 text-[0.78rem]">
            <p className="mono-label mb-3">En esta página</p>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block py-1 text-muted-foreground transition hover:text-foreground"
              >
                {section.title}
              </a>
            ))}
            <a
              href="#precios"
              className="block py-1 text-muted-foreground transition hover:text-foreground"
            >
              Precios
            </a>
          </nav>
        </aside>
      </div>
    </div>
  )
}