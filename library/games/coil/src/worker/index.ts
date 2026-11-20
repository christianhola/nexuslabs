import { createFreebuffAuth, isSameOriginRequest } from '@freebuff/auth'
import type { FreebuffAuth } from '@freebuff/auth'
import { ROOMS, validSkin } from '../shared/protocol'
import { Arena } from './arena'
export { Arena }

export interface Env {
  ASSETS: Fetcher
  ARENA: DurableObjectNamespace<Arena>
  APP_ORIGIN?: string
  FREEBUFF_CLIENT_ID?: string
  FREEBUFF_ISSUER?: string
}
let cached: { key: string; auth: FreebuffAuth } | undefined
function getAuth(env: Env, origin: string) {
  if (!env.FREEBUFF_CLIENT_ID) return null
  const key = `${origin}|${env.FREEBUFF_CLIENT_ID}|${env.FREEBUFF_ISSUER ?? ''}`
  if (cached?.key !== key)
    cached = {
      key,
      auth: createFreebuffAuth({
        clientId: env.FREEBUFF_CLIENT_ID,
        baseUrl: origin,
        issuer: env.FREEBUFF_ISSUER || undefined,
        allowInsecureLocalhost:
          origin.startsWith('http://127.0.0.1:') ||
          origin.startsWith('http://localhost:'),
      }),
    }
  return cached.auth
}
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const origin = env.APP_ORIGIN ?? new URL(request.url).origin
    const auth = getAuth(env, origin)
    const handle = async (request: Request) => {
      const url = new URL(request.url)
      if (url.pathname === '/api/rooms' && request.method === 'GET') {
        return json(
          await Promise.all(
            ROOMS.map(async (name) => ({
              name,
              ...(await env.ARENA.get(env.ARENA.idFromName(name)).population()),
            })),
          ),
        )
      }
      if (url.pathname === '/api/session' && request.method === 'GET') {
        const user = auth ? await auth.getUser(request) : null
        const profile = user
          ? await env.ARENA.get(env.ARENA.idFromName('profiles')).getProfile(
              user.sub,
            )
          : null
        return json({
          user: user ? { name: user.name ?? 'Player' } : null,
          profile,
          authAvailable: !!auth,
        })
      }
      if (url.pathname === '/api/skin' && request.method === 'POST') {
        if (!isSameOriginRequest(request, origin))
          return json({ error: 'Origin refused' }, 403)
        const user = auth ? await auth.getUser(request) : null
        if (!user) return json({ error: 'Sign in required' }, 401)
        if (
          !request.headers.get('content-type')?.includes('application/json') ||
          Number(request.headers.get('content-length') || 0) > 128
        )
          return json({ error: 'Invalid skin' }, 400)
        const body = await request.text()
        if (body.length > 128) return json({ error: 'Invalid skin' }, 400)
        let skin: unknown
        try {
          skin = JSON.parse(body).skin
        } catch {
          return json({ error: 'Invalid skin' }, 400)
        }
        if (!validSkin(skin)) return json({ error: 'Invalid skin' }, 400)
        return json(
          await env.ARENA.get(env.ARENA.idFromName('profiles')).saveSkin(
            user.sub,
            skin,
          ),
        )
      }
      if (url.pathname === '/api/play') {
        if (request.headers.get('Origin') !== origin)
          return json({ error: 'Origin refused' }, 403)
        if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket')
          return json({ error: 'WebSocket required' }, 426)
        const room = url.searchParams.get('room') ?? ROOMS[0]
        if (!(ROOMS as readonly string[]).includes(room))
          return json({ error: 'Unknown arena' }, 404)
        const user = auth ? await auth.getUser(request) : null
        const headers = new Headers(request.headers)
        headers.delete('x-coil-sub')
        if (user) headers.set('x-coil-sub', user.sub)
        return env.ARENA.get(env.ARENA.idFromName(room)).fetch(
          new Request(request, { headers }),
        )
      }
      if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/'))
        return json({ error: 'Not found' }, 404)
      return env.ASSETS.fetch(request)
    }
    try {
      return auth ? await auth.wrap(handle)(request) : await handle(request)
    } catch {
      return json({ error: 'Please try again in a moment.' }, 503)
    }
  },
}
