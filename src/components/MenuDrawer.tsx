import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router'

import { BRAND, NAV } from '../content'
import { cx } from '../lib/cx'
import { ButtonLink, IconButton } from './Button'
import { Logo } from './Logo'
import { useFocusTrap } from './Modal'

/** Full-screen menu: focus is trapped inside, Escape closes, focus returns. */
export function MenuDrawer({ open, onClose, savedCount }: { open: boolean; onClose: () => void; savedCount: number }) {
  return createPortal(<AnimatePresence>{open && <Panel onClose={onClose} savedCount={savedCount} />}</AnimatePresence>, document.body)
}

function Panel({ onClose, savedCount }: { onClose: () => void; savedCount: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(true, ref, onClose)
  const links = [...NAV, { label: savedCount ? `Ideas board (${savedCount})` : 'Ideas board', to: '/saved' }]
  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="on-dark fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-night text-snow focus:outline-none"
    >
      <div className="container-page flex items-center justify-between pt-3">
        <Logo tone="light" onClick={onClose} />
        <IconButton tone="light" aria-label="Close menu" onClick={onClose} data-autofocus>
          <X className="size-5" strokeWidth={1.75} />
        </IconButton>
      </div>
      <nav aria-label="Menu" className="container-page mt-10 flex-1">
        <ul className="flex flex-col">
          {links.map((item, i) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.04 * i + 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cx('flex items-baseline gap-4 border-b border-night-line py-3 text-[clamp(2.25rem,8vw,4.5rem)] leading-none font-medium tracking-[-0.05em] transition-opacity hover:opacity-60', isActive && 'text-snow-muted')
                }
              >
                <span className="label-sm w-6 text-snow-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="container-page flex flex-col gap-6 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="text-[14px] text-snow-muted">
          <p>{BRAND.email}</p>
          <p>{BRAND.phone}</p>
        </div>
        <ButtonLink to="/book" variant="light" icon onClick={onClose}>
          Book a consultation
        </ButtonLink>
      </div>
    </motion.div>
  )
}
