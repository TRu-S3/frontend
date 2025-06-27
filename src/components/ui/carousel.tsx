"use client"

import * as React from "react"
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'

const CarouselContext = React.createContext<EmblaCarouselType | undefined>(undefined)

export function Carousel({
  children,
  className = '',
  opts = {},
  ...props
}: React.PropsWithChildren<{
  className?: string
  opts?: Parameters<typeof useEmblaCarousel>[0]
}>) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, ...opts })
  return (
    <CarouselContext.Provider value={emblaApi}>
      <div className={`overflow-hidden ${className}`} ref={emblaRef} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`flex min-w-0 ${className}`}>{children}</div>
}

export function CarouselItem({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`flex-shrink-0 w-full ${className}`}>{children}</div>
}

export function CarouselPrevious({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const embla = React.useContext(CarouselContext)
  return (
    <button
      type="button"
      className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 ${className}`}
      style={{ left: '-20px' }}
      onClick={() => embla?.scrollPrev()}
      {...props}
    >
      ‹
    </button>
  )
}

export function CarouselNext({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const embla = React.useContext(CarouselContext)
  return (
    <button
      type="button"
      className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow p-2 ${className}`}
      style={{ right: '-20px' }}
      onClick={() => embla?.scrollNext()}
      {...props}
    >
      ›
    </button>
  )
} 