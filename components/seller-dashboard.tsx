"use client"

import { useState } from "react"
import { Package, ShoppingBag, TrendingUp, DollarSign, Plus, Search, Filter, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { SellerSidebar } from "@/components/seller-sidebar"
import { AddProductDialog } from "@/components/add-product-dialog"
import Link from "next/link"

const stats = [
  {
    title: "Tổng doanh thu",
    value: "45,231,000đ",
    change: "+20.1%",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    title: "Đơn hàng mới",
    value: "23",
    change: "+12.5%",
    icon: ShoppingBag,
    color: "text-blue-500",
  },
  {
    title: "Sản phẩm",
    value: "156",
    change: "+5",
    icon: Package,
    color: "text-purple-500",
  },
  {
    title: "Lượt xem",
    value: "12,543",
    change: "+18.2%",
    icon: TrendingUp,
    color: "text-orange-500",
  },
]

const orders = [
  {
    id: "DH123456",
    customer: "Nguyễn Văn A",
    product: "Áo thun nam basic",
    quantity: 2,
    total: "299,000đ",
    status: "pending",
    date: "10/01/2025",
  },
  {
    id: "DH123455",
    customer: "Trần Thị B",
    product: "Quần jean nữ",
    quantity: 1,
    total: "450,000đ",
    status: "shipping",
    date: "09/01/2025",
  },
  {
    id: "DH123454",
    customer: "Lê Văn C",
    product: "Giày thể thao",
    quantity: 1,
    total: "890,000đ",
    status: "completed",
    date: "08/01/2025",
  },
]

const products = [
  {
    id: "1",
    name: "Áo thun nam basic",
    image: "/product-1.jpg",
    price: "149,000đ",
    stock: 45,
    sold: 234,
    status: "active",
  },
  {
    id: "2",
    name: "Quần jean nữ",
    image: "/product-2.jpg",
    price: "450,000đ",
    stock: 23,
    sold: 156,
    status: "active",
  },
  {
    id: "3",
    name: "Giày thể thao",
    image: "/product-3.jpg",
    price: "890,000đ",
    stock: 0,
    sold: 89,
    status: "out_of_stock",
  },
]

export function SellerDashboard() {
  const [showAddProduct, setShowAddProduct] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xử lý</Badge>
      case "shipping":
        return <Badge className="bg-blue-500">Đang giao</Badge>
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Đang bán</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Hết hàng</Badge>
      case "inactive":
        return <Badge variant="secondary">Ngừng bán</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-2xl font-bold">Kênh Người Bán</h1>
              <p className="text-muted-foreground">Quản lý cửa hàng của bạn</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/">Xem cửa hàng</Link>
              </Button>
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
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">{stat.change} so với tháng trước</p>
                </CardContent>
              </Card>
            ))}
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
                        <Input placeholder="Tìm đơn hàng..." className="pl-9 w-64" />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mã đơn</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Khách hàng</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Sản phẩm</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Số lượng</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tổng tiền</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trạng thái</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ngày</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-accent/5">
                            <td className="py-3 px-4 font-medium">{order.id}</td>
                            <td className="py-3 px-4">{order.customer}</td>
                            <td className="py-3 px-4">{order.product}</td>
                            <td className="py-3 px-4">{order.quantity}</td>
                            <td className="py-3 px-4 font-medium">{order.total}</td>
                            <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                            <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Quản lý sản phẩm</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Tìm sản phẩm..." className="pl-9 w-64" />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">{getProductStatusBadge(product.status)}</div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-primary">{product.price}</span>
                            <span className="text-sm text-muted-foreground">Kho: {product.stock}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">Đã bán: {product.sold}</div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Sửa
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                              Xóa
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {showAddProduct && <AddProductDialog onClose={() => setShowAddProduct(false)} />}
    </div>
  )
}
