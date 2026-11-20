import { EmailCapture } from '../components/EmailCapture'

export function Cta() {
  return (
    <section aria-labelledby="cta-title" className="px-3 pb-3 sm:px-[34px] sm:pb-[34px]">
      <div className="flex flex-col items-center rounded-[22px] bg-ink px-6 py-[100px] text-center text-paper">
        <h2 id="cta-title" className="max-w-[16ch] text-[clamp(40px,5.4vw,72px)] leading-[0.98] font-bold tracking-[-0.05em] text-balance">
          Stop losing the <span className="text-lime">good stuff</span>
        </h2>
        <p className="mt-6 max-w-[44ch] text-[18px] leading-[1.6] text-white/75">Join the waitlist and keep using the library in this browser while you wait.</p>
        <div className="mt-10 flex w-full justify-center">
          <EmailCapture tone="dark" />
        </div>
      </div>
    </section>
  )
}
