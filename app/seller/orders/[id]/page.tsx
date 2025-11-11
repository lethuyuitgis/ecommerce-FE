import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Printer, Package, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { OrderStatusActions } from "@/components/orders/order-status-actions"
import { OrderTimeline } from "@/components/orders/order-timeline"
import { SellerSidebar } from "@/components/seller/seller-sidebar"


export default function OrderDetailPage() {
  const order = {
    id: "DH001234",
    status: "pending",
    customer: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    },
    items: [
      {
        id: "1",
        name: "iPhone 15 Pro Max 256GB",
        image: "/modern-smartphone.png",
        variant: "Màu đen",
        price: 29990000,
        quantity: 1,
      },
      {
        id: "2",
        name: "Ốp lưng iPhone 15 Pro Max",
        image: "/placeholder.svg?height=80&width=80",
        variant: "Màu trong suốt",
        price: 250000,
        quantity: 2,
      },
    ],
    payment: {
      method: "COD",
      subtotal: 30490000,
      shipping: 30000,
      discount: 500000,
      total: 30020000,
    },
    date: "2024-01-07 14:30",
    note: "Giao hàng giờ hành chính",
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

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
                  <h1 className="text-3xl font-bold text-foreground">Đơn hàng {order.id}</h1>
                  <Badge variant="secondary">Chờ xác nhận</Badge>
                </div>
                <p className="text-muted-foreground mt-1">{order.date}</p>
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
              <OrderStatusActions status={order.status} orderId={order.id} />

              {/* Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm ({order.items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.variant}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                          <span className="font-medium">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatPrice(order.payment.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{formatPrice(order.payment.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Giảm giá</span>
                      <span className="text-green-600">-{formatPrice(order.payment.discount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(order.payment.total)}</span>
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
                  <OrderTimeline status={order.status} />
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
                    <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{order.customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{order.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{order.customer.address}</p>
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
                      <Badge variant="outline">{order.payment.method}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trạng thái</span>
                      <Badge variant="secondary">Chưa thanh toán</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Note */}
              {order.note && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ghi chú</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{order.note}</p>
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
