/*
  The simulated devices the docs console reads, shared by the Worker (which
  serves them) and the docs page (which describes them). Sandbox keys are
  minted in the browser and only need the right shape; replace this with
  your real key check when you wire the API to a backend.
*/
export const SANDBOX_KEY = /^gw_sbx_[a-z0-9]{24}$/

export type SandboxDevice = {
  id: string
  type: 'vehicle' | 'charger' | 'heat_pump' | 'battery'
  vendor: string
  model: string
  state: Record<string, string | number | boolean>
}

export const sandboxDevices: SandboxDevice[] = [
  { id: 'veh_7Hq2Lx', type: 'vehicle', vendor: 'Voltaro', model: 'Arc 5', state: { battery_percent: 46, range_km: 182, is_plugged_in: true, is_charging: false, charge_limit_percent: 90 } },
  { id: 'chg_3Kd9Vp', type: 'charger', vendor: 'Plugwell', model: 'Home 22', state: { power_kw: 0, max_power_kw: 11, status: 'connected' } },
  { id: 'hp_9Rm4Tb', type: 'heat_pump', vendor: 'Thermwell', model: 'Air 8', state: { power_kw: 1.8, indoor_c: 20.5, setpoint_c: 21, mode: 'heating' } },
  { id: 'bat_2Ns6Qw', type: 'battery', vendor: 'Stillcell', model: 'Wall 13', state: { battery_percent: 71, power_kw: -2.2, capacity_kwh: 13.5, mode: 'self_consumption' } },
]

export type ScheduleInput = { targetPercent?: unknown; readyBy?: unknown }

export function validateSchedule(b: ScheduleInput): Record<string, string> {
  const e: Record<string, string> = {}
  const t = Number(b.targetPercent)
  if (!Number.isInteger(t) || t < 10 || t > 100) e.targetPercent = 'targetPercent must be a whole number from 10 to 100.'
  if (typeof b.readyBy !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(b.readyBy)) e.readyBy = 'readyBy must be a time like "07:00".'
  return e
}

export function mintSandboxKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  return 'gw_sbx_' + Array.from(bytes, (b) => chars[b % chars.length]).join('')
}
