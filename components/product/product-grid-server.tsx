import { ProductCard } from "@/components/product/product-card"
import { Product } from "@/lib/api/products"
import { ProductGridClient } from "./product-grid-client"
import { getImageUrl } from "@/lib/utils/image"

interface ProductGridServerProps {
  category: string
  filters: { [key: string]: string | string[] | undefined }
  initialProducts: Product[]
  initialTotalPages: number
  initialTotalElements: number
  initialPage: number
}

export function ProductGridServer({ 
  category, 
  filters, 
  initialProducts, 
  initialTotalPages,
  initialTotalElements,
  initialPage 
}: ProductGridServerProps) {
  // Transform API product to component product format
  const transformProduct = (product: Product) => {
    if (!product || !product.id) {
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

  const transformedProducts = initialProducts
    .map(transformProduct)
    .filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <ProductGridClient
      category={category}
      filters={filters}
      initialProducts={transformedProducts}
      initialTotalPages={initialTotalPages}
      initialTotalElements={initialTotalElements}
      initialPage={initialPage}
    />
  )
}

