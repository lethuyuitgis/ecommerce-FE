'use client'

import { ProductCard } from "@/components/product/product-card"
import { Product } from "@/lib/api/products"

interface RelatedProductsProps {
  currentProductId: string
  initialProducts?: Product[]
  categorySlug?: string
}

export function RelatedProducts({ currentProductId, initialProducts = [], categorySlug }: RelatedProductsProps) {
  const relatedProducts = initialProducts.filter((p) => p.id !== currentProductId)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-6 rounded-lg bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold">SẢN PHẨM TƯƠNG TỰ</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
