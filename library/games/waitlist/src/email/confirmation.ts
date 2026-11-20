// The confirmation email, as one HTML string. Tables and inline styles only,
// so it renders the same in Gmail, Outlook and Apple Mail. This template
// never sends it: pass the result to your email provider (Resend, Postmark,
// SES...) as the `html` body when you wire up sending.

export type ConfirmationEmail = {
  brand: string
  subject: string
  preheader: string
  position: number
  count: number
  shareUrl: string
  statusUrl: string
  boost: number
  launchDate: string
}

const c = {
  page: '#f7f7f7',
  card: '#ffffff',
  ink: '#111111',
  body: '#1d1d1f',
  muted: '#6e6e73',
  line: '#e8e8ed',
  accent: '#ee7631',
  accentStrong: '#e4651f',
  accentFill: '#c4531a',
  accentSoft: '#fdeee5',
}

const font = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"

const escape = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

export function confirmationEmailHtml(e: ConfirmationEmail): string {
  const share = escape(e.shareUrl)
  const status = escape(e.statusUrl)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(e.subject)}</title>
<base target="_blank">
<style>
  @media (max-width: 600px) {
    .card { padding: 32px 24px !important; }
    .rank { font-size: 52px !important; }
  }
  a { color: ${c.accentFill}; }
</style>
</head>
<body style="margin:0;padding:0;background:${c.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(e.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${c.page};">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
      <tr><td style="padding:0 4px 20px;font-family:${font};font-size:18px;font-weight:700;letter-spacing:-0.03em;color:${c.ink};">
        <span style="display:inline-block;width:24px;height:24px;border-radius:6px;background:${c.accent};vertical-align:-6px;margin-right:8px;"></span>${escape(e.brand)}
      </td></tr>
      <tr><td class="card" style="background:${c.card};border:1px solid ${c.line};border-radius:6px;padding:44px 44px 40px;font-family:${font};color:${c.body};">
        <p style="margin:0;font-size:15px;font-weight:600;color:${c.accentStrong};">Coming Soon.</p>
        <h1 style="margin:6px 0 0;font-size:30px;line-height:1.2;font-weight:700;letter-spacing:-0.04em;color:${c.ink};">You're on the list.</h1>
        <p style="margin:16px 0 0;font-size:16px;line-height:1.55;">Thanks for joining the ${escape(e.brand)} waitlist. We'll email you the moment your spot opens. We're letting the first wave in on ${escape(e.launchDate)}.</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;background:${c.page};border-radius:6px;">
          <tr><td style="padding:22px 24px;">
            <p style="margin:0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${c.muted};">Your spot</p>
            <p style="margin:6px 0 0;"><span class="rank" style="font-size:60px;line-height:1;font-weight:700;letter-spacing:-0.05em;color:${c.accentStrong};">#${e.position.toLocaleString('en-US')}</span>
            <span style="font-size:14px;color:${c.muted};">&nbsp;of ${e.count.toLocaleString('en-US')}</span></p>
          </td></tr>
        </table>

        <h2 style="margin:32px 0 0;font-size:18px;font-weight:600;letter-spacing:-0.015em;color:${c.ink};">Move up the list</h2>
        <p style="margin:8px 0 0;font-size:15px;line-height:1.55;">Every friend who joins with your link moves you up ${e.boost} places. Here it is:</p>
        <p style="margin:12px 0 0;padding:12px 14px;border:1px solid ${c.line};border-radius:2px;background:${c.page};font-size:14px;word-break:break-all;"><a href="${share}" style="color:${c.body};text-decoration:none;">${share}</a></p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
          <tr><td style="border-radius:2px;background:${c.accentFill};">
            <a href="${status}" style="display:inline-block;padding:13px 22px;font-family:${font};font-size:16px;font-weight:500;color:#ffffff;text-decoration:none;">See your rank &rarr;</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 8px 0;font-family:${font};font-size:12.5px;line-height:1.6;color:${c.muted};text-align:center;">
        You got this email because you joined the ${escape(e.brand)} waitlist.<br>
        Not you, or changed your mind? Reply to this email and we'll take you off the list.
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
