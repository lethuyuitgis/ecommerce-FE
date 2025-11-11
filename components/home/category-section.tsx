'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { categoriesApi, Category } from "@/lib/api/categories"

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll()
        if (response.success && response.data) {
          // Get all categories (parent categories only)
          setCategories(response.data.slice(0, 26)) // Limit to 26 categories
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <section className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">DANH MỤC</h2>
        {loading ? (
          <div className="text-center py-4">Đang tải danh mục...</div>
        ) : categories.length > 0 ? (
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group flex min-w-[80px] flex-col items-center gap-2 transition-transform hover:scale-105"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200 overflow-hidden">
                    {category.coverImage ? (
                      <img
                        src={category.coverImage}
                        alt={category.name}
                        className="h-full w-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                    ) : category.icon ? (
                      <span className="text-2xl">{category.icon}</span>
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <span className="text-center text-xs font-medium text-foreground group-hover:text-primary">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">Chưa có danh mục nào</div>
        )}
      </div>
    </section>
  )
}
