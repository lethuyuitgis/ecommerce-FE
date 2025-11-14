'use client'

import { useState } from "react"
import { Header } from "@/components/common/header"
import { Footer } from "@/components/common/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { useCart } from "@/hooks/useCart"
import { ordersApi } from "@/lib/api/orders"
import { userApi } from "@/lib/api/user"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [note, setNote] = useState("")
  const [voucherCode, setVoucherCode] = useState<string | null>(null)

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống")
      return
    }

    if (!selectedAddressId) {
      toast.error("Vui lòng chọn địa chỉ giao hàng")
      return
    }

    try {
      setLoading(true)
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
        })),
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod,
        voucherCode: voucherCode || undefined,
        notes: note || undefined,
      }

      const response = await ordersApi.createOrder(orderData)
      if (response.success && response.data) {
        toast.success("Đặt hàng thành công!")
        await clearCart()
        router.push(`/orders/${response.data.id}`)
      }
    } catch (error: any) {
      toast.error(error.message || "Đặt hàng thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4 text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/')}>Trang chủ</span>
            <span className="mx-2">/</span>
            <span className="hover:text-primary cursor-pointer" onClick={() => router.push('/cart')}>Giỏ hàng</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Thanh toán</span>
          </div>

          <h1 className="mb-6 text-2xl font-bold text-foreground">Thanh Toán</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CheckoutForm
                selectedAddressId={selectedAddressId}
                onAddressChange={setSelectedAddressId}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                note={note}
                onNoteChange={setNote}
              />
            </div>
            <div>
              <CheckoutSummary
                onSubmit={handleCreateOrder}
                loading={loading}
                onVoucherChange={(code, discount) => setVoucherCode(code)}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
