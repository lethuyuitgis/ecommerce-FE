import { useState, useEffect, useRef, useCallback } from 'react'
import { productsApi, Product, ProductPage } from '@/lib/api/products'
import { apiCache } from '@/lib/api/cache'

interface HookOptions {
  enabled?: boolean
}

export function useProducts(page: number = 0, size: number = 20, options: HookOptions = {}) {
  const enabled = options.enabled !== false
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    // Create a new AbortController for each request
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const fetchProducts = async () => {
      const cacheKey = `products:${page}:${size}`
      try {
        setLoading(true)
        setError(null)

        const response = await apiCache.get(
          cacheKey,
          () => productsApi.getAll(page, size),
          2 * 60 * 1000
        )

        if (signal.aborted) return

        if (response.success && response.data) {
          setProducts(response.data.content)
          setTotalPages(response.data.totalPages)
        }
      } catch (err: any) {
        if (signal.aborted || err.name === 'AbortError') return
        setError(err as Error)
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [page, size, enabled])

  return { products, loading, error, totalPages }
}

export function useFeaturedProducts(page: number = 0, size: number = 20, options: HookOptions = {}) {
  const enabled = options.enabled !== false
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const fetchProducts = async () => {
      const cacheKey = `featured:${page}:${size}`
      try {
        setLoading(true)
        setError(null)

        const response = await apiCache.get(
          cacheKey,
          () => productsApi.getFeatured(page, size),
          3 * 60 * 1000
        )

        if (signal.aborted) return

        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err: any) {
        if (signal.aborted || err.name === 'AbortError') return
        setError(err as Error)
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [page, size, enabled])

  return { products, loading, error }
}

export function useFlashSaleProducts(page: number = 0, size: number = 20, options: HookOptions = {}) {
  const enabled = options.enabled !== false
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const fetchProducts = async () => {
      const cacheKey = `flash-sale:${page}:${size}`
      try {
        setLoading(true)
        setError(null)

        const response = await apiCache.get(
          cacheKey,
          () => productsApi.getFlashSales(page, size),
          1 * 60 * 1000
        )

        if (signal.aborted) return

        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err: any) {
        if (signal.aborted || err.name === 'AbortError') return
        setError(err as Error)
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      abortControllerRef.current?.abort()
    }
  }, [page, size, enabled])

  return { products, loading, error }
}

export function useProduct(id: string, options: HookOptions = {}) {
  const enabled = options.enabled !== false
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProduct = useCallback(async (skipCache: boolean = false) => {
    if (!id || !enabled) return

    // Abort previous request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const cacheKey = `product:${id}`
    try {
      setLoading(true)
      setError(null)

      if (skipCache) {
        apiCache.invalidate(cacheKey)
      }

      const response = await apiCache.get(
        cacheKey,
        () => productsApi.getById(id),
        5 * 60 * 1000
      )

      if (signal.aborted) return

      if (response.success && response.data) {
        setProduct(response.data)
      }
    } catch (err: any) {
      if (signal.aborted || err.name === 'AbortError') return
      setError(err as Error)
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }, [id, enabled])

  useEffect(() => {
    if (enabled) {
      fetchProduct()
    } else {
      setLoading(false)
    }
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [id, enabled, fetchProduct])

  return { product, loading, error, refreshProduct: () => fetchProduct(true) }
}

export function useProductsByCategory(
  slug: string,
  page: number = 0,
  size: number = 20,
  filters?: {
    minPrice?: number
    maxPrice?: number
    minRating?: number
    subcategory?: string
  },
  options: HookOptions = {}
) {
  const enabled = options.enabled !== false
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Stable json key for filters to avoid infinite re-renders
  const filtersKey = JSON.stringify(filters ?? null)

  useEffect(() => {
    if (!slug || !enabled) {
      if (!enabled) setLoading(false)
      return
    }

    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const fetchProducts = async () => {
      const cacheKey = `category:${slug}:${page}:${size}:${filtersKey}`
      try {
        setLoading(true)
        setError(null)

        const response = await apiCache.get(
          cacheKey,
          () => productsApi.getByCategory(slug, page, size, filters),
          2 * 60 * 1000
        )

        if (signal.aborted) return

        if (response && response.success && response.data) {
          if (response.data.content && Array.isArray(response.data.content)) {
            setProducts(response.data.content)
          } else if (Array.isArray(response.data)) {
            setProducts(response.data)
          }
        } else {
          setError(new Error(response?.message || 'Failed to fetch products'))
        }
      } catch (err: any) {
        if (signal.aborted || err.name === 'AbortError') return
        setError(err as Error)
      } finally {
        if (!signal.aborted) setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      abortControllerRef.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, page, size, filtersKey, enabled])

  return { products, loading, error }
}

export function useSearchProducts(keyword: string, page: number = 0, size: number = 20, options: HookOptions = {}) {
  const enabled = options.enabled !== false
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!keyword || !enabled) {
      setProducts([])
      setLoading(false)
      return
    }

    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal

      const fetchProducts = async () => {
        const cacheKey = `search:${keyword}:${page}:${size}`
        try {
          setLoading(true)
          setError(null)

          const response = await apiCache.get(
            cacheKey,
            () => productsApi.search(keyword, page, size),
            1 * 60 * 1000
          )

          if (signal.aborted) return

          if (response.success && response.data) {
            setProducts(response.data.content)
          }
        } catch (err: any) {
          if (signal.aborted || err.name === 'AbortError') return
          setError(err as Error)
        } finally {
          if (!signal.aborted) setLoading(false)
        }
      }

      fetchProducts()
    }, 300) // Debounce

    return () => {
      clearTimeout(timeoutId)
      abortControllerRef.current?.abort()
    }
  }, [keyword, page, size, enabled])

  return { products, loading, error }
}
