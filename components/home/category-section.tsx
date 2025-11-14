'use client'

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categoriesApi, Category } from "@/lib/api/categories"

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScrollability = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }

    checkScrollability()
    container.addEventListener('scroll', checkScrollability)
    window.addEventListener('resize', checkScrollability)

    return () => {
      container.removeEventListener('scroll', checkScrollability)
      window.removeEventListener('resize', checkScrollability)
    }
  }, [categories])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 300 // Scroll 300px each time
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  return (
    <section className="border-b bg-white">
      <div className="container mx-auto px-4 py-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">DANH MỤC</h2>
        {loading ? (
          <div className="text-center py-4">Đang tải danh mục...</div>
        ) : categories.length > 0 ? (
          <div className="relative">
            {/* Previous Button */}
            {canScrollLeft && (
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200"
                onClick={() => scroll('left')}
                aria-label="Previous categories"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}

            {/* Categories Slider */}
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
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

            {/* Next Button */}
            {canScrollRight && (
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200"
                onClick={() => scroll('right')}
                aria-label="Next categories"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">Chưa có danh mục nào</div>
        )}
      </div>
    </section>
  )
}
