import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export type OrbState = "idle" | "listening" | "thinking" | "talking"

type OrbProps = {
  colors: [string, string]
  seed?: number
  state?: OrbState
  className?: string
}

const intensityFor: Record<OrbState, number> = {
  idle: 0.55,
  listening: 0.95,
  thinking: 0.7,
  talking: 1,
}

/**
 * Esfera de voz: blobs cálidos que respiran despacio en reposo y reaccionan
 * al micrófono o a la voz del asistente. Sin dependencias ni shaders.
 */
export function Orb({ colors, seed = 1, state = "idle", className }: OrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<OrbState>(state)
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    if (!context) return

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let raf = 0
    const start = performance.now()

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, Math.round(bounds.width))
      height = Math.max(1, Math.round(bounds.height))
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const onPointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      pointerRef.current.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      pointerRef.current.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    }
    const onLeave = () => {
      pointerRef.current.targetX = 0
      pointerRef.current.targetY = 0
    }
    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("pointerleave", onLeave)

    const draw = (time: number) => {
      const elapsed = (time - start) / 1000
      const size = Math.min(width, height)
      const centerX = width / 2
      const centerY = height / 2
      const radius = size * 0.46
      const intensity = intensityFor[stateRef.current]
      const pulse =
        stateRef.current === "talking"
          ? 0.5 + 0.5 * Math.sin(elapsed * 5.6)
          : stateRef.current === "listening"
            ? 0.35 + 0.35 * Math.sin(elapsed * 1.8)
            : 0.5 + 0.5 * Math.sin(elapsed * 0.7)

      const pointer = pointerRef.current
      pointer.x += (pointer.targetX - pointer.x) * 0.06
      pointer.y += (pointer.targetY - pointer.y) * 0.06

      context.clearRect(0, 0, width, height)
      context.save()
      context.beginPath()
      context.arc(centerX, centerY, radius, 0, Math.PI * 2)
      context.clip()

      const base = context.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.35,
        radius * 0.05,
        centerX,
        centerY,
        radius
      )
      base.addColorStop(0, colors[0])
      base.addColorStop(0.55, colors[1])
      base.addColorStop(1, "#1c1611")
      context.globalAlpha = 0.9
      context.fillStyle = base
      context.fillRect(0, 0, width, height)

      context.globalCompositeOperation = "screen"

      const blobs = 5
      for (let index = 0; index < blobs; index += 1) {
        const phase = index * 1.7 + seed * 0.31
        const speed = 0.22 + index * 0.05
        const orbit = radius * (0.16 + 0.1 * Math.sin(elapsed * speed + phase))
        const x =
          centerX +
          Math.cos(elapsed * speed * 0.9 + phase) * orbit +
          pointer.x * radius * 0.18 +
          Math.sin(elapsed * 0.31 + phase) * radius * 0.05
        const y =
          centerY +
          Math.sin(elapsed * speed * 1.15 + phase * 1.3) * orbit +
          pointer.y * radius * 0.18 +
          Math.cos(elapsed * 0.27 + phase) * radius * 0.05
        const blobRadius = radius * (0.42 + 0.16 * intensity + 0.08 * Math.sin(elapsed + phase))
        const gradient = context.createRadialGradient(x, y, 0, x, y, blobRadius)
        gradient.addColorStop(0, index % 2 === 0 ? colors[0] : colors[1])
        gradient.addColorStop(1, "rgba(0,0,0,0)")
        context.globalAlpha = (0.16 + 0.12 * pulse) * intensity
        context.fillStyle = gradient
        context.fillRect(0, 0, width, height)
      }

      // Nucleo cálido que late con la voz.
      context.globalCompositeOperation = "lighter"
      const coreRadius = radius * (0.34 + 0.14 * pulse * intensity)
      const core = context.createRadialGradient(
        centerX + pointer.x * radius * 0.08,
        centerY + pointer.y * radius * 0.08,
        0,
        centerX,
        centerY,
        coreRadius
      )
      core.addColorStop(0, "rgba(255, 244, 226, 0.75)")
      core.addColorStop(0.45, "rgba(255, 226, 190, 0.28)")
      core.addColorStop(1, "rgba(255, 205, 150, 0)")
      context.fillStyle = core
      context.fillRect(0, 0, width, height)

      context.globalCompositeOperation = "source-over"
      context.globalAlpha = 1

      // Borde y sombra interior para que parezca una esfera y no un gradiente.
      const shade = context.createRadialGradient(
        centerX - radius * 0.2,
        centerY - radius * 0.3,
        radius * 0.4,
        centerX,
        centerY,
        radius
      )
      shade.addColorStop(0, "rgba(0,0,0,0)")
      shade.addColorStop(0.78, "rgba(20,14,10,0.06)")
      shade.addColorStop(1, "rgba(20,14,10,0.55)")
      context.fillStyle = shade
      context.fillRect(0, 0, width, height)

      context.restore()

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("pointerleave", onLeave)
    }
  }, [colors, seed])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("size-full", className)}
    />
  )
}

export default Orb
