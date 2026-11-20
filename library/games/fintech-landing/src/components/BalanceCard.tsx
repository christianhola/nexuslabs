import { cx } from '../lib/cx'
import { CountUp } from './CountUp'
import { Sparkline } from './Sparkline'

export function AppIcon({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        'relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-[13px] bg-[linear-gradient(140deg,#f0cdf6_0%,#d6a6f2_55%,#c58ef0_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[30px]" aria-hidden>
        <rect x="3" y="13" width="8" height="8" fill="#fff" />
        <rect x="11" y="3" width="10" height="10" fill="#fff" fillOpacity="0.92" />
        <rect x="11" y="13" width="4" height="4" fill="#fff" fillOpacity="0.5" />
      </svg>
    </div>
  )
}

// The white "Business Account" balance card from the hero.
export function BalanceCard({
  name,
  label,
  balanceLabel,
  balance,
  change,
  spark,
  className,
}: {
  name: string
  label: string
  balanceLabel: string
  balance: number
  change: string
  spark: number[]
  className?: string
}) {
  return (
    <div
      className={cx(
        'w-[350px] overflow-hidden rounded-[24px] bg-white p-[2px] text-ink shadow-[0_30px_70px_-30px_rgb(140_90_240/0.45)]',
        className,
      )}
    >
      <div className="flex items-center gap-[14px] rounded-t-[22px] bg-[linear-gradient(180deg,#f7effd,#f3e8fc)] px-[16px] pt-[16px] pb-[17px]">
        <AppIcon />
        <div className="leading-tight">
          <div className="font-display text-[21px] font-medium tracking-[-0.03em]">{name}</div>
          <div className="mt-[3px] text-[16px] tracking-[-0.02em] text-ink-muted">{label}</div>
        </div>
      </div>
      <div className="flex items-end justify-between px-[16px] pt-[11px] pb-[18px]">
        <div>
          <div className="text-[13px] text-[#6b6b75]">{balanceLabel}</div>
          <div className="mt-[3px] flex items-center gap-[6px]">
            <CountUp
              value={balance}
              decimals={2}
              prefix="$"
              duration={2.2}
              delay={0.7}
              className="font-display text-[20px] font-medium tracking-[-0.02em] tabular"
            />
            <span className="rounded-[6px] bg-up-soft px-[5px] py-[2px] text-[13px] font-medium tracking-[-0.02em] text-[#157a39]">{change}</span>
          </div>
        </div>
        <Sparkline points={spark} width={100} height={44} className="mb-[2px] h-[44px] w-[100px]" delay={1} />
      </div>
    </div>
  )
}
