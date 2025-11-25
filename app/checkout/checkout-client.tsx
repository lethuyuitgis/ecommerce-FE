'use client'

import { useState } from "react"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { ordersApi } from "@/lib/api/orders"
import { paymentApi } from "@/lib/api/payment"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

interface CheckoutClientProps {
  cartItems: any[]
  addresses: any[]
}

export function CheckoutClient({ cartItems, addresses: initialAddresses }: CheckoutClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [note, setNote] = useState("")
  const [voucherCode, setVoucherCode] = useState<string | null>(null)

  const handleCreateOrder = async () => {
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

      const orderResponse = await ordersApi.createOrder(orderData)
      if (orderResponse.success && orderResponse.data) {
        // Check if payment method requires online payment (VNPay, MoMo, etc.)
        const paymentMethodLower = paymentMethod.toLowerCase()
        const requiresOnlinePayment = paymentMethodLower.includes('vnpay') || 
                                     paymentMethodLower.includes('momo') || 
                                     paymentMethodLower.includes('zalopay') ||
                                     paymentMethodLower.includes('paypal')

        if (requiresOnlinePayment) {
          try {
            // Get payment method ID
            const paymentMethodsResponse = await paymentApi.getMethods()
            const selectedMethod = paymentMethodsResponse.data?.find(
              (m: any) => {
                const methodCode = (m.code || m.id || '').toLowerCase()
                return methodCode === paymentMethodLower || methodCode.includes(paymentMethodLower)
              }
            )

            if (selectedMethod) {
              const paymentResponse = await paymentApi.processPayment({
                orderId: orderResponse.data.id,
                methodId: selectedMethod.id,
                amount: orderResponse.data.finalTotal,
              })

              if (paymentResponse.success && paymentResponse.data) {
                if (paymentResponse.data.paymentUrl) {
                  // Redirect to payment gateway (VNPay, MoMo, etc.)
                  window.location.href = paymentResponse.data.paymentUrl
                  return
                } else if (paymentResponse.data.status === 'SUCCESS') {
                  // Payment completed immediately
                  toast.success("Thanh toán thành công!")
                  router.push(`/orders/${orderResponse.data.id}`)
                  router.refresh()
                  return
                }
              }
            } else {
              toast.error("Không tìm thấy phương thức thanh toán. Vui lòng thử lại.")
              return
            }
          } catch (paymentError: any) {
            console.error('Payment processing error:', paymentError)
            toast.error(paymentError.message || "Không thể xử lý thanh toán. Vui lòng thử lại.")
            return
          }
        }

        // For COD or other offline methods, redirect to order detail
        toast.success("Đặt hàng thành công!")
        router.push(`/orders/${orderResponse.data.id}`)
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Đặt hàng thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:text-primary">Giỏ hàng</Link>
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
    </>
  )
}

