"use client"

import { ArrowLeft, MessageSquare, Gift, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

const customerDetail = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0912345678",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  joinDate: "2023-05-10",
  totalOrders: 15,
  totalSpent: 5200000,
  averageOrderValue: 346667,
  lastOrder: "2024-10-15",
  status: "VIP",
  avatar: "👨",
  orders: [
    {
      id: "ORD001",
      date: "2024-10-15",
      total: 450000,
      status: "Delivered",
      items: 3,
    },
    {
      id: "ORD002",
      date: "2024-10-10",
      total: 320000,
      status: "Delivered",
      items: 2,
    },
    {
      id: "ORD003",
      date: "2024-09-20",
      total: 580000,
      status: "Delivered",
      items: 4,
    },
  ],
}

export default function CustomerDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{customerDetail.name}</h1>
          <p className="text-muted-foreground mt-1">Khách hàng VIP • Tham gia từ {customerDetail.joinDate}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium mt-2">{customerDetail.email}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Số điện thoại</p>
              <p className="text-foreground font-medium mt-2">{customerDetail.phone}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Địa chỉ</p>
              <p className="text-foreground font-medium mt-2">{customerDetail.address}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-foreground mt-2">{customerDetail.totalOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
          <p className="text-2xl font-bold text-primary mt-2">{(customerDetail.totalSpent / 1000000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Giá trị trung bình</p>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {(customerDetail.averageOrderValue / 1000).toFixed(0)}K
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Mua lần cuối</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{customerDetail.lastOrder}</p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90">
          <MessageSquare className="w-4 h-4 mr-2" />
          Gửi tin nhắn
        </Button>
        <Button variant="outline">
          <Gift className="w-4 h-4 mr-2" />
          Gửi khuyến mãi
        </Button>
        <Button variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          Xem phân tích
        </Button>
      </div>

      {/* Order History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Lịch sử đơn hàng</h2>
        <div className="space-y-3">
          {customerDetail.orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
              <div>
                <p className="font-medium text-foreground">{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  {order.date} • {order.items} sản phẩm
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{(order.total / 1000000).toFixed(1)}M</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
