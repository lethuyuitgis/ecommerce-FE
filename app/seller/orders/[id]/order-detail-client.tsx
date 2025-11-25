"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Printer, Package, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { OrderStatusActions } from "@/components/orders/order-status-actions"
import { OrderTimeline } from "@/components/orders/order-timeline"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { Order } from "@/lib/api/orders"
import { ordersApi } from "@/lib/api/orders"

interface OrderDetailClientProps {
  initialOrder: Order
}

export function OrderDetailClient({ initialOrder }: OrderDetailClientProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order>(initialOrder)

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
    // Refresh order data after status update
    const response = await ordersApi.getOrderById(order.id)
    if (response.success && response.data) {
      setOrder(response.data)
    }
  }

  const status = order.status || "PENDING"

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
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
            <div className="lg:col-span-2 space-y-6">
              <OrderStatusActions status={status.toLowerCase()} orderId={order.id} onStatusUpdate={handleStatusUpdate} />

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

              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTimeline status={status.toLowerCase()} createdAt={order.createdAt} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Địa chỉ giao hàng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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


