"use client"

import { OrdersTable } from "@/components/orders/orders-table"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download } from "lucide-react"

export default function SellerOrdersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Quản Lý Đơn Hàng</h1>
            <p className="text-muted-foreground mt-1">Theo dõi và xử lý đơn hàng của khách</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm mã đơn, tên khách hàng..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>

          {/* Orders Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
              <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
              <TabsTrigger value="shipping">Đang giao</TabsTrigger>
              <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
              <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <OrdersTable status="all" />
            </TabsContent>
            <TabsContent value="pending">
              <OrdersTable status="pending" />
            </TabsContent>
            <TabsContent value="processing">
              <OrdersTable status="processing" />
            </TabsContent>
            <TabsContent value="shipping">
              <OrdersTable status="shipping" />
            </TabsContent>
            <TabsContent value="completed">
              <OrdersTable status="completed" />
            </TabsContent>
            <TabsContent value="cancelled">
              <OrdersTable status="cancelled" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
