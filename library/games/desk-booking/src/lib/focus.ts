import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest('[inert]') && el.offsetParent !== null)
}

/**
  While `active`: moves focus into `ref`, keeps Tab inside it, calls `onEscape`
  on Esc, and on deactivate returns focus to whatever had it before.
*/
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean, onEscape: () => void, initial?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return
    const previous = document.activeElement as HTMLElement | null
    const root = ref.current
    const frame = requestAnimationFrame(() => {
      if (!root) return
      const target = initial?.current ?? focusables(root)[0] ?? root
      target.focus()
    })
    function onKey(e: KeyboardEvent) {
      if (!root) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        onEscape()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables(root)
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKey, true)
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true })
    }
    // onEscape is read fresh through the closure each open; re-binding on
    // every render would steal focus, so it is deliberately not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
