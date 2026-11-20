import { useEffect, useState } from 'react'

import { IMAGES, type ImageKey } from '../content'
import { uid } from './cx'

/*
  Uploaded images are stored as Blobs in IndexedDB (localStorage would choke
  on them) and shown through object URLs, created once per blob and cached.
*/

const DB_NAME = 'inspo'
const STORE = 'blobs'

let dbPromise: Promise<IDBDatabase> | null = null

function db(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }
  return dbPromise
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const req = fn(d.transaction(STORE, mode).objectStore(STORE))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      }),
  )
}

export const putBlob = (key: string, blob: Blob) => tx('readwrite', (s) => s.put(blob, key))
export const getBlob = (key: string) => tx<Blob | undefined>('readonly', (s) => s.get(key))

const urlCache = new Map<string, string>()
const pending = new Map<string, Promise<string | null>>()

/** Resolve an item's `src` to something an <img> can show. */
export function resolveSrc(src: string | undefined): string | null | Promise<string | null> {
  if (!src) return null
  if (src.startsWith('lib:')) return IMAGES[src.slice(4) as ImageKey]?.src ?? null
  if (src.startsWith('idb:')) {
    const key = src.slice(4)
    const hit = urlCache.get(key)
    if (hit) return hit
    let p = pending.get(key)
    if (!p) {
      p = getBlob(key)
        .then((blob) => {
          if (!blob) return null
          const url = URL.createObjectURL(blob)
          urlCache.set(key, url)
          return url
        })
        .catch(() => null)
      pending.set(key, p)
    }
    return p
  }
  return src
}

export type ImageState = { url: string | null; status: 'loading' | 'ready' | 'missing' }

export function useImageSrc(src: string | undefined): ImageState {
  const first = resolveSrc(src)
  const [state, setState] = useState<ImageState>(() =>
    first instanceof Promise ? { url: null, status: 'loading' } : { url: first, status: first ? 'ready' : 'missing' },
  )
  useEffect(() => {
    const r = resolveSrc(src)
    if (!(r instanceof Promise)) {
      setState({ url: r, status: r ? 'ready' : 'missing' })
      return
    }
    let live = true
    setState({ url: null, status: 'loading' })
    r.then((url) => live && setState({ url, status: url ? 'ready' : 'missing' }))
    return () => {
      live = false
    }
  }, [src])
  return state
}

/** Load an <img> for canvas work (swatches, export). */
export async function loadImage(src: string | undefined): Promise<HTMLImageElement | null> {
  const url = await resolveSrc(src)
  if (!url) return null
  return new Promise((resolve) => {
    const im = new Image()
    im.decoding = 'async'
    im.onload = () => resolve(im)
    im.onerror = () => resolve(null)
    im.src = url
  })
}

export type Upload = { src: string; alt: string; w: number; h: number }

/** Store image files in IndexedDB and report their natural sizes. */
export async function storeImageFiles(files: Iterable<File>): Promise<Upload[]> {
  const out: Upload[] = []
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    const key = uid('blob')
    const url = URL.createObjectURL(file)
    const size = await new Promise<{ w: number; h: number } | null>((resolve) => {
      const im = new Image()
      im.onload = () => resolve({ w: im.naturalWidth || 400, h: im.naturalHeight || 300 })
      im.onerror = () => resolve(null)
      im.src = url
    })
    if (!size) {
      URL.revokeObjectURL(url)
      continue
    }
    try {
      await putBlob(key, file)
    } catch {
      /* IndexedDB unavailable: the image still shows this session */
    }
    urlCache.set(key, url)
    out.push({ src: `idb:${key}`, alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), ...size })
  }
  return out
}
