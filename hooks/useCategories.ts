import { useState, useEffect } from 'react'
import { categoriesApi, Category } from '@/lib/api/categories'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await categoriesApi.getAll()
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
      try {
        setLoading(true)
        const response = await categoriesApi.getBySlug(slug)
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







