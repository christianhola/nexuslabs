import { ArrowLeftRight, Eye, KeyRound, Landmark, Lock, ShieldCheck, Vault } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/** Named outline icons used from content.ts. */
const icons: Record<string, LucideIcon> = {
  transfer: ArrowLeftRight,
  bank: Landmark,
  shield: ShieldCheck,
  lock: Lock,
  key: KeyRound,
  eye: Eye,
  vault: Vault,
}

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = icons[name] ?? ShieldCheck
  return <C className={className} strokeWidth={1.5} aria-hidden />
}
