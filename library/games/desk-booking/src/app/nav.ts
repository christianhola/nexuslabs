import { CalendarDays, CalendarRange, DoorOpen, LayoutGrid, Map, Package, PencilRuler, Users, type LucideIcon } from 'lucide-react'

export type NavItem = { path: string; label: string; icon: LucideIcon; reference?: boolean }

// The sidebar. `reference` marks the six items shown in the landing mock.
export const nav: NavItem[] = [
  { path: '/app', label: 'Dashboard', icon: LayoutGrid, reference: true },
  { path: '/app/floor', label: 'Floor map', icon: Map, reference: true },
  { path: '/app/rooms', label: 'Meeting rooms', icon: DoorOpen },
  { path: '/app/bookings', label: 'My bookings', icon: CalendarRange, reference: true },
  { path: '/app/parking', label: 'Parking & lockers', icon: Package, reference: true },
  { path: '/app/team', label: 'Team', icon: Users, reference: true },
  { path: '/app/week', label: 'My week', icon: CalendarDays, reference: true },
]

export const adminNav: NavItem[] = [{ path: '/app/admin', label: 'Floor plan editor', icon: PencilRuler }]
