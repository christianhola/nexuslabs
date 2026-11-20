import { LOGOS, LOGO_CAPTION } from '../content'

const styles = ['font-semibold tracking-[-0.02em]', 'font-light tracking-[0.08em]', 'font-bold italic', 'font-medium tracking-[-0.04em]', 'font-mono font-medium text-[0.9em]', 'font-semibold tracking-[0.02em]', 'font-light italic', 'font-bold tracking-[-0.03em]']

/** Customer wordmarks (fictional). Swap the names in content.ts for logos you are allowed to show. */
export function Logos() {
  const row = [...LOGOS, ...LOGOS]
  return (
    <section aria-label="Customers" className="border-y border-white/6 bg-[#040a0b] py-10">
      <p className="text-center text-[14.5px] text-muted">{LOGO_CAPTION}</p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="flex w-max animate-marquee gap-14 pr-14 hover:[animation-play-state:paused]">
          {row.map((name, i) => (
            <li key={i} aria-hidden={i >= LOGOS.length || undefined} className={`text-[22px] whitespace-nowrap text-[#8fa29e] ${styles[i % styles.length]}`}>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
