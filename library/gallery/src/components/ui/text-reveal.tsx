import * as React from "react"

import { cn } from "@/lib/utils"

function TextReveal({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const root = React.useRef<HTMLParagraphElement>(null)
  const [shown, setShown] = React.useState(false)
  const words = children.split(/\s+/)

  React.useEffect(() => {
    const node = root.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <p ref={root} className={cn("flex flex-wrap justify-center gap-x-1.5 gap-y-1", className)}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="transition duration-500"
          style={{
            opacity: shown ? 1 : 0.12,
            transform: shown ? "translateY(0)" : "translateY(6px)",
            transitionDelay: `${Math.min(index * 28, 360)}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  )
}

export { TextReveal }
