import { BRAND, type LogoId } from '@/content'
import { cn } from '@/lib/cn'

/** Clipwise mark: a cream disc with a clip-shaped cut and a play notch. */
export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#f4efe4" />
      <path d="M21.6 11.2a7 7 0 1 0 0 9.6" fill="none" stroke="#121110" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M15 12.6v6.8l5.4-3.4z" fill="#e5484d" />
    </svg>
  )
}

export function Logo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark size={size === 'md' ? 30 : 24} />
      <span className={cn('font-display font-semibold tracking-[-0.03em] text-fg', size === 'md' ? 'text-[23px]' : 'text-[18px]')}>{BRAND.name}</span>
    </span>
  )
}

/**
 * Invented partner wordmarks for the "Trusted by" strip. Each is drawn here
 * in SVG and type so no real brand appears; swap in your customers' logos.
 */
export function PartnerLogo({ id, className }: { id: LogoId; className?: string }) {
  const base = cn('inline-flex shrink-0 items-center gap-2 text-[#c9c3b8]', className)
  switch (id) {
    case 'loopkit':
      return (
        <span className={base} aria-label="Loopkit" role="img">
          <svg viewBox="0 0 48 24" width="46" height="23" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <circle cx="6" cy="16" r="4" />
            <circle cx="18" cy="16" r="4" />
            <path d="M22 16h4a6 6 0 0 0 6-6V9" />
            <circle cx="35" cy="6" r="4" />
          </svg>
          <span className="font-mono text-[21px] font-medium tracking-[-0.02em]">loopkit</span>
        </span>
      )
    case 'hearth':
      return (
        <span className={base} aria-label="Hearth" role="img">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
            <circle cx="12" cy="12" r="9.5" />
            <path d="M12 6.5c2.8 2.2 4 4.2 4 6.3a4 4 0 0 1-8 0c0-1.4.6-2.6 1.6-3.6.3 1.4 1 2.2 2 2.6-.6-1.9-.4-3.6.4-5.3z" fill="currentColor" stroke="none" />
          </svg>
          <span className="font-display text-[25px] font-semibold tracking-[-0.04em]">hearth</span>
        </span>
      )
    case 'paperplane':
      return (
        <span className={cn(base, 'gap-0')} aria-label="Paperplane Weekly" role="img">
          <span className="font-serif text-[27px] italic tracking-[-0.01em]">Paperplane</span>
          <span className="ml-1.5 font-serif text-[27px] italic opacity-70">Weekly</span>
        </span>
      )
    case 'quarry':
      return (
        <span className={base} aria-label="Quarry" role="img">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
            <path d="M12 2 22 8v8l-10 6L2 16V8z" opacity="0.35" />
            <path d="M12 2 22 8l-10 6L2 8z" />
          </svg>
          <span className="font-display text-[22px] font-bold tracking-[0.12em] uppercase">Quarry</span>
        </span>
      )
    case 'stackhouse':
      return (
        <span className={base} aria-label="Stackhouse" role="img">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
            <rect x="3" y="3" width="18" height="5" rx="1.5" />
            <rect x="3" y="10" width="18" height="5" rx="1.5" opacity="0.7" />
            <rect x="3" y="17" width="18" height="4" rx="1.5" opacity="0.45" />
          </svg>
          <span className="font-sans text-[21px] font-semibold tracking-[-0.03em]">stackhouse</span>
        </span>
      )
    case 'mintline':
      return (
        <span className={base} aria-label="Mintline" role="img">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M3 17c3-8 6-8 9 0s6 8 9 0" />
          </svg>
          <span className="font-display text-[23px] font-medium tracking-[-0.02em]">mintline</span>
        </span>
      )
    case 'orbitly':
      return (
        <span className={base} aria-label="Orbitly" role="img">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(-25 12 12)" />
            <circle cx="12" cy="12" r="3.2" fill="currentColor" />
          </svg>
          <span className="font-display text-[23px] font-semibold tracking-[-0.03em]">orbitly</span>
        </span>
      )
  }
}
