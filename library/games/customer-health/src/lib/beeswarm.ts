/*
  Deterministic beeswarm packing (no force simulation). Circles are placed
  largest first; each one takes the free y closest to the lane centre at its
  fixed x. Same input, same layout, every time.
*/

export type SwarmInput = { id: string; x: number; r: number }
export type SwarmPoint = { x: number; y: number }

export function packSwarm(nodes: SwarmInput[], pad = 1.25): { points: Map<string, SwarmPoint>; extent: number } {
  const order = [...nodes].sort((a, b) => b.r - a.r || a.x - b.x || a.id.localeCompare(b.id))
  const placed: Array<{ x: number; y: number; r: number }> = []
  const points = new Map<string, SwarmPoint>()
  let extent = 0

  for (const n of order) {
    const candidates = [0]
    for (const p of placed) {
      const R = n.r + p.r + pad
      const dx = n.x - p.x
      if (Math.abs(dx) < R) {
        const h = Math.sqrt(R * R - dx * dx)
        candidates.push(p.y + h, p.y - h)
      }
    }
    candidates.sort((a, b) => Math.abs(a) - Math.abs(b) || a - b)
    let y = 0
    for (const c of candidates) {
      let ok = true
      for (const p of placed) {
        const R = n.r + p.r + pad - 0.01
        const dx = n.x - p.x
        const dy = c - p.y
        if (dx * dx + dy * dy < R * R) {
          ok = false
          break
        }
      }
      if (ok) {
        y = c
        break
      }
    }
    placed.push({ x: n.x, y, r: n.r })
    points.set(n.id, { x: n.x, y })
    extent = Math.max(extent, Math.abs(y) + n.r)
  }
  return { points, extent }
}
