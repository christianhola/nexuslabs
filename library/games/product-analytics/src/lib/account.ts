import { read, remove, write } from './storage'

/*
  Demo accounts, kept in this browser only (localStorage). The password is
  stored as a SHA-256 hash, never as text. Replace this file with real auth
  (for example Sign in with Freebuff) before you take sign-ups.
*/
export type Account = { name: string; email: string; company: string; passwordHash: string; createdAt: string; plan: string }

export async function hash(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const getAccount = () => read<Account | null>('account', null)
export const saveAccount = (a: Account) => write('account', a)
export const getSession = () => read<string | null>('session', null)
export const signIn = (email: string) => write('session', email)
export const signOut = () => remove('session')
