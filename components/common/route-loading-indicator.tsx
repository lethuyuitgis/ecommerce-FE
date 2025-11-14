"use client"

import { useEffect, useState } from "react"
import { useRouteLoading } from "@/contexts/RouteLoadingContext"

export function RouteLoadingIndicator() {
  const { isNavigating } = useRouteLoading()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (isNavigating) {
      timeout = setTimeout(() => setVisible(true), 150)
    } else {
      setVisible(false)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isNavigating])

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-[10000] transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-1 w-full overflow-hidden bg-primary/20">
        <div className="loading-bar h-full w-1/3 bg-primary" />
      </div>
    </div>
  )
}

