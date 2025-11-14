import { useState, useEffect } from 'react'
import { categoriesApi, Category } from '@/lib/api/categories'
import { apiCache } from '@/lib/api/cache'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const cacheKey = 'categories:all'
      
      try {
        setLoading(true)
        
        const response = await apiCache.get(
          cacheKey,
          () => categoriesApi.getAll(),
          10 * 60 * 1000 // 10 minutes cache for categories (rarely change)
        )
        
        if (response.success && response.data) {
          setCategories(response.data)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchCategory = async () => {
      const cacheKey = `category:${slug}`
      
      try {
        setLoading(true)
        
        const response = await apiCache.get(
          cacheKey,
          () => categoriesApi.getBySlug(slug),
          10 * 60 * 1000 // 10 minutes cache
        )
        
        if (response.success && response.data) {
          setCategory(response.data)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [slug])

  return { category, loading, error }
}






