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
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false)
      }, 10000)
    },
    [clearTimeoutRef]
  )

  // Complete navigation once pathname updates
  useEffect(() => {
    const pendingPath = pendingPathRef.current
    if (!isNavigating) {
      previousPathRef.current = pathname
      return
    }

    if (!pendingPath || pendingPath === pathname || pathname !== previousPathRef.current) {
      previousPathRef.current = pathname
      finishNavigation()
    }
  }, [pathname, isNavigating, finishNavigation])

  // Auto-start loading for internal anchor clicks
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = (event.target as HTMLElement)?.closest("a")
      if (!target) return

      const href = target.getAttribute("href")
      if (!href) return
      if (href.startsWith("#")) return
      if (target.getAttribute("target") === "_blank") return

      // Only handle internal navigation
      const isAbsolute = /^https?:\/\//i.test(href)
      if (isAbsolute) {
        const url = new URL(href, window.location.origin)
        if (url.origin !== window.location.origin) return
        startNavigation(`${url.pathname}${url.search}${url.hash}`)
      } else {
        startNavigation(href)
      }
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
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

