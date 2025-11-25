"use client"

import { ArrowLeft, MessageSquare, Gift, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { SellerCustomerDetail } from "@/lib/api/customers"
import { messagesApi } from "@/lib/api/messages"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/format"

interface CustomerDetailClientProps {
  initialCustomer: SellerCustomerDetail
}

export function CustomerDetailClient({ initialCustomer }: CustomerDetailClientProps) {
  const handleMessage = async () => {
    try {
      const response = await messagesApi.sendMessage({
        recipientId: initialCustomer.customerId,
        content: "Xin chào, mình có thể hỗ trợ gì cho bạn?",
      })
      if (response.success && response.data) {
        toast.success(`Đã mở hội thoại với ${initialCustomer.fullName || 'khách hàng'}`)
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể mở hội thoại")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/seller/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{initialCustomer.fullName || 'Khách hàng'}</h1>
          <p className="text-muted-foreground mt-1">
            {initialCustomer.firstOrderAt 
              ? `Tham gia từ ${new Date(initialCustomer.firstOrderAt).toLocaleDateString('vi-VN')}`
              : 'Khách hàng'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium mt-2">{initialCustomer.email || '—'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Số điện thoại</p>
              <p className="text-foreground font-medium mt-2">{initialCustomer.phone || '—'}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Địa chỉ</p>
              <p className="text-foreground font-medium mt-2">—</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          <p className="text-2xl font-bold text-foreground mt-2">{initialCustomer.totalOrders}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
          <p className="text-2xl font-bold text-primary mt-2">
            {formatCurrency(Number(initialCustomer.totalSpent || 0))}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Giá trị trung bình</p>
          <p className="text-2xl font-bold text-amber-600 mt-2">
            {initialCustomer.totalOrders > 0
              ? formatCurrency(Number(initialCustomer.totalSpent || 0) / initialCustomer.totalOrders)
              : '—'}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Mua lần cuối</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {initialCustomer.lastOrderAt 
              ? new Date(initialCustomer.lastOrderAt).toLocaleDateString('vi-VN')
              : '—'}
          </p>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90" onClick={handleMessage}>
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

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Lịch sử đơn hàng</h2>
        <div className="space-y-3">
          {initialCustomer.recentOrders && initialCustomer.recentOrders.length > 0 ? (
            initialCustomer.recentOrders.map((order) => (
              <div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">#{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')} • {order.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(Number(order.finalTotal || 0))}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Chưa có đơn hàng nào</p>
          )}
        </div>
      </Card>
    </div>
  )
}


