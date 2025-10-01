import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { Clock } from "lucide-react"

export default function FlashSalesPage() {
  const flashSaleProducts = products.slice(0, 12)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
        <h1 className="mb-4 text-center text-3xl font-bold">Flash Sale</h1>
        <div className="flex items-center justify-center gap-2 text-lg">
          <Clock className="h-6 w-6" />
          <span>Kết thúc trong:</span>
          <div className="flex gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-xl font-bold text-primary">
              12
            </div>
            <span className="text-2xl">:</span>
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-xl font-bold text-primary">
              34
            </div>
            <span className="text-2xl">:</span>
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-xl font-bold text-primary">
              56
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {flashSaleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
