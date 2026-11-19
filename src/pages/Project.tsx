import { Link, useParams } from 'react-router'

import { BeforeAfter } from '../components/BeforeAfter'
import { ArrowLink, ButtonLink } from '../components/Button'
import { Label } from '../components/Label'
import { Photo } from '../components/Photo'
import { Reveal } from '../components/Reveal'
import { SaveButton } from '../components/SaveButton'
import { Swatch } from '../components/Swatch'
import { PACKAGES, PROJECTS } from '../content'
import { NotFound } from './NotFound'

export function ProjectPage() {
  const { slug } = useParams()
  const index = PROJECTS.findIndex((p) => p.slug === slug)
  if (index < 0) return <NotFound />
  const project = PROJECTS[index]
  const next = PROJECTS[(index + 1) % PROJECTS.length]
  const pkg = PACKAGES.find((p) => p.id === project.package)!

  const facts = [
    { label: 'Location', value: project.location },
    { label: 'Size', value: project.size },
    { label: 'Duration', value: project.duration },
    { label: 'Package', value: pkg.name },
  ]

  return (
    <article>
      <header className="container-page pt-28 md:pt-36">
        <nav aria-label="Breadcrumb" className="label-sm text-muted">
          <Link to="/portfolio" className="link-underline inline-flex min-h-10 items-center">
            Portfolio
          </Link>
          <span aria-hidden> / </span>
          <span aria-current="page" className="text-ink-2">
            {project.name}
          </span>
        </nav>
        <h1 className="font-display mt-5 animate-rise text-[clamp(3rem,9vw,9rem)]">{project.name}</h1>
        <div className="mt-8 grid gap-8 border-t border-ink pt-5 md:grid-cols-12">
          <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.15] tracking-[-0.03em] text-pretty md:col-span-6">{project.summary}</p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 md:col-span-5 md:col-start-8">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="label-sm text-muted">{f.label}</dt>
                <dd className="mt-0.5 text-[15px] font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <Photo name={project.cover} alt={`${project.name}, ${project.location}`} eager className="mt-10 aspect-[16/9] max-h-[85svh] w-full" />

      <section aria-labelledby="brief-title" className="container-page grid gap-8 py-20 md:grid-cols-12">
        <div className="md:col-span-3">
          <Label>The brief</Label>
          <h2 id="brief-title" className="sr-only">
            The brief
          </h2>
        </div>
        <p className="font-statement text-[clamp(1.75rem,3.4vw,3rem)] text-pretty md:col-span-8">{project.brief}</p>
      </section>

      <div className="container-page grid gap-10 pb-24 md:grid-cols-12">
        <nav aria-label="Rooms in this project" className="md:col-span-3">
          <div className="md:sticky md:top-24">
            <Label>Room by room</Label>
            <ol className="mt-4 flex flex-wrap gap-2 md:flex-col md:gap-0">
              {project.rooms.map((r, i) => (
                <li key={r.id}>
                  <a href={`#${r.id}`} className="inline-flex min-h-10 items-center gap-3 text-[15px] font-medium hover:opacity-60">
                    <span className="label-sm tabular-nums text-muted">{String(i + 1).padStart(2, '0')}</span>
                    {r.name}
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-8 hidden md:block">
              <Label>Palette</Label>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {project.palette.map((c) => (
                  <Swatch key={c.hex} hex={c.hex} name={c.name} />
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex flex-col gap-20 md:col-span-9">
          {project.rooms.map((r, i) => (
            <Reveal key={r.id}>
              <section id={r.id} aria-labelledby={`${r.id}-title`} className="scroll-mt-24">
                <div className="relative">
                  <Photo name={r.image} alt={`${r.name}, ${project.name}`} className="aspect-[3/2]" />
                  <SaveButton id={r.id} name={r.name} className="absolute top-3 right-3" />
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-9">
                  <div className="md:col-span-4">
                    <p className="label-sm tabular-nums text-muted">
                      {String(i + 1).padStart(2, '0')} {r.type}
                    </p>
                    <h2 id={`${r.id}-title`} className="mt-1 text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-medium tracking-[-0.045em]">
                      {r.name}
                    </h2>
                  </div>
                  <div className="md:col-span-5">
                    <p className="text-[16px] leading-snug text-ink-2">{r.body}</p>
                    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Materials">
                      {r.materials.map((m) => (
                        <li key={m} className="round rounded-full bg-paper-2 px-3 py-1 text-[13px] text-ink-2">
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </Reveal>
          ))}

          {project.beforeAfter && (
            <section aria-labelledby="ba-title">
              <Label>Before and after</Label>
              <h2 id="ba-title" className="mt-2 text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-medium tracking-[-0.045em]">
                Drag to compare
              </h2>
              <BeforeAfter className="mt-5" before={project.beforeAfter.before} after={project.beforeAfter.after} label="Compare the room before and after the redesign" />
              <p className="label-sm mt-3 text-muted">{project.beforeAfter.caption}</p>
            </section>
          )}

          <div className="grid grid-cols-2 gap-3 md:hidden">
            {project.palette.map((c) => (
              <Swatch key={c.hex} hex={c.hex} name={c.name} />
            ))}
          </div>
        </div>
      </div>

      <section aria-label="Next" className="on-dark bg-night text-snow">
        <div className="container-page grid gap-8 py-16 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <Label tone="light">Planning something like this?</Label>
            <p className="mt-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.04em]">Start with a two-hour consultation in your own home.</p>
            <ButtonLink to={`/book?package=${project.package}`} variant="light" icon className="mt-6">
              Book a consultation
            </ButtonLink>
          </div>
          <Link to={`/portfolio/${next.slug}`} className="group md:col-span-5 md:col-start-8">
            <span className="label-sm text-snow-muted">Next project</span>
            <span className="mt-2 flex items-center gap-4">
              <Photo name={next.cover} alt="" className="aspect-square w-24 shrink-0" />
              <span className="text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-medium tracking-[-0.045em] group-hover:underline">{next.name}</span>
            </span>
          </Link>
        </div>
      </section>
      <div className="container-page py-6">
        <ArrowLink to="/portfolio">Back to the portfolio</ArrowLink>
      </div>
    </article>
  )
}
