// The "move up the list" mechanic. Everyone starts at their signup order;
// each friend who joins with your share link moves you up BOOST places.
// Ranks are computed on read, so changing BOOST re-ranks everyone at once.
export const BOOST = 5

/**
 * Every row with its signup order (`joined_at`), referral count and current
 * place in line (`position`). Lower score = nearer the front; ties go to
 * whoever joined first.
 */
export const RANKED = `
  WITH base AS (
    SELECT w.id, w.email, w.code, w.referred_by, w.created_at,
      ROW_NUMBER() OVER (ORDER BY w.id) AS joined_at,
      (SELECT COUNT(*) FROM waitlist r WHERE r.referred_by = w.code) AS referrals
    FROM waitlist w
  )
  SELECT *, ROW_NUMBER() OVER (ORDER BY joined_at - ${BOOST} * referrals, joined_at) AS position
  FROM base
`

export type RankedRow = {
  id: number
  email: string
  code: string
  referred_by: string | null
  created_at: number
  joined_at: number
  referrals: number
  position: number
}

/** "jane.doe@example.com" → "ja•••". Public lists never show full emails. */
export function maskEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  return `${local.slice(0, 2)}•••`
}

/** CSV cell: quoted, and formula-looking values defused for spreadsheets. */
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}
