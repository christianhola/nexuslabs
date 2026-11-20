import { ArrowLeft } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Logo } from '../components/Logo'
import { Link, usePath } from '../lib/router'

/** 404: an empty desk, and two ways out. */
export function NotFound() {
  const path = usePath()
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      <header className="px-5 py-6 sm:px-9">
        <Link href="/" aria-label="DeskFlow home" className="inline-flex min-h-10 items-center rounded-sm">
          <Logo size={18} />
        </Link>
      </header>
      <main className="grid flex-1 place-items-center px-5 pb-20 text-center">
        <div className="max-w-md">
          <EmptyDesk />
          <p className="mt-6 text-sm font-semibold text-brand">404</p>
          <h1 className="mt-1 text-[32px] leading-10 font-bold tracking-[-0.03em] text-ink">This desk is unbooked</h1>
          <p className="mt-2 text-base text-muted">
            Nothing lives at <code className="rounded-xs bg-subtle px-1 py-0.5 text-sm text-body">{path}</code>. It may have moved, or the link is wrong.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/" variant="outline" icon={<ArrowLeft className="size-4" aria-hidden />}>
              Back home
            </ButtonLink>
            <ButtonLink href="/app">Open the app</ButtonLink>
          </div>
        </div>
      </main>
    </div>
  )
}

function EmptyDesk() {
  return (
    <svg viewBox="0 0 240 140" className="mx-auto w-56" aria-hidden>
      <ellipse cx="120" cy="128" rx="100" ry="8" fill="#f3f4f6" />
      <rect x="40" y="58" width="160" height="12" rx="3" fill="#fde7e0" stroke="#f24e1e" strokeWidth="2" />
      <rect x="52" y="70" width="8" height="54" rx="2" fill="#e5e7eb" />
      <rect x="180" y="70" width="8" height="54" rx="2" fill="#e5e7eb" />
      <rect x="92" y="18" width="56" height="36" rx="4" fill="#fff" stroke="#cfd4dc" strokeWidth="2" />
      <rect x="114" y="54" width="12" height="5" fill="#cfd4dc" />
      <text x="120" y="42" textAnchor="middle" fontSize="14" fontWeight="700" fill="#9aa1ad" fontFamily="var(--font-sans)">
        ?
      </text>
      <g>
        <circle cx="200" cy="30" r="10" fill="#e3f6f0" stroke="#4fb99a" strokeWidth="2" />
      </g>
    </svg>
  )
}
