import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

interface ProductGridProps {
  category: string
  filters: { [key: string]: string | string[] | undefined }
}

export function ProductGrid({ category, filters }: ProductGridProps) {
  // Filter products based on category and filters
  const filteredProducts = products.filter((product) => {
    // Add your filtering logic here
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Hiển thị <span className="font-medium">{filteredProducts.length}</span> sản phẩm
        </p>
        <select className="border rounded-lg px-4 py-2 text-sm">
          <option>Phổ biến</option>
          <option>Mới nhất</option>
          <option>Bán chạy</option>
          <option>Giá thấp đến cao</option>
          <option>Giá cao đến thấp</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Trước</button>
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className={`px-4 py-2 border rounded-lg ${page === 1 ? "bg-primary text-white" : "hover:bg-gray-50"}`}
          >
            {page}
          </button>
        ))}
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Sau</button>
      </div>
    </div>
  )
}
