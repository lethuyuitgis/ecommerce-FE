'use client'

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product/product-card"
import { useFeaturedProducts } from "@/hooks/useProducts"
import { Product } from "@/lib/api/products"

interface RelatedProductsProps {
  currentProductId: string
  categorySlug?: string
}

export function RelatedProducts({ currentProductId, categorySlug }: RelatedProductsProps) {
  const { products, loading } = useFeaturedProducts(0, 12)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    // Filter out current product and limit to 6
    const filtered = products
      .filter((p) => p.id !== currentProductId)
      .slice(0, 6)
    setRelatedProducts(filtered)
  }, [products, currentProductId])

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
      <div className="mt-6 rounded-lg bg-white p-6">
        <h2 className="mb-6 text-xl font-semibold">SẢN PHẨM TƯƠNG TỰ</h2>
        <div className="text-center py-4">
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

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
