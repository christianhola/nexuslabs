import { cx } from '../lib/cx'

export type AvatarTone = 'cobalt' | 'cherry' | 'saffron' | 'mint'

const tones: Record<AvatarTone, string> = {
  cobalt: 'bg-cobalt text-white',
  cherry: 'bg-[#b3261b] text-white',
  saffron: 'bg-saffron text-bg',
  mint: 'bg-[#18704b] text-white',
}

/** A round photo, or initials on a brand colour when there is no photo. */
export function Avatar({ src, name, initials, tone = 'cobalt', size = 32, className }: { src?: string; name: string; initials?: string; tone?: AvatarTone; size?: number; className?: string }) {
  const style = { width: size, height: size }
  if (src)
    return <img src={src} alt={name} width={size} height={size} loading="lazy" style={style} className={cx('shrink-0 rounded-full object-cover ring-1 ring-white/15', className)} />
  return (
    <span role="img" aria-label={name} style={{ ...style, fontSize: size * 0.38 }} className={cx('grid shrink-0 place-items-center rounded-full font-semibold', tones[tone], className)}>
      {initials ?? name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
    </span>
  )
}
