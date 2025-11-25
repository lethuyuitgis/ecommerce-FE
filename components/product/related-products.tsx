'use client'

import { ProductCard } from "@/components/product/product-card"
import { Product } from "@/lib/api/products"
import { getImageUrl } from "@/lib/utils/image"

interface RelatedProductsProps {
  currentProductId: string
  initialProducts?: Product[]
  categorySlug?: string
}

export function RelatedProducts({ currentProductId, initialProducts = [], categorySlug }: RelatedProductsProps) {
  const relatedProducts = initialProducts

  // Transform API product to component product format
  const transformProduct = (product: Product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.comparePrice,
    image: getImageUrl(product.primaryImage || product.images?.[0]),
    rating: product.rating || 0,
    sold: product.totalSold || 0,
    discount: product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : undefined,
    category: product.categoryName,
  })

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-6 rounded-lg bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold">SẢN PHẨM TƯƠNG TỰ</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={transformProduct(product)} />
        ))}
      </div>
    </div>
  )
}
