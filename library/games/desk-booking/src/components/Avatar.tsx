import type { Person } from '../data'
import { cn } from '../lib/cn'

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
}

/** Initials on a tinted disc; the hue comes from the person record. */
export function Avatar({ person, size = 32, ring, className }: { person: Person; size?: number; ring?: boolean; className?: string }) {
  return (
    <span
      role="img"
      aria-label={person.name}
      title={person.name}
      className={cn('inline-grid shrink-0 place-items-center rounded-full font-semibold select-none', ring && 'ring-2 ring-surface', className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(9, Math.round(size * 0.34)),
        letterSpacing: '-0.02em',
        background: `hsl(${person.hue} 70% 92%)`,
        color: `hsl(${person.hue} 55% 28%)`,
      }}
    >
      {initials(person.name)}
    </span>
  )
}

export function AvatarStack({ people, max = 4, size = 28 }: { people: Person[]; max?: number; size?: number }) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <span className="flex items-center" aria-label={`${people.length} people`} role="group">
      {shown.map((p, i) => (
        <Avatar key={p.id} person={p} size={size} ring className={i > 0 ? '-ml-1.5' : ''} />
      ))}
      {extra > 0 && (
        <span
          className="-ml-1.5 inline-grid place-items-center rounded-full bg-subtle text-2xs font-semibold text-body ring-2 ring-surface"
          style={{ width: size, height: size }}
        >
          +{extra}
        </span>
      )}
    </span>
  )
}
