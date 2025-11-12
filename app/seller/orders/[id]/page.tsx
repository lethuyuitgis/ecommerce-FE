"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Printer, Package, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { OrderStatusActions } from "@/components/orders/order-status-actions"
import { OrderTimeline } from "@/components/orders/order-timeline"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { ordersApi, Order } from "@/lib/api/orders"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { RequireSeller } from "@/components/seller/require-seller"

function OrderDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const orderId = params?.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!orderId) return

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await ordersApi.getOrderById(orderId)
        if (response.success && response.data) {
          setOrder(response.data)
        } else {
          toast.error("Không tìm thấy đơn hàng")
          router.push("/seller/orders")
        }
      } catch (error: any) {
        console.error("Failed to fetch order:", error)
        toast.error("Không thể tải thông tin đơn hàng")
        router.push("/seller/orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, isAuthenticated, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      PROCESSING: "Đang xử lý",
      SHIPPING: "Đang giao",
      DELIVERED: "Đã giao",
      CANCELLED: "Đã hủy",
    }
    return statusMap[status?.toUpperCase()] || status
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    const statusUpper = status?.toUpperCase()
    if (statusUpper === "PENDING") return "secondary"
    if (statusUpper === "CANCELLED") return "destructive"
    return "default"
  }

  const handleStatusUpdate = async () => {
    if (!order) return
    // Refresh order data after status update
    const response = await ordersApi.getOrderById(order.id)
    if (response.success && response.data) {
      setOrder(response.data)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-background">
        <SellerSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">Không tìm thấy đơn hàng</p>
            <Link href="/seller/orders">
              <Button className="mt-4">Quay lại danh sách đơn hàng</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const status = order.status || "PENDING"

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/seller/orders">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">Đơn hàng {order.orderNumber}</h1>
                  <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                In đơn
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status Actions */}
              <OrderStatusActions status={status.toLowerCase()} orderId={order.id} onStatusUpdate={handleStatusUpdate} />

              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm ({order.items?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                        <Image
                          src={item.productImage || "/placeholder.svg"}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.productName}</h3>
                        {item.variantName && (
                          <p className="text-sm text-muted-foreground">Phân loại: {item.variantName}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                          <span className="font-medium">
                            {formatPrice((item.variantPrice || item.productPrice || item.unitPrice || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatPrice(order.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{formatPrice(order.shippingFee || 0)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giảm giá</span>
                        <span className="text-green-600">-{formatPrice(order.discountAmount)}</span>
                      </div>
                    )}
                    {order.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Thuế</span>
                        <span>{formatPrice(order.tax)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(order.finalTotal || order.totalPrice || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTimeline status={status.toLowerCase()} createdAt={order.createdAt} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Thông tin khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                  </div>
                  {/* TODO: Fetch customer phone and email from user API if needed */}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                      {/* TODO: Fetch full shipping address from addressId */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phương thức</span>
                      <Badge variant="outline">
                        {order.paymentMethod === "COD" ? "COD" :
                          order.paymentMethod === "BANK" ? "Chuyển khoản" :
                            order.paymentMethod === "MOMO" ? "MoMo" :
                              order.paymentMethod === "ZALOPAY" ? "ZaloPay" :
                                order.paymentMethod || "Chưa xác định"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trạng thái</span>
                      <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                        {order.paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Note */}
              {(order.notes || order.customerNotes) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ghi chú</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.customerNotes && (
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Ghi chú của khách hàng:</p>
                        <p className="text-sm text-muted-foreground">{order.customerNotes}</p>
                      </div>
                    )}
                    {order.notes && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Ghi chú nội bộ:</p>
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  return <RequireSeller><OrderDetailContent /></RequireSeller>
}
