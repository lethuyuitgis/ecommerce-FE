import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"
import { serverCartApi } from "@/lib/api/server"
import { redirect } from "next/navigation"

export default async function CartPage() {
  // Fetch cart data on server
  const cartResponse = await serverCartApi.getCart()
  
  const cartItems = cartResponse.success && cartResponse.data?.items
    ? (Array.isArray(cartResponse.data.items) ? cartResponse.data.items : [])
    : []

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Giỏ hàng</span>
          </div>

          <h1 className="mb-6 text-2xl font-bold text-foreground">Giỏ Hàng Của Bạn</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CartItems initialCartItems={cartItems} />
            </div>
            <div>
              <CartSummary initialCartItems={cartItems} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
