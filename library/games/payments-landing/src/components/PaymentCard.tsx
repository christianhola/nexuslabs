import { Nfc } from 'lucide-react'

import { cx } from '../lib/cx'

/*
  The two-tone card face from the hero: a teal top with the masked number
  and a navy strip carrying the network mark. Pure CSS/SVG.
*/
export function PaymentCard({
  label,
  last4,
  className,
  network = 'visa',
  accent = 'var(--color-teal)',
}: {
  label: string
  last4: string
  className?: string
  network?: 'visa' | 'mastercard' | 'amex' | 'card'
  accent?: string
}) {
  return (
    <div
      className={cx('relative flex aspect-[150/196] w-[204px] flex-col overflow-hidden rounded-[16px] shadow-float', className)}
      role="img"
      aria-label={`${label} ending ${last4}`}
    >
      <div className="relative flex-1 p-[18px] text-white" style={{ background: accent }}>
        <svg aria-hidden className="absolute inset-0 size-full opacity-[0.14]" viewBox="0 0 150 130" preserveAspectRatio="none">
          <path d="M95 0 L150 0 L150 130 L40 130 Z" fill="white" />
        </svg>
        <p className="relative text-[11px] font-medium opacity-85">{label}</p>
        <p className="tabular relative mt-1.5 flex items-center gap-2 text-[17px] font-medium tracking-[0.02em]">
          <span>{last4}</span>
          <span className="text-[13px] tracking-[0.14em]">••••</span>
          <span className="text-[13px] tracking-[0.14em]">••••</span>
        </p>
      </div>
      <div className="flex h-[30%] items-center justify-between bg-navy px-[18px] text-white">
        <NetworkMark network={network} />
        <Nfc className="size-5 opacity-80" aria-hidden />
      </div>
    </div>
  )
}

export function NetworkMark({ network, className }: { network: 'visa' | 'mastercard' | 'amex' | 'card'; className?: string }) {
  if (network === 'mastercard')
    return (
      <svg viewBox="0 0 38 24" className={cx('h-6', className)} aria-label="Mastercard">
        <circle cx="14" cy="12" r="9" fill="#e4572e" />
        <circle cx="24" cy="12" r="9" fill="#f3a712" fillOpacity="0.9" />
      </svg>
    )
  if (network === 'amex') return <span className={cx('text-[14px] font-bold tracking-[0.08em]', className)}>AMEX</span>
  if (network === 'card') return <span className={cx('text-[13px] font-semibold', className)}>Card</span>
  return <span className={cx('text-[19px] font-black italic tracking-[-0.02em]', className)}>VISA</span>
}
