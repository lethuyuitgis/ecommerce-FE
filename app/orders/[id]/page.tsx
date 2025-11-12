import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { OrderDetail } from "@/components/orders/order-detail"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer">Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="hover:text-primary cursor-pointer">Đơn hàng</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Chi tiết đơn hàng</span>
          </div>

          <OrderDetail orderId={params.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
