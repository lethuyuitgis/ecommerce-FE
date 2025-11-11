'use client'

import { useState } from "react"
import { ProductCard } from "@/components/product/product-card"
import { useProductsByCategory } from "@/hooks/useProducts"
import { Product } from "@/lib/api/products"

interface ProductGridProps {
  category: string
  filters: { [key: string]: string | string[] | undefined }
}

export function ProductGrid({ category, filters }: ProductGridProps) {
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState('createdAt')
  const { products, loading, error } = useProductsByCategory(category, page, 24)

  // Transform API product to component product format
  const transformProduct = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.comparePrice,
    image: product.primaryImage || product.images?.[0] || '/placeholder.svg',
    rating: product.rating || 0,
    sold: product.totalSold || 0,
    discount: product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : undefined,
    category: product.categoryName,
  })

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Đang tải sản phẩm...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Có lỗi xảy ra khi tải sản phẩm</p>
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

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có sản phẩm nào trong danh mục này</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={transformProduct(product)} />
            ))}
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
