"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingBag, TrendingUp, DollarSign, Plus, Search, Eye, ArrowRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { SellerSidebar } from "./seller-sidebar"
import { AddProductDialog } from "./add-product-dialog"
import { ProductsTable } from "./products-table"
import { sellerApi, SellerOverview } from "@/lib/api/seller"
import { ordersApi, Order } from "@/lib/api/orders"
import { formatCurrency } from "@/lib/format"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"

function formatCurrencyVND(n: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(n || 0)
}

export function SellerDashboard() {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [overview, setOverview] = useState<SellerOverview | null>(null)
  const [loadingOverview, setLoadingOverview] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [orderSearchQuery, setOrderSearchQuery] = useState("")

  useEffect(() => {
    let mounted = true
    sellerApi.getOverview()
      .then((resp) => {
        if (!mounted) return
        if (resp.success) setOverview(resp.data)
      })
      .catch((err) => {
        console.error("Failed to load overview:", err)
      })
      .finally(() => setLoadingOverview(false))
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    setLoadingOrders(true)
    ordersApi.getSellerOrders(0, 5)
      .then((resp) => {
        if (!mounted) return
        if (resp.success && resp.data) {
          setOrders(resp.data.content || [])
        }
      })
      .catch((err) => {
        console.error("Failed to load orders:", err)
        toast.error("Không thể tải đơn hàng")
      })
      .finally(() => setLoadingOrders(false))
    return () => { mounted = false }
  }, [])


  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("pending") || statusLower.includes("chờ")) {
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
    }
    if (statusLower.includes("processing") || statusLower.includes("confirmed") || statusLower.includes("xử lý")) {
      return <Badge className="bg-blue-500">Đang xử lý</Badge>
    }
    if (statusLower.includes("shipping") || statusLower.includes("giao")) {
      return <Badge className="bg-purple-500">Đang giao</Badge>
    }
    if (statusLower.includes("completed") || statusLower.includes("delivered") || statusLower.includes("hoàn thành")) {
        return <Badge className="bg-green-500">Hoàn thành</Badge>
    }
    if (statusLower.includes("cancelled") || statusLower.includes("hủy")) {
        return <Badge variant="destructive">Đã hủy</Badge>
    }
    return <Badge>{status}</Badge>
  }


  const filteredOrders = orders.filter(order => {
    if (!orderSearchQuery) return true
    const query = orderSearchQuery.toLowerCase()
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query)
    )
  })


  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />

      <div className="flex-1">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-2xl font-bold">Kênh Người Bán</h1>
              <p className="text-muted-foreground">Quản lý cửa hàng của bạn</p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="gap-2" onClick={() => setShowAddProduct(true)}>
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tổng doanh thu</CardTitle>
                <DollarSign className="w-5 h-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrencyVND(overview?.totalRevenue || 0)}</div>
                <p className="text-xs text-green-600 mt-1">{overview?.revenueChange || (loadingOverview ? "..." : "+0%")} so với tháng trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Đơn hàng mới</CardTitle>
                <ShoppingBag className="w-5 h-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.newOrders ?? (loadingOverview ? "..." : 0)}</div>
                <p className="text-xs text-green-600 mt-1">{overview?.newOrdersChange || (loadingOverview ? "..." : "+0%")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sản phẩm</CardTitle>
                <Package className="w-5 h-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overview?.productsCount ?? (loadingOverview ? "..." : 0)}</div>
                <p className="text-xs text-green-600 mt-1">{overview?.productsChange || (loadingOverview ? "..." : "+0")}</p>
              </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Lượt xem</CardTitle>
                <TrendingUp className="w-5 h-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{overview?.views ?? (loadingOverview ? "..." : 0)}</div>
                <p className="text-xs text-green-600 mt-1">{overview?.viewsChange || (loadingOverview ? "..." : "+0%")}</p>
                </CardContent>
              </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Đơn hàng gần đây</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          placeholder="Tìm đơn hàng..." 
                          className="pl-9 w-64" 
                          value={orderSearchQuery}
                          onChange={(e) => setOrderSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" asChild>
                        <Link href="/seller/orders">
                          Xem tất cả
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Chưa có đơn hàng nào</p>
                    </div>
                  ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mã đơn</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Khách hàng</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Sản phẩm</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tổng tiền</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trạng thái</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ngày</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody>
                          {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-accent/5">
                              <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                              <td className="py-3 px-4">{order.customerName}</td>
                              <td className="py-3 px-4">
                                {order.items && order.items.length > 0 ? (
                                  <div>
                                    <div className="font-medium">{order.items[0].productName}</div>
                                    {order.items.length > 1 && (
                                      <div className="text-sm text-muted-foreground">+{order.items.length - 1} sản phẩm khác</div>
                                    )}
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="py-3 px-4 font-medium">{formatCurrency(order.finalTotal)}</td>
                            <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {format(new Date(order.createdAt), "dd/MM/yyyy", { locale: vi })}
                              </td>
                            <td className="py-3 px-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  asChild
                                >
                                  <Link href={`/seller/orders/${order.id}`}>
                                    <Eye className="w-4 h-4" />
                                  </Link>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Quản lý sản phẩm</CardTitle>
                    <Button variant="outline" asChild>
                      <Link href="/seller/products">
                        Xem tất cả
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ProductsTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/seller/orders">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Quản lý đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Xem và xử lý tất cả đơn hàng</p>
                </CardContent>
              </Link>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/seller/products">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Quản lý sản phẩm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Thêm, sửa, xóa sản phẩm</p>
                </CardContent>
              </Link>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/seller/analytics">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Thống kê
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Xem báo cáo và phân tích</p>
                </CardContent>
              </Link>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" asChild>
              <Link href="/seller/customers">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Quản lý khách hàng</p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </main>
      </div>

      {showAddProduct && <AddProductDialog onClose={() => setShowAddProduct(false)} />}
    </div>
  )
}
