"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CheckCircle, MapPin, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ordersApi, Order } from "@/lib/api/orders"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface OrderDetailProps {
  orderId: string
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Package },
  PROCESSING: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800", icon: Package },
  SHIPPING: { label: "Đang giao", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: Package },
}

function getTimelineFromStatus(status: string, createdAt: string) {
  const timeline = [
    { status: "Đơn hàng đã đặt", date: new Date(createdAt).toLocaleString("vi-VN"), completed: true },
  ]

  if (status === "PENDING") {
    return timeline
  }

  timeline.push({ status: "Đã xác nhận", date: "", completed: true })

  if (status === "PROCESSING") {
    return timeline
  }

  timeline.push({ status: "Đang đóng gói", date: "", completed: true })

  if (status === "SHIPPING") {
    timeline.push({ status: "Đang giao hàng", date: "", completed: true })
    timeline.push({ status: "Đã giao hàng", date: "", completed: false })
    return timeline
  }

  if (status === "DELIVERED") {
    timeline.push({ status: "Đang đóng gói", date: "", completed: true })
    timeline.push({ status: "Đang giao hàng", date: "", completed: true })
    timeline.push({ status: "Đã giao hàng", date: "", completed: true })
    return timeline
  }

  if (status === "CANCELLED") {
    timeline.push({ status: "Đã hủy", date: "", completed: true })
    return timeline
  }

  return timeline
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [shippingAddress, setShippingAddress] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await ordersApi.getOrderById(orderId)
        if (response.success && response.data) {
          setOrder(response.data)
          // TODO: Fetch shipping address from addressId if available
          // For now, we'll construct from order data
        } else {
          toast.error("Không tìm thấy đơn hàng")
          router.push("/orders")
        }
      } catch (error: any) {
        console.error("Failed to fetch order:", error)
        toast.error("Không thể tải thông tin đơn hàng")
        router.push("/orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">Không tìm thấy đơn hàng</p>
          <Link href="/orders">
            <Button className="mt-4">Quay lại danh sách đơn hàng</Button>
          </Link>
        </div>
      </div>
    )
  }

  const status = order.status || "PENDING"
  const statusInfo = statusConfig[status] || statusConfig["PENDING"]
  const StatusIcon = statusInfo.icon
  const timeline = getTimelineFromStatus(status, order.createdAt)

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">Chi Tiết Đơn Hàng</h1>
            <p className="text-sm text-muted-foreground">
              Mã đơn hàng: <span className="font-semibold text-foreground">{order.orderNumber}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
          <Badge className={statusInfo.color}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>

        {/* Order Timeline */}
        <div className="relative mt-6">
          <div className="flex justify-between">
            {timeline.map((step, index) => (
              <div key={index} className="flex flex-1 flex-col items-center">
                <div
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${step.completed ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                >
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                </div>
                <p
                  className={`text-center text-xs font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.status}
                </p>
                {step.date && <p className="text-center text-xs text-muted-foreground">{step.date}</p>}
                {index < timeline.length - 1 && timeline.length > 1 && (
                  <div
                    className={`absolute top-5 h-0.5 ${step.completed ? "bg-primary" : "bg-muted"}`}
                    style={{
                      left: `${(index / (timeline.length - 1)) * 100}%`,
                      width: `${100 / (timeline.length - 1)}%`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Sản Phẩm ({order.items?.length || 0})</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded border">
                    <img
                      src={item.productImage || "/placeholder.svg"}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 font-medium text-foreground">{item.productName}</h4>
                    {item.variantName && (
                      <p className="mb-2 text-sm text-muted-foreground">
                        Phân loại: {item.variantName}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                      <p className="font-semibold text-foreground">
                        ₫{((item.variantPrice || item.productPrice || item.unitPrice || 0) * item.quantity).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Địa Chỉ Nhận Hàng</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-foreground">{order.customerName}</p>
              {/* TODO: Fetch and display full shipping address from addressId */}
              <p className="text-muted-foreground">
                {/* Address will be fetched separately if addressId is available */}
                Địa chỉ giao hàng
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-lg bg-white p-6">
            <h3 className="mb-3 font-semibold text-foreground">Phương Thức Thanh Toán</h3>
            <p className="text-sm text-muted-foreground">
              {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" :
                order.paymentMethod === "BANK" ? "Chuyển khoản ngân hàng" :
                  order.paymentMethod === "MOMO" ? "Ví MoMo" :
                    order.paymentMethod === "ZALOPAY" ? "Ví ZaloPay" :
                      order.paymentMethod || "Chưa xác định"}
            </p>
          </div>

          {/* Order Summary */}
          <div className="rounded-lg bg-white p-6">
            <h3 className="mb-4 font-semibold text-foreground">Tóm Tắt Đơn Hàng</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="text-foreground">₫{(order.subtotal || 0).toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="text-foreground">₫{(order.shippingFee || 0).toLocaleString("vi-VN")}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giảm giá</span>
                  <span className="text-primary">-₫{order.discountAmount.toLocaleString("vi-VN")}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thuế</span>
                  <span className="text-foreground">₫{order.tax.toLocaleString("vi-VN")}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold text-foreground">Tổng cộng</span>
                <span className="text-xl font-bold text-primary">
                  ₫{(order.finalTotal || order.totalPrice || 0).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full bg-transparent" variant="outline">
              Liên Hệ Người Bán
            </Button>
            <Link href="/orders">
              <Button className="w-full bg-transparent" variant="outline">
                Quay Lại Đơn Hàng
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
