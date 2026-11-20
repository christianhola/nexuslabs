import { cx } from '../lib/cx'
import { CountUp } from './CountUp'

export function Stat({ value, suffix, prefix, label, size = 'md', tone = 'ink', className }: { value: number; suffix?: string; prefix?: string; label: string; size?: 'md' | 'lg'; tone?: 'ink' | 'on-navy'; className?: string }) {
  return (
    <div className={className}>
      <p className={cx('tabular font-medium tracking-[-0.04em]', size === 'lg' ? 'text-[64px] leading-none' : 'text-[44px] leading-none', tone === 'on-navy' ? 'text-white' : 'text-ink')}>
        <CountUp value={value} suffix={suffix} prefix={prefix} />
      </p>
      <p className={cx('mt-3 text-[14px]', tone === 'on-navy' ? 'text-on-navy-muted' : 'text-muted')}>{label}</p>
    </div>
  )
}
