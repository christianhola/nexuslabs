import { CountUp } from './CountUp'

export function Stat({ value, label, prefix, suffix, decimals }: { value: number; label: string; prefix?: string; suffix?: string; decimals?: number }) {
  return (
    <div className="grid content-start gap-3 border-t border-line-strong pt-6">
      <p className="font-display text-[48px] font-medium leading-none tracking-[-0.03em] text-white sm:text-[56px]">
        <CountUp value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </p>
      <p className="max-w-[240px] text-[15px] leading-[1.55] text-muted">{label}</p>
    </div>
  )
}
