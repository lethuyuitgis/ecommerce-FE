import { useState, useEffect, useRef } from 'react'
import { productsApi, Product, ProductPage } from '@/lib/api/products'
import { apiCache } from '@/lib/api/cache'

export function useProducts(page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const fetchProducts = async () => {
      const cacheKey = `products:${page}:${size}`
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiCache.get(
          cacheKey,
          () => productsApi.getAll(page, size),
          2 * 60 * 1000 // 2 minutes cache
        )
        
        if (response.success && response.data) {
          setProducts(response.data.content)
          setTotalPages(response.data.totalPages)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err as Error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [page, size])

  return { products, loading, error, totalPages }
}

export function useFeaturedProducts(page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const fetchProducts = async () => {
      const cacheKey = `featured:${page}:${size}`
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiCache.get(
          cacheKey,
          () => productsApi.getFeatured(page, size),
          3 * 60 * 1000 // 3 minutes cache for featured products
        )
        
        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err as Error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [page, size])

  return { products, loading, error }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchProduct = async (skipCache: boolean = false) => {
    if (!id) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

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
        5 * 60 * 1000 // 5 minutes cache for product details
      )
      
      if (response.success && response.data) {
        setProduct(response.data)
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err as Error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  return { product, loading, error, refreshProduct: () => fetchProduct(true) }
}

export function useProductsByCategory(slug: string, page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!slug) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const fetchProducts = async () => {
      const cacheKey = `category:${slug}:${page}:${size}`
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiCache.get(
          cacheKey,
          () => productsApi.getByCategory(slug, page, size),
          2 * 60 * 1000 // 2 minutes cache
        )
        
        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err as Error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [slug, page, size])

  return { products, loading, error }
}

export function useSearchProducts(keyword: string, page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!keyword) {
      setProducts([])
      setLoading(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const fetchProducts = async () => {
      const cacheKey = `search:${keyword}:${page}:${size}`
      
      try {
        setLoading(true)
        setError(null)
        
        const response = await apiCache.get(
          cacheKey,
          () => productsApi.search(keyword, page, size),
          1 * 60 * 1000 // 1 minute cache for search
        )
        
        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err as Error)
        }
      } finally {
        setLoading(false)
      }
    }


    const timeoutId = setTimeout(fetchProducts, 300) // Debounce
    return () => {
      clearTimeout(timeoutId)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [keyword, page, size])

  return { products, loading, error }
}






