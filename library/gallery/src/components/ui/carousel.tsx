import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CarouselContextValue = {
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

function Carousel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const viewport = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ prev: false, next: false })

  const sync = React.useCallback(() => {
    const node = viewport.current
    if (!node) return
    const max = node.scrollWidth - node.clientWidth
    setEdges({
      prev: node.scrollLeft > 2,
      next: node.scrollLeft < max - 2,
    })
  }, [])

  React.useEffect(() => {
    sync()
    const node = viewport.current
    if (!node) return
    const observer = new ResizeObserver(sync)
    observer.observe(node)
    return () => observer.disconnect()
  }, [sync])

  function move(direction: 1 | -1) {
    const node = viewport.current
    if (!node) return
    node.scrollBy({
      left: direction * Math.max(node.clientWidth * 0.86, 240),
      behavior: "smooth",
    })
  }

  return (
    <CarouselContext.Provider
      value={{
        scrollPrev: () => move(-1),
        scrollNext: () => move(1),
        canScrollPrev: edges.prev,
        canScrollNext: edges.next,
      }}
    >
      <div
        data-slot="carousel"
        className={cn("relative", className)}
        {...props}
      >
        <div
          ref={viewport}
          data-slot="carousel-viewport"
          onScroll={sync}
          className="overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </div>
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-content"
      className={cn("flex touch-pan-x gap-3", className)}
      {...props}
    />
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-item"
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-[86%] snap-start sm:basis-[48%]",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label="Anterior"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cn(
        "absolute top-1/2 -left-2 z-10 -translate-y-1/2 rounded-full bg-background/95 shadow-sm disabled:opacity-35",
        className
      )}
      {...props}
    >
      <ChevronLeft />
    </Button>
  )
}

function CarouselNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      aria-label="Siguiente"
      disabled={!canScrollNext}
      onClick={scrollNext}
      className={cn(
        "absolute top-1/2 -right-2 z-10 -translate-y-1/2 rounded-full bg-background/95 shadow-sm disabled:opacity-35",
        className
      )}
      {...props}
    >
      <ChevronRight />
    </Button>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
}
