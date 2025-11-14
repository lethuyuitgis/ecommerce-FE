import { useRouter } from "next/navigation"
import { startTransition } from "react"

/**
 * Optimized router push with startTransition for non-blocking navigation
 */
export function useOptimizedRouter() {
  const router = useRouter()

  const push = (href: string) => {
    startTransition(() => {
      router.push(href)
    })
  }

  const replace = (href: string) => {
    startTransition(() => {
      router.replace(href)
    })
  }

  return {
    ...router,
    push,
    replace,
  }
}

