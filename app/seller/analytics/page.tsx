"use client"

import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, TrendingDown } from "lucide-react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"

const RevenueChart = dynamic(() => import("@/components/analytics/revenue-chart").then(mod => ({ default: mod.RevenueChart })), { ssr: false, loading: () => <ChartFallback /> })
const CustomerAnalytics = dynamic(() => import("@/components/analytics/customer-analytics").then(mod => ({ default: mod.CustomerAnalytics })), { ssr: false, loading: () => <ChartFallback /> })
const TrafficAnalytics = dynamic(() => import("@/components/analytics/traffic-analytics").then(mod => ({ default: mod.TrafficAnalytics })), { ssr: false, loading: () => <ChartFallback /> })
const TopProductsChart = dynamic(() => import("@/components/analytics/top-products-chart").then(mod => ({ default: mod.TopProductsChart })), { loading: () => <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div> })

function ChartFallback() {
  return (
    <div className="flex h-[350px] items-center justify-center rounded-lg border bg-muted/40">
      <span className="text-sm text-muted-foreground">Đang tải biểu đồ...</span>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Thống Kê & Báo Cáo</h1>
              <p className="text-muted-foreground mt-1">Phân tích hiệu suất kinh doanh của bạn</p>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 ngày qua</SelectItem>
                  <SelectItem value="30days">30 ngày qua</SelectItem>
                  <SelectItem value="90days">90 ngày qua</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">125.5M₫</div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>+24.5% so với tháng trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,234</div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>+18.2% so với tháng trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Giá trị TB/Đơn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.02M₫</div>
                <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                  <TrendingDown className="h-4 w-4" />
                  <span>-5.3% so với tháng trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ chuyển đổi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.24%</div>
                <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>+0.8% so với tháng trước</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="revenue" className="space-y-6">
            <TabsList>
              <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="customers">Khách hàng</TabsTrigger>
              <TabsTrigger value="traffic">Lưu lượng</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue">
              <RevenueChart />
            </TabsContent>

            <TabsContent value="products">
              <TopProductsChart />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerAnalytics />
            </TabsContent>

            <TabsContent value="traffic">
              <TrafficAnalytics />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
