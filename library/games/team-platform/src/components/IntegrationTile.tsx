import { cx } from '../lib/cx'

/* A monogram tile standing in for a partner logo. Swap for real logos. */
function textOn(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return (L + 0.05) / 0.05 > 1.05 / (L + 0.05) ? '#0f0f0f' : '#ffffff'
}

export function IntegrationTile({ name, color, size = 44, className }: { name: string; color: string; size?: number; className?: string }) {
  const letters = name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean)
  const mono = (letters.length > 1 ? letters[0][0] + letters[1][0] : name.slice(0, 2)).toUpperCase()
  return (
    <span className={cx('grid shrink-0 place-items-center rounded-[12px] border border-line bg-card', className)} style={{ width: size, height: size }} aria-hidden>
      <span className="grid place-items-center rounded-[8px] font-display font-semibold" style={{ width: size * 0.68, height: size * 0.68, background: color, color: textOn(color), fontSize: size * 0.28 }}>
        {mono}
      </span>
    </span>
  )
}
