'use client'

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product/product-card"
import { useProductsByCategory } from "@/hooks/useProducts"
import { Product } from "@/lib/api/products"
import { getImageUrl } from "@/lib/utils/image"

interface ProductGridProps {
  category: string
  filters: { [key: string]: string | string[] | undefined }
}

export function ProductGrid({ category, filters }: ProductGridProps) {
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('createdAt')
  
  // Extract filter values from URL params
  const filterParams = {
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    minRating: filters.rating ? Number(filters.rating) : undefined,
    subcategory: Array.isArray(filters.subcategory) 
      ? filters.subcategory[0] 
      : (filters.subcategory as string | undefined),
  }
  
  const { products, loading, error } = useProductsByCategory(category, page, 24, filterParams)
  
  // Reset page when filters change
  useEffect(() => {
    setPage(0)
  }, [JSON.stringify(filterParams)])

  // Transform API product to component product format
  const transformProduct = (product: Product) => {
    if (!product || !product.id) {
      console.error('Invalid product:', product)
      return null
    }
    return {
      id: product.id,
      name: product.name || 'Sản phẩm không có tên',
      price: product.price || 0,
      originalPrice: product.comparePrice || undefined,
      image: getImageUrl(product.primaryImage || product.images?.[0]),
      rating: product.rating || 0,
      sold: product.totalSold || 0,
      discount: product.comparePrice && product.price 
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) 
        : undefined,
      category: product.categoryName || '',
    }
  }

  // Show loading only if loading AND no products yet
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Đang tải sản phẩm...</p>
      </div>
    )
  }

  // Show error only if there's an error AND no products
  // If we have products, don't show error even if error state exists
  if (error && (!products || products.length === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Có lỗi xảy ra khi tải sản phẩm</p>
        {process.env.NODE_ENV === 'development' && (
          <p className="text-sm text-muted-foreground mt-2">
            {error.message || String(error)}
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Hiển thị <span className="font-medium">{products.length}</span> sản phẩm
        </p>
        <select
          className="border rounded-lg px-4 py-2 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Mới nhất</option>
          <option value="totalSold">Bán chạy</option>
          <option value="price_asc">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
        </select>
      </div>

      {!products || products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có sản phẩm nào trong danh mục này</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products
              .filter((product) => product && product.id) // Filter out invalid products
              .map((product) => {
                const transformed = transformProduct(product)
                return transformed ? (
                  <ProductCard key={product.id} product={transformed} />
                ) : null
              })
              .filter(Boolean) // Remove null entries
            }
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-8">
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Trước
            </button>
            <button
              className="px-4 py-2 border rounded-lg bg-primary text-white"
            >
              {page + 1}
            </button>
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={products.length < 24}
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  )
}
