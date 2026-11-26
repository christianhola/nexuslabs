// Pre-decode the images that are about to scroll into view.
//
// Cards ship every image as loading="lazy", so the browser fetches and decodes
// them exactly when they enter the viewport — during the scroll itself. That
// decode lands on the frames the user is scrolling through, so the first pass
// over the page stutters and later passes are smooth.
//
// Here the first few screens are flipped to eager as soon as the cards are on
// screen, and their decode is awaited one at a time so the work is finished
// before the user reaches them and never lands in a single burst. While a
// scroll is in flight the warm-up steps aside and resumes ~220 ms after it
// stops, so it never competes with a real gesture. It re-runs on navigation,
// because each route brings its own cards.

import * as React from "react"
import { useLocation } from "react-router-dom"

/** How many viewport heights below the fold to warm ahead of time. */
const LOOKAHEAD_SCREENS = 3
/** Hard stop, so a slow connection does not keep this alive forever. */
const TIME_BUDGET_MS = 6000
/** Scroll quiet time before the warm-up picks the queue back up. */
const SCROLL_QUIET_MS = 220

const nextIdle = (fn: () => void) => {
  const ric = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
    }
  ).requestIdleCallback
  if (ric) ric(fn, { timeout: 160 })
  else window.setTimeout(fn, 16)
}

export function ImageWarmup() {
  const { pathname } = useLocation()

  React.useEffect(() => {
    let cancelled = false
    let scrolling = false
    let scrollTimer = 0
    let frame = 0
    let index = 0
    let targets: HTMLImageElement[] = []
    const started = performance.now()

    const onScroll = () => {
      scrolling = true
      window.clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        scrolling = false
      }, SCROLL_QUIET_MS)
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    const pump = () => {
      if (cancelled) return
      if (performance.now() - started > TIME_BUDGET_MS) return
      if (index >= targets.length) return
      // Never decode while the page is moving under the user's finger.
      if (scrolling) {
        nextIdle(pump)
        return
      }
      const img = targets[index++]
      const done = () => nextIdle(pump)
      if (typeof img.decode === "function") img.decode().then(done, done)
      else done()
    }

    const collect = () => {
      if (cancelled) return
      const limit = window.innerHeight * LOOKAHEAD_SCREENS
      // One pass over the boxes, so the filter costs a single layout read.
      targets = Array.from(document.images).filter((img) => {
        if (img.loading === "eager") return false
        if (!img.currentSrc && !img.getAttribute("src")) return false
        if (img.complete && img.naturalWidth > 0) return false
        return img.getBoundingClientRect().top + window.scrollY <= limit
      })
      // Start the fetches now; only the decode is serialised below.
      for (const img of targets) img.loading = "eager"
      nextIdle(pump)
    }

    // Two frames: the first lets React paint the cards, the second measures them.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(collect)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.clearTimeout(scrollTimer)
      window.removeEventListener("scroll", onScroll)
    }
  }, [pathname])

  return null
}
