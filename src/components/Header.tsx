import { Menu } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'

import { NAV } from '../content'
import { cx } from '../lib/cx'
import { useSaved } from '../lib/store'
import { Logo } from './Logo'
import { MenuDrawer } from './MenuDrawer'

/** The small slanted block beside "Book", after the reference's contact mark. */
export const Mark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 22 10" className={cx('h-2.5 w-[22px]', className)} aria-hidden>
    <path d="M6 0h16l-6 10H0z" fill="currentColor" />
  </svg>
)

/** Overlay header. `tone="light"` sits over the hero photograph on the home page. */
export function Header({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { ids } = useSaved()
  const light = tone === 'light'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const text = light ? 'text-snow' : 'text-ink'

  return (
    <>
      <header className={cx('absolute inset-x-0 top-0 z-40', light && 'on-dark')}>
        <div className="container-page grid grid-cols-12 items-start gap-x-4 pt-4 md:pt-5">
          <Logo tone={tone} className="col-span-6 -mt-1.5 md:col-span-3" />
          <nav aria-label="Main" className="col-span-3 col-start-8 hidden md:block lg:col-span-2 lg:col-start-9">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cx('inline-block py-[1px] text-[13px] leading-[1.15] font-medium transition-opacity hover:opacity-60', text, isActive && 'underline underline-offset-2')
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-6 flex items-start justify-end gap-5 md:col-span-1 md:col-start-12 lg:col-span-2 lg:col-start-11">
            <Link to="/saved" className={cx('hidden text-[13px] leading-[1.15] font-medium transition-opacity hover:opacity-60 lg:inline-block', text)}>
              Ideas board{ids.length > 0 && <span className="tabular-nums"> ({ids.length})</span>}
            </Link>
            <Link to="/book" className={cx('hidden items-center gap-1.5 text-[13px] leading-[1.15] font-medium transition-opacity hover:opacity-60 md:inline-flex', text)}>
              <Mark />
              Book
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cx('round -mt-2 -mr-2 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-[14px] font-medium md:hidden', text)}
              aria-haspopup="dialog"
            >
              <Menu className="size-5" strokeWidth={1.75} aria-hidden />
              Menu
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {scrolled && !open && (
          <motion.div
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -64, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md"
          >
            <div className="container-page flex h-14 items-center justify-between gap-4">
              <Logo className="text-[19px]" />
              <div className="flex items-center gap-2">
                <Link to="/book" className="round hidden h-10 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition-colors hover:bg-ink-2 sm:inline-flex">
                  Book a consultation
                </Link>
                <button type="button" onClick={() => setOpen(true)} className="round inline-flex h-10 items-center gap-2 rounded-full px-3 text-[14px] font-medium hover:bg-paper-2" aria-haspopup="dialog">
                  <Menu className="size-5" strokeWidth={1.75} aria-hidden />
                  Menu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MenuDrawer open={open} onClose={() => setOpen(false)} savedCount={ids.length} />
    </>
  )
}
