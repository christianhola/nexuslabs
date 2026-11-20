import { useSyncExternalStore } from 'react'

/*
  A tiny history router: enough for a handful of routes. Links call
  navigate(); the back button fires popstate.
*/

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

if (typeof window !== 'undefined') window.addEventListener('popstate', emit)

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const fromBase = (path: string) =>
  BASE && (path === BASE || path.startsWith(BASE + '/')) ? path.slice(BASE.length) || '/' : path
const toBase = (to: string) =>
  to.startsWith('/') && BASE && to !== BASE && !to.startsWith(BASE + '/') ? BASE + to : to

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  to = toBase(to)
  if (to === location.pathname + location.search) return
  if (opts.replace) history.replaceState(null, '', to)
  else history.pushState(null, '', to)
  emit()
}

export function usePath(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => fromBase(location.pathname),
    () => '/',
  )
}

export type Route =
  | { name: 'landing' }
  | { name: 'board'; id: string }
  | { name: 'present'; id: string }
  | { name: 'boards' }
  | { name: 'styleguide' }
  | { name: 'notfound' }

export function matchRoute(path: string): Route {
  const p = path.replace(/\/+$/, '') || '/'
  if (p === '/') return { name: 'landing' }
  if (p === '/boards') return { name: 'boards' }
  if (p === '/styleguide') return { name: 'styleguide' }
  let m = p.match(/^\/b\/([^/]+)\/present$/)
  if (m) return { name: 'present', id: decodeURIComponent(m[1]!) }
  m = p.match(/^\/b\/([^/]+)$/)
  if (m) return { name: 'board', id: decodeURIComponent(m[1]!) }
  return { name: 'notfound' }
}

export const boardPath = (id: string) => `/b/${encodeURIComponent(id)}`
