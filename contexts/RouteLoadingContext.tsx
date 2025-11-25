"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"

type RouteLoadingContextValue = {
  isNavigating: boolean
  startNavigation: (path?: string) => void
  finishNavigation: () => void
}

const RouteLoadingContext = createContext<RouteLoadingContextValue | undefined>(undefined)

export function RouteLoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const pendingPathRef = useRef<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousPathRef = useRef<string>(pathname)

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const finishNavigation = useCallback(() => {
    clearTimeoutRef()
    pendingPathRef.current = null
    setIsNavigating(false)
  }, [clearTimeoutRef])

  const startNavigation = useCallback(
    (path?: string) => {
      pendingPathRef.current = path ?? null
      setIsNavigating(true)

      clearTimeoutRef()
      // Fallback guard so the indicator never gets stuck indefinitely
      // Reduced from 10s to 3s for faster recovery
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false)
      }, 3000)
    },
    [clearTimeoutRef]
  )

  // Complete navigation once pathname updates
  useEffect(() => {
    if (!isNavigating) {
      previousPathRef.current = pathname
      return
    }

    const pendingPath = pendingPathRef.current
    // Finish navigation immediately when pathname changes (faster detection)
    if (pathname !== previousPathRef.current) {
      previousPathRef.current = pathname
      // Small delay to ensure smooth transition
      const finishTimeout = setTimeout(() => {
        finishNavigation()
      }, 100)
      return () => clearTimeout(finishTimeout)
    }
  }, [pathname, isNavigating, finishNavigation])

  // Auto-start loading for internal anchor clicks (optimized with passive listener)
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Early returns for better performance
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      
      const target = (event.target as HTMLElement)?.closest("a")
      if (!target) return

      const href = target.getAttribute("href")
      if (!href || href.startsWith("#")) return
      if (target.getAttribute("target") === "_blank") return

      // Only handle internal navigation
      const isAbsolute = /^https?:\/\//i.test(href)
      if (isAbsolute) {
        try {
          const url = new URL(href, window.location.origin)
          if (url.origin !== window.location.origin) return
          startNavigation(`${url.pathname}${url.search}${url.hash}`)
        } catch {
          // Invalid URL, ignore
          return
        }
      } else {
        startNavigation(href)
      }
    }

    // Use capture phase for faster detection
    document.addEventListener("click", handleClick, { capture: true, passive: true })
    return () => {
      document.removeEventListener("click", handleClick, { capture: true })
    }
  }, [startNavigation])

  useEffect(() => clearTimeoutRef, [clearTimeoutRef])

  const value = useMemo<RouteLoadingContextValue>(
    () => ({
      isNavigating,
      startNavigation,
      finishNavigation,
    }),
    [isNavigating, startNavigation, finishNavigation]
  )

  return <RouteLoadingContext.Provider value={value}>{children}</RouteLoadingContext.Provider>
}

export function useRouteLoading() {
  const context = useContext(RouteLoadingContext)
  if (!context) {
    throw new Error("useRouteLoading must be used within RouteLoadingProvider")
  }
  return context
}

