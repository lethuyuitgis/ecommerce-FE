"use client"

import { useState, useMemo } from "react"
import { Package, Truck, CheckCircle, XCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Order } from "@/lib/api/orders"
import { getImageUrl } from "@/lib/utils/image"

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Package },
  PROCESSING: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800", icon: Package },
  SHIPPING: { label: "Đang giao", color: "bg-purple-100 text-purple-800", icon: Truck },
  DELIVERED: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
}

interface OrdersListProps {
  initialOrders?: Order[]
}

export function OrdersList({ initialOrders = [] }: OrdersListProps) {
  const [orders] = useState<Order[]>(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Filter orders based on search and tab
  const filteredOrders = useMemo(() => {
    let filtered = orders

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items?.some((item) =>
            item.productName?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    }

    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab.toUpperCase())
    }

    return filtered
  }, [orders, searchQuery, activeTab])

  return (
    <div className="rounded-lg bg-white p-6">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold text-foreground">Đơn Hàng Của Tôi</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
          <TabsTrigger value="shipping">Đang giao</TabsTrigger>
          <TabsTrigger value="delivered">Đã giao</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">Không có đơn hàng nào</p>
              <p className="mb-4 text-sm text-muted-foreground">Bạn chưa có đơn hàng nào trong mục này</p>
              <Link href="/">
                <Button>Tiếp Tục Mua Sắm</Button>
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = order.status || 'PENDING'
              const statusInfo = statusConfig[status] || statusConfig['PENDING']
              const StatusIcon = statusInfo.icon
              return (
                <div key={order.id} className="rounded-lg border p-4">
                  {/* Order Header */}
                  <div className="mb-4 flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
                        <p className="font-semibold text-foreground">{order.orderNumber || order.id}</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <p className="text-sm text-muted-foreground">Ngày đặt</p>
                        <p className="font-medium text-foreground">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <Badge className={statusInfo.color}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border">
                          <img
                            src={getImageUrl(item.productImage)}
                            alt={item.productName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1 font-medium text-foreground line-clamp-2">{item.productName}</h4>
                          {item.variantName && (
                            <p className="mb-1 text-sm text-muted-foreground">
                              Phân loại: {item.variantName}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ₫{((item.variantPrice || item.productPrice || item.unitPrice || 0) * item.quantity).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex gap-2">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Xem Chi Tiết
                        </Button>
                      </Link>
                      {status === "DELIVERED" && (
                        <Button variant="outline" size="sm">
                          Mua Lại
                        </Button>
                      )}
                      {status === "SHIPPING" && (
                        <Button variant="outline" size="sm">
                          Theo Dõi Đơn Hàng
                        </Button>
                      )}
                      {status === "PENDING" && (
                        <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                          Hủy Đơn
                        </Button>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tổng tiền</p>
                      <p className="text-xl font-bold text-primary">
                        ₫{order.finalTotal?.toLocaleString("vi-VN") || order.totalPrice?.toLocaleString("vi-VN") || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
