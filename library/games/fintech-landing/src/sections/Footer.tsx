import { Container } from '../components/Container'
import { Logo } from '../components/Logo'
import { brand, footer } from '../content'
import { Link } from '../lib/router'

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] pt-16 pb-10">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 max-w-[260px] text-[14px] leading-relaxed text-muted">{brand.tagline}</p>
          </div>
          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-[13px] font-medium text-white">{col.title}</h2>
              <ul className="mt-3 flex flex-col">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="inline-flex min-h-[40px] items-center text-[14px] text-muted transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Revio, Inc. ·{' '}
            <Link href={footer.styleguide.href} className="inline-flex min-h-[40px] items-center underline-offset-4 transition-colors hover:text-white hover:underline">
              {footer.styleguide.label}
            </Link>
          </span>
          <span className="max-w-[640px] sm:text-right">{footer.legal}</span>
        </div>
      </Container>
      {/* Giant watermark. SVG text so it scales with the viewport and is not read as body copy. */}
      <svg aria-hidden viewBox="0 0 1000 250" className="pointer-events-none mt-10 block w-full select-none">
        <text x="500" y="215" textAnchor="middle" fontFamily="'Inter Tight', Inter, sans-serif" fontWeight="600" fontSize="345" letterSpacing="-20" fill="rgb(255 255 255 / 0.035)">
          Revio
        </text>
      </svg>
    </footer>
  )
}
