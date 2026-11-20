import { motion } from 'motion/react'

import { cx } from '../lib/cx'

// A switch. Controlled; announces itself as role="switch".
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-300 round before:absolute before:-inset-[8px] before:content-[""] disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'bg-violet' : 'bg-white/[0.12]',
        className,
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 34 }}
        className={cx('size-5 rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.35)] round', checked && 'ml-auto')}
      />
    </button>
  )
}
