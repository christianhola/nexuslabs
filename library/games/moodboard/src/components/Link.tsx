import type { AnchorHTMLAttributes } from 'react'

import { navigate } from '../lib/router'

/** An <a> that routes in-app without a reload (modifier-clicks still open a tab). */
export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        navigate(href)
      }}
      {...rest}
    />
  )
}
