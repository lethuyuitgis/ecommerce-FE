"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { toast } from "sonner"
import { reportsApi } from "@/lib/api/reports"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { analyticsApi, SellerAnalyticsDashboard } from "@/lib/api/analytics"

const RevenueChart = dynamic(
  () => import("@/components/analytics/revenue-chart").then((mod) => mod.RevenueChart),
  { ssr: false, loading: () => <ChartFallback /> }
)
const CustomerAnalytics = dynamic(
  () => import("@/components/analytics/customer-analytics").then((mod) => mod.CustomerAnalytics),
  { ssr: false, loading: () => <ChartFallback /> }
)
const TrafficAnalytics = dynamic(
  () => import("@/components/analytics/traffic-analytics").then((mod) => mod.TrafficAnalytics),
  { ssr: false, loading: () => <ChartFallback /> }
)
const TopProductsChart = dynamic(
  () => import("@/components/analytics/top-products-chart").then((mod) => mod.TopProductsChart),
  { loading: () => <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div> }
)

function ChartFallback() {
  return (
    <div className="flex h-[350px] items-center justify-center rounded-lg border bg-muted/40">
      <span className="text-sm text-muted-foreground">Đang tải biểu đồ...</span>
    </div>
  )
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7days' | '30days' | '90days' | 'year'>('30days')
  const [exporting, setExporting] = useState(false)
  const [dashboard, setDashboard] = useState<SellerAnalyticsDashboard | null>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  const handleExportReport = async (type: 'EXCEL' | 'PDF') => {
    try {
      setExporting(true)
      toast.info("Đang tạo báo cáo...")

      // Call backend API to export report
      const blob = await reportsApi.exportReport({
        type,
        period,
        reportType: 'all',
      })

      // Get filename from Content-Disposition header or generate default
      const extension = type === 'EXCEL' ? 'xlsx' : 'pdf'
      const periodLabel = period === '7days' ? '7-ngay' : period === '30days' ? '30-ngay' : period === '90days' ? '90-ngay' : 'nam'
      const filename = `bao-cao-${periodLabel}-${new Date().toISOString().split('T')[0]}.${extension}`

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Xuất báo cáo ${type === 'EXCEL' ? 'Excel' : 'PDF'} thành công!`)
    } catch (error: any) {
      console.error('Export error:', error)
      toast.error(error.message || "Xuất báo cáo thất bại. Vui lòng thử lại.")
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingAnalytics(true)
        const response = await analyticsApi.getDashboard(period)
        if (response.success && response.data) {
          setDashboard(response.data)
        }
      } catch (error) {
        console.error("Failed to load analytics dashboard", error)
        toast.error("Không thể tải dữ liệu thống kê")
      } finally {
        setLoadingAnalytics(false)
      }
    }
    load()
  }, [period])

  const overview = dashboard?.overview
  const cards = useMemo(() => {
    return [
      {
        title: "Doanh thu",
        value: overview ? formatCurrency(overview.revenue) : "125.5M₫",
        change: overview?.revenueChange ?? 24.5,
      },
      {
        title: "Đơn hàng",
        value: overview ? overview.orders.toLocaleString("vi-VN") : "1,234",
        change: overview?.ordersChange ?? 18.2,
      },
      {
        title: "Giá trị TB/Đơn",
        value: overview ? formatCurrency(overview.averageOrderValue) : "1.02M₫",
        change: overview?.averageOrderValueChange ?? -5.3,
      },
      {
        title: "Tỷ lệ chuyển đổi",
        value: overview ? `${overview.conversionRate.toFixed(2)}%` : "3.24%",
        change: overview?.conversionRateChange ?? 0.8,
      },
    ]
  }, [overview])

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
              <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={exporting}>
                    {exporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xuất...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Xuất báo cáo
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExportReport('EXCEL')}>
                    <Download className="h-4 w-4 mr-2" />
                    Xuất Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportReport('PDF')}>
                    <Download className="h-4 w-4 mr-2" />
                    Xuất PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {cards.map((card) => {
              const change = card.change ?? 0
              const isPositive = change >= 0
              const ChangeIcon = isPositive ? TrendingUp : TrendingDown
              const changeText = `${isPositive ? "+" : ""}${change.toFixed(1)}% so với kỳ trước`
              return (
                <Card key={card.title}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{card.value}</div>
                    <div
                      className={`flex items-center gap-1 text-sm mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
                    >
                      <ChangeIcon className="h-4 w-4" />
                      <span>{changeText}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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
              <RevenueChart
                revenueData={dashboard?.revenueSeries}
                categoryData={dashboard?.categorySeries}
              />
            </TabsContent>

            <TabsContent value="products">
              <TopProductsChart
                topProducts={dashboard?.topProducts}
                lowStockProducts={dashboard?.lowStockProducts}
              />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerAnalytics
                customerTypeData={dashboard?.customerTypes}
                customerLocationData={dashboard?.customerLocations}
              />
            </TabsContent>

            <TabsContent value="traffic">
              <TrafficAnalytics
                trafficData={dashboard?.trafficSeries}
                sourceData={dashboard?.trafficSources}
              />
            </TabsContent>
          </Tabs>
          {loadingAnalytics && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang cập nhật dữ liệu...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatCurrency(value?: number) {
  if (value == null) return "0₫"
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
}
