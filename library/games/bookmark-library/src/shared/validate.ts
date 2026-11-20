/** Shared by the page and the Worker so both say the same thing. */
export function validateEmail(raw: unknown): string | null {
  const email = typeof raw === 'string' ? raw.trim() : ''
  if (!email) return 'Enter your email address.'
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'That email does not look right. Check for typos.'
  return null
}
