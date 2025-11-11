'use client'

import { useEffect, useState, use } from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { ProductGrid } from "@/components/product/product-grid"
import { useCategory } from "@/hooks/useCategories"
import { CategoryBreadcrumb } from "@/components/common/category-breadcrumb"
import { CategoryFilters } from "@/components/common/category-filters"
import { CategoryHeader } from "@/components/common/category-header"

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = use(params)
  const resolvedSearchParams = use(searchParams)
  const { category, loading: categoryLoading } = useCategory(slug)

  if (categoryLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Đang tải danh mục...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p className="text-destructive">Danh mục không tồn tại</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <CategoryBreadcrumb category={category.name} />
        <CategoryHeader
          name={category.name}
          description={category.description || ''}
          image={category.coverImage || category.icon || "/placeholder.svg"}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-64 flex-shrink-0">
              <CategoryFilters
                subcategories={category.subcategories || []}
                currentFilters={resolvedSearchParams}
              />
            </aside>
            <main className="flex-1">
              <ProductGrid category={slug} filters={resolvedSearchParams} />
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
