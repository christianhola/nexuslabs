import { passwordScore } from '../lib/validate'
import { cx } from '../lib/cx'

const words = ['Too short', 'Weak', 'Fair', 'Good', 'Strong']

/* Four-segment meter under a new-password field, with the word for screen readers. */
export function PasswordStrength({ value }: { value: string }) {
  const s = value ? passwordScore(value) : 0
  return (
    <div className="flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden>
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cx('h-1.5 flex-1 rounded-full transition-colors duration-300', i <= s ? (s <= 1 ? 'bg-bad' : s === 2 ? 'bg-[#e5a33a]' : 'bg-leaf') : 'bg-wash-2')} />
        ))}
      </div>
      <span className="w-[72px] text-right text-[12.5px] text-muted">{value ? words[s] : 'Strength'}</span>
    </div>
  )
}
