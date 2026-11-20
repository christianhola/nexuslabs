import { useId } from 'react'

/* Five black stars filled to `value` (supports halves), as in the hero. */
export function Stars({ value, size = 26 }: { value: number; size?: number }) {
  const id = useId()
  const path = 'M12 1.6l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.7l-6.4 3.5L7 14.1l-5.3-5 7.2-.9z'
  return (
    <span className="inline-flex items-center gap-[3px]" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i))
        return (
          <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden>
            <defs>
              <clipPath id={`${id}-${i}`}>
                <rect x="0" y="0" width={24 * fill} height="24" />
              </clipPath>
            </defs>
            <path d={path} fill="none" stroke="#0f0f0f" strokeWidth="1.8" strokeLinejoin="round" />
            <path d={path} fill="#0f0f0f" stroke="#0f0f0f" strokeWidth="1.8" strokeLinejoin="round" clipPath={`url(#${id}-${i})`} />
          </svg>
        )
      })}
    </span>
  )
}
