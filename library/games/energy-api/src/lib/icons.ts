import { BatteryCharging, Car, Fan, PlugZap, Sun, Thermometer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { CategoryId } from '../content'

export const categoryIcon: Record<CategoryId, LucideIcon> = {
  ev: Car,
  charger: PlugZap,
  heatpump: Fan,
  battery: BatteryCharging,
  solar: Sun,
  thermostat: Thermometer,
}
