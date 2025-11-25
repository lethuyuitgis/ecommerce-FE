"use client"

import Link from "next/link"
import type { ComponentProps, MouseEvent } from "react"
import { useRouteLoading } from "@/contexts/RouteLoadingContext"

function resolveHref(href: ComponentProps<typeof Link>["href"]): string | null {
  if (typeof href === "string") return href
  if (href === null) return null
  const path = href.pathname ?? ""
  const hash = href.hash ? `#${href.hash}` : ""

  let query = ""
  if (href.query) {
    const params = new URLSearchParams()
    Object.entries(href.query).forEach(([key, value]) => {
      if (value == null) return
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)))
      } else {
        params.append(key, String(value))
      }
    })
    const qs = params.toString()
    query = qs ? `?${qs}` : ""
  }

  return `${path}${query}${hash}`
}

/**
 * Optimized Link component with prefetch enabled by default for faster navigation
 * Set prefetch={false} to disable for specific links
 */
export function OptimizedLink({
  children,
  href,
  prefetch = true, // Enable prefetch by default for faster navigation
  onClick,
  ...props
}: ComponentProps<typeof Link> & { prefetch?: boolean }) {
  const { startNavigation } = useRouteLoading()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    const resolvedHref = resolveHref(href)
    startNavigation(resolvedHref ?? undefined)
  }

  return (
    <Link href={href} prefetch={prefetch} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

