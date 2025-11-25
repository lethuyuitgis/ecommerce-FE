"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product/product-card"
import { useRouter, useSearchParams } from "next/navigation"
import type { Product as ProductType } from "@/lib/products"

interface ProductGridClientProps {
  category: string
  filters: { [key: string]: string | string[] | undefined }
  initialProducts: ProductType[]
  initialTotalPages: number
  initialTotalElements: number
  initialPage: number
}

export function ProductGridClient({ 
  category, 
  filters,
  initialProducts,
  initialTotalPages,
  initialTotalElements,
  initialPage: initialPageProp
}: ProductGridClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState('createdAt')
  
  // Get page from URL or use initial
  const currentPage = parseInt(searchParams.get('page') || initialPageProp.toString(), 10)

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', newSortBy)
    params.set('page', '0') // Reset to first page when sorting changes
    router.push(`?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Hiển thị <span className="font-medium">{initialTotalElements}</span> sản phẩm
        </p>
        <select
          className="border rounded-lg px-4 py-2 text-sm"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="createdAt">Mới nhất</option>
          <option value="totalSold">Bán chạy</option>
          <option value="price_asc">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
        </select>
      </div>

      {initialProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không có sản phẩm nào trong danh mục này</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {initialTotalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Trước
              </button>
              <span className="px-4 py-2 border rounded-lg bg-primary text-white">
                {currentPage + 1} / {initialTotalPages}
              </span>
              <button
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= initialTotalPages - 1}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}


