import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { WishlistGrid } from "@/components/wishlist/wishlist-grid"
import { serverFetch } from "@/lib/api/server"
import { cookies, headers } from "next/headers"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/api/products"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const cookieStore = await cookies()
  const headerList = await headers()
  const response = await serverFetch<Product[]>("/wishlist", {}, cookieStore, headerList)
  const items = response.success && Array.isArray(response.data) ? response.data : []

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Sản phẩm yêu thích</span>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <h1 className="text-2xl font-bold text-foreground">Sản Phẩm Yêu Thích</h1>
            <span className="text-sm text-muted-foreground">({items.length} sản phẩm)</span>
          </div>

          <WishlistGrid initialItems={items} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
