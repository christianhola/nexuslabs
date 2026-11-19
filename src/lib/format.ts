export const money = (n: number) => `£${n.toLocaleString('en-GB')}`

export function longDate(iso: string) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
}
