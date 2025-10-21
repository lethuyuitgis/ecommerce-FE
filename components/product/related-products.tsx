import { ProductCard } from "@/components/product-card"
import { featuredProducts } from "@/lib/products"

interface RelatedProductsProps {
  currentProductId: string
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const relatedProducts = featuredProducts.filter((p) => p.id !== currentProductId).slice(0, 6)

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
