import { useState, useEffect } from 'react'
import { productsApi, Product, ProductPage } from '@/lib/api/products'

export function useProducts(page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsApi.getAll(page, size)
        if (response.success && response.data) {
          setProducts(response.data.content)
          setTotalPages(response.data.totalPages)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, size])

  return { products, loading, error, totalPages }
}

export function useFeaturedProducts(page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsApi.getFeatured(page, size)
        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, size])

  return { products, loading, error }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productsApi.getById(id)
        if (response.success && response.data) {
          setProduct(response.data)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  return { product, loading, error }
}

export function useProductsByCategory(slug: string, page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsApi.getByCategory(slug, page, size)
        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [slug, page, size])

  return { products, loading, error }
}

export function useSearchProducts(keyword: string, page: number = 0, size: number = 20) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!keyword) {
      setProducts([])
      setLoading(false)
      return
    }

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productsApi.search(keyword, page, size)
        if (response.success && response.data) {
          setProducts(response.data.content)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchProducts, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [keyword, page, size])

  return { products, loading, error }
}

