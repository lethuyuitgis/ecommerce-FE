import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { CartItems } from "@/components/cart/cart-items"
import { CartSummary } from "@/components/cart/cart-summary"

export default function CartPage() {
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
              <CartItems />
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
