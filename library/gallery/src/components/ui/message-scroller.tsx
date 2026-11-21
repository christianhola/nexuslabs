import * as React from "react"
import { cn } from "cn"

export function MessageScroller({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)
  const stickRef = React.useRef(true)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const distance = el.scrollHeight - (el.scrollTop + el.clientHeight)
      stickRef.current = distance <= 120
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    const el = ref.current
    if (!el || !stickRef.current) return
    el.scrollTop = el.scrollHeight
  }, [children])

  return (
    <div
      ref={ref}
      data-slot="message-scroller"
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}
      {...props}
    >
      {children}
    </div>
  )
}