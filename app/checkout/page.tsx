import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"
import { CheckoutSummary } from "@/components/checkout-summary"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="hover:text-primary cursor-pointer">Giỏ hàng</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Thanh toán</span>
          </div>

          <h1 className="mb-6 text-2xl font-bold text-foreground">Thanh Toán</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CheckoutForm />
            </div>
            <div>
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
