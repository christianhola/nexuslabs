import { useEffect, useSyncExternalStore } from 'react'

/*
  A tiny History API router: `usePath()` re-renders on navigation,
  `navigate()` pushes a path. The Worker serves index.html for every
  unknown path (single-page-application mode), so deep links work.
*/

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

if (typeof window !== 'undefined') window.addEventListener('popstate', emit)

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const fromBase = (path: string) =>
  BASE && (path === BASE || path.startsWith(BASE + '/')) ? path.slice(BASE.length) || '/' : path
const toBase = (to: string) =>
  to.startsWith('/') && BASE && to !== BASE && !to.startsWith(BASE + '/') ? BASE + to : to

export function usePath(): string {
  return useSyncExternalStore(subscribe, () => fromBase(window.location.pathname), () => '/')
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  to = toBase(to)
  if (to === window.location.pathname + window.location.search) return
  if (opts.replace) window.history.replaceState(null, '', to)
  else window.history.pushState(null, '', to)
  emit()
}

export type Route =
  | { name: 'overview' }
  | { name: 'accounts' }
  | { name: 'account'; id: string }
  | { name: 'renewals' }
  | { name: 'playbooks' }
  | { name: 'settings' }
  | { name: 'styleguide' }
  | { name: 'not-found' }

export function match(path: string): Route {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/') return { name: 'overview' }
  if (p === '/accounts') return { name: 'accounts' }
  const m = /^\/accounts\/([\w-]+)$/.exec(p)
  if (m) return { name: 'account', id: m[1]! }
  if (p === '/renewals') return { name: 'renewals' }
  if (p === '/playbooks') return { name: 'playbooks' }
  if (p === '/settings') return { name: 'settings' }
  if (p === '/styleguide') return { name: 'styleguide' }
  return { name: 'not-found' }
}

/** Scroll to the top and set the document title on route change. */
export function useRouteEffects(path: string, title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [path])
}
