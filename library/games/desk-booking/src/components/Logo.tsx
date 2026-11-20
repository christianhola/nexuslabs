import { cn } from '../lib/cn'

/*
  The DESKFLOW wordmark. Drawn as SVG text so it scales crisply and reads as
  one image to assistive tech. It uses the bright brand orange: brand marks are
  exempt from text-contrast rules, every other orange text uses `brand`.
*/
export function Logo({ className, size = 17 }: { className?: string; size?: number }) {
  const w = size * 5.45
  return (
    <svg
      role="img"
      aria-label="DeskFlow"
      viewBox={`0 0 ${w} ${size * 1.25}`}
      width={w}
      height={size * 1.25}
      className={cn('block shrink-0', className)}
    >
      <text
        x="0"
        y={size * 1.02}
        fill="var(--color-brand-bright)"
        fontFamily="var(--font-sans)"
        fontWeight={700}
        fontSize={size}
        letterSpacing={size * 0.035}
        textLength={w - size * 0.1}
        lengthAdjust="spacingAndGlyphs"
      >
        DESKFLOW
      </text>
    </svg>
  )
}
